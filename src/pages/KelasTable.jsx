import React from 'react';
import { Edit2, Trash2, AlertTriangle } from 'lucide-react';
import Card from '../components/molecules/Card';

const KelasTable = ({ kelas, openEditModal, onDelete, canWrite = true, canDelete = true }) => {
  return (
    <Card title="Daftar Kelas" subtitle="Kelola data kelas perkuliahan, jumlah mahasiswa, dan dosen wali kelas">
      <div className="table-responsive-wrapper">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>Kode Kelas</th>
              <th>Nama Kelas</th>
              <th>Dosen Wali</th>
              <th>Jumlah Mahasiswa</th>
              <th>Status Kelas</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kelas && kelas.length > 0 ? (
              kelas.map((item) => (
                <tr key={item.kode} className="table-row-animate">
                  <td style={{ fontWeight: 700, color: 'var(--primary-hover)' }}>{item.kode}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.nama}</td>
                  <td>{item.dosenWali}</td>
                  <td style={{ fontWeight: 700 }}>{item.jumlahMahasiswa} Mahasiswa</td>
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
                          onClick={() => openEditModal(item.kode)}
                          title="Edit Kelas"
                        >
                          <Edit2 size={15} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          className="action-icon-btn delete"
                          onClick={() => onDelete(item.kode)}
                          title="Hapus Kelas"
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
                    <p>Tidak ada data kelas dalam database.</p>
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

export default KelasTable;
