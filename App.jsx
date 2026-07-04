import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

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
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/admin" replace /> : <LoginPage onLogin={handleLogin} />
          } 
        />
        
        <Route 
          path="/admin/*" 
          element={
            user ? <AdminPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          } 
        />

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
  );
}

export default App;
