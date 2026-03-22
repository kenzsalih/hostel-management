import { useState, useEffect } from 'react';
import { isAuthenticated, getStoredUser } from '../services/auth.service';

// Hook to manage authentication state
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on mount
    if (isAuthenticated()) {
      const storedUser = getStoredUser();
      setUser(storedUser);
      setIsAuth(true);
    }
    setIsLoading(false);
  }, []);

  return { user, isLoading, isAuth };
};
