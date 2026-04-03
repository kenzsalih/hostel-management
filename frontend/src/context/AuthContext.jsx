import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  clearAuthStorage,
  getCurrentUser,
  getStoredUser,
  getStoredToken,
  persistAuthSession,
} from '../services/auth.service';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const hydrateAuth = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const cachedUser = getStoredUser();
    if (cachedUser) {
      setUser(cachedUser);
    }

    try {
      const payload = await getCurrentUser();
      const normalizedUser = payload?.user || payload;
      setUser(normalizedUser);
      persistAuthSession(normalizedUser, token);
    } catch (error) {
      clearAuthStorage();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    const onStorageChange = (event) => {
      if (event.key === 'token' || event.key === 'user') {
        hydrateAuth();
      }
    };

    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, [hydrateAuth]);

  const login = useCallback((userPayload, token) => {
    persistAuthSession(userPayload, token);
    setUser(userPayload);
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuth: Boolean(user),
      isLoading,
      login,
      logout,
      refreshAuth: hydrateAuth,
    }),
    [user, isLoading, login, logout, hydrateAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
