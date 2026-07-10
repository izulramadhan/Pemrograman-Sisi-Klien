import React, { useState, useEffect } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import { Search, Check, Loader2, ShieldAlert } from 'lucide-react';
import Card from '../components/molecules/Card';
import UserTable from './UserTable';
import UserModal from './UserModal';
import api from '../services/api';
import './MahasiswaPage.css'; // Reuse common layout styles
import './UserManagement.css';

const UserManagement = () => {
  const { user } = useOutletContext();
  
  // Guard access: Only Super Admin can view this page
  if (user?.role !== 'Super Admin') {
    return (
      <div className="access-denied-container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 1rem' }}>
        <Card title="Akses Ditolak" subtitle="Security Authorization Alert" style={{ maxWidth: '500px', textAlign: 'center' }}>
          <div className="denied-icon-box" style={{ display: 'inline-flex', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <ShieldAlert size={36} />
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Maaf, Anda tidak memiliki hak akses yang cukup untuk membuka halaman Manajemen Pengguna. Menu ini hanya dapat diakses oleh akun berkualifikasi <strong>Super Admin</strong>.
          </p>
        </Card>
      </div>
    );
  }

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/users');
      setUsers(response.data);
    } catch (err) {
      showToast('Gagal memuat daftar pengguna.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async (updatedData) => {
    if (!selectedUser) return;
    
    try {
      const response = await api.put(`/api/users/${selectedUser.username}`, updatedData);
      
      // Update local state list
      setUsers(prev => prev.map(u => u.username === selectedUser.username ? response.data : u));
      showToast(`Hak akses pengguna ${selectedUser.name} berhasil diperbarui!`);
      
      // If the admin edited their own account, we should also trigger updates or notify
      if (selectedUser.username.toLowerCase() === user.username?.toLowerCase() || selectedUser.username.toLowerCase() === 'admin') {
        showToast('Perubahan akses akun Anda berhasil disimpan. Silakan masuk kembali untuk sinkronisasi penuh.');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal memperbarui hak akses pengguna.');
    }
  };

  const openEditModal = (username) => {
    const matched = users.find(u => u.username === username);
    setSelectedUser(matched);
    setModalOpen(true);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mahasiswa-page-container">
      {toastMessage && (
        <div className="admin-toast-notification" style={{ border: '1px solid var(--primary)', maxWidth: '400px' }}>
          <Check size={16} style={{ color: 'var(--primary-hover)' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Manajemen Pengguna</h2>
          <p className="admin-page-subtitle">Kelola otorisasi akun pengguna, role akses kontrol, dan daftar permissions</p>
        </div>
      </div>

      <div className="table-controls" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
        <div className="search-bar-wrapper">
          <Search size={16} className="search-bar-icon" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, username, atau role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="table-search-input"
            style={{ width: '400px' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner-wrapper" style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 className="spinner-icon animate-spin" size={32} style={{ color: 'var(--primary)', animation: 'btn-spin 1s linear infinite' }} />
        </div>
      ) : (
        <UserTable
          users={filteredUsers}
          openEditModal={openEditModal}
        />
      )}

      <UserModal
        isModalOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleUpdateUser}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default UserManagement;
