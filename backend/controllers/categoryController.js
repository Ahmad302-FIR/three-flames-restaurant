import { Category } from '../models/Category.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    return sendSuccess(res, 200, 'Categories retrieved', categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, id, icon, description, image } = req.body;
    const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const category = await Category.create({
      id: id || slug,
      name,
      slug,
      icon: icon || 'Flame',
      description: description || '',
      image: image || ''
    });

    return sendSuccess(res, 201, 'Category created successfully', category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Category.findOneAndUpdate(
      { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { id }, { slug: id }] },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return sendError(res, 404, 'Category not found.');
    }

    return sendSuccess(res, 200, 'Category updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findOneAndDelete({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { id }, { slug: id }]
    });

    if (!deleted) {
      return sendError(res, 404, 'Category not found.');
    }

    return sendSuccess(res, 200, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};
