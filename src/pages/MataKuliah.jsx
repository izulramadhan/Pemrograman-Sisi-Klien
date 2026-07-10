import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Search, Check, Loader2 } from 'lucide-react';
import Button from '../components/atoms/Button';
import MataKuliahTable from './MataKuliahTable';
import MataKuliahModal from './MataKuliahModal';
import api from '../services/api';
import './MahasiswaPage.css'; // Reuse table list components styling
import './MataKuliah.css';

const MataKuliah = () => {
  const { user } = useOutletContext();
  const canWrite = user?.permissions?.includes('write');
  const canDelete = user?.permissions?.includes('delete');

  const [matakuliah, setMatakuliah] = useState([]);
  const [selectedMK, setSelectedMK] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch Mata Kuliah List via Axios
  const fetchMataKuliah = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/matakuliah');
      setMatakuliah(response.data);
    } catch (err) {
      showToast('Gagal memuat data mata kuliah.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMataKuliah();
  }, []);

  // storeMataKuliah (POST)
  const storeMataKuliah = async (newMK) => {
    try {
      const response = await api.post('/api/matakuliah', newMK);
      setMatakuliah(prev => [response.data, ...prev]);
      showToast(`Mata Kuliah ${newMK.nama} berhasil ditambahkan!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menambahkan mata kuliah.');
    }
  };

  // updateMataKuliah (PUT)
  const updateMataKuliah = async (kode, updatedMK) => {
    try {
      const response = await api.put(`/api/matakuliah/${kode}`, updatedMK);
      setMatakuliah(prev => prev.map(m => m.kode === kode ? response.data : m));
      showToast(`Data mata kuliah ${updatedMK.nama} berhasil diperbarui!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal memperbarui mata kuliah.');
    }
  };

  // deleteMataKuliah (DELETE)
  const deleteMataKuliah = async (kode) => {
    try {
      await api.delete(`/api/matakuliah/${kode}`);
      setMatakuliah(prev => prev.filter(m => m.kode !== kode));
    } catch (err) {
      showToast('Gagal menghapus mata kuliah.');
    }
  };

  const openAddModal = () => {
    setSelectedMK(null);
    setModalOpen(true);
  };

  const openEditModal = (kode) => {
    const matched = matakuliah.find(m => m.kode === kode);
    setSelectedMK(matched);
    setModalOpen(true);
  };

  const handleSubmit = (formState) => {
    if (selectedMK) {
      const confirmUpdate = window.confirm(`Apakah Anda yakin ingin memperbarui data mata kuliah: ${formState.nama}?`);
      if (!confirmUpdate) return;
      updateMataKuliah(selectedMK.kode, formState);
    } else {
      storeMataKuliah(formState);
    }
  };

  const handleDelete = (kode) => {
    const target = matakuliah.find(m => m.kode === kode);
    const targetName = target ? target.nama : kode;

    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus data mata kuliah: ${targetName}?`);
    if (!confirmDelete) return;

    deleteMataKuliah(kode);
    showToast(`Data mata kuliah ${targetName} berhasil dihapus.`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredMK = matakuliah.filter(
    m =>
      m.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sifat.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h2 className="admin-page-title">Kelola Mata Kuliah</h2>
          <p className="admin-page-subtitle">Daftar silabus mata kuliah, bobot SKS, semester dan sifat Wajib/Pilihan</p>
        </div>
        {canWrite && (
          <Button onClick={openAddModal} className="add-user-top-btn">
            <Plus size={18} style={{ marginRight: '0.5rem' }} />
            Tambah Mata Kuliah
          </Button>
        )}
      </div>

      <div className="table-controls" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
        <div className="search-bar-wrapper">
          <Search size={16} className="search-bar-icon" />
          <input
            type="text"
            placeholder="Cari berdasarkan Kode, Nama, atau Sifat Mata Kuliah..."
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
        <MataKuliahTable
          matakuliah={filteredMK}
          openEditModal={openEditModal}
          onDelete={handleDelete}
          canWrite={canWrite}
          canDelete={canDelete}
        />
      )}

      <MataKuliahModal
        isModalOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedMK(null);
        }}
        onSubmit={handleSubmit}
        selectedMK={selectedMK}
        mkList={matakuliah}
      />
    </div>
  );
};

export default MataKuliah;
