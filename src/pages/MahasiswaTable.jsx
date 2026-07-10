import React from 'react';
import { Eye, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/molecules/Card';

const MahasiswaTable = ({ mahasiswa, openEditModal, onDelete, canWrite = true, canDelete = true }) => {
  const handleDelete = (nim) => {
    onDelete(nim);
  };

  return (
    <Card title="Database Mahasiswa" subtitle="Cari, tambah, edit, hapus, dan lihat rincian detail mahasiswa">
      <div className="table-responsive-wrapper">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>NIM</th>
              <th>Nama</th>
              <th>Program Studi</th>
              <th>IPK</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {mahasiswa && mahasiswa.length > 0 ? (
              mahasiswa.map((item) => (
                <tr key={item.nim} className="table-row-animate">
                  <td style={{ fontWeight: 700, color: 'var(--primary-hover)' }}>{item.nim}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</td>
                  <td>{item.prodi}</td>
                  <td style={{ fontWeight: 700 }}>{item.ipk}</td>
                  <td>
                    <span className={`status-badge status-${item.status ? 'active' : 'inactive'}`}>
                      {item.status ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-action-group">
                      <Link
                        className="action-icon-btn edit"
                        to={`/admin/mahasiswa/${item.id}`}
                        title="Lihat Detail"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <Eye size={15} />
                      </Link>
                      
                      {canWrite && (
                        <button
                          className="action-icon-btn edit"
                          onClick={() => openEditModal(item.nim)}
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                      )}

                      {canDelete && (
                        <button
                          className="action-icon-btn delete"
                          onClick={() => handleDelete(item.nim)}
                          title="Hapus"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <div className="empty-table-state">
                    <AlertTriangle size={32} style={{ marginBottom: '0.75rem', opacity: 0.6 }} />
                    <p>Tidak ada data mahasiswa dalam database.</p>
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

export default MahasiswaTable;
