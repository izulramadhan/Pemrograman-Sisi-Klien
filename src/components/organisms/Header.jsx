import React, { useState } from 'react';
import { Search, Bell, Menu, User, LogOut, ChevronDown } from 'lucide-react';
import './Header.css';

const Header = ({ onToggleSidebar, user = {}, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="organism-header">
      <div className="header-left">
        <button className="header-mobile-toggle" onClick={onToggleSidebar}>
          <Menu size={20} />
        </button>
        
        <div className="header-search">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search anything..." className="search-input" />
        </div>
      </div>

      <div className="header-right">
        <button className="header-action-btn" title="Notifications">
          <Bell size={20} />
          <span className="notification-badge"></span>
        </button>

        <div className="header-profile-menu">
          <button className="profile-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="profile-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <User size={18} />
              )}
            </div>
            <span className="profile-name">{user.name || 'Admin'}</span>
            <ChevronDown size={14} className={`profile-arrow ${dropdownOpen ? 'arrow-rotated' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-user-info">
                <p className="dropdown-name">{user.name || 'Administrator'}</p>
                <p className="dropdown-email">{user.email || 'admin@pemsik.com'}</p>
              </div>
              <hr className="dropdown-divider" />
              <button className="dropdown-item logout-dropdown-item" onClick={onLogout}>
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
