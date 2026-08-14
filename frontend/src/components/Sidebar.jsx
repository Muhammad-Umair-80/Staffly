import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/layout.scss';

const Sidebar = ({ collapsed }) => {
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
        <a href="/logout" className="nav-item logout">Logout</a>
      </div>
    </aside>
  );
};

export default Sidebar;
