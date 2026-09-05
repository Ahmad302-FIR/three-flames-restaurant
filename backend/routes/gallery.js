import express from 'express';
import {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} from '../controllers/galleryController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getGallery);

// Admin routes
router.post('/', authenticate, authorize('admin', 'superadmin', 'staff'), upload.single('image'), createGalleryItem);
router.put('/:id', authenticate, authorize('admin', 'superadmin', 'staff'), upload.single('image'), updateGalleryItem);
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), deleteGalleryItem);

export default router;
