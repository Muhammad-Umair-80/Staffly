import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/login.jsx';
import AdminProtected from './components/Admin.protected.jsx';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <AdminProtected>
            <div className="dashboard-screen">
              <div className="dashboard-shell">
                <h1>Welcome to the Admin Dashboard</h1>
                <p>
                  You are successfully logged in. Use this area to manage your
                  admin settings and staff details.
                </p>
              </div>
            </div>
          </AdminProtected>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
