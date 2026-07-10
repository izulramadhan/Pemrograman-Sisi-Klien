import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Search, Check, Loader2 } from 'lucide-react';
import Button from '../components/atoms/Button';
import KelasTable from './KelasTable';
import KelasModal from './KelasModal';
import Pagination from '../components/molecules/Pagination';
import { useGetDosen } from '../utils/hooks/useDosenQuery';
import { useGetMataKuliah } from '../utils/hooks/useMataKuliahQuery';
import { useGetMahasiswa } from '../utils/hooks/useMahasiswaQuery';
import { 
  useGetKelas, 
  useAddKelas, 
  useUpdateKelas, 
  useDeleteKelas 
} from '../utils/hooks/useKelasQuery';
import './MahasiswaPage.css'; // Reuse common layout styles
import './Kelas.css';

const Kelas = () => {
  const { user } = useOutletContext();
  const canWrite = user?.permissions?.includes('write');
  const canDelete = user?.permissions?.includes('delete');

  // React Query hooks for list fetchings
  const { data: kelas = [], isLoading: isKelasLoading } = useGetKelas();
  const { data: dosenList = [], isLoading: isDosenLoading } = useGetDosen();
  const { data: matakuliahList = [], isLoading: isMKLoading } = useGetMataKuliah();
  const { data: studentList = [], isLoading: isStudentLoading } = useGetMahasiswa();

  const addKelasMutation = useAddKelas();
  const updateKelasMutation = useUpdateKelas();
  const deleteKelasMutation = useDeleteKelas();

  const [selectedKelas, setSelectedKelas] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // Search & Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState('');

  const itemsPerPage = 5;

  // storeKelas (POST)
  const storeKelas = async (newKelas) => {
    try {
      await addKelasMutation.mutateAsync(newKelas);
      showToast(`Kelas ${newKelas.nama} berhasil ditambahkan!`);
      setCurrentPage(1); // Go back to first page
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menambahkan kelas.';
      showToast(msg);
    }
  };

  // updateKelas (PUT)
  const updateKelas = async (kode, updatedKelas) => {
    try {
      await updateKelasMutation.mutateAsync(updatedKelas);
      showToast(`Data kelas ${updatedKelas.nama} berhasil diperbarui!`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal memperbarui kelas.';
      showToast(msg);
    }
  };

  // deleteKelas (DELETE)
  const deleteKelas = async (kode) => {
    try {
      await deleteKelasMutation.mutateAsync(kode);
    } catch (err) {
      showToast('Gagal menghapus kelas.');
    }
  };

  const openAddModal = () => {
    setSelectedKelas(null);
    setModalOpen(true);
  };

  const openEditModal = (kode) => {
    const matched = kelas.find(k => k.kode === kode);
    setSelectedKelas(matched);
    setModalOpen(true);
  };

  const handleSubmit = (formState) => {
    if (selectedKelas) {
      const confirmUpdate = window.confirm(`Apakah Anda yakin ingin memperbarui data kelas: ${formState.nama}?`);
      if (!confirmUpdate) return;
      updateKelas(selectedKelas.kode, formState);
    } else {
      storeKelas(formState);
    }
  };

  const handleDelete = (kode) => {
    const target = kelas.find(k => k.kode === kode);
    const targetName = target ? target.nama : kode;

    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus data kelas: ${targetName}?`);
    if (!confirmDelete) return;

    deleteKelas(kode);
    showToast(`Data kelas ${targetName} berhasil dihapus.`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 6000); // 6 seconds for complex validation messages!
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const filteredKelas = kelas.filter(k => {
    const course = matakuliahList.find(m => m.kode === k.matakuliah);
    const lecturer = dosenList.find(d => d.nidn === k.dosen);
    
    return (
      k.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course && course.nama.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lecturer && lecturer.nama.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Slicing data for active page
  const totalItems = filteredKelas.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedKelas = filteredKelas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isGlobalLoading = isKelasLoading || isDosenLoading || isMKLoading || isStudentLoading;

  return (
    <div className="mahasiswa-page-container">
      {toastMessage && (
        <div className="admin-toast-notification" style={{ maxWidth: '450px', border: '1px solid var(--primary)' }}>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Kelola Kelas</h2>
          <p className="admin-page-subtitle">Daftar kelas akademik perkuliahan, nama kelas, dosen wali, dan jumlah mahasiswa</p>
        </div>
        {canWrite && (
          <Button onClick={openAddModal} className="add-user-top-btn" disabled={isGlobalLoading}>
            <Plus size={18} style={{ marginRight: '0.5rem' }} />
            Tambah Kelas
          </Button>
        )}
      </div>

      <div className="table-controls" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
        <div className="search-bar-wrapper">
          <Search size={16} className="search-bar-icon" />
          <input
            type="text"
            placeholder="Cari berdasarkan Kode, Kelas, Matakuliah, atau Dosen..."
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
          <KelasTable
            kelas={paginatedKelas}
            matakuliahList={matakuliahList}
            dosenList={dosenList}
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

      <KelasModal
        isModalOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedKelas(null);
        }}
        onSubmit={handleSubmit}
        selectedKelas={selectedKelas}
        kelasList={kelas}
        dosenList={dosenList}
        matakuliahList={matakuliahList}
        studentList={studentList}
      />
    </div>
  );
};

export default Kelas;
