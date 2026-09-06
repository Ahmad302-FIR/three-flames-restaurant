import { Server } from 'socket.io';
import { logger } from '../utils/logger.js';

let io = null;

const getSocketAllowedOrigins = () => {
  const defaults = [
    'https://frontend-sepia-eight-58.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ];

  const clientUrls = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/+$/, '')).filter(Boolean)
    : [];

  return Array.from(new Set([...clientUrls, ...defaults]));
};

export const initializeSocket = (server) => {
  const allowedOrigins = getSocketAllowedOrigins();

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const normalized = origin.replace(/\/+$/, '');
        if (
          process.env.NODE_ENV !== 'production' ||
          allowedOrigins.includes(normalized) ||
          normalized.endsWith('.vercel.app')
        ) {
          callback(null, true);
        } else {
          callback(new Error('Blocked by Socket CORS policy'));
        }
      },
      methods: ['GET', 'POST', 'PATCH'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Join order room for tracking specific order
    socket.on('join:order', (orderNumber) => {
      if (orderNumber) {
        const room = `order:${orderNumber.toUpperCase()}`;
        socket.join(room);
        logger.debug(`Socket ${socket.id} joined room: ${room}`);
      }
    });

    // Leave order room
    socket.on('leave:order', (orderNumber) => {
      if (orderNumber) {
        const room = `order:${orderNumber.toUpperCase()}`;
        socket.leave(room);
        logger.debug(`Socket ${socket.id} left room: ${room}`);
      }
    });

    // Join admin dashboard room
    socket.on('join:admin', () => {
      socket.join('admin:kitchen');
      logger.debug(`Socket ${socket.id} joined admin room`);
    });

    // Join user notification room
    socket.on('join:user', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
        logger.debug(`Socket ${socket.id} joined user room: user:${userId}`);
      }
    });

    socket.on('disconnect', () => {
      logger.debug(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};

export const emitOrderStatusUpdate = (order) => {
  if (!io) return;
  const room = `order:${order.orderNumber.toUpperCase()}`;
  io.to(room).emit('order:status_updated', {
    orderNumber: order.orderNumber,
    status: order.status,
    timeline: order.timeline,
    estimatedTime: order.estimatedTime,
    paymentStatus: order.paymentStatus
  });

  // Also emit specific event name (e.g. order:preparing)
  io.to(room).emit(`order:${order.status}`, {
    orderNumber: order.orderNumber,
    status: order.status
  });

  // Also notify admin room
  io.to('admin:kitchen').emit('admin:order_updated', order);
};

export const emitNewOrder = (order) => {
  if (!io) return;
  io.to('admin:kitchen').emit('order:created', order);
};

export const emitNewReservation = (reservation) => {
  if (!io) return;
  io.to('admin:kitchen').emit('reservation:created', reservation);
};
