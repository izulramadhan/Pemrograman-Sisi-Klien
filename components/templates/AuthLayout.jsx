import React from 'react';
import './AuthLayout.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="template-auth-layout">
      <div className="auth-background-glows">
        <div className="glow-circle glow-1"></div>
        <div className="glow-circle glow-2"></div>
      </div>
      <div className="auth-container">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
