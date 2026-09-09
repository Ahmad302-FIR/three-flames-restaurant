import express from 'express';
import {
  createReservation,
  getMyReservations,
  getReservationById,
  trackReservationByNumber,
  getAdminReservations,
  updateAdminReservationStatus
} from '../controllers/reservationController.js';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createReservationValidation } from '../validators/reservationValidators.js';

const router = express.Router();

router.post('/', optionalAuthenticate, validate(createReservationValidation), createReservation);
router.get('/my-reservations', authenticate, getMyReservations);
router.get('/track/:reservationNumber', trackReservationByNumber);
router.get('/:id', optionalAuthenticate, getReservationById);

// Admin subroutes
router.get('/admin/all', authenticate, authorize('admin', 'superadmin', 'staff'), getAdminReservations);
router.patch('/admin/:id/status', authenticate, authorize('admin', 'superadmin', 'staff'), updateAdminReservationStatus);

export default router;
