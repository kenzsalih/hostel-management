import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getStoredUser } from '../../services/auth.service';

// Protected route component
export const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const user = getStoredUser();
    if (!allowedRoles.includes(user?.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};
