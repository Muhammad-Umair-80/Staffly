import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/login.jsx';
import dashboard from './pages/dashboard.jsx';
import AdminProtected from './components/Admin.protected.jsx';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <AdminProtected>
            <dashboard />
          </AdminProtected>
        }
      />
      
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
