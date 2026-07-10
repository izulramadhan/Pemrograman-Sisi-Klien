import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap,
  UserCheck,
  BookOpen,
  Settings, 
  Shield, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle, onLogout }) => {
  return (
    <aside className={`organism-sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Shield size={24} className="brand-logo-img" />
        </div>
        {isOpen && <span className="brand-name">Pemsik Admin</span>}
        <button className="sidebar-toggle-btn" onClick={onToggle}>
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/admin" 
          end
          className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
        >
          <LayoutDashboard size={20} />
          {isOpen && <span className="nav-text">Dashboard</span>}
        </NavLink>
        
        <NavLink 
          to="/admin/mahasiswa" 
          className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
        >
          <GraduationCap size={20} />
          {isOpen && <span className="nav-text">Mahasiswa</span>}
        </NavLink>

        <NavLink 
          to="/admin/dosen" 
          className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
        >
          <UserCheck size={20} />
          {isOpen && <span className="nav-text">Dosen</span>}
        </NavLink>

        <NavLink 
          to="/admin/matakuliah" 
          className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
        >
          <BookOpen size={20} />
          {isOpen && <span className="nav-text">Mata Kuliah</span>}
        </NavLink>

        <NavLink 
          to="/admin/system" 
          className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
          onClick={(e) => e.preventDefault()}
        >
          <Activity size={20} />
          {isOpen && <span className="nav-text">System Status</span>}
        </NavLink>

        <NavLink 
          to="/admin/settings" 
          className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
          onClick={(e) => e.preventDefault()}
        >
          <Settings size={20} />
          {isOpen && <span className="nav-text">Settings</span>}
        </NavLink>
      </nav>

      <div className="sidebar-footer-section">
        <button className="nav-item logout-btn" onClick={onLogout}>
          <LogOut size={20} />
          {isOpen && <span className="nav-text">Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
