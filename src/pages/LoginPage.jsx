import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Key, User as UserIcon } from 'lucide-react';
import Card from '../components/molecules/Card';
import Form from '../components/molecules/Form';
import FormField from '../components/molecules/FormField';
import Button from '../components/atoms/Button';
import api from '../services/api';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', {
        username,
        password
      });

      if (response.data.success) {
        const loggedInUser = response.data.user;
        onLogin({
          name: loggedInUser.name,
          email: loggedInUser.email,
          role: loggedInUser.role,
          avatar: loggedInUser.avatar
        });
        navigate('/admin');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid username or password.';
      setErrors({
        general: errMsg
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="login-card">
      <div className="login-header-logo">
        <div className="login-logo-circle">
          <Shield size={32} />
        </div>
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to access your administration board</p>
      </div>

      {errors.general && (
        <div className="login-general-error">
          {errors.general}
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <div className="input-with-icon-wrapper">
          <FormField
            label="Username"
            id="username"
            type="text"
            placeholder="Enter username (e.g. admin, dosen)"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) setErrors(prev => ({ ...prev, username: '' }));
              if (errors.general) setErrors(prev => ({ ...prev, general: '' }));
            }}
            error={errors.username}
            disabled={loading}
            required
          />
          <UserIcon size={16} className="input-icon-adornment" />
        </div>

        <div className="input-with-icon-wrapper">
          <FormField
            label="Password"
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
              if (errors.general) setErrors(prev => ({ ...prev, general: '' }));
            }}
            error={errors.password}
            disabled={loading}
            required
          />
          <Key size={16} className="input-icon-adornment" />
        </div>

        <div className="login-helper-box">
          <p>Demo accounts (database):<br />
            <strong>admin</strong> / <strong>password123</strong><br />
            <strong>dosen</strong> / <strong>dosenpassword</strong>
          </p>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          loading={loading}
          className="login-submit-btn"
        >
          Sign In
        </Button>

        <div className="register-redirect" style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Belum punya akun? <Link to="/register" style={{ color: 'var(--primary-hover)', textDecoration: 'none', fontWeight: 'bold' }}>Daftar di sini</Link>
        </div>
      </Form>
    </Card>
  );
};

export default LoginPage;
