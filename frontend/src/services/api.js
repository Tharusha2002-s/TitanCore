import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token if user is logged in
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('userInfo'));

    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get backend base URL without /api
export const getBackendUrl = () => {
  return API_URL.replace(/\/api\/?$/, '');
};

// Convert image URL to a complete backend URL when needed
export const getImageUrl = (url) => {
  if (!url) return '';

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  const backendUrl = getBackendUrl();
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;

  return `${backendUrl}${cleanUrl}`;
};

export default API;