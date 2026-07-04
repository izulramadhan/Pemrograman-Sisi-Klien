import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, User as UserIcon } from 'lucide-react';
import AuthLayout from '../components/templates/AuthLayout';
import Card from '../components/molecules/Card';
import Form from '../components/molecules/Form';
import FormField from '../components/molecules/FormField';
import Button from '../components/atoms/Button';
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
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    if (!validate()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (username.toLowerCase() === 'admin' && password === 'admin123') {
        onLogin({
          name: 'Azizul Izul',
          email: 'admin@pemsik.com',
          role: 'Super Admin',
          avatar: ''
        });
        navigate('/admin');
      } else {
        setErrors({
          general: 'Invalid username or password. (Use admin / admin123)'
        });
      }
    }, 1200);
  };

  return (
    <AuthLayout>
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
              placeholder="Enter username (e.g. admin)"
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
              placeholder="Enter password (e.g. admin123)"
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
            <p>Demo account: <strong>admin</strong> / <strong>admin123</strong></p>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            loading={loading}
            className="login-submit-btn"
          >
            Sign In
          </Button>
        </Form>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
