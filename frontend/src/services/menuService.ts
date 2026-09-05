import api from './api';
import { MenuItem, Category } from '../types';
import { initialMenuItems, categories as defaultCategories } from '../data/menuData';

export const menuService = {
  getMenuItems: async (params?: { category?: string; search?: string; featured?: boolean }): Promise<MenuItem[]> => {
    try {
      const res = await api.get('/menu', { params });
      return res.data.data;
    } catch {
      // Fallback to initial items if backend is offline
      let items = [...initialMenuItems];
      if (params?.category && params.category !== 'all') {
        items = items.filter((item) => item.category.toLowerCase() === params.category?.toLowerCase());
      }
      if (params?.search) {
        const term = params.search.toLowerCase();
        items = items.filter(
          (item) =>
            item.name.toLowerCase().includes(term) ||
            item.description.toLowerCase().includes(term) ||
            item.tags.some((t) => t.toLowerCase().includes(term))
        );
      }
      if (params?.featured !== undefined) {
        items = items.filter((item) => item.featured === params.featured);
      }
      return items;
    }
  },

  getMenuItemById: async (id: string): Promise<MenuItem | null> => {
    try {
      const res = await api.get(`/menu/${id}`);
      return res.data.data;
    } catch {
      return initialMenuItems.find((item) => item.id === id || item.slug === id) || null;
    }
  },

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

  createMenuItem: async (itemData: Omit<MenuItem, 'id' | 'slug'> | FormData): Promise<MenuItem> => {
    const headers = itemData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined;
    const res = await api.post('/menu', itemData, { headers });
    return res.data.data;
  },

  updateMenuItem: async (id: string, updates: Partial<MenuItem> | FormData): Promise<MenuItem> => {
    const headers = updates instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined;
    const res = await api.put(`/menu/${id}`, updates, { headers });
    return res.data.data;
  },

  deleteMenuItem: async (id: string): Promise<boolean> => {
    await api.delete(`/menu/${id}`);
    return true;
  },

  toggleAvailability: async (id: string): Promise<MenuItem> => {
    const res = await api.patch(`/menu/${id}/availability`);
    return res.data.data;
  },

  resetToDefault: async (): Promise<MenuItem[]> => {
    return initialMenuItems;
  }
};
