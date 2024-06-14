import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rewardPercentage: {
    type: Number,
    required: true,
    default: 0, // Default reward percentage is 0%
  },
  image: {
    type: [String],
    required: true,
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
