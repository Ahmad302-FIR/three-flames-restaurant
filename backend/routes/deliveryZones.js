import express from 'express';
import {
  getDeliveryZones,
  createDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone,
  syncDeliveryZones
} from '../controllers/deliveryZoneController.js';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createDeliveryZoneValidation } from '../validators/miscValidators.js';

const router = express.Router();

router.get('/', optionalAuthenticate, getDeliveryZones);
router.post('/', authenticate, authorize('admin', 'superadmin'), validate(createDeliveryZoneValidation), createDeliveryZone);
router.put('/sync', authenticate, authorize('admin', 'superadmin'), syncDeliveryZones);
router.put('/:id', authenticate, authorize('admin', 'superadmin'), updateDeliveryZone);
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), deleteDeliveryZone);

export default router;
