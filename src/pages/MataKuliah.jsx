import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Search, Check, Loader2 } from 'lucide-react';
import Button from '../components/atoms/Button';
import MataKuliahTable from './MataKuliahTable';
import MataKuliahModal from './MataKuliahModal';
import Pagination from '../components/molecules/Pagination';
import { 
  useGetMataKuliah, 
  useAddMataKuliah, 
  useUpdateMataKuliah, 
  useDeleteMataKuliah 
} from '../utils/hooks/useMataKuliahQuery';
import './MahasiswaPage.css'; // Reuse table list components styling
import './MataKuliah.css';

const MataKuliah = () => {
  const { user } = useOutletContext();
  const canWrite = user?.permissions?.includes('write');
  const canDelete = user?.permissions?.includes('delete');

  // React Query hooks
  const { data: matakuliah = [], isLoading } = useGetMataKuliah();
  const addMKMutation = useAddMataKuliah();
  const updateMKMutation = useUpdateMataKuliah();
  const deleteMKMutation = useDeleteMataKuliah();

  const [selectedMK, setSelectedMK] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // Search & Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState('');

  const itemsPerPage = 5;

  // storeMataKuliah (POST)
  const storeMataKuliah = async (newMK) => {
    try {
      await addMKMutation.mutateAsync(newMK);
      showToast(`Mata Kuliah ${newMK.nama} berhasil ditambahkan!`);
      setCurrentPage(1); // Go back to first page
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menambahkan mata kuliah.');
    }
  };

  // updateMataKuliah (PUT)
  const updateMataKuliah = async (kode, updatedMK) => {
    try {
      await updateMKMutation.mutateAsync(updatedMK);
      showToast(`Data mata kuliah ${updatedMK.nama} berhasil diperbarui!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal memperbarui mata kuliah.');
    }
  };

  // deleteMataKuliah (DELETE)
  const deleteMataKuliah = async (kode) => {
    try {
      await deleteMKMutation.mutateAsync(kode);
      const remainingItems = filteredMK.length - 1;
      const maxPages = Math.ceil(remainingItems / itemsPerPage) || 1;
      if (currentPage > maxPages) {
        setCurrentPage(maxPages);
      }
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const filteredMK = matakuliah.filter(
    m =>
      m.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sifat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Slicing data for active page
  const totalItems = filteredMK.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedMK = filteredMK.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
            onChange={handleSearchChange}
            className="table-search-input"
            style={{ width: '400px' }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="loading-spinner-wrapper" style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 className="spinner-icon animate-spin" size={32} style={{ color: 'var(--primary)', animation: 'btn-spin 1s linear infinite' }} />
        </div>
      ) : (
        <>
          <MataKuliahTable
            matakuliah={paginatedMK}
            openEditModal={openEditModal}
            onDelete={handleDelete}
            canWrite={canWrite}
            canDelete={canDelete}
          />
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
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
