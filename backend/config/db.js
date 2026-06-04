import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://admin:hello123@ac-4vc5awv-shard-00-00.pzynyfj.mongodb.net:27017,ac-4vc5awv-shard-00-01.pzynyfj.mongodb.net:27017,ac-4vc5awv-shard-00-02.pzynyfj.mongodb.net:27017/TitanCore_db?ssl=true&replicaSet=atlas-m7vvpu-shard-0&authSource=admin&appName=Cluster0');
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
