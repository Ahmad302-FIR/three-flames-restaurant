import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  trackOrderByNumber
} from '../controllers/orderController.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOrderValidation } from '../validators/orderValidators.js';

const router = express.Router();

router.post('/', optionalAuthenticate, validate(createOrderValidation), createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/track/:orderNumber', trackOrderByNumber);
router.get('/:id', optionalAuthenticate, getOrderById);

export default router;
