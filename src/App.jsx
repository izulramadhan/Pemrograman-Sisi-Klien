import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import Mahasiswa from './pages/Mahasiswa';
import MahasiswaDetailPage from './pages/MahasiswaDetailPage';
import Dosen from './pages/Dosen';
import MataKuliah from './pages/MataKuliah';
import Kelas from './pages/Kelas';
import UserManagement from './pages/UserManagement';
import AuthLayout from './components/templates/AuthLayout';
import AdminLayout from './components/templates/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Initialize TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('pemsik_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('pemsik_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pemsik_user');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes with AuthLayout template */}
          <Route element={<AuthLayout />}>
            <Route 
              path="/login" 
              element={
                user ? <Navigate to="/admin" replace /> : <LoginPage onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/register" 
              element={
                user ? <Navigate to="/admin" replace /> : <RegisterPage />
              } 
            />
          </Route>
          
          {/* Protected Admin Routes with AdminLayout template */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="mahasiswa" element={<Mahasiswa />} />
            <Route path="mahasiswa/:id" element={<MahasiswaDetailPage />} />
            <Route path="dosen" element={<Dosen />} />
            <Route path="matakuliah" element={<MataKuliah />} />
            <Route path="kelas" element={<Kelas />} />
            <Route path="users" element={<UserManagement />} />
          </Route>

          {/* Fallback routes */}
          <Route 
            path="/" 
            element={<Navigate to={user ? "/admin" : "/login"} replace />} 
          />
          <Route 
            path="*" 
            element={<Navigate to={user ? "/admin" : "/login"} replace />} 
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
