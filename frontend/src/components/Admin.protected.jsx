import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth.hooks.js';

const AdminProtected = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-loading">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtected;
