import React from 'react';
import './Footer.css';

const Footer = ({ className = '' }) => {
  return (
    <footer className={`organism-footer ${className}`}>
      <div className="footer-content">
        <p className="footer-copyright">&copy; {new Date().getFullYear()} Pemsik. All rights reserved.</p>
        <div className="footer-system-status">
          <span className="status-indicator-dot"></span>
          <span className="status-text">All systems operational</span>
          <span className="system-version">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
