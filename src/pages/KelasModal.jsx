import React, { useState, useEffect } from 'react';
import Modal from '../components/organisms/Modal';
import Form from '../components/molecules/Form';
import FormField from '../components/molecules/FormField';
import Button from '../components/atoms/Button';

const initialForm = {
  kode: '',
  nama: '',
  matakuliah: '',
  dosen: '',
  mahasiswa: [],
  status: true
};

const KelasModal = ({ 
  isModalOpen, 
  onClose, 
  onSubmit, 
  selectedKelas, 
  kelasList = [], 
  dosenList = [], 
  matakuliahList = [], 
  studentList = [] 
}) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isModalOpen) {
      setErrors({});
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (selectedKelas) {
      setForm({
        kode: selectedKelas.kode || '',
        nama: selectedKelas.nama || '',
        matakuliah: selectedKelas.matakuliah || '',
        dosen: selectedKelas.dosen || '',
        mahasiswa: selectedKelas.mahasiswa || [],
        status: selectedKelas.status !== undefined ? selectedKelas.status : true
      });
    } else {
      setForm({
        kode: '',
        nama: '',
        matakuliah: matakuliahList.length > 0 ? matakuliahList[0].kode : '',
        dosen: dosenList.length > 0 ? dosenList[0].nidn : '',
        mahasiswa: [],
        status: true
      });
    }
  }, [selectedKelas, dosenList, matakuliahList, isModalOpen]);

  if (!isModalOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Toggle student NIM enrollment
  const handleStudentToggle = (nim) => {
    setForm((prev) => {
      const currentEnrolled = prev.mahasiswa || [];
      const updated = currentEnrolled.includes(nim)
        ? currentEnrolled.filter(n => n !== nim)
        : [...currentEnrolled, nim];
      return { ...prev, mahasiswa: updated };
    });
  };

  // Helper: Get student SKS load from other classes (excluding this class)
  const getStudentCurrentSks = (nim) => {
    const otherClasses = kelasList.filter(
      k => k.mahasiswa?.includes(nim) && (!selectedKelas || k.kode !== selectedKelas.kode)
    );
    return otherClasses.reduce((sum, k) => {
      const course = matakuliahList.find(m => m.kode === k.matakuliah);
      return sum + (course ? parseInt(course.sks) : 0);
    }, 0);
  };

  // Helper: Get dosen teaching SKS load from other classes (excluding this class)
  const getDosenCurrentSks = (nidn) => {
    const otherClasses = kelasList.filter(
      k => k.dosen === nidn && (!selectedKelas || k.kode !== selectedKelas.kode)
    );
    return otherClasses.reduce((sum, k) => {
      const course = matakuliahList.find(m => m.kode === k.matakuliah);
      return sum + (course ? parseInt(course.sks) : 0);
    }, 0);
  };

  // Fetch current selected course SKS
  const currentCourse = matakuliahList.find(m => m.kode === form.matakuliah);
  const selectedCourseSks = currentCourse ? parseInt(currentCourse.sks) : 0;

  const validate = () => {
    const newErrors = {};
    if (!form.kode.trim()) {
      newErrors.kode = 'Kode kelas harus diisi';
    } else if (form.kode.length < 3) {
      newErrors.kode = 'Kode kelas minimal 3 karakter';
    }

    if (!form.nama.trim()) newErrors.nama = 'Nama kelas harus diisi';
    if (!form.matakuliah) newErrors.matakuliah = 'Mata Kuliah harus dipilih';
    if (!form.dosen) newErrors.dosen = 'Dosen Pengajar harus dipilih';

    // Uniqueness validation in add mode
    const isEdit = !!selectedKelas;
    const kodeExists = kelasList.some(
      k => k.kode.toLowerCase().trim() === form.kode.toLowerCase().trim() && (!isEdit || k.kode.toLowerCase() !== selectedKelas.kode.toLowerCase())
    );
    if (kodeExists) {
      newErrors.kode = 'Kode kelas sudah terdaftar (Kode kelas harus unik)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    onClose();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onClose}
      title={selectedKelas ? 'Edit Hubungan Kelas' : 'Tambah Kelas & Hubungan Baru'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {selectedKelas ? 'Simpan Perubahan' : 'Simpan Data'}
          </Button>
        </>
      }
    >
      <Form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField
            label="Kode Kelas"
            id="kode"
            name="kode"
            type="text"
            placeholder="e.g. K-101"
            value={form.kode}
            onChange={handleChange}
            error={errors.kode}
            required
            disabled={!!selectedKelas}
          />

          <FormField
            label="Nama Kelas"
            id="nama"
            name="nama"
            type="text"
            placeholder="e.g. IF-4A"
            value={form.nama}
            onChange={handleChange}
            error={errors.nama}
            required
          />
        </div>

        {/* SELECT MATA KULIAH */}
        <div className="molecule-form-field">
          <label htmlFor="matakuliah" className="atom-label">
            Mata Kuliah Diampu
          </label>
          <select
            id="matakuliah"
            name="matakuliah"
            value={form.matakuliah}
            onChange={handleChange}
            className="atom-input"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-primary)', outline: 'none' }}
          >
            {matakuliahList.map((m) => (
              <option key={m.kode} value={m.kode} style={{ background: '#12121d' }}>
                {m.nama} ({m.kode} - {m.sks} SKS)
              </option>
            ))}
          </select>
        </div>

        {/* SELECT DOSEN PENGAJAR */}
        <div className="molecule-form-field">
          <label htmlFor="dosen" className="atom-label">
            Dosen Wali / Pengajar Kelas
          </label>
          <select
            id="dosen"
            name="dosen"
            value={form.dosen}
            onChange={handleChange}
            className="atom-input"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-primary)', outline: 'none' }}
          >
            {dosenList.map((d) => {
              const currentLoad = getDosenCurrentSks(d.nidn);
              const prospectiveLoad = currentLoad + selectedCourseSks;
              const isOverloaded = prospectiveLoad > 12;

              return (
                <option 
                  key={d.nidn} 
                  value={d.nidn} 
                  style={{ background: '#12121d', color: isOverloaded ? 'var(--danger)' : 'var(--text-primary)' }}
                >
                  {d.nama} (Beban: {currentLoad} SKS {selectedCourseSks > 0 && `+ ${selectedCourseSks} SKS = ${prospectiveLoad}/12 SKS`}) {isOverloaded ? '[OVERLOAD]' : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* SELECT MAHASISWA ENROLLED (Multi-checkbox list) */}
        <div className="molecule-form-field" style={{ display: 'flex', flexDirection: 'column' }}>
          <label className="atom-label" style={{ marginBottom: '0.5rem' }}>
            Pilih Mahasiswa Kelas ({form.mahasiswa?.length || 0} Terpilih)
          </label>
          
          <div 
            style={{ 
              maxHeight: '200px', 
              overflowY: 'auto', 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRadius: 'var(--border-radius-sm)', 
              padding: '0.75rem',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            {studentList.map((s) => {
              const isEnrolled = form.mahasiswa?.includes(s.nim);
              const otherLoad = getStudentCurrentSks(s.nim);
              const totalLoad = isEnrolled ? otherLoad + selectedCourseSks : otherLoad;
              const potentialLoad = !isEnrolled ? otherLoad + selectedCourseSks : otherLoad;
              const isOverloaded = potentialLoad > 24;

              return (
                <label 
                  key={s.nim} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.625rem', 
                    cursor: 'pointer',
                    userSelect: 'none',
                    padding: '0.375rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: isEnrolled ? 'rgba(16, 185, 129, 0.04)' : 'transparent',
                    border: '1px solid ' + (isEnrolled ? 'rgba(16, 185, 129, 0.15)' : 'transparent'),
                    transition: 'all 0.15s ease'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isEnrolled}
                    onChange={() => handleStudentToggle(s.nim)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                  />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.825rem' }}>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</span>
                      <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({s.nim})</span>
                    </div>
                    <span 
                      style={{ 
                        fontWeight: 700, 
                        color: isOverloaded && !isEnrolled ? 'var(--danger)' : isEnrolled ? 'var(--primary-hover)' : 'var(--text-secondary)'
                      }}
                    >
                      {totalLoad} SKS {!isEnrolled && `(Jika gabung: ${potentialLoad}/24 SKS)`} {isOverloaded && !isEnrolled ? '[LIMIT EXCEEDED]' : ''}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* STATUS KELAS */}
        <div className="molecule-form-field" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
          <input
            type="checkbox"
            id="status"
            name="status"
            checked={form.status}
            onChange={handleChange}
            style={{
              width: '18px',
              height: '18px',
              accentColor: 'var(--primary)',
              cursor: 'pointer'
            }}
          />
          <label htmlFor="status" className="atom-label" style={{ marginBottom: 0, cursor: 'pointer', userSelect: 'none' }}>
            Kelas Aktif (Centang jika kelas berjalan)
          </label>
        </div>
      </Form>
    </Modal>
  );
};

export default KelasModal;
