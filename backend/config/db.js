import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

export const connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!connUri) {
      throw new Error(
        'Database connection string is missing. Please configure MONGO_URI in backend/.env'
      );
    }

    const maskedUri = connUri.replace(
      /\/\/([^:]+):([^@]+)@/,
      '//$1:****@'
    );

    logger.info(`Connecting to MongoDB at: ${maskedUri}`);

    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });

    logger.info(
      `MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`
    );

    return conn;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);

    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }

    return null;
  }
};
