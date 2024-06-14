import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
  rewardPercentage: {
    type: Number,
    required: true,
    default: 0, // Percentage of reward points for products in this category
  },
  image: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
