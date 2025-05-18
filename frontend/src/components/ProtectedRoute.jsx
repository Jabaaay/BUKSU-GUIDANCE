import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  // Get token from localStorage
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Check if user has the required role
  if (role === 'admin' && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  if (role === 'student' && user.role !== 'student') {
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
