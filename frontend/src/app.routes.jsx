import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/login.jsx';
import Dashboard from './pages/dashboard.jsx';
import AddEmployee from './pages/addEmployee.jsx';
import Employees from './pages/employees.jsx';
import EditEmployee from './pages/EditEmployee.jsx';
import EmployeeProfile from './pages/employeeProfile.jsx';
import Archive from './pages/Archive.jsx';
import Projects from './pages/Projects.jsx';
import AddProject from './pages/AddProject.jsx';
import ProjectProfile from './pages/ProjectProfile.jsx';
import EditProject from './pages/EditProject.jsx';
import AdminProtected from './components/Admin.protected.jsx';
import Admins from './pages/Admins.jsx';
import AddAdmin from './pages/AddAdmin.jsx';
import EditAdmin from './pages/EditAdmin.jsx';
import EmployeesExample from './pages/employees_example.jsx';

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
        path="/admins"
        element={
          <AdminProtected>
            <Admins />
          </AdminProtected>
        }
      />
      <Route
        path="/admins/add"
        element={
          <AdminProtected>
            <AddAdmin />
          </AdminProtected>
        }
      />
      <Route
        path="/admins/:id/edit"
        element={
          <AdminProtected>
            <EditAdmin />
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
            <EditEmployee />
          </AdminProtected>
        }
      />
      <Route
        path="/archived-employees"
        element={
          <AdminProtected>
            <Archive/>
          </AdminProtected>
        }
      />
      <Route
        path="/projects"
        element={
          <AdminProtected>
            <Projects />
          </AdminProtected>
        }
      />
      <Route
        path="/projects/add"
        element={
          <AdminProtected>
            <AddProject />
          </AdminProtected>
        }
      />
      <Route
        path="/projects/:id/edit"
        element={
          <AdminProtected>
            <EditProject />
          </AdminProtected>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <AdminProtected>
            <ProjectProfile />
          </AdminProtected>
        }
      />
      <Route
        path="/employees-example"
        element={
          <AdminProtected>
            <EmployeesExample />
          </AdminProtected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
