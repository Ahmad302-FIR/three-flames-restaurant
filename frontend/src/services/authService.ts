import api from './api';
import { UserProfile } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<UserProfile> => {
    const cleanEmail = email.trim().toLowerCase();
    const res = await api.post('/auth/login', { email: cleanEmail, password });
    const resData = res.data;

    if (!resData?.data?.user || !resData?.data?.token) {
      throw new Error('Authentication failed: Missing credentials verification from server.');
    }

    const { user, token } = resData.data;

    // Verify administrative clearance from the real backend response
    if (!['admin', 'superadmin', 'staff'].includes(user.role)) {
      throw new Error('Access denied. Administrator clearance required.');
    }

    localStorage.setItem('tf_token_v1', token);
    return user;
  },

  adminLogin: async (email: string, password: string): Promise<UserProfile> => {
    return authService.login(email, password);
  },

  getMe: async (): Promise<UserProfile | null> => {
    try {
      const res = await api.get('/auth/me');
      return res.data.data.user;
    } catch {
      return null;
    }
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const res = await api.put('/auth/profile', data);
    return res.data.data.user;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.put('/auth/change-password', { currentPassword, newPassword });
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('tf_token_v1');
    }
  }
};
