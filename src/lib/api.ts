import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
  changePassword: (data: { currentPassword: string; newPassword: string }) => 
    api.put('/auth/change-password', data),
};

export const customerAPI = {
  getAll: (params?: any) => api.get('/customers', { params }),
  create: (data: any) => api.post('/customers', data),
  update: (id: number, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: number) => api.delete(`/customers/${id}`),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRevenueChart: () => api.get('/dashboard/revenue-chart'),
};

export const settingsAPI = {
  getAll: () => api.get('/settings'),
  update: (key: string, value: any) => api.put(`/settings/${key}`, { value }),
};

export default api;
