import api from './api';
import { DeliveryZone, Offer, Customer, Review, GalleryItem } from '../types';
import { initialDeliveryZones } from '../data/deliveryZonesData';
import { initialOffers } from '../data/offersData';
import { initialCustomers } from '../data/customersData';
import { reviewsData } from '../data/reviewsData';
import { galleryData } from '../data/galleryData';

export const adminService = {
  getDashboardStats: async () => {
    try {
      const res = await api.get('/admin/dashboard/stats');
      return res.data.data;
    } catch (err: any) {
      if (err.status === 401 || err.status === 403 || err.statusCode === 401 || err.statusCode === 403) {
        throw err;
      }
      return {
        todayOrders: 14,
        todayRevenue: 52400,
        pendingOrders: 3,
        preparingOrders: 2,
        reservationsCount: 6,
        customersCount: 8,
        menuItemsCount: 17,
        averageOrderValue: 3740
      };
    }
  },

  getSalesChartData: async () => {
    try {
      const res = await api.get('/admin/dashboard/charts');
      return res.data.data;
    } catch (err: any) {
      if (err.status === 401 || err.status === 403 || err.statusCode === 401 || err.statusCode === 403) {
        throw err;
      }
      return [
        { time: '12 PM', sales: 6400, orders: 4 },
        { time: '02 PM', sales: 12800, orders: 8 },
        { time: '04 PM', sales: 8200, orders: 5 },
        { time: '06 PM', sales: 19500, orders: 12 },
        { time: '08 PM', sales: 34200, orders: 21 },
        { time: '10 PM', sales: 42100, orders: 26 },
        { time: '12 AM', sales: 18900, orders: 11 }
      ];
    }
  },

  getOrderTypeDistribution: async () => {
    try {
      const res = await api.get('/admin/dashboard/order-distribution');
      return res.data.data.map((d: any) => ({
        name: d.name,
        value: d.count,
        color: d.color || '#C97845'
      }));
    } catch (err: any) {
      if (err.status === 401 || err.status === 403 || err.statusCode === 401 || err.statusCode === 403) {
        throw err;
      }
      return [
        { name: 'Delivery', value: 56, color: '#C97845' },
        { name: 'Pickup', value: 24, color: '#D6A15D' },
        { name: 'Dine-In', value: 20, color: '#7FA27A' }
      ];
    }
  },

  getPopularDishesChart: async () => {
    try {
      const res = await api.get('/admin/dashboard/popular-dishes');
      return res.data.data;
    } catch (err: any) {
      if (err.status === 401 || err.status === 403 || err.statusCode === 401 || err.statusCode === 403) {
        throw err;
      }
      return [
        { name: 'Chicken Sajji', orders: 142, revenue: 255600 },
        { name: 'Shinwari Karahi', orders: 98, revenue: 333200 },
        { name: 'Mutton Seekh', orders: 86, revenue: 98900 },
        { name: 'Royal BBQ Platter', orders: 74, revenue: 362600 },
        { name: 'Kabuli Pulao', orders: 65, revenue: 81250 }
      ];
    }
  },

  getCustomers: async (): Promise<Customer[]> => {
    try {
      const res = await api.get('/admin/dashboard/customers');
      return res.data.data;
    } catch (err: any) {
      if (err.status === 401 || err.status === 403 || err.statusCode === 401 || err.statusCode === 403) {
        throw err;
      }
      return initialCustomers;
    }
  },

  getDeliveryZones: async (): Promise<DeliveryZone[]> => {
    try {
      const res = await api.get('/delivery-zones');
      return res.data.data;
    } catch {
      return initialDeliveryZones;
    }
  },

  getActiveDeliveryZones: async (): Promise<DeliveryZone[]> => {
    try {
      const res = await api.get('/delivery-zones');
      const zones: DeliveryZone[] = res.data.data;
      return zones.filter(z => z.active);
    } catch {
      return initialDeliveryZones.filter(z => z.active);
    }
  },

  saveDeliveryZones: async (zones: DeliveryZone[]): Promise<DeliveryZone[]> => {
    try {
      const res = await api.put('/delivery-zones/sync', { zones });
      return res.data.data;
    } catch {
      return zones;
    }
  },

  createDeliveryZone: async (zoneData: Partial<DeliveryZone>): Promise<DeliveryZone> => {
    const res = await api.post('/delivery-zones', zoneData);
    return res.data.data;
  },

  updateDeliveryZone: async (id: string, updates: Partial<DeliveryZone>): Promise<DeliveryZone> => {
    const res = await api.put(`/delivery-zones/${id}`, updates);
    return res.data.data;
  },

  deleteDeliveryZone: async (id: string): Promise<boolean> => {
    await api.delete(`/delivery-zones/${id}`);
    return true;
  },

  getOffers: async (): Promise<Offer[]> => {
    try {
      const res = await api.get('/coupons/admin/all');
      return res.data.data;
    } catch (err: any) {
      if (err.status === 401 || err.status === 403 || err.statusCode === 401 || err.statusCode === 403) {
        throw err;
      }
      return initialOffers;
    }
  },

  createOffer: async (offerData: Partial<Offer>): Promise<Offer> => {
    const res = await api.post('/coupons/admin', offerData);
    return res.data.data;
  },

  updateOffer: async (id: string, updates: Partial<Offer>): Promise<Offer> => {
    const res = await api.put(`/coupons/admin/${id}`, updates);
    return res.data.data;
  },

  deleteOffer: async (id: string): Promise<boolean> => {
    await api.delete(`/coupons/admin/${id}`);
    return true;
  },

  saveOffers: async (offers: Offer[]): Promise<Offer[]> => {
    try {
      const res = await api.put('/coupons/admin/sync', { offers });
      return res.data.data;
    } catch {
      return offers;
    }
  },

  getPublicReviews: async (): Promise<Review[]> => {
    try {
      const res = await api.get('/reviews');
      return res.data.data;
    } catch {
      return reviewsData;
    }
  },

  getReviews: async (): Promise<Review[]> => {
    try {
      const res = await api.get('/reviews/admin/all');
      return res.data.data;
    } catch (err: any) {
      if (err.status === 401 || err.status === 403 || err.statusCode === 401 || err.statusCode === 403) {
        throw err;
      }
      return reviewsData;
    }
  },

  updateReviewStatus: async (id: string, status: 'approved' | 'pending' | 'hidden'): Promise<Review[]> => {
    try {
      await api.patch(`/reviews/admin/${id}/status`, { status });
      return await adminService.getReviews();
    } catch {
      const reviews = reviewsData.map((r) => (r.id === id ? { ...r, status } : r));
      return reviews;
    }
  },

  deleteReview: async (id: string): Promise<boolean> => {
    await api.delete(`/reviews/admin/${id}`);
    return true;
  },

  getGallery: async (): Promise<GalleryItem[]> => {
    try {
      const res = await api.get('/gallery');
      return res.data.data;
    } catch {
      return galleryData;
    }
  },

  createGalleryItem: async (data: FormData | { title: string; category: string; image: string; description?: string; featured?: boolean }): Promise<GalleryItem> => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined;
    const res = await api.post('/gallery', data, { headers });
    return res.data.data;
  },

  updateGalleryItem: async (id: string, data: FormData | Partial<GalleryItem>): Promise<GalleryItem> => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined;
    const res = await api.put(`/gallery/${id}`, data, { headers });
    return res.data.data;
  },

  deleteGalleryItem: async (id: string): Promise<boolean> => {
    await api.delete(`/gallery/${id}`);
    return true;
  },

  validateCoupon: async (code: string, subtotal: number): Promise<{ coupon: any; discount: number }> => {
    try {
      const res = await api.post('/coupons/validate', { code, subtotal });
      const data = res.data.data;
      return {
        coupon: {
          code: data.code,
          title: data.title,
          discountType: data.discountType,
          discountValue: data.discountValue,
          maxDiscount: data.maxDiscount,
          minOrder: data.minOrder
        },
        discount: data.calculatedDiscount
      };
    } catch (error: any) {
      const found = initialOffers.find((o) => o.code === code && o.isActive);
      if (found) {
        if (subtotal < found.minOrder) {
          throw new Error(`Minimum order of Rs. ${found.minOrder} required for this coupon.`);
        }
        let discount =
          found.discountType === 'percentage'
            ? Math.round((subtotal * found.discountValue) / 100)
            : found.discountValue;
        if (found.maxDiscount && discount > found.maxDiscount) {
          discount = found.maxDiscount;
        }
        return { coupon: found, discount };
      }
      throw error;
    }
  },

  getSettings: async () => {
    try {
      const res = await api.get('/settings');
      return res.data.data;
    } catch {
      return null;
    }
  },

  updateSettings: async (settings: any) => {
    const res = await api.put('/settings', settings);
    return res.data.data;
  }
};

