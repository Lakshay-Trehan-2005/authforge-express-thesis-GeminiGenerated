import mongoose from 'mongoose';
import env from './env';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB connection disconnected. Retrying...');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB database error: ${err}`);
});

export default connectDB;
