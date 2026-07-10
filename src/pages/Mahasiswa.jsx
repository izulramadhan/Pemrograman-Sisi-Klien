import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Search, Check, Loader2 } from 'lucide-react';
import Button from '../components/atoms/Button';
import MahasiswaModal from './MahasiswaModal';
import MahasiswaTable from './MahasiswaTable';
import Pagination from '../components/molecules/Pagination';
import { 
  useGetMahasiswa, 
  useAddMahasiswa, 
  useUpdateMahasiswa, 
  useDeleteMahasiswa 
} from '../utils/hooks/useMahasiswaQuery';
import './MahasiswaPage.css'; // Reuse styles

const Mahasiswa = () => {
  const { user } = useOutletContext();
  const canWrite = user?.permissions?.includes('write');
  const canDelete = user?.permissions?.includes('delete');

  // React Query hooks
  const { data: mahasiswa = [], isLoading } = useGetMahasiswa();
  const addMahasiswaMutation = useAddMahasiswa();
  const updateMahasiswaMutation = useUpdateMahasiswa();
  const deleteMahasiswaMutation = useDeleteMahasiswa();

  // state selected mahasiswa
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);

  // state modal
  const [isModalOpen, setModalOpen] = useState(false);

  // Search & Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState('');

  const itemsPerPage = 5;

  // storeMahasiswa
  const storeMahasiswa = async (newMahasiswa) => {
    const newStudent = {
      ...newMahasiswa,
      id: mahasiswa.length ? Math.max(...mahasiswa.map((s) => s.id)) + 1 : 1,
      ipk: parseFloat(newMahasiswa.ipk).toFixed(2),
      hp: newMahasiswa.hp || '-',
      address: newMahasiswa.address || '-'
    };
    try {
      await addMahasiswaMutation.mutateAsync(newStudent);
      showToast(`Mahasiswa ${newStudent.name} berhasil ditambahkan!`);
      setCurrentPage(1); // Go back to first page
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menambahkan mahasiswa.');
    }
  };

  // updateMahasiswa
  const updateMahasiswa = async (nim, updatedMahasiswa) => {
    const updatePayload = {
      ...updatedMahasiswa,
      ipk: parseFloat(updatedMahasiswa.ipk).toFixed(2),
      hp: updatedMahasiswa.hp || '-',
      address: updatedMahasiswa.address || '-'
    };
    try {
      await updateMahasiswaMutation.mutateAsync(updatePayload);
      showToast(`Data mahasiswa ${updatedMahasiswa.name} berhasil diperbarui!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal memperbarui mahasiswa.');
    }
  };

  // deleteMahasiswa
  const deleteMahasiswa = async (nim) => {
    try {
      await deleteMahasiswaMutation.mutateAsync(nim);
      // Adjust current page if items on current page reduce to zero
      const remainingItems = filteredMahasiswa.length - 1;
      const maxPages = Math.ceil(remainingItems / itemsPerPage) || 1;
      if (currentPage > maxPages) {
        setCurrentPage(maxPages);
      }
    } catch (err) {
      showToast('Gagal menghapus data mahasiswa.');
    }
  };

  // openAddModal
  const openAddModal = () => {
    setSelectedMahasiswa(null);
    setModalOpen(true);
  };

  // openEditModal (menerima nim mahasiswa)
  const openEditModal = (nim) => {
    const student = mahasiswa.find((s) => s.nim.toString().trim() === nim.toString().trim());
    setSelectedMahasiswa(student);
    setModalOpen(true);
  };

  // handleSubmit
  const handleSubmit = (formState) => {
    if (selectedMahasiswa) {
      const confirmUpdate = window.confirm(`Apakah Anda yakin ingin memperbarui data mahasiswa: ${formState.name}?`);
      if (!confirmUpdate) return;
      updateMahasiswa(selectedMahasiswa.nim, formState);
    } else {
      storeMahasiswa(formState);
    }
  };

  // handleDelete
  const handleDelete = (nim) => {
    const student = mahasiswa.find((s) => s.nim.toString().trim() === nim.toString().trim());
    const studentName = student ? student.name : nim;
    
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus data mahasiswa: ${studentName}?`);
    if (!confirmDelete) return;

    deleteMahasiswa(nim);
    showToast(`Data mahasiswa ${studentName} berhasil dihapus.`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const filteredMahasiswa = mahasiswa.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nim.includes(searchQuery) ||
      s.prodi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Slicing data for active page list views
  const totalItems = filteredMahasiswa.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedMahasiswa = filteredMahasiswa.slice(
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
          <h2 className="admin-page-title">Kelola Mahasiswa</h2>
          <p className="admin-page-subtitle">Daftar mahasiswa terdaftar beserta informasi studi dan status akademik</p>
        </div>
        {canWrite && (
          <Button onClick={openAddModal} className="add-user-top-btn">
            <Plus size={18} style={{ marginRight: '0.5rem' }} />
            Tambah Mahasiswa
          </Button>
        )}
      </div>

      <div className="table-controls" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
        <div className="search-bar-wrapper">
          <Search size={16} className="search-bar-icon" />
          <input
            type="text"
            placeholder="Cari berdasarkan NIM, Nama, atau Program Studi..."
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
          <MahasiswaTable 
            mahasiswa={paginatedMahasiswa} 
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

      {/* Renders MahasiswaModal component */}
      <MahasiswaModal 
        isModalOpen={isModalOpen} 
        onClose={() => {
          setModalOpen(false);
          setSelectedMahasiswa(null);
        }} 
        onSubmit={handleSubmit} 
        selectedMahasiswa={selectedMahasiswa} 
        mahasiswa={mahasiswa}
      />
    </div>
  );
};

export default Mahasiswa;
