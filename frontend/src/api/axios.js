import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // This will be proxied to http://localhost:8000/api
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add request interceptor to add auth token from localStorage if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  response => response,
  error => {
    // Handle token expiration, etc.
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      // You could add redirect logic here if needed
    }
    return Promise.reject(error);
  }
);

export default api;