import express from 'express';
import {
  submitContact,
  getAdminContactMessages,
  markContactMessageRead,
  deleteContactMessage
} from '../controllers/contactController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { contactValidation } from '../validators/miscValidators.js';

const router = express.Router();

router.post('/', validate(contactValidation), submitContact);

// Admin endpoints
router.get('/admin/all', authenticate, authorize('admin', 'superadmin', 'staff'), getAdminContactMessages);
router.patch('/admin/:id/read', authenticate, authorize('admin', 'superadmin', 'staff'), markContactMessageRead);
router.delete('/admin/:id', authenticate, authorize('admin', 'superadmin'), deleteContactMessage);

export default router;
