import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/layout.scss';

const titleMap = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/projects': 'Projects',
  '/archived-employees': 'Archived Employees',
  '/admins': 'Admins',
};

const Topbar = ({ onToggleSidebar, user }) => {
  const location = useLocation();
  const title = titleMap[location.pathname] || (location.pathname.split('/')[1] || '');

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger" onClick={onToggleSidebar} aria-label="Toggle navigation">☰</button>
        <h2 className="topbar-title">{title}</h2>
      </div>
      <div className="topbar-right">
        <div className="topbar-user">{user?.email || 'Admin'}</div>
      </div>
    </header>
  );
};

export default Topbar;
