import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', authenticate, authorize('admin', 'superadmin'), updateSettings);

export default router;
