import express from 'express';
import {
  getDashboardStats,
  getSalesChartData,
  getOrderDistribution,
  getPopularDishes,
  getAdminCustomers
} from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, authorize('admin', 'superadmin', 'staff'));

router.get('/stats', getDashboardStats);
router.get('/charts', getSalesChartData);
router.get('/order-distribution', getOrderDistribution);
router.get('/popular-dishes', getPopularDishes);
router.get('/customers', getAdminCustomers);

export default router;
