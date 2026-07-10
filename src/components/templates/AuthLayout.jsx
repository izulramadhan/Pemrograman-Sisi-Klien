import React from 'react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.css';

const AuthLayout = () => {
  return (
    <div className="template-auth-layout">
      <div className="auth-background-glows">
        <div className="glow-circle glow-1"></div>
        <div className="glow-circle glow-2"></div>
      </div>
      <div className="auth-container">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
