import { body } from 'express-validator';

export const createReviewValidation = [
  body('customerName').trim().notEmpty().withMessage('Customer name is required'),
  body('customerEmail').trim().notEmpty().withMessage('Email address is required').isEmail().withMessage('Please provide a valid email address'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Review comment is required').isLength({ min: 5, max: 1000 }).withMessage('Comment must be between 5 and 1000 characters')
];

export const createDeliveryZoneValidation = [
  body('name').trim().notEmpty().withMessage('Zone name is required'),
  body('fee').isFloat({ min: 0 }).withMessage('Delivery fee must be >= 0'),
  body('minOrder').isFloat({ min: 0 }).withMessage('Minimum order must be >= 0')
];

export const createCouponValidation = [
  body('code').trim().notEmpty().withMessage('Coupon code is required').toUpperCase(),
  body('title').trim().notEmpty().withMessage('Coupon title is required'),
  body('discountType').isIn(['percentage', 'fixed']).withMessage('Discount type must be percentage or fixed'),
  body('discountValue').isFloat({ min: 0 }).withMessage('Discount value must be >= 0')
];

export const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
];
