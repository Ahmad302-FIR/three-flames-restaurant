import express from 'express';
import {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus
} from '../controllers/adminOrderController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, authorize('admin', 'superadmin', 'staff'));

router.get('/', getAdminOrders);
router.get('/:id', getAdminOrderById);
router.patch('/:id/status', updateOrderStatus);

export default router;
