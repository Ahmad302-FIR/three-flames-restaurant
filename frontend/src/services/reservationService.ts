import api from './api';
import { Reservation, ReservationStatus } from '../types';
import { initialReservations } from '../data/ordersData';

export const reservationService = {
  getReservations: async (): Promise<Reservation[]> => {
    try {
      const res = await api.get('/reservations/admin/all');
      return res.data.data;
    } catch (err: any) {
      if (err.status === 401 || err.status === 403 || err.statusCode === 401 || err.statusCode === 403) {
        throw err;
      }
      return initialReservations;
    }
  },

  getMyReservations: async (): Promise<Reservation[]> => {
    try {
      const res = await api.get('/reservations/my-reservations');
      return res.data.data;
    } catch {
      return initialReservations;
    }
  },

  createReservation: async (data: Omit<Reservation, 'id' | 'createdAt' | 'status'>): Promise<Reservation> => {
    try {
      const res = await api.post('/reservations', data);
      return res.data.data;
    } catch (error: any) {
      if (error.message?.includes('Unable to connect to the server')) {
        const id = `RES-${Math.floor(800 + Math.random() * 200)}`;
        return {
          ...data,
          id,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
      }
      throw error;
    }
  },

  updateReservationStatus: async (
    id: string,
    status: ReservationStatus,
    adminNotes?: string
  ): Promise<Reservation> => {
    const res = await api.patch(`/reservations/admin/${id}/status`, { status, adminNotes });
    return res.data.data;
  },

  trackReservation: async (reservationNumber: string): Promise<Reservation> => {
    const cleanNumber = reservationNumber.trim().toUpperCase();
    const res = await api.get(`/reservations/track/${encodeURIComponent(cleanNumber)}`);
    return res.data.data;
  }
};
