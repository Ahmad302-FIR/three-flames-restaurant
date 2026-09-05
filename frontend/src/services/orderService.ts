import api from './api';
import { Order, OrderStatus } from '../types';
import { initialOrders } from '../data/ordersData';

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    try {
      // If admin, fetch admin orders, else user orders
      const token = localStorage.getItem('tf_token_v1');
      const savedUser = localStorage.getItem('tf_user_v1');
      let isAdmin = false;
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          isAdmin = ['admin', 'superadmin', 'staff'].includes(parsed.role);
        } catch {}
      }
      
      const endpoint = isAdmin ? '/admin/orders' : (token ? '/orders/my-orders' : '/orders/my-orders');
      const res = await api.get(endpoint);
      return res.data.data;
    } catch (err: any) {
      if (err.status === 401 || err.status === 403 || err.statusCode === 401 || err.statusCode === 403) {
        throw err;
      }
      return initialOrders;
    }
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    try {
      // First try tracking endpoint (accessible publicly without auth)
      const res = await api.get(`/orders/track/${id}`);
      return res.data.data;
    } catch {
      try {
        const res = await api.get(`/orders/${id}`);
        return res.data.data;
      } catch {
        return initialOrders.find((o) => o.id.toLowerCase() === id.toLowerCase()) || null;
      }
    }
  },

  createOrder: async (orderData: Omit<Order, 'id' | 'createdAt' | 'timeline' | 'status'>): Promise<Order> => {
    try {
      const res = await api.post('/orders', orderData);
      return res.data.data;
    } catch (error: any) {
      // If server unreachable, fallback simulation
      if (error.message?.includes('Unable to connect to the server')) {
        const orderNumber = `TF-${Math.floor(1000 + Math.random() * 9000)}`;
        const fallbackOrder: Order = {
          ...orderData,
          id: orderNumber,
          createdAt: new Date().toISOString(),
          status: 'pending',
          timeline: [
            {
              status: 'pending',
              title: 'Order Received',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              completed: true,
              note: 'Order placed in local offline mode.'
            }
          ]
        };
        return fallbackOrder;
      }
      throw error;
    }
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const res = await api.patch(`/admin/orders/${id}/status`, { status });
    return res.data.data;
  },

  getCustomerOrders: async (emailOrPhone?: string): Promise<Order[]> => {
    try {
      const res = await api.get('/orders/my-orders');
      let orders: Order[] = res.data.data;
      if (emailOrPhone) {
        orders = orders.filter(
          (o) =>
            o.customer.email.toLowerCase() === emailOrPhone.toLowerCase() ||
            o.customer.phone === emailOrPhone
        );
      }
      return orders;
    } catch {
      if (!emailOrPhone) return initialOrders;
      return initialOrders.filter(
        (o) =>
          o.customer.email.toLowerCase() === emailOrPhone.toLowerCase() ||
          o.customer.phone === emailOrPhone
      );
    }
  }
};
