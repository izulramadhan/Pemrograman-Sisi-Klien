import React, { useState, useEffect } from 'react';
import Modal from '../components/organisms/Modal';
import Form from '../components/molecules/Form';
import FormField from '../components/molecules/FormField';
import Button from '../components/atoms/Button';
import { useGetDosen } from '../utils/hooks/useDosenQuery';

const initialForm = {
  kode: '',
  nama: '',
  dosenWali: '',
  jumlahMahasiswa: '',
  status: true
};

const KelasModal = ({ isModalOpen, onClose, onSubmit, selectedKelas, kelasList = [] }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  // Fetch list of lecturers (Dosen) to populate Dosen Wali dropdown!
  const { data: dosenList = [] } = useGetDosen();

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
        dosenWali: selectedKelas.dosenWali || '',
        jumlahMahasiswa: selectedKelas.jumlahMahasiswa || '',
        status: selectedKelas.status !== undefined ? selectedKelas.status : true
      });
    } else {
      // Set default first dosen wali from dropdown list
      setForm({
        ...initialForm,
        dosenWali: dosenList.length > 0 ? dosenList[0].nama : ''
      });
    }
  }, [selectedKelas, dosenList, isModalOpen]);

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
    if (!form.kode.trim()) {
      newErrors.kode = 'Kode kelas harus diisi';
    } else if (form.kode.length < 3) {
      newErrors.kode = 'Kode minimal 3 karakter';
    }

    if (!form.nama.trim()) newErrors.nama = 'Nama kelas harus diisi';
    if (!form.dosenWali.trim()) newErrors.dosenWali = 'Dosen wali harus dipilih';

    if (!form.jumlahMahasiswa.toString().trim()) {
      newErrors.jumlahMahasiswa = 'Jumlah mahasiswa harus diisi';
    } else {
      const jml = parseInt(form.jumlahMahasiswa);
      if (isNaN(jml) || jml < 0) {
        newErrors.jumlahMahasiswa = 'Jumlah mahasiswa harus berupa angka positif';
      }
    }

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
      title={selectedKelas ? 'Edit Data Kelas' : 'Tambah Kelas Baru'}
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

        <div className="molecule-form-field">
          <label htmlFor="dosenWali" className="atom-label">
            Dosen Wali Kelas
          </label>
          <select
            id="dosenWali"
            name="dosenWali"
            value={form.dosenWali}
            onChange={handleChange}
            className="atom-input"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-primary)', outline: 'none' }}
          >
            {dosenList.length > 0 ? (
              dosenList.map((d) => (
                <option key={d.nidn} value={d.nama} style={{ background: '#12121d' }}>
                  {d.nama}
                </option>
              ))
            ) : (
              <option value="" style={{ background: '#12121d' }}>Tidak ada data dosen</option>
            )}
          </select>
          {errors.dosenWali && <span className="atom-input-error">{errors.dosenWali}</span>}
        </div>

        <FormField
          label="Jumlah Mahasiswa"
          id="jumlahMahasiswa"
          name="jumlahMahasiswa"
          type="text"
          placeholder="e.g. 28"
          value={form.jumlahMahasiswa}
          onChange={handleChange}
          error={errors.jumlahMahasiswa}
          required
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
            Kelas Aktif (Centang jika kelas aktif)
          </label>
        </div>
      </Form>
    </Modal>
  );
};

export default KelasModal;
