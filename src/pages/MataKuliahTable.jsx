import React from 'react';
import { Edit2, Trash2, AlertTriangle } from 'lucide-react';
import Card from '../components/molecules/Card';

const MataKuliahTable = ({ matakuliah, openEditModal, onDelete }) => {
  return (
    <Card title="Database Mata Kuliah" subtitle="Kelola kurikulum, beban SKS, semester, dan jenis mata kuliah">
      <div className="table-responsive-wrapper">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama Mata Kuliah</th>
              <th>SKS</th>
              <th>Semester</th>
              <th>Sifat</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {matakuliah && matakuliah.length > 0 ? (
              matakuliah.map((item) => (
                <tr key={item.kode} className="table-row-animate">
                  <td style={{ fontWeight: 700, color: 'var(--primary-hover)' }}>{item.kode}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.nama}</td>
                  <td style={{ fontWeight: 700 }}>{item.sks} SKS</td>
                  <td>Semester {item.semester}</td>
                  <td>
                    <span className={`role-badge ${item.sifat === 'Wajib' ? 'role-super-admin' : 'role-viewer'}`} style={{ fontSize: '0.8rem' }}>
                      {item.sifat}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-action-group">
                      <button
                        className="action-icon-btn edit"
                        onClick={() => openEditModal(item.kode)}
                        title="Edit Mata Kuliah"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="action-icon-btn delete"
                        onClick={() => onDelete(item.kode)}
                        title="Hapus Mata Kuliah"
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
                    <p>Tidak ada data mata kuliah dalam database.</p>
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

export default MataKuliahTable;
