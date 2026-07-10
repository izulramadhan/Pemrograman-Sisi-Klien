import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Key, User as UserIcon, Mail } from 'lucide-react';
import Card from '../components/molecules/Card';
import Form from '../components/molecules/Form';
import FormField from '../components/molecules/FormField';
import Button from '../components/atoms/Button';
import api from '../services/api';
import './LoginPage.css'; // Reuse Login layout styles
import './RegisterPage.css';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Viewer'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
    if (!form.username.trim()) newErrors.username = 'Username wajib diisi';
    if (!form.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!form.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await api.post('/api/auth/register', {
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role
      });

      if (response.data.success) {
        setSuccess('Registrasi Berhasil! Mengalihkan ke login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registrasi gagal, coba lagi.';
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="login-card register-card">
      <div className="login-header-logo">
        <div className="login-logo-circle">
          <Shield size={32} />
        </div>
        <h2 className="login-title">Daftar Akun</h2>
        <p className="login-subtitle">Registrasi pengguna baru sistem administrasi</p>
      </div>

      {errors.general && (
        <div className="login-general-error">
          {errors.general}
        </div>
      )}

      {success && (
        <div className="register-success-alert">
          {success}
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <FormField
          label="Nama Lengkap"
          id="name"
          name="name"
          type="text"
          placeholder="Masukkan nama lengkap"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          disabled={loading}
          required
        />

        <div className="input-with-icon-wrapper">
          <FormField
            label="Username"
            id="username"
            name="username"
            type="text"
            placeholder="Buat username unik"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
            disabled={loading}
            required
          />
          <UserIcon size={16} className="input-icon-adornment" style={{ top: '2.5rem' }} />
        </div>

        <div className="input-with-icon-wrapper">
          <FormField
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="Masukkan email aktif"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            disabled={loading}
            required
          />
          <Mail size={16} className="input-icon-adornment" style={{ top: '2.5rem' }} />
        </div>

        <div className="input-with-icon-wrapper">
          <FormField
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="Minimal 6 karakter"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            disabled={loading}
            required
          />
          <Key size={16} className="input-icon-adornment" style={{ top: '2.5rem' }} />
        </div>

        <div className="input-with-icon-wrapper">
          <FormField
            label="Konfirmasi Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Ulangi password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            disabled={loading}
            required
          />
          <Key size={16} className="input-icon-adornment" style={{ top: '2.5rem' }} />
        </div>

        <div className="molecule-form-field">
          <label htmlFor="role" className="atom-label">Role Akses</label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="atom-input"
            disabled={loading}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-primary)', outline: 'none' }}
          >
            <option value="Super Admin" style={{ background: '#12121d' }}>Super Admin</option>
            <option value="Dosen" style={{ background: '#12121d' }}>Dosen</option>
            <option value="Viewer" style={{ background: '#12121d' }}>Viewer</option>
          </select>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          loading={loading}
          className="login-submit-btn"
          style={{ marginTop: '1rem' }}
        >
          Daftar Sekarang
        </Button>

        <div className="register-footer-redirect" style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Sudah punya akun? <Link to="/login" style={{ color: 'var(--primary-hover)', textDecoration: 'none', fontWeight: 'bold' }}>Masuk di sini</Link>
        </div>
      </Form>
    </Card>
  );
};

export default RegisterPage;
