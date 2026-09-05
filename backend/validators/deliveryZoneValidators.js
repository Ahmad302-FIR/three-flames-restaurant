const { body } = require('express-validator');

const createDeliveryZoneValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('fee').notEmpty().withMessage('Fee is required').isNumeric().withMessage('Fee must be a number').isFloat({ min: 0 }).withMessage('Fee must be at least 0'),
  body('minOrder').notEmpty().withMessage('Minimum order is required').isNumeric().withMessage('Minimum order must be a number').isFloat({ min: 0 }).withMessage('Minimum order must be at least 0'),
  body('estimatedMinutes').notEmpty().withMessage('Estimated minutes are required')
];

module.exports = {
  createDeliveryZoneValidation
};
