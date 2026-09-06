import { io, Socket } from 'socket.io-client';

const getSocketUrl = (): string => {
  const defaultUrl = import.meta.env.PROD
    ? 'https://backend-six-tau-kva66m6smt.vercel.app'
    : 'http://localhost:5000';
  const rawUrl = (import.meta.env.VITE_SOCKET_URL as string) || defaultUrl;
  return rawUrl.trim().replace(/\/+$/, '');
};

const SOCKET_URL = getSocketUrl();

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
      timeout: 5000
    });

    socket.on('connect_error', (err) => {
      // Gracefully handle serverless environments where persistent WebSockets may not be supported
      console.warn('Realtime Socket.IO connection unavailable (falling back to REST API):', err.message);
    });
  }
  return socket;
};

export const joinOrderTracking = (orderNumber: string) => {
  const s = getSocket();
  s.emit('join:order', orderNumber);
};

export const leaveOrderTracking = (orderNumber: string) => {
  const s = getSocket();
  s.emit('leave:order', orderNumber);
};

export const onOrderStatusChange = (callback: (data: any) => void) => {
  const s = getSocket();
  s.on('order:status_updated', callback);
  return () => {
    s.off('order:status_updated', callback);
  };
};

export const joinAdminKitchen = () => {
  const s = getSocket();
  s.emit('join:admin');
};

export const onAdminOrderUpdate = (callback: (data: any) => void) => {
  const s = getSocket();
  s.on('admin:order_updated', callback);
  s.on('order:created', callback);
  return () => {
    s.off('admin:order_updated', callback);
    s.off('order:created', callback);
  };
};
