import mongoose from 'mongoose';
const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log('Error connecting to MongoDB', err);
    process.exit(1);
  }
};
export default connectDatabase;
