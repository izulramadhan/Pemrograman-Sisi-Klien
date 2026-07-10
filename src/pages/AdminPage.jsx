import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit2, Users, HardDrive, ShieldAlert, Wifi, Check, AlertTriangle } from 'lucide-react';
import AdminLayout from '../components/templates/AdminLayout';
import Card from '../components/molecules/Card';
import Button from '../components/atoms/Button';
import Modal from '../components/organisms/Modal';
import Form from '../components/molecules/Form';
import FormField from '../components/molecules/FormField';
import './AdminPage.css';

const initialUsers = [
  { id: 1, name: 'Azizul Izul', email: 'admin@pemsik.com', role: 'Super Admin', status: 'Active' },
  { id: 2, name: 'Budi Santoso', email: 'budi@pemsik.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Siti Rahma', email: 'siti@pemsik.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'Rian Hidayat', email: 'rian@pemsik.com', role: 'Developer', status: 'Active' }
];

const AdminPage = ({ user, onLogout }) => {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Viewer');
  const [formError, setFormError] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  const handleAddUser = () => {
    const errors = {};
    if (!newName.trim()) errors.name = 'Name is required';
    if (!newEmail.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newEmail)) {
      errors.email = 'Email is invalid';
    }

    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }

    const newUser = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: newName,
      email: newEmail,
      role: newRole,
      status: 'Active'
    };

    setUsers([newUser, ...users]);
    setIsModalOpen(false);
    resetForm();
    showToast(`User ${newUser.name} added successfully!`);
  };

  const handleDeleteUser = (id, name) => {
    setUsers(users.filter(u => u.id !== id));
    showToast(`User ${name} has been deleted.`);
  };

  const resetForm = () => {
    setNewName('');
    setNewEmail('');
    setNewRole('Viewer');
    setFormError({});
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast-notification">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Dashboard Title section */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Dashboard Overview</h2>
          <p className="admin-page-subtitle">Real-time status updates and user administration panel</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="add-user-top-btn">
          <Plus size={18} style={{ marginRight: '0.5rem' }} />
          Add User
        </Button>
      </div>

      {/* Dashboard Metrics Cards */}
      <div className="admin-metrics-grid">
        <Card className="metric-card" hoverable>
          <div className="metric-header">
            <span className="metric-label">Total Users</span>
            <div className="metric-icon-box primary-bg">
              <Users size={20} />
            </div>
          </div>
          <div className="metric-value">{users.length}</div>
          <div className="metric-footer-text text-success">
            +12% from last week
          </div>
        </Card>

        <Card className="metric-card" hoverable>
          <div className="metric-header">
            <span className="metric-label">CPU Usage</span>
            <div className="metric-icon-box warning-bg">
              <HardDrive size={20} />
            </div>
          </div>
          <div className="metric-value">24.8%</div>
          <div className="metric-footer-text text-muted">
            Normal state load
          </div>
        </Card>

        <Card className="metric-card" hoverable>
          <div className="metric-header">
            <span className="metric-label">Active Connections</span>
            <div className="metric-icon-box success-bg">
              <Wifi size={20} />
            </div>
          </div>
          <div className="metric-value">1,482</div>
          <div className="metric-footer-text text-success">
            +4.3% speed response
          </div>
        </Card>

        <Card className="metric-card" hoverable>
          <div className="metric-header">
            <span className="metric-label">Security Alerts</span>
            <div className="metric-icon-box danger-bg">
              <ShieldAlert size={20} />
            </div>
          </div>
          <div className="metric-value">0</div>
          <div className="metric-footer-text text-success">
            Secure infrastructure
          </div>
        </Card>
      </div>

      {/* User Management Section */}
      <div className="admin-content-section">
        <Card title="User Administration" subtitle="Manage and monitor system user registration accounts">
          <div className="table-controls">
            <div className="search-bar-wrapper">
              <Search size={16} className="search-bar-icon" />
              <input 
                type="text" 
                placeholder="Search user by name, email, or role..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="table-search-input"
              />
            </div>
          </div>

          <div className="table-responsive-wrapper">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email Address</th>
                  <th>Role Privilege</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((item) => (
                    <tr key={item.id} className="table-row-animate">
                      <td>#{item.id}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</td>
                      <td>{item.email}</td>
                      <td>
                        <span className={`role-badge role-${item.role.toLowerCase().replace(' ', '-')}`}>
                          {item.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-action-group">
                          <button 
                            className="action-icon-btn edit" 
                            onClick={() => showToast(`Edit feature for ${item.name} is mock-only.`)}
                            title="Edit User"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button 
                            className="action-icon-btn delete" 
                            onClick={() => handleDeleteUser(item.id, item.name)}
                            title="Delete User"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      <div className="empty-table-state">
                        <AlertTriangle size={32} style={{ marginBottom: '0.75rem', opacity: 0.6 }} />
                        <p>No user records found matching your query.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal for Adding Users */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Register New User"
        footer={
          <>
            <Button 
              variant="secondary" 
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleAddUser}
            >
              Create Account
            </Button>
          </>
        }
      >
        <Form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
          <FormField
            label="Full Name"
            id="new-name"
            type="text"
            placeholder="e.g. Budi Santoso"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              if (formError.name) setFormError(prev => ({ ...prev, name: '' }));
            }}
            error={formError.name}
            required
          />
          
          <FormField
            label="Email Address"
            id="new-email"
            type="email"
            placeholder="e.g. budi@pemsik.com"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              if (formError.email) setFormError(prev => ({ ...prev, email: '' }));
            }}
            error={formError.email}
            required
          />

          <div className="molecule-form-field">
            <label htmlFor="new-role" className="atom-label">Role Privilege</label>
            <select
              id="new-role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="atom-input"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-primary)', outline: 'none' }}
            >
              <option value="Super Admin" style={{ background: '#12121d' }}>Super Admin</option>
              <option value="Editor" style={{ background: '#12121d' }}>Editor</option>
              <option value="Developer" style={{ background: '#12121d' }}>Developer</option>
              <option value="Viewer" style={{ background: '#12121d' }}>Viewer</option>
            </select>
          </div>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminPage;
