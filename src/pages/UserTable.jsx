import React from 'react';
import { Edit2, ShieldAlert } from 'lucide-react';
import Card from '../components/molecules/Card';

const UserTable = ({ users, openEditModal }) => {
  return (
    <Card title="Database Pengguna" subtitle="Daftar akun terdaftar beserta konfigurasi hak akses dan role sistem">
      <div className="table-responsive-wrapper">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>Nama Lengkap</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Permissions</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((item) => (
                <tr key={item.username} className="table-row-animate">
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary-hover)' }}>{item.username}</td>
                  <td>{item.email}</td>
                  <td>
                    <span className={`role-badge ${item.role === 'Super Admin' ? 'role-super-admin' : item.role === 'Dosen' ? 'role-editor' : 'role-viewer'}`}>
                      {item.role}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                      {item.permissions && item.permissions.includes('read') && (
                        <span className="status-badge status-active" style={{ fontSize: '0.725rem', padding: '0.125rem 0.375rem' }}>Read</span>
                      )}
                      {item.permissions && item.permissions.includes('write') && (
                        <span className="status-badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontSize: '0.725rem', padding: '0.125rem 0.375rem' }}>Write</span>
                      )}
                      {item.permissions && item.permissions.includes('delete') && (
                        <span className="status-badge status-inactive" style={{ fontSize: '0.725rem', padding: '0.125rem 0.375rem' }}>Delete</span>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="action-icon-btn edit"
                      onClick={() => openEditModal(item.username)}
                      title="Edit Akses User"
                    >
                      <Edit2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <div className="empty-table-state">
                    <ShieldAlert size={32} style={{ marginBottom: '0.75rem', opacity: 0.6 }} />
                    <p>Tidak ada data pengguna dalam database.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default UserTable;
