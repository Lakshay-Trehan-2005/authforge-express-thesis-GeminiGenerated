import mongoose from 'mongoose';
import { env } from './env';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(env.mongo.uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.info(`[MongoDB] Connected to ${env.mongo.uri}`);

    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB] Connection error:', err.message);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Disconnected. Will attempt to reconnect...');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.info('[MongoDB] Reconnected successfully.');
      isConnected = true;
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[MongoDB] Initial connection failed: ${message}`);
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.info('[MongoDB] Disconnected gracefully.');
}
