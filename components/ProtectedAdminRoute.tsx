import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

interface Props {
  children: React.ReactNode;
}

export const ProtectedAdminRoute: React.FC<Props> = ({ children }) => {
  const user = authService.getCurrentUser();
  const location = useLocation();

  // Strict check for 'admin' role
  if (!user || user.role !== 'admin') {
    // Redirect unauthorized users to home, not login, to hide the route's existence slightly
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};