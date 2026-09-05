import express from 'express';
import {
  getApprovedReviews,
  getReviewsByMenuItem,
  createReview,
  getAdminReviews,
  updateReviewStatus,
  deleteReview
} from '../controllers/reviewController.js';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createReviewValidation } from '../validators/miscValidators.js';

const router = express.Router();

router.get('/', getApprovedReviews);
router.get('/menu/:menuItemId', getReviewsByMenuItem);
router.post('/', optionalAuthenticate, validate(createReviewValidation), createReview);

// Admin review endpoints
router.get('/admin/all', authenticate, authorize('admin', 'superadmin', 'staff'), getAdminReviews);
router.patch('/admin/:id/status', authenticate, authorize('admin', 'superadmin', 'staff'), updateReviewStatus);
router.delete('/admin/:id', authenticate, authorize('admin', 'superadmin'), deleteReview);

export default router;
