import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import '../styles/layout.scss';

const Layout = ({ children, user }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="app-layout">
      <Sidebar 
        mobileOpen={mobileOpen} 
        onCloseMobile={closeMobile} 
        user={user} 
      />

      {mobileOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={closeMobile} 
          aria-hidden="true" 
        />
      )}

      <div className="app-main">
        <Topbar onToggleSidebar={toggleMobile} user={user} />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
