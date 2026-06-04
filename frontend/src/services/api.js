import axios from 'axios';

const rawApiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getNormalizedApiUrl = (url) => {
    let normalized = url;
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
        if (normalized.includes('localhost') || normalized.includes('127.0.0.1')) {
            normalized = `http://${normalized}`;
        } else {
            normalized = `https://${normalized}`;
        }
    }
    // Automatically append /api if it's missing at the end of the URL path
    if (!normalized.endsWith('/api') && !normalized.endsWith('/api/')) {
        normalized = normalized.endsWith('/') ? `${normalized}api` : `${normalized}/api`;
    }
    return normalized;
};

const API_URL = getNormalizedApiUrl(rawApiURL);

const API = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach token if logged in
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

export const getBackendUrl = () => {
    return API_URL.replace(/\/api\/?$/, '');
};

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
