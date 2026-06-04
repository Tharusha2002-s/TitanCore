import axios from 'axios';

const rawApiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getNormalizedApiUrl = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        if (url.includes('localhost') || url.includes('127.0.0.1')) {
            return `http://${url}`;
        } else {
            return `https://${url}`;
        }
    }
    return url;
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
