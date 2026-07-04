import React, { useState } from 'react';
import Sidebar from '../organisms/Sidebar';
import Header from '../organisms/Header';
import Footer from '../organisms/Footer';
import './AdminLayout.css';

const AdminLayout = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="template-admin-layout">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar} 
        onLogout={onLogout}
      />
      
      <div className={`admin-main-container ${sidebarOpen ? 'main-expanded' : 'main-collapsed'}`}>
        <Header 
          onToggleSidebar={toggleSidebar} 
          user={user} 
          onLogout={onLogout}
        />
        
        <main className="admin-content-area">
          <div className="admin-content-inner">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
