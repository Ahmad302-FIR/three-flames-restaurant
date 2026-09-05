import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', authenticate, authorize('admin', 'superadmin', 'staff'), createCategory);
router.put('/:id', authenticate, authorize('admin', 'superadmin', 'staff'), updateCategory);
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), deleteCategory);

export default router;
