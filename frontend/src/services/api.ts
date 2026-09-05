import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tf_token_v1');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with user-friendly error messages
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ success?: boolean; message?: string; errors?: any[] }>) => {
    if (!error.response) {
      // Network error / Server down
      const friendlyMessage = 'Unable to connect to the server. Please check your connection and try again.';
      const netErr: any = new Error(friendlyMessage);
      netErr.isNetworkError = true;
      return Promise.reject(netErr);
    }

    const message = error.response.data?.message || error.message || 'An unexpected error occurred.';
    const err: any = new Error(message);
    err.status = error.response.status;
    err.statusCode = error.response.status;
    return Promise.reject(err);
  }
);

export default api;
