import express from 'express';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability
} from '../controllers/menuController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { createMenuItemValidation, updateMenuItemValidation } from '../validators/menuValidators.js';

const router = express.Router();

// Public routes
router.get('/', getMenuItems);
router.get('/:id', getMenuItemById);

// Admin routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'superadmin', 'staff'),
  upload.single('image'),
  validate(createMenuItemValidation),
  createMenuItem
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'superadmin', 'staff'),
  upload.single('image'),
  validate(updateMenuItemValidation),
  updateMenuItem
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'superadmin'),
  deleteMenuItem
);

router.patch(
  '/:id/availability',
  authenticate,
  authorize('admin', 'superadmin', 'staff'),
  toggleAvailability
);

export default router;
