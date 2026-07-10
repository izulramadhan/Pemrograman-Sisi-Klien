import React, { useState, useEffect } from 'react';
import Modal from '../components/organisms/Modal';
import Form from '../components/molecules/Form';
import FormField from '../components/molecules/FormField';
import Button from '../components/atoms/Button';

const initialForm = {
  kode: '',
  nama: '',
  sks: '3',
  semester: '1',
  sifat: 'Wajib'
};

const MataKuliahModal = ({ isModalOpen, onClose, onSubmit, selectedMK, mkList = [] }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isModalOpen) {
      setErrors({});
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (selectedMK) {
      setForm({
        kode: selectedMK.kode || '',
        nama: selectedMK.nama || '',
        sks: selectedMK.sks || '3',
        semester: selectedMK.semester || '1',
        sifat: selectedMK.sifat || 'Wajib'
      });
    } else {
      setForm(initialForm);
    }
  }, [selectedMK]);

  if (!isModalOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.kode.trim()) {
      newErrors.kode = 'Kode mata kuliah harus diisi';
    } else if (form.kode.length < 3) {
      newErrors.kode = 'Kode minimal 3 karakter';
    }

    if (!form.nama.trim()) newErrors.nama = 'Nama mata kuliah harus diisi';
    
    if (!form.semester.toString().trim()) {
      newErrors.semester = 'Semester harus diisi';
    } else {
      const sem = parseInt(form.semester);
      if (isNaN(sem) || sem < 1 || sem > 8) {
        newErrors.semester = 'Semester harus di antara 1 dan 8';
      }
    }

    // Uniqueness validation in add mode
    const isEdit = !!selectedMK;
    const kodeExists = mkList.some(
      m => m.kode.toLowerCase().trim() === form.kode.toLowerCase().trim() && (!isEdit || m.kode.toLowerCase() !== selectedMK.kode.toLowerCase())
    );
    if (kodeExists) {
      newErrors.kode = 'Kode mata kuliah sudah terdaftar (Kode harus unik)';
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
      title={selectedMK ? 'Edit Data Mata Kuliah' : 'Tambah Mata Kuliah Baru'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {selectedMK ? 'Simpan Perubahan' : 'Simpan Data'}
          </Button>
        </>
      }
    >
      <Form onSubmit={handleSubmit}>
        <FormField
          label="Kode Mata Kuliah"
          id="kode"
          name="kode"
          type="text"
          placeholder="e.g. IF-201"
          value={form.kode}
          onChange={handleChange}
          error={errors.kode}
          required
          disabled={!!selectedMK}
        />

        <FormField
          label="Nama Mata Kuliah"
          id="nama"
          name="nama"
          type="text"
          placeholder="e.g. Pemrograman Web"
          value={form.nama}
          onChange={handleChange}
          error={errors.nama}
          required
        />

        <div className="molecule-form-field">
          <label htmlFor="sks" className="atom-label">
            Jumlah Bobot SKS
          </label>
          <select
            id="sks"
            name="sks"
            value={form.sks}
            onChange={handleChange}
            className="atom-input"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-primary)', outline: 'none' }}
          >
            <option value="1" style={{ background: '#12121d' }}>1 SKS</option>
            <option value="2" style={{ background: '#12121d' }}>2 SKS</option>
            <option value="3" style={{ background: '#12121d' }}>3 SKS</option>
            <option value="4" style={{ background: '#12121d' }}>4 SKS</option>
            <option value="6" style={{ background: '#12121d' }}>6 SKS</option>
          </select>
        </div>

        <FormField
          label="Semester"
          id="semester"
          name="semester"
          type="text"
          placeholder="e.g. 4"
          value={form.semester}
          onChange={handleChange}
          error={errors.semester}
          required
        />

        <div className="molecule-form-field">
          <label className="atom-label">Sifat Mata Kuliah</label>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '0.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="radio"
                name="sifat"
                value="Wajib"
                checked={form.sifat === 'Wajib'}
                onChange={handleChange}
                style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
              />
              Wajib
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="radio"
                name="sifat"
                value="Pilihan"
                checked={form.sifat === 'Pilihan'}
                onChange={handleChange}
                style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
              />
              Pilihan
            </label>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default MataKuliahModal;
