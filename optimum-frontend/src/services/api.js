import axios from 'axios';

// Use relative base URL so Vercel rewrites /api/* to PythonAnywhere backend
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const ordersAPI = {
  // Get all orders
  getOrders: (params = {}) => api.get('/orders/', { params }),
  
  // Get single order
  getOrder: (id) => api.get(`/orders/${id}/`),
  
  // Create new order
  createOrder: (orderData) => api.post('/orders/', orderData),
  
  // Update order
  updateOrder: (id, orderData) => api.patch(`/orders/${id}/`, orderData),
  
  // Update order status
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/update_status/`, { status }),
  
  // Send message for order
  sendMessage: (id, messageData) => api.post(`/orders/${id}/send_message/`, messageData),
  
  // Get dashboard stats
  getDashboardStats: () => api.get('/orders/dashboard_stats/'),
  
  // Get recent orders
  getRecentOrders: (limit = 5) => api.get('/orders/recent_orders/', { params: { limit } }),
};

export const customersAPI = {
  // Get all customers
  getCustomers: (params = {}) => api.get('/customers/', { params }),
  
  // Get single customer
  getCustomer: (id) => api.get(`/customers/${id}/`),
  
  // Create new customer
  createCustomer: (customerData) => api.post('/customers/', customerData),
  
  // Update customer
  updateCustomer: (id, customerData) => api.patch(`/customers/${id}/`, customerData),
  
  // Search customers
  searchCustomers: (query) => api.get('/customers/search/', { params: { q: query } }),
};

export const suppliersAPI = {
  // Get all suppliers
  getSuppliers: (params = {}) => api.get('/suppliers/', { params }),
  
  // Get single supplier
  getSupplier: (id) => api.get(`/suppliers/${id}/`),
  
  // Create new supplier
  createSupplier: (supplierData) => api.post('/suppliers/', supplierData),
  
  // Update supplier
  updateSupplier: (id, supplierData) => api.patch(`/suppliers/${id}/`, supplierData),
  
  // Get top rated suppliers
  getTopRatedSuppliers: (limit = 5) => api.get('/suppliers/top_rated/', { params: { limit } }),
  
  // Search suppliers
  searchSuppliers: (query) => api.get('/suppliers/search/', { params: { q: query } }),
};

export default api;
