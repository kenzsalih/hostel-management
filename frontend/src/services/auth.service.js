import api from '../utils/api';

// Login user
export const loginUser = async (credentials) => {
  const payload = await api.post('/auth/login', credentials);
  const envelope = payload?.data || payload;

  return {
    token: envelope?.token,
    user: envelope?.user,
    message: envelope?.message || payload?.message,
  };
};

// Authorized account creation (warden or allowed mess secretary only)
export const createUserByRole = async (userData) => {
  const payload = await api.post('/auth/users', userData);
  return payload?.data || payload;
};

// Get current user
export const getCurrentUser = async () => {
  const payload = await api.get('/auth/me');
  const envelope = payload?.data || payload;
  return envelope?.user || envelope;
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
