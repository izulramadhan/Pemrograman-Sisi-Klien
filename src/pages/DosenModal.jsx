import React, { useState, useEffect } from 'react';
import Modal from '../components/organisms/Modal';
import Form from '../components/molecules/Form';
import FormField from '../components/molecules/FormField';
import Button from '../components/atoms/Button';

const initialForm = {
  nidn: '',
  nama: '',
  email: '',
  keahlian: 'Rekayasa Perangkat Lunak',
  status: true
};

const DosenModal = ({ isModalOpen, onClose, onSubmit, selectedDosen, dosenList = [] }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isModalOpen) {
      setErrors({});
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (selectedDosen) {
      setForm({
        nidn: selectedDosen.nidn || '',
        nama: selectedDosen.nama || '',
        email: selectedDosen.email || '',
        keahlian: selectedDosen.keahlian || 'Rekayasa Perangkat Lunak',
        status: selectedDosen.status !== undefined ? selectedDosen.status : true
      });
    } else {
      setForm(initialForm);
    }
  }, [selectedDosen]);

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

  const validate = () => {
    const newErrors = {};
    if (!form.nidn.trim()) {
      newErrors.nidn = 'NIDN harus diisi';
    } else if (!/^\d+$/.test(form.nidn)) {
      newErrors.nidn = 'NIDN harus berupa angka';
    }

    if (!form.nama.trim()) newErrors.nama = 'Nama lengkap harus diisi';
    
    if (!form.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // NIDN uniqueness validation in add mode
    const isEdit = !!selectedDosen;
    const nidnExists = dosenList.some(
      d => d.nidn.trim() === form.nidn.trim() && (!isEdit || d.nidn !== selectedDosen.nidn)
    );
    if (nidnExists) {
      newErrors.nidn = 'NIDN sudah terdaftar (NIDN harus unik)';
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
      title={selectedDosen ? 'Edit Data Dosen' : 'Tambah Dosen Baru'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {selectedDosen ? 'Simpan Perubahan' : 'Simpan Data'}
          </Button>
        </>
      }
    >
      <Form onSubmit={handleSubmit}>
        <FormField
          label="NIDN (Nomor Induk Dosen Nasional)"
          id="nidn"
          name="nidn"
          type="text"
          placeholder="e.g. 0412038501"
          value={form.nidn}
          onChange={handleChange}
          error={errors.nidn}
          required
          disabled={!!selectedDosen}
        />

        <FormField
          label="Nama Lengkap & Gelar"
          id="nama"
          name="nama"
          type="text"
          placeholder="e.g. Dr. Ir. Azizul Izul, M.T."
          value={form.nama}
          onChange={handleChange}
          error={errors.nama}
          required
        />

        <FormField
          label="Email Dosen"
          id="email"
          name="email"
          type="email"
          placeholder="e.g. dosen@pemsik.ac.id"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <div className="molecule-form-field">
          <label htmlFor="keahlian" className="atom-label">
            Bidang Keahlian
          </label>
          <select
            id="keahlian"
            name="keahlian"
            value={form.keahlian}
            onChange={handleChange}
            className="atom-input"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-primary)', outline: 'none' }}
          >
            <option value="Rekayasa Perangkat Lunak" style={{ background: '#12121d' }}>Rekayasa Perangkat Lunak</option>
            <option value="Data Science" style={{ background: '#12121d' }}>Data Science</option>
            <option value="Jaringan Komputer" style={{ background: '#12121d' }}>Jaringan Komputer</option>
            <option value="Kecerdasan Buatan" style={{ background: '#12121d' }}>Kecerdasan Buatan</option>
            <option value="Sistem Informasi" style={{ background: '#12121d' }}>Sistem Informasi</option>
          </select>
        </div>

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
            Dosen Aktif Mengajar (Centang jika aktif)
          </label>
        </div>
      </Form>
    </Modal>
  );
};

export default DosenModal;
