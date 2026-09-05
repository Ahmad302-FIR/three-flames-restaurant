import { body } from 'express-validator';

export const createOrderValidation = [
  body('orderType').isIn(['delivery', 'pickup', 'dine-in']).withMessage('Order type must be delivery, pickup, or dine-in'),
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Item quantity must be at least 1'),
  body('customer.name').trim().notEmpty().withMessage('Customer name is required'),
  body('customer.phone').trim().notEmpty().withMessage('Customer phone is required'),
  body('customer.email').trim().isEmail().withMessage('Valid customer email is required'),
  
  // Conditional checks
  body('deliveryDetails.address').if(body('orderType').equals('delivery')).trim().notEmpty().withMessage('Delivery address is required for delivery orders'),
  body('deliveryDetails.area').if(body('orderType').equals('delivery')).trim().notEmpty().withMessage('Delivery zone/area is required for delivery orders')
];
