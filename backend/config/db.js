import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

let cachedConn = null;
let cachedPromise = null;

let lastDbError = null;

export const getLastDbError = () => lastDbError;

export const connectDB = async () => {
  // If already connected, reuse connection (prevents multiple connections in serverless environments)
  if (cachedConn && mongoose.connection.readyState === 1) {
    return cachedConn;
  }

  if (mongoose.connection.readyState === 1) {
    cachedConn = mongoose.connection;
    return cachedConn;
  }

  try {
    const connUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!connUri) {
      throw new Error(
        'Database connection string is missing. Please configure MONGO_URI in environment variables.'
      );
    }

    const maskedUri = connUri.replace(
      /\/\/([^:]+):([^@]+)@/,
      '//$1:****@'
    );

    logger.info(`Connecting to MongoDB at: ${maskedUri}`);

    if (!cachedPromise) {
      cachedPromise = mongoose.connect(connUri, {
        dbName: 'three-flames',
        serverSelectionTimeoutMS: 8000,
        autoIndex: process.env.NODE_ENV !== 'production',
      });
    }

    cachedConn = await cachedPromise;
    lastDbError = null;
    logger.info(
      `MongoDB Connected: ${cachedConn.connection.host}/${cachedConn.connection.name}`
    );

    return cachedConn;
  } catch (error) {
    cachedPromise = null;
    cachedConn = null;
    lastDbError = error.message;

    if (error.message && error.message.includes('whitelist')) {
      logger.error('MongoDB Atlas IP Whitelist error detected. Ensure 0.0.0.0/0 is added in MongoDB Atlas -> Network Access for cloud deployments.');
    } else {
      logger.error(`MongoDB connection error: ${error.message}`);
    }

    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
      process.exit(1);
    }

    return null;
  }
};
