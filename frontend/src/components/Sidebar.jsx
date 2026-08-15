import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/layout.scss';
import { useAuth } from '../hooks/auth.hooks.js';

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

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
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} aria-label="Primary">
      <div className="sidebar-brand">STAFFLY</div>
      <nav className="sidebar-nav">
        <NavLink to="/" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} end>
          Dashboard
        </NavLink>
        <NavLink to="/employees" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          Employees
        </NavLink>
        <NavLink to="/projects" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          Projects
        </NavLink>
        <NavLink to="/archived-employees" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          Archive
        </NavLink>
        <NavLink to="/admins" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          Admins
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="nav-item logout" onClick={handleLogoutClick} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'inherit', padding: 0, font: 'inherit' }}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
