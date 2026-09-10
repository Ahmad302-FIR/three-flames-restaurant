import { Order } from '../models/Order.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { emitOrderStatusUpdate } from '../sockets/orderSocket.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';

export const getAdminOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      if (status === 'payment_verification') {
        filter.$or = [
          { status: 'payment_verification' },
          { paymentStatus: 'submitted' }
        ];
      } else {
        filter.status = status;
      }
    }

    if (search && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { orderNumber: { $regex: term, $options: 'i' } },
        { 'customer.name': { $regex: term, $options: 'i' } },
        { 'customer.phone': { $regex: term, $options: 'i' } }
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Orders retrieved successfully', orders);
  } catch (error) {
    next(error);
  }
};

export const getAdminOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id.toUpperCase() });
    }

    if (!order) {
      return sendError(res, 404, 'Order not found.');
    }

    return sendSuccess(res, 200, 'Order details retrieved', order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return sendError(res, 400, `Invalid order status. Must be one of: ${allowedStatuses.join(', ')}`);
    }

    let order = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id.toUpperCase() });
    }
    if (!order) {
      return sendError(res, 404, 'Order not found.');
    }

    if (order.paymentMethod === 'online' && order.paymentStatus !== 'verified' && ['preparing', 'ready', 'out_for_delivery', 'delivered'].includes(status)) {
      return sendError(res, 400, 'Cannot advance order to preparation or delivery before online payment is verified.');
    }

    const statusHierarchy = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
    const targetIndex = statusHierarchy.indexOf(status);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update timeline entries accordingly
    if (targetIndex !== -1 && order.timeline && order.timeline.length) {
      order.timeline.forEach((step, idx) => {
        if (idx <= targetIndex) {
          step.completed = true;
          if (!step.timestamp) {
            step.timestamp = nowTime;
          }
        } else {
          step.completed = false;
        }
      });
    }

    // Auto mark paid if delivered
    if (status === 'delivered') {
      order.paymentStatus = 'paid';
    }

    order.status = status;
    await order.save();

    // Emit Socket.IO update
    emitOrderStatusUpdate(order);

    return sendSuccess(res, 200, `Order #${order.orderNumber} status transitioned to ${status}`, order);
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return sendError(res, 400, 'Invalid verification action. Must be "approve" or "reject".');
    }

    let order = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id.toUpperCase() });
    }
    if (!order) {
      return sendError(res, 404, 'Order not found.');
    }

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (action === 'approve') {
      order.paymentStatus = 'verified';
      order.status = 'confirmed';
      order.paymentRejectionReason = undefined;

      if (order.timeline && order.timeline.length) {
        order.timeline.forEach((step) => {
          if (step.status === 'payment_verification') {
            step.completed = true;
            if (!step.timestamp) step.timestamp = nowTime;
            step.note = 'Payment proof verified by management';
          }
          if (step.status === 'confirmed') {
            step.completed = true;
            step.timestamp = nowTime;
            step.note = 'Order confirmed and scheduled for kitchen preparation';
          }
        });
      }

      await order.save();

      // Send order confirmation email upon approval
      sendOrderConfirmationEmail(order).catch(() => {});

      // Emit real-time Socket.io update
      emitOrderStatusUpdate(order);

      return sendSuccess(res, 200, `Payment verified successfully. Order #${order.orderNumber} is now confirmed.`, order);
    } else {
      // action === 'reject'
      order.paymentStatus = 'rejected';
      order.paymentRejectionReason = reason?.trim() || 'Payment screenshot could not be verified. Please contact restaurant support.';

      if (order.timeline && order.timeline.length) {
        order.timeline.forEach((step) => {
          if (step.status === 'payment_verification') {
            step.completed = false;
            step.note = `Payment rejected: ${order.paymentRejectionReason}`;
          }
        });
      }

      await order.save();

      // Emit real-time Socket.io update
      emitOrderStatusUpdate(order);

      return sendSuccess(res, 200, `Payment rejected for Order #${order.orderNumber}.`, order);
    }
  } catch (error) {
    next(error);
  }
};

