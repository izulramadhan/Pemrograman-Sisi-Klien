import React, { useState, useEffect } from 'react';
import Modal from '../components/organisms/Modal';
import Form from '../components/molecules/Form';
import FormField from '../components/molecules/FormField';
import Button from '../components/atoms/Button';

const initialForm = {
  nim: '',
  name: '',
  email: '',
  prodi: 'Teknik Informatika',
  ipk: '',
  status: true,
  hp: '',
  address: ''
};

const MahasiswaModal = ({ isModalOpen, onClose, onSubmit, selectedMahasiswa, mahasiswa = [] }) => {
  // State form
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  // Guard: ketika isModalOpen false maka null
  useEffect(() => {
    if (!isModalOpen) {
      setErrors({});
    }
  }, [isModalOpen]);

  // useEffect untuk mengisi/mengosongkan form berdasarkan selectedMahasiswa
  useEffect(() => {
    if (selectedMahasiswa) {
      setForm({
        nim: selectedMahasiswa.nim || '',
        name: selectedMahasiswa.name || '',
        email: selectedMahasiswa.email || '',
        prodi: selectedMahasiswa.prodi || 'Teknik Informatika',
        ipk: selectedMahasiswa.ipk || '',
        status: selectedMahasiswa.status !== undefined ? selectedMahasiswa.status : true,
        hp: selectedMahasiswa.hp === '-' ? '' : selectedMahasiswa.hp || '',
        address: selectedMahasiswa.address === '-' ? '' : selectedMahasiswa.address || ''
      });
    } else {
      setForm(initialForm);
    }
  }, [selectedMahasiswa]);

  if (!isModalOpen) return null;

  // handleChange event handler
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
    if (!form.nim.toString().trim()) newErrors.nim = 'NIM harus diisi';
    if (!form.name.trim()) newErrors.name = 'Nama harus diisi';
    if (!form.email.trim()) newErrors.email = 'Email harus diisi';
    if (!form.ipk.toString().trim()) {
      newErrors.ipk = 'IPK harus diisi';
    } else {
      const val = parseFloat(form.ipk);
      if (isNaN(val) || val < 0 || val > 4.0) {
        newErrors.ipk = 'IPK harus di antara 0.00 dan 4.00';
      }
    }

    // NIM unique validation
    const isEdit = !!selectedMahasiswa;
    const nimExist = mahasiswa.some(
      (s) => s.nim.toString().trim() === form.nim.toString().trim() && (!isEdit || s.nim !== selectedMahasiswa.nim)
    );
    if (nimExist) {
      newErrors.nim = 'NIM sudah terdaftar (NIM harus unik)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handleSubmit event handler
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
      title={selectedMahasiswa ? 'Edit Data Mahasiswa' : 'Tambah Mahasiswa Baru'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {selectedMahasiswa ? 'Simpan Perubahan' : 'Simpan Data'}
          </Button>
        </>
      }
    >
      <Form onSubmit={handleSubmit}>
        <FormField
          label="NIM (Nomor Induk Mahasiswa)"
          id="nim"
          name="nim"
          type="text"
          placeholder="e.g. 20260010"
          value={form.nim}
          onChange={handleChange}
          error={errors.nim}
          required
          disabled={!!selectedMahasiswa}
        />

        <FormField
          label="Nama Lengkap"
          id="name"
          name="name"
          type="text"
          placeholder="e.g. Azizul Izul"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <FormField
          label="Email Mahasiswa"
          id="email"
          name="email"
          type="email"
          placeholder="e.g. izul@mahasiswa.pemsik.ac.id"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <div className="molecule-form-field">
          <label htmlFor="prodi" className="atom-label">
            Program Studi
          </label>
          <select
            id="prodi"
            name="prodi"
            value={form.prodi}
            onChange={handleChange}
            className="atom-input"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-primary)', outline: 'none' }}
          >
            <option value="Teknik Informatika" style={{ background: '#12121d' }}>
              Teknik Informatika
            </option>
            <option value="Sistem Informasi" style={{ background: '#12121d' }}>
              Sistem Informasi
            </option>
            <option value="Teknik Komputer" style={{ background: '#12121d' }}>
              Teknik Komputer
            </option>
          </select>
        </div>

        <FormField
          label="IPK (Indeks Prestasi Kumulatif)"
          id="ipk"
          name="ipk"
          type="text"
          placeholder="e.g. 3.75"
          value={form.ipk}
          onChange={handleChange}
          error={errors.ipk}
          required
        />

        <FormField
          label="No. HP / Whatsapp (Opsional)"
          id="hp"
          name="hp"
          type="text"
          placeholder="e.g. 0812-xxxx-xxxx"
          value={form.hp}
          onChange={handleChange}
        />

        <FormField
          label="Alamat Rumah (Opsional)"
          id="address"
          name="address"
          type="text"
          placeholder="e.g. Jl. Kenanga No. 5"
          value={form.address}
          onChange={handleChange}
        />

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
            Mahasiswa Aktif (Centang jika aktif)
          </label>
        </div>
      </Form>
    </Modal>
  );
};

export default MahasiswaModal;
