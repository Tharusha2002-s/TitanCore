import axios from 'axios';

// Normalize the backend API URL to guarantee it ends with /api and has proper protocol
const getNormalizedApiUrl = (url) => {
  let normalized = (url || '').trim();

  if (!normalized) {
    return 'http://localhost:5000/api';
  }

  // Remove trailing slashes
  normalized = normalized.replace(/\/+$/, '');

  // Fix common protocol typos: missing colon like "http//" or "https//", or "http:/"
  if (/^http\/\//i.test(normalized)) {
    normalized = normalized.replace(/^http\/\//i, 'http://');
  } else if (/^https\/\//i.test(normalized)) {
    normalized = normalized.replace(/^https\/\//i, 'https://');
  } else if (/^http:\/(?!\/)/i.test(normalized)) {
    normalized = normalized.replace(/^http:\//i, 'http://');
  } else if (/^https:\/(?!\/)/i.test(normalized)) {
    normalized = normalized.replace(/^https:\//i, 'https://');
  } else if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    // If it starts with an IP address or localhost, default to http://
    if (normalized.includes('localhost') || normalized.includes('127.0.0.1') || /^\d+\.\d+\.\d+\.\d+/.test(normalized)) {
      normalized = `http://${normalized}`;
    } else {
      normalized = `https://${normalized}`;
    }
  }

  // Ensure /api suffix is present
  if (!normalized.endsWith('/api')) {
    normalized = `${normalized}/api`;
  }

  return normalized;
};

const API_URL = getNormalizedApiUrl(
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
);

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token if user is logged in
API.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem('userInfo');
      if (stored) {
        const user = JSON.parse(stored);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch {
      // Ignore JSON parse errors if localStorage is corrupted
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