import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Search, Check, Loader2 } from 'lucide-react';
import Button from '../components/atoms/Button';
import DosenTable from './DosenTable';
import DosenModal from './DosenModal';
import Pagination from '../components/molecules/Pagination';
import { useGetKelas } from '../utils/hooks/useKelasQuery';
import { useGetMataKuliah } from '../utils/hooks/useMataKuliahQuery';
import { 
  useGetDosen, 
  useAddDosen, 
  useUpdateDosen, 
  useDeleteDosen 
} from '../utils/hooks/useDosenQuery';
import './MahasiswaPage.css'; // Reuse table list components styling
import './Dosen.css';

const Dosen = () => {
  const { user } = useOutletContext();
  const canWrite = user?.permissions?.includes('write');
  const canDelete = user?.permissions?.includes('delete');

  // React Query hooks
  const { data: dosen = [], isLoading: isDsnLoading } = useGetDosen();
  const { data: kelasList = [], isLoading: isKelasLoading } = useGetKelas();
  const { data: mkList = [], isLoading: isMKLoading } = useGetMataKuliah();

  const addDosenMutation = useAddDosen();
  const updateDosenMutation = useUpdateDosen();
  const deleteDosenMutation = useDeleteDosen();

  const [selectedDosen, setSelectedDosen] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // Search & Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState('');

  const itemsPerPage = 5;

  // storeDosen (POST)
  const storeDosen = async (newDosen) => {
    try {
      await addDosenMutation.mutateAsync(newDosen);
      showToast(`Dosen ${newDosen.nama} berhasil ditambahkan!`);
      setCurrentPage(1); // Go back to first page
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menambahkan dosen.');
    }
  };

  // updateDosen (PUT)
  const updateDosen = async (nidn, updatedDosen) => {
    try {
      await updateDosenMutation.mutateAsync(updatedDosen);
      showToast(`Data dosen ${updatedDosen.nama} berhasil diperbarui!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal memperbarui dosen.');
    }
  };

  // deleteDosen (DELETE)
  const deleteDosen = async (nidn) => {
    try {
      await deleteDosenMutation.mutateAsync(nidn);
      const remainingItems = filteredDosen.length - 1;
      const maxPages = Math.ceil(remainingItems / itemsPerPage) || 1;
      if (currentPage > maxPages) {
        setCurrentPage(maxPages);
      }
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const filteredDosen = dosen.filter(
    d =>
      d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nidn.includes(searchQuery) ||
      d.keahlian.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Map Dosen teaching SKS load dynamically!
  const dosenWithSks = filteredDosen.map(teacher => {
    const classesTaught = kelasList.filter(k => k.dosen === teacher.nidn);
    const totalSks = classesTaught.reduce((sum, k) => {
      const course = mkList.find(m => m.kode === k.matakuliah);
      return sum + (course ? parseInt(course.sks) : 0);
    }, 0);
    return { ...teacher, totalSks };
  });

  // Slicing data for active page
  const totalItems = dosenWithSks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedDosen = dosenWithSks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isGlobalLoading = isDsnLoading || isKelasLoading || isMKLoading;

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
        {canWrite && (
          <Button onClick={openAddModal} className="add-user-top-btn" disabled={isGlobalLoading}>
            <Plus size={18} style={{ marginRight: '0.5rem' }} />
            Tambah Dosen
          </Button>
        )}
      </div>

      <div className="table-controls" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
        <div className="search-bar-wrapper">
          <Search size={16} className="search-bar-icon" />
          <input
            type="text"
            placeholder="Cari berdasarkan NIDN, Nama, atau Bidang Keahlian..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="table-search-input"
            style={{ width: '400px' }}
          />
        </div>
      </div>

      {isGlobalLoading ? (
        <div className="loading-spinner-wrapper" style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 className="spinner-icon animate-spin" size={32} style={{ color: 'var(--primary)', animation: 'btn-spin 1s linear infinite' }} />
        </div>
      ) : (
        <>
          <DosenTable
            dosen={paginatedDosen}
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
