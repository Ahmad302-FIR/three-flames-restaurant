import express from 'express';
import {
  validateCoupon,
  getAdminCoupons,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
  syncAdminCoupons
} from '../controllers/couponController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createCouponValidation } from '../validators/miscValidators.js';

const router = express.Router();

router.post('/validate', validateCoupon);

// Admin endpoints
router.get('/admin/all', authenticate, authorize('admin', 'superadmin'), getAdminCoupons);
router.post('/admin', authenticate, authorize('admin', 'superadmin'), validate(createCouponValidation), createAdminCoupon);
router.put('/admin/sync', authenticate, authorize('admin', 'superadmin'), syncAdminCoupons);
router.put('/admin/:id', authenticate, authorize('admin', 'superadmin'), updateAdminCoupon);
router.delete('/admin/:id', authenticate, authorize('admin', 'superadmin'), deleteAdminCoupon);

export default router;
