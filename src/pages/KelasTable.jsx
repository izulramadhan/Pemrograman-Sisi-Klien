import React from 'react';
import { Edit2, Trash2, AlertTriangle, Book, User, Users } from 'lucide-react';
import Card from '../components/molecules/Card';

const KelasTable = ({ kelas, matakuliahList = [], dosenList = [], openEditModal, onDelete, canWrite = true, canDelete = true }) => {
  return (
    <Card title="Daftar Kelas" subtitle="Kelola data kelas perkuliahan, mata kuliah diampu, pengajar dan mahasiswa terdaftar">
      <div className="table-responsive-wrapper">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>Kode Kelas</th>
              <th>Nama Kelas</th>
              <th>Mata Kuliah (SKS)</th>
              <th>Dosen Wali/Pengajar</th>
              <th>Jumlah Mahasiswa</th>
              <th>Status Kelas</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kelas && kelas.length > 0 ? (
              kelas.map((item) => {
                // Find matching course and lecturer details
                const course = matakuliahList.find(m => m.kode === item.matakuliah);
                const lecturer = dosenList.find(d => d.nidn === item.dosen);

                return (
                  <tr key={item.kode} className="table-row-animate">
                    <td style={{ fontWeight: 700, color: 'var(--primary-hover)' }}>{item.kode}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.nama}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {course ? course.nama : item.matakuliah}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.125rem' }}>
                          <Book size={12} /> {item.matakuliah} ({course ? course.sks : '0'} SKS)
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {lecturer ? lecturer.nama : item.dosen}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.125rem' }}>
                          <User size={12} /> NIDN: {item.dosen}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Users size={12} />
                        {item.mahasiswa ? item.mahasiswa.length : 0} Mahasiswa
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
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
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
