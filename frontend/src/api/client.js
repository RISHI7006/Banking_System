import axios from 'axios';

// Get base URL dynamically:
// 1. If VITE_API_BASE_URL is provided (Render Blueprint / separate services), format and use it.
// 2. In production without VITE_API_BASE_URL (unified single-service Render deployment), use '' (same-origin relative).
// 3. In local development, default to http://127.0.0.1:8000 with 8001 failover.
const getInitialBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() !== '') {
    const cleanUrl = envUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      return `https://${cleanUrl}`;
    }
    return cleanUrl;
  }
  if (import.meta.env.PROD) {
    return ''; // Same origin in production
  }
  const savedPort = typeof window !== 'undefined' ? localStorage.getItem('mbms_backend_port') : null;
  return `http://127.0.0.1:${savedPort || '8000'}`;
};

export const api = axios.create({
  baseURL: getInitialBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auto-failover: If port 8000 is blocked/restricted by Windows in local dev, seamlessly fallback to port 8001
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || config._retry) {
      return Promise.reject(error);
    }

    const currentBase = config.baseURL || api.defaults.baseURL || '';
    if ((error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) && currentBase.includes(':8000')) {
      config._retry = true;
      const fallbackUrl = currentBase.replace(':8000', ':8001');
      api.defaults.baseURL = fallbackUrl;
      config.baseURL = fallbackUrl;
      if (typeof window !== 'undefined') {
        localStorage.setItem('mbms_backend_port', '8001');
      }
      return api(config);
    }

    return Promise.reject(error);
  }
);

export default api;
