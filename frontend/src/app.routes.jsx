import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/login.jsx';
import Dashboard from './pages/dashboard.jsx';
import AddEmployee from './pages/addEmployee.jsx';
import Employees from './pages/employees.jsx';
import EmployeeProfile, { EmployeeEditPlaceholder } from './pages/employeeProfile.jsx';
import AdminProtected from './components/Admin.protected.jsx';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <AdminProtected>
            <Dashboard />
          </AdminProtected>
        }
      />
      <Route
        path="/add-employee"
        element={
          <AdminProtected>
            <AddEmployee />
          </AdminProtected>
        }
      />
      <Route
        path="/employees"
        element={
          <AdminProtected>
            <Employees />
          </AdminProtected>
        }
      />
      <Route
        path="/employees/:id"
        element={
          <AdminProtected>
            <EmployeeProfile />
          </AdminProtected>
        }
      />
      <Route
        path="/employees/:id/edit"
        element={
          <AdminProtected>
            <EmployeeEditPlaceholder />
          </AdminProtected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
