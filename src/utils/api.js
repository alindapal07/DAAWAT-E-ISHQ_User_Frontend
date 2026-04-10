import axios from 'axios';

// Base URL priority:
//   1. REACT_APP_API_URL from .env / Vercel env vars (should include /api)
//   2. Fallback to local dev backend
// Make sure REACT_APP_API_URL ends with /api on all environments.
// Example: https://daawat-e-ishq-user-backend.onrender.com/api
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

// Attach Authorization header if token exists in localStorage
api.interceptors.request.use(
  (config) => { 
    try {
      // Attach user token by default
      const token = localStorage.getItem('userToken');
      // For admin endpoints, prefer adminToken if available
      const isAdminPath = config.url && config.url.startsWith('/admin');
      const adminToken = localStorage.getItem('adminToken');

      if (isAdminPath && adminToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${adminToken}`;
      } else if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // ignore localStorage errors in environments where it's not available
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response handler: clear auth on 401 to force re-login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      if (error.response && error.response.status === 401) {
        // Clear stored auth — let UI handle redirect/login
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
      }
    } catch (e) {
      // noop
    }
    return Promise.reject(error);
  }
);

export default api;
