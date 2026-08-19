import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/layout.scss';
import { useAuth } from '../hooks/auth.hooks.js';

const Sidebar = ({ collapsed, mobileOpen, onCloseMobile, user }) => {
  const navigate = useNavigate();
  const { handleLogout, user: authUser } = useAuth();
  const currentUser = user || authUser;

  const handleLogoutClick = (e) => {
    e.preventDefault();
    try {
      handleLogout();
    } catch (err) {
      // ignore errors during logout
    }
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`} aria-label="Primary">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="material-symbols-outlined">badge</span>
        </div>
        <div className="sidebar-brand-info">
          <span className="sidebar-brand-name">Staffly</span>
          <span className="sidebar-brand-tag">Management System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')} 
          end 
          onClick={onCloseMobile}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/employees" 
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          onClick={onCloseMobile}
        >
          <span className="material-symbols-outlined">group</span>
          <span>Employees</span>
        </NavLink>

        <NavLink 
          to="/projects" 
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          onClick={onCloseMobile}
        >
          <span className="material-symbols-outlined">assignment</span>
          <span>Projects</span>
        </NavLink>

        <NavLink 
          to="/archived-employees" 
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          onClick={onCloseMobile}
        >
          <span className="material-symbols-outlined">archive</span>
          <span>Archive</span>
        </NavLink>

        <NavLink 
          to="/admins" 
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          onClick={onCloseMobile}
        >
          <span className="material-symbols-outlined">admin_panel_settings</span>
          <span>Admins</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-block">
          <div className="user-avatar-sm">
            {(currentUser?.email || 'A')[0].toUpperCase()}
          </div>
          <div className="user-details-sm">
            <span className="user-email-sm">{currentUser?.email || 'Administrator'}</span>
            <span className="user-role-sm">System Admin</span>
          </div>
        </div>

        <button 
          type="button" 
          className="nav-item" 
          onClick={handleLogoutClick} 
          style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
