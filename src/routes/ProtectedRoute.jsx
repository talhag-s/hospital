import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect unauthenticated user to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role checking is needed
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.some(
      (role) => role.toLowerCase() === user.role.toLowerCase()
    );
    if (!hasRole) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
