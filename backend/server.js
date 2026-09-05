import dotenv from 'dotenv';
import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { initializeSocket } from './sockets/orderSocket.js';
import { logger } from './utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Create HTTP server
  const server = http.createServer(app);

  // Initialize Real-time Socket.IO
  initializeSocket(server);

  // Start listening
  server.listen(PORT, () => {
    logger.info(`================================================`);
    logger.info(`🔥 THREE FLAMES RESTAURANT API SERVER STARTED`);
    logger.info(`📍 Port: ${PORT}`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`⚡ Socket.IO initialized`);
    logger.info(`================================================`);
  });

  server.on('error', (err) => {
    logger.error(`Server error: ${err.message}`);
  });

  const handleShutdown = () => {
    logger.info('Shutting down server gracefully...');
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  });

  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}\n${err.stack}`);
  });
};

startServer().catch((err) => {
  logger.error(`Failed to start server: ${err.message}`);
});

