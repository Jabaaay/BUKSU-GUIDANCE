import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Student Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute role="student">
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin Dashboard */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Redirect unauthenticated users to login */}
          <Route path="/*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
