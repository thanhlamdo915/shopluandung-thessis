import express from 'express';
import Product from './models/product.js';
import product from './data/Product.js';
import asyncHandler from 'express-async-handler';

const ImportData = express.Router();

ImportData.post(
  '/products',
  asyncHandler(async (req, res) => {
    await Product.deleteMany({});
    const importProducts = await Product.insertMany(product);
    res.send({ importProducts });
  })
);

export default ImportData;
