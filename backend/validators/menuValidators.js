import { body } from 'express-validator';

export const createMenuItemValidation = [
  body('name').trim().notEmpty().withMessage('Dish name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a valid number >= 0'),
  body('serving').optional().trim(),
  body('prepTime').optional().trim(),
  body('spiceLevel').optional().isIn(['Mild', 'Medium', 'Hot', 'Extra Hot']).withMessage('Invalid spice level')
];

export const updateMenuItemValidation = [
  body('name').optional().trim().notEmpty().withMessage('Dish name cannot be empty'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a valid number >= 0'),
  body('spiceLevel').optional().isIn(['Mild', 'Medium', 'Hot', 'Extra Hot']).withMessage('Invalid spice level')
];
