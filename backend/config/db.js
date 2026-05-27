import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/construction_db');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // If connection fails, log error but don't exit in development
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log('Running backend in local fallback/development mode. Ensure MongoDB is running if needed.');
    }
  }
};

export default connectDB;
