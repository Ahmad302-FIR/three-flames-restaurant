import { Server } from 'socket.io';
import { logger } from '../utils/logger.js';

let io = null;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
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
