import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Search, Check } from 'lucide-react';
import Button from '../components/atoms/Button';
import MahasiswaModal from './MahasiswaModal';
import MahasiswaTable from './MahasiswaTable';
import initialStudents from '../data/students.json';
import './MahasiswaPage.css'; // Reuse styles

const Mahasiswa = () => {
  const { user } = useOutletContext();
  const canWrite = user?.permissions?.includes('write');
  const canDelete = user?.permissions?.includes('delete');

  // state mahasiswa
  const [mahasiswa, setMahasiswa] = useState(() => {
    const saved = localStorage.getItem('pemsik_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  // state selected mahasiswa
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);

  // state modal
  const [isModalOpen, setModalOpen] = useState(false);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('pemsik_students', JSON.stringify(mahasiswa));
  }, [mahasiswa]);

  // storeMahasiswa
  const storeMahasiswa = (newMahasiswa) => {
    const newStudent = {
      ...newMahasiswa,
      id: mahasiswa.length ? Math.max(...mahasiswa.map((s) => s.id)) + 1 : 1,
      ipk: parseFloat(newMahasiswa.ipk).toFixed(2),
      hp: newMahasiswa.hp || '-',
      address: newMahasiswa.address || '-'
    };
    setMahasiswa([newStudent, ...mahasiswa]);
    showToast(`Mahasiswa ${newStudent.name} berhasil ditambahkan!`);
  };

  // updateMahasiswa
  const updateMahasiswa = (nim, updatedMahasiswa) => {
    setMahasiswa((prev) =>
      prev.map((s) =>
        s.nim.toString().trim() === nim.toString().trim()
          ? {
              ...s,
              ...updatedMahasiswa,
              ipk: parseFloat(updatedMahasiswa.ipk).toFixed(2),
              hp: updatedMahasiswa.hp || '-',
              address: updatedMahasiswa.address || '-'
            }
          : s
      )
    );
    showToast(`Data mahasiswa ${updatedMahasiswa.name} berhasil diperbarui!`);
  };

  // deleteMahasiswa
  const deleteMahasiswa = (nim) => {
    setMahasiswa((prev) => prev.filter((s) => s.nim.toString().trim() !== nim.toString().trim()));
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
      // update
      const confirmUpdate = window.confirm(`Apakah Anda yakin ingin memperbarui data mahasiswa: ${formState.name}?`);
      if (!confirmUpdate) return;
      updateMahasiswa(selectedMahasiswa.nim, formState);
    } else {
      // tambah
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

  const filteredMahasiswa = mahasiswa.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nim.includes(searchQuery) ||
      s.prodi.toLowerCase().includes(searchQuery.toLowerCase())
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="table-search-input"
            style={{ width: '400px' }}
          />
        </div>
      </div>

      {/* Renders MahasiswaTable component */}
      <MahasiswaTable 
        mahasiswa={filteredMahasiswa} 
        openEditModal={openEditModal} 
        onDelete={handleDelete}
        canWrite={canWrite}
        canDelete={canDelete}
      />

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
