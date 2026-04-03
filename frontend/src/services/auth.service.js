import api from './api';

// Login user
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Authorized account creation (warden or allowed mess secretary only)
export const createUserByRole = async (userData) => {
  const response = await api.post('/auth/users', userData);
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getStoredToken = () => localStorage.getItem('token');

export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => Boolean(getStoredToken());

export const persistAuthSession = (user, token) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
};

// Backward compatibility for existing imports.
export const storeUser = persistAuthSession;
export const logout = clearAuthStorage;
