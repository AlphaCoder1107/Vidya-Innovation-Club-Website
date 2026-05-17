import axios from 'axios';

function normalizeHfSpacesUrl(rawBaseUrl) {
  if (!rawBaseUrl) return '/api';

  const trimmed = rawBaseUrl.trim();

  try {
    const url = new URL(trimmed);
    if (url.hostname === 'huggingface.co' && url.pathname.startsWith('/spaces/')) {
      const [, , owner, repo] = url.pathname.split('/');
      if (owner && repo) {
        return `https://${owner}-${repo}.hf.space/api`;
      }
    }

    if (url.hostname.endsWith('.hf.space') || url.hostname === 'localhost') {
      return url.pathname.endsWith('/api') ? url.toString() : `${url.origin}${url.pathname.replace(/\/$/, '')}/api`;
    }

    return url.pathname.endsWith('/api') ? url.toString() : `${url.origin}${url.pathname.replace(/\/$/, '')}/api`;
  } catch (_err) {
    return trimmed === '/api' ? '/api' : trimmed.endsWith('/api') ? trimmed : `${trimmed.replace(/\/$/, '')}/api`;
  }
}

function normalizeBaseUrl(rawBaseUrl) {
  const baseUrl = normalizeHfSpacesUrl(rawBaseUrl);
  if (baseUrl === '/api') return baseUrl;
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/api`;
}

const baseURL = normalizeBaseUrl(import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vic_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
