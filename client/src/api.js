import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getProducts = () => api.get('/products').then((r) => r.data);
export const createOrder = (payload) =>
  api.post('/orders', payload).then((r) => r.data);
export const getOrders = () => api.get('/orders').then((r) => r.data);
export const getOrder = (id) => api.get(`/orders/${id}`).then((r) => r.data);

export default api;
