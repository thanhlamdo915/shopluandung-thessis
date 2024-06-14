//Server.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from './models/user.js';
import Order from './models/order.js';
import Product from './models/product.js';
import Category from './models/category.js';
import ImportData from './DataImport.js';
import productRoute from './Routes/ProductRoutes.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
// import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
// import {storage} from './firebase';

dotenv.config();

const app = express();

const port = 8000;
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/api/import', ImportData);
app.use('/api/products', productRoute);

mongoose
  .connect(
    'mongodb+srv://thanhlamdo915:dothanhlam@cluster0.fmbyv5e.mongodb.net/'
  )
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(() => {
    console.log('Error connecting to MongoDB', err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//func to send Verif email to user
const sendVerificationEmail = async (email, verificationToken) => {
  //create nodemailer transport
  const transporter = nodemailer.createTransport({
    //config email serv
    service: 'gmail',
    auth: {
      user: 'thanhlamdo915@gmail.com',
      pass: 'iinepzeyzfutamje',
    },
  });

  //compose the email message
  const mailOptions = {
    from: 'amazon.com',
    to: email,
    subject: 'Email verification',
    text: `Please click the following link to verify your email : http://localhost:8000/verify/${verificationToken}`,
  };
  //send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.log('Error sending verification email', error);
  }
};

// app.use('/api/import', ImportData);
app.route('/').get((req, res) => {
  res.json('Hello Lam Thanh');
});
//endpoint to register in the app
app.post('/register', async (req, res) => {
  try {
    const {name, email, password} = req.body;
    console.log(req.body); // Log the request body

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({message: 'Name, email, and password are required'});
    }
    //check if the email is already registered
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: 'Email already registered'});
    }
    //create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({name, email, password: hashedPassword});
    //gen and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString('hex');
    //save the user to the db
    await newUser.save();
    //send verification email to user
    sendVerificationEmail(newUser.email, newUser.verificationToken);
  } catch (error) {
    console.log('error registerting user ', error);
    res.status(500).json({message: 'Registration failed'});
  }
});

//endpoint to verify the email

app.get('/verify/:token', async (req, res) => {
  try {
    const token = req.params.token;
    //find the user with the given verification token
    const user = await User.findOne({verificationToken: token});
    if (!user) {
      return res.status(400).json({message: 'Invalid verification token'});
    }

    //Mark the user as verified
    user.verified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).json({message: 'Email verification successfully'});
  } catch (error) {
    res.status(500).json({message: 'Email verification Failed'});
  }
});

//endpoint to login
app.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    console.log(req.body);
    //check if the user exists
    const user = await User.findOne({email});
    if (!user) {
      return res.status(444).json({message: 'Invalid email or password'});
    }

    //check if the password is correct
    // if (user.password !== password) {
    //   return res.status(402).json({message: 'Invalid password'});
    // }
    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(444).json({message: 'Invalid password'});
    }

    //generate a token
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET);
    // console.log();

    res.status(200).json({token});
  } catch (error) {
    res.status(500).json({message: 'Login Failed'});
    console.log('error logging in', error);
  }
});

//endpoint to store new address to backend

app.post('/addresses', async (req, res) => {
  try {
    const {userId, address} = req.body;

    //find the user by the Userid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(444).json({message: 'User not found'});
    }

    //add the new address to the user's addresses array
    user.addresses.push(address);

    //save the updated user in to backend
    await user.save();

    res.status(200).json({message: 'Address created Successfully'});
  } catch (error) {
    res.status(500).json({message: 'Error addding address'});
  }
});

//endpoint to get all address to particular user

app.get('/addresses/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(444).json({message: 'User not found'});
    }

    const addresses = user.addresses;
    res.status(200).json({addresses});
  } catch (error) {
    res.status(500).json({message: 'Error retrieveing the addresses'});
  }
});
//endpoint get total reward and used reward
app.get('/rewardPoints/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(444).json({message: 'User not found'});
    }

    const rewardPoints = user.rewardPoints;
    res.status(200).json({rewardPoints});
  } catch (error) {
    res.status(500).json({message: 'Error retrieveing the rewardPoints'});
  }
});
//endpoint to store all the orders
app.post('/orders', async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      totalPrice,
      shippingAddress,
      paymentMethod,
      totalRewardPoints,
      usedRewardPoints,
    } = req.body;
    console.log(req.body);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(444).json({message: 'User not found'});
    }
    // Ensure user has enough reward points to use
    // if (rewardPoints > user.rewardPoints) {
    //   return res.status(400).json({message: 'Not enough reward points'});
    // }
    // Calculate the final price after applying the reward points
    const discount = user.rewardPoints; // Assuming 100 reward points = $1 discount
    const finalPrice = totalPrice - discount;
    // usedRewardPoints = discount;
    const products = cartItems.map((item) => ({
      name: item?.name,
      quantity: item.quantity,
      price: item.price,
      image: item?.image.length > 0 ? item?.image[0] : item.image,
      rewardPercentage: item.rewardPercentage,
    }));

    //create a new Order
    const order = new Order({
      user: userId,
      products: products,
      totalPrice: finalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      totalRewardPoints: totalRewardPoints,
      usedRewardPoints: discount,
    });

    // Update the user's reward points
    // user.rewardPoints += totalRewardPoints;
    user.rewardPoints = totalRewardPoints;
    await order.save();
    await user.save();

    res.status(200).json({message: 'Order created successfully!'});
  } catch (error) {
    console.log('error creating orders', error);
    res.status(500).json({message: 'Error creating orders'});
  }
});

