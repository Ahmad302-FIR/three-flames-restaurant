import express from 'express';
import mongoose from 'mongoose';
import { connectDB, getLastDbError } from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch {
      // Ignored here; recorded in getLastDbError
    }
  }

  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const dbName = mongoose.connection.name || 'none';

  res.status(200).json({
    success: true,
    message: 'Ahmed Khan Restaurant API is running',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    databaseName: dbName,
    environment: process.env.NODE_ENV || 'development',
    diagnostics: {
      hasMongoUri: Boolean(process.env.MONGO_URI || process.env.MONGODB_URI),
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
      hasClientUrl: Boolean(process.env.CLIENT_URL),
      hasCloudinary: Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ),
      lastDbError: getLastDbError()
    }
  });
});

export default router;
