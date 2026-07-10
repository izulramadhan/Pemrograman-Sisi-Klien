import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, HardDrive, Wifi, ShieldAlert } from 'lucide-react';
import Card from '../components/molecules/Card';
import './AdminPage.css'; // Reuse metrics styling

const DashboardPage = () => {
  const { user } = useOutletContext();

  return (
    <div className="dashboard-content-page">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Dashboard Overview</h2>
          <p className="admin-page-subtitle">Selamat datang kembali, {user?.name || 'Administrator'}! Berikut ringkasan status sistem.</p>
        </div>
      </div>

      <div className="admin-metrics-grid">
        <Card className="metric-card" hoverable>
          <div className="metric-header">
            <span className="metric-label">Total Mahasiswa</span>
            <div className="metric-icon-box primary-bg">
              <Users size={20} />
            </div>
          </div>
          <div className="metric-value">1,248</div>
          <div className="metric-footer-text text-success">
            +5% semester ini
          </div>
        </Card>

        <Card className="metric-card" hoverable>
          <div className="metric-header">
            <span className="metric-label">CPU Usage</span>
            <div className="metric-icon-box warning-bg">
              <HardDrive size={20} />
            </div>
          </div>
          <div className="metric-value">18.4%</div>
          <div className="metric-footer-text text-muted">
            Normal state load
          </div>
        </Card>

        <Card className="metric-card" hoverable>
          <div className="metric-header">
            <span className="metric-label">Koneksi Aktif</span>
            <div className="metric-icon-box success-bg">
              <Wifi size={20} />
            </div>
          </div>
          <div className="metric-value">482</div>
          <div className="metric-footer-text text-success">
            Stable response
          </div>
        </Card>

        <Card className="metric-card" hoverable>
          <div className="metric-header">
            <span className="metric-label">Peringatan Keamanan</span>
            <div className="metric-icon-box danger-bg">
              <ShieldAlert size={20} />
            </div>
          </div>
          <div className="metric-value">0</div>
          <div className="metric-footer-text text-success">
            Sistem aman
          </div>
        </Card>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <Card title="Informasi Sistem Pemsik" subtitle="Portal administrasi data akademik mahasiswa">
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
            Sistem ini dikembangkan menggunakan konsep <strong>Atomic Design</strong> dan <strong>React Router</strong> untuk memberikan pengalaman navigasi yang mulus dan struktur komponen yang terstandarisasi. Anda dapat mengelola data mahasiswa melalui menu <strong>Mahasiswa</strong> pada sidebar di sebelah kiri.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
