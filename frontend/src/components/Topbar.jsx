import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/layout.scss';
import { useAuth } from '../hooks/auth.hooks.js';

const titleMap = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/add-employee': 'Add Employee',
  '/projects': 'Projects',
  '/projects/add': 'Add Project',
  '/archived-employees': 'Archived Employees',
  '/admins': 'System Admins',
  '/admins/add': 'Add Admin',
};

const Topbar = ({ onToggleSidebar, user }) => {
  const location = useLocation();
  const { user: authUser } = useAuth();
  const currentUser = user || authUser;
  
  const pathname = location.pathname;
  let title = titleMap[pathname];
  
  if (!title) {
    if (pathname.startsWith('/employees/') && pathname.endsWith('/edit')) {
      title = 'Edit Employee';
    } else if (pathname.startsWith('/employees/')) {
      title = 'Employee Profile';
    } else if (pathname.startsWith('/projects/') && pathname.endsWith('/edit')) {
      title = 'Edit Project';
    } else if (pathname.startsWith('/projects/')) {
      title = 'Project Profile';
    } else if (pathname.startsWith('/admins/') && pathname.endsWith('/edit')) {
      title = 'Edit Admin';
    } else {
      title = 'Staffly Admin';
    }
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger-btn" onClick={onToggleSidebar} aria-label="Toggle navigation">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>
      <div className="topbar-right">
        <button className="icon-button" title="Notifications" type="button">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div 
          className="user-avatar-sm" 
          style={{ width: '36px', height: '36px', fontSize: '14px', cursor: 'pointer' }}
          title={currentUser?.email || 'Admin User'}
        >
          {(currentUser?.email || 'A')[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
