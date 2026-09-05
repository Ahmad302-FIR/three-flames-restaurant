import { Order } from '../models/Order.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { emitOrderStatusUpdate } from '../sockets/orderSocket.js';

export const getAdminOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
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
