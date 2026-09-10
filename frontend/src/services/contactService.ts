import api from './api';
import { ContactMessage } from '../types';

export const contactService = {
  getAdminContactMessages: async (): Promise<ContactMessage[]> => {
    const res = await api.get('/contact/admin/all');
    return res.data.data || [];
  },

  markContactMessageRead: async (id: string): Promise<ContactMessage> => {
    const res = await api.patch(`/contact/admin/${id}/read`);
    return res.data.data;
  },

  deleteContactMessage: async (id: string): Promise<void> => {
    await api.delete(`/contact/admin/${id}`);
  }
};

/**
 * Normalizes phone numbers for WhatsApp.
 * Handles Pakistani 03xxxxxxxxx -> 923xxxxxxxxx,
 * preserves international numbers with country codes.
 */
export const formatWhatsAppNumber = (rawPhone: string): string | null => {
  if (!rawPhone) return null;
  let cleaned = rawPhone.trim().replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  // Convert 03xxxxxxxxx (11 digits) to 923xxxxxxxxx (12 digits)
  if (/^03\d{9}$/.test(cleaned)) {
    return '92' + cleaned.substring(1);
  }
  // Already has Pakistani country code (923xxxxxxxxx)
  if (/^923\d{9}$/.test(cleaned)) {
    return cleaned;
  }
  // 00923xxxxxxxxx -> 923xxxxxxxxx
  if (cleaned.startsWith('0092')) {
    return cleaned.substring(2);
  }
  // Generic international digits (10-15 digits)
  if (/^\d{10,15}$/.test(cleaned)) {
    return cleaned;
  }
  return null;
};
