import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const payload = error.response?.data || {};
    const message = payload.message || payload.error?.message || payload.error || error.message || 'Request failed';

    if (status === 401) {
      clearSession();
    }

    return Promise.reject({
      ...error,
      status,
      message,
      details: payload.details || null,
      payload,
    });
  }
);

const unwrap = (response) => response.data;

const api = {
  get: (url, config = {}) => client.get(url, config).then(unwrap),
  post: (url, body = {}, config = {}) => client.post(url, body, config).then(unwrap),
  patch: (url, body = {}, config = {}) => client.patch(url, body, config).then(unwrap),
  put: (url, body = {}, config = {}) => client.put(url, body, config).then(unwrap),
  delete: (url, config = {}) => client.delete(url, config).then(unwrap),
};

export default api;
