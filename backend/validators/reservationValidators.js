import { body } from 'express-validator';

export const createReservationValidation = [
  body('fullName').trim().notEmpty().withMessage('Guest full name is required'),
  body('phone').trim().notEmpty().withMessage('Contact phone number is required'),
  body('email').trim().isEmail().withMessage('Valid email address is required'),
  body('date').trim().notEmpty().withMessage('Reservation date is required'),
  body('time').trim().notEmpty().withMessage('Reservation time is required'),
  body('guests').isInt({ min: 1, max: 50 }).withMessage('Guest count must be between 1 and 50')
];
