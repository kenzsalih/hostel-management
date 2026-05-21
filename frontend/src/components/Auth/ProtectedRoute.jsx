import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Protected route component
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuth, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">Checking session...</div>;
  }

  if (!isAuth || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    if (!allowedRoles.includes(user?.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};
