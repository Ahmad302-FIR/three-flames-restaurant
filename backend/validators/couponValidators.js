const { body } = require('express-validator');

const createCouponValidation = [
  body('code').trim().notEmpty().withMessage('Code is required').isLength({ min: 3 }).withMessage('Code must be at least 3 characters long'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('discountType').notEmpty().withMessage('Discount type is required').isIn(['percentage', 'fixed']).withMessage('Discount type must be percentage or fixed'),
  body('discountValue').notEmpty().withMessage('Discount value is required').isFloat({ min: 0 }).withMessage('Discount value must be at least 0'),
  body('minOrder').optional().isFloat({ min: 0 }).withMessage('Min order must be at least 0'),
  body('expiresAt').notEmpty().withMessage('Expiration date is required').isISO8601().withMessage('Expiration date must be a valid date')
];

const validateCouponValidation = [
  body('code').trim().notEmpty().withMessage('Code is required'),
  body('cartTotal').notEmpty().withMessage('Cart total is required').isNumeric().withMessage('Cart total must be a number').isFloat({ min: 0 }).withMessage('Cart total must be at least 0')
];

module.exports = {
  createCouponValidation,
  validateCouponValidation
};
