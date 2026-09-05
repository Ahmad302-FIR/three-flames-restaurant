import api from './api';
import { Category } from '../types';
import { categories as defaultCategories } from '../data/menuData';

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const res = await api.get('/categories');
      if (res.data.data && res.data.data.length > 0) {
        return res.data.data;
      }
      return defaultCategories;
    } catch {
      return defaultCategories;
    }
  },

  createCategory: async (data: Partial<Category>): Promise<Category> => {
    const res = await api.post('/categories', data);
    return res.data.data;
  },

  updateCategory: async (id: string, updates: Partial<Category>): Promise<Category> => {
    const res = await api.put('/categories/' + id, updates);
    return res.data.data;
  },

  deleteCategory: async (id: string): Promise<boolean> => {
    await api.delete('/categories/' + id);
    return true;
  }
};
