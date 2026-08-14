import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import '../styles/layout.scss';

const Layout = ({ children, user }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => setCollapsed((c) => !c);

  return (
    <div className={`app-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} />
      <div className="app-main">
        <Topbar onToggleSidebar={toggle} user={user} />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
