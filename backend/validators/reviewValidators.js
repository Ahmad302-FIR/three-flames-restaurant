const { body } = require('express-validator');

const createReviewValidation = [
  body('rating').notEmpty().withMessage('Rating is required').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required').isLength({ min: 10 }).withMessage('Comment must be at least 10 characters long')
];

module.exports = {
  createReviewValidation
};
