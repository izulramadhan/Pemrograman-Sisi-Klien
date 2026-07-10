import React from 'react';
import { Edit2, Trash2, AlertTriangle, BookOpen } from 'lucide-react';
import Card from '../components/molecules/Card';

const DosenTable = ({ dosen, openEditModal, onDelete, canWrite = true, canDelete = true }) => {
  return (
    <Card title="Database Dosen" subtitle="Cari, tambah, edit, dan hapus data tenaga pengajar (dosen)">
      <div className="table-responsive-wrapper">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>NIDN</th>
              <th>Nama Lengkap</th>
              <th>Email</th>
              <th>Bidang Keahlian</th>
              <th>Beban Mengajar</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dosen && dosen.length > 0 ? (
              dosen.map((item) => {
                const isLimitReached = item.totalSks >= 12;
                const isApproachingLimit = item.totalSks >= 9;

                return (
                  <tr key={item.nidn} className="table-row-animate">
                    <td style={{ fontWeight: 700, color: 'var(--primary-hover)' }}>{item.nidn}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.nama}</td>
                    <td>{item.email}</td>
                    <td>
                      <span className="role-badge role-developer" style={{ fontSize: '0.8rem' }}>
                        {item.keahlian}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="status-badge" 
                        style={{ 
                          backgroundColor: isLimitReached ? 'rgba(239, 68, 68, 0.15)' : isApproachingLimit ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                          color: isLimitReached ? 'var(--danger)' : isApproachingLimit ? 'var(--warning)' : '#60a5fa',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <BookOpen size={12} />
                        {item.totalSks} / 12 SKS
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${item.status ? 'active' : 'inactive'}`}>
                        {item.status ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-action-group">
                        {canWrite && (
                          <button
                            className="action-icon-btn edit"
                            onClick={() => openEditModal(item.nidn)}
                            title="Edit Dosen"
                          >
                            <Edit2 size={15} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            className="action-icon-btn delete"
                            onClick={() => onDelete(item.nidn)}
                            title="Hapus Dosen"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <div className="empty-table-state">
                    <AlertTriangle size={32} style={{ marginBottom: '0.75rem', opacity: 0.6 }} />
                    <p>Tidak ada data dosen dalam database.</p>
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

export default DosenTable;