//get the user profile
app.get('/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(444).json({message: 'User not found'});
    }

    res.status(200).json({user});
  } catch (error) {
    res.status(500).json({message: 'Error retrieving the user profile'});
  }
});

app.get('/orders/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({user: userId});

    if (!orders || orders.length === 0) {
      return res.status(444).json({message: 'No orders found for this user'});
    }

    res.status(200).json({orders});
  } catch (error) {
    res.status(500).json({message: 'Error'});
  }
});

// endpoint to create category
app.post('/categories', async (req, res) => {
  try {
    const {name, rewardPercentage} = req.body;
    const newCategory = new Category({name, rewardPercentage});
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.log('error creating category', error);
    res.status(500).json({message: 'Failed to create category', error});
  }
});

//endpoint to create new product
app.post('/products', async (req, res) => {
  try {
    const {
      categoryId,
      name,
      quantity,
      price,
      description,
      rewardPercentage,
      image,
    } = req.body;

    // Tìm kiếm danh mục từ ID
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({message: 'Category not found'});
    }

    // Tính toán điểm thưởng dựa trên phần trăm điểm thưởng của danh mục
    const calculatedRewardPercentage =
      rewardPercentage || category.rewardPercentage;

    // Tạo sản phẩm mới với các thông tin được cung cấp
    const newProduct = new Product({
      category: categoryId,
      name,
      quantity,
      price,
      description,
      rewardPercentage: calculatedRewardPercentage,
      image,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({message: 'Failed to create product', error});
  }
});

// endpoint to get all products
app.get('/products', async (req, res) => {
  try {
    // Lấy tất cả các sản phẩm từ cơ sở dữ liệu
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({message: 'Failed to fetch products', error});
  }
});
// Endpoint to get all categories
app.get('/categories', async (req, res) => {
  try {
    // Lấy tất cả các sản phẩm từ cơ sở dữ liệu
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({message: 'Failed to fetch categories', error});
  }
});

const upload = multer({storage: multer.memoryStorage()}); // Sử dụng bộ nhớ tạm thời cho multer

app.post('/add-product', upload.single('image'), async (req, res) => {
  try {
    const {category, name, quantity, price, description, rewardPercentage} =
      req.body;

    // Check if all required fields are present
    if (
      !category ||
      !name ||
      !quantity ||
      !price ||
      !description ||
      !req.file
    ) {
      return res.status(400).json({message: 'All fields are required'});
    }

    // Upload image to Firebase Storage
    const imageRef = ref(
      storage,
      `images/${Date.now()}_${req.file.originalname}`
    );
    await uploadBytes(imageRef, req.file.buffer);
    const imageUrl = await getDownloadURL(imageRef);

    const newProduct = new Product({
      category,
      name,
      quantity,
      price,
      description,
      rewardPercentage: parseFloat(rewardPercentage),
      image: [imageUrl], // Save the image URL in the database
    });

    const savedProduct = await newProduct.save();

    res
      .status(201)
      .json({message: 'Product added successfully', product: savedProduct});
  } catch (error) {
    console.error('Error adding product', error);
    res.status(500).json({message: 'Error adding product', error});
  }
});
// GET /api/favoriteProducts?search=query
app.get('/search/:key', async (req, res) => {
  let result = await Product.find({
    $or: [{name: {$regex: req.params.key, $options: 'i'}}],
  });
  res.json(result);
});
app.get('/products/filterByName/:searchQuery', async (req, res) => {
  try {
    const products = await Product.find({
      name: {$regex: req.params.searchQuery, $options: 'i'},
    }).sort({name: 1});
    res.json(products);
  } catch (error) {
    console.error('Error filtering products by name:', error);
    res.status(500).json({error: 'Internal server error'});
  }
});

app.get('/products/filterByPriceLowToHigh/:searchQuery', async (req, res) => {
  try {
    const products = await Product.find({
      name: {$regex: req.params.searchQuery, $options: 'i'},
    }).sort({price: 1});
    res.json(products);
  } catch (error) {
    console.error('Error filtering products by price (low to high):', error);
    res.status(500).json({error: 'Internal server error'});
  }
});

app.get('/products/filterByPriceHighToLow/:searchQuery', async (req, res) => {
  try {
    const products = await Product.find({
      name: {$regex: req.params.searchQuery, $options: 'i'},
    }).sort({price: -1});
    res.json(products);
  } catch (error) {
    console.error('Error filtering products by price (high to low):', error);
    res.status(500).json({error: 'Internal server error'});
  }
});

app.get('/category/:categoryId', async (req, res) => {
  try {
    const products = await Product.find({category: req.params.categoryId});
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({error: 'Internal server error'});
  }
});
