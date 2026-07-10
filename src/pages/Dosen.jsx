import React, { useState, useEffect } from 'react';
import { Plus, Search, Check, Loader2 } from 'lucide-react';
import Button from '../components/atoms/Button';
import DosenTable from './DosenTable';
import DosenModal from './DosenModal';
import api from '../services/api';
import './MahasiswaPage.css'; // Reuse table list components styling
import './Dosen.css';

const Dosen = () => {
  const [dosen, setDosen] = useState([]);
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch Dosen List via Axios
  const fetchDosen = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/dosen');
      setDosen(response.data);
    } catch (err) {
      showToast('Gagal memuat data dosen.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDosen();
  }, []);

  // storeDosen (POST)
  const storeDosen = async (newDosen) => {
    try {
      const response = await api.post('/api/dosen', newDosen);
      setDosen(prev => [response.data, ...prev]);
      showToast(`Dosen ${newDosen.nama} berhasil ditambahkan!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menambahkan dosen.');
    }
  };

  // updateDosen (PUT)
  const updateDosen = async (nidn, updatedDosen) => {
    try {
      const response = await api.put(`/api/dosen/${nidn}`, updatedDosen);
      setDosen(prev => prev.map(d => d.nidn === nidn ? response.data : d));
      showToast(`Data dosen ${updatedDosen.nama} berhasil diperbarui!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal memperbarui dosen.');
    }
  };

  // deleteDosen (DELETE)
  const deleteDosen = async (nidn) => {
    try {
      await api.delete(`/api/dosen/${nidn}`);
      setDosen(prev => prev.filter(d => d.nidn !== nidn));
    } catch (err) {
      showToast('Gagal menghapus dosen.');
    }
  };

  const openAddModal = () => {
    setSelectedDosen(null);
    setModalOpen(true);
  };

  const openEditModal = (nidn) => {
    const matched = dosen.find(d => d.nidn === nidn);
    setSelectedDosen(matched);
    setModalOpen(true);
  };

  const handleSubmit = (formState) => {
    if (selectedDosen) {
      const confirmUpdate = window.confirm(`Apakah Anda yakin ingin memperbarui data dosen: ${formState.nama}?`);
      if (!confirmUpdate) return;
      updateDosen(selectedDosen.nidn, formState);
    } else {
      storeDosen(formState);
    }
  };

  const handleDelete = (nidn) => {
    const target = dosen.find(d => d.nidn === nidn);
    const targetName = target ? target.nama : nidn;

    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus data dosen: ${targetName}?`);
    if (!confirmDelete) return;

    deleteDosen(nidn);
    showToast(`Data dosen ${targetName} berhasil dihapus.`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredDosen = dosen.filter(
    d =>
      d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nidn.includes(searchQuery) ||
      d.keahlian.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mahasiswa-page-container">
      {toastMessage && (
        <div className="admin-toast-notification">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Kelola Dosen</h2>
          <p className="admin-page-subtitle">Daftar tenaga pengajar, nidn, kualifikasi bidang dan status keaktifan</p>
        </div>
        <Button onClick={openAddModal} className="add-user-top-btn">
          <Plus size={18} style={{ marginRight: '0.5rem' }} />
          Tambah Dosen
        </Button>
      </div>

      <div className="table-controls" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
        <div className="search-bar-wrapper">
          <Search size={16} className="search-bar-icon" />
          <input
            type="text"
            placeholder="Cari berdasarkan NIDN, Nama, atau Bidang Keahlian..."
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
        <DosenTable
          dosen={filteredDosen}
          openEditModal={openEditModal}
          onDelete={handleDelete}
        />
      )}

      <DosenModal
        isModalOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedDosen(null);
        }}
        onSubmit={handleSubmit}
        selectedDosen={selectedDosen}
        dosenList={dosen}
      />
    </div>
  );
};

export default Dosen;
