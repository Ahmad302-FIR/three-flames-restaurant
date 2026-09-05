import express from 'express';
import { getAdminReservations, updateAdminReservationStatus } from '../controllers/reservationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, authorize('admin', 'superadmin', 'staff'));

router.get('/', getAdminReservations);
router.patch('/:id/status', updateAdminReservationStatus);

export default router;
