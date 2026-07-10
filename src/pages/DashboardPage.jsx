import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { GraduationCap, UserCheck, BookOpen, Presentation } from 'lucide-react';
import Card from '../components/molecules/Card';
import './AdminPage.css'; // Reuse metrics styling
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useOutletContext();

  // Load dynamic data counts from localStorage for metric summaries!
  const studentCount = JSON.parse(localStorage.getItem('pemsik_students') || '[]').length;
  const dosenCount = JSON.parse(localStorage.getItem('pemsik_dosen') || '[]').length;
  const matakuliahCount = JSON.parse(localStorage.getItem('pemsik_matakuliah') || '[]').length;
  const kelasCount = JSON.parse(localStorage.getItem('pemsik_kelas') || '[]').length;

  // Donut chart calculations: Active vs Inactive students
  const students = JSON.parse(localStorage.getItem('pemsik_students') || '[]');
  const activeStudents = students.filter(s => s.status === true).length;
  const inactiveStudents = students.filter(s => s.status === false).length;
  const totalStudents = students.length || 1;
  const activePercentage = Math.round((activeStudents / totalStudents) * 100);

  // Circumference for strokeDasharray radius r=70: 2 * pi * r = 439.8
  const circ = 439.8;
  const activeOffset = circ - (activeStudents / totalStudents) * circ;

  return (
    <div className="dashboard-content-page animate-fade-in">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Dashboard Overview</h2>
          <p className="admin-page-subtitle">Selamat datang kembali, {user?.name || 'Administrator'}! Berikut ringkasan status akademik.</p>
        </div>
      </div>

      {/* DYNAMIC METRIC CARDS */}
      <div className="admin-metrics-grid">
        <Card className="metric-card" hoverable>
          <div className="metric-header">
            <span className="metric-label">Total Mahasiswa</span>
            <div className="metric-icon-box primary-bg">
              <GraduationCap size={20} />
            </div>
          </div>
          <div className="metric-value">{studentCount}</div>
          <div className="metric-footer-text text-success">
            Mahasiswa aktif & alumni
          </div>
        </Card>

        <Card className="metric-card" hoverable>
          <div className="metric-header">
            <span className="metric-label">Total Dosen</span>
            <div className="metric-icon-box warning-bg">
              <UserCheck size={20} />
            </div>
          </div>
          <div className="metric-value">{dosenCount}</div>
          <div className="metric-footer-text text-muted">
            Tenaga pengajar aktif
          </div>
        </Card>

        <Card className="metric-card" hoverable>
          <div className="metric-header">
            <span className="metric-label">Mata Kuliah</span>
            <div className="metric-icon-box success-bg">
              <BookOpen size={20} />
            </div>
          </div>
          <div className="metric-value">{matakuliahCount}</div>
          <div className="metric-footer-text text-success">
            Kurikulum terdaftar
          </div>
        </Card>

        <Card className="metric-card" hoverable>
          <div className="metric-header">
            <span className="metric-label">Jumlah Kelas</span>
            <div className="metric-icon-box danger-bg">
              <Presentation size={20} />
            </div>
          </div>
          <div className="metric-value">{kelasCount}</div>
          <div className="metric-footer-text text-success">
            Rombongan belajar aktif
          </div>
        </Card>
      </div>

      {/* CHARTS SECTION GIRD */}
      <div className="dashboard-charts-grid">
        {/* Left Column: Line Area Chart & Bar Chart */}
        <div className="chart-row">
          {/* Chart 1: Area Chart */}
          <div className="chart-card-wrapper">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Tren Pendaftaran Mahasiswa (Semestral)
            </h3>
            <svg viewBox="0 0 500 220" className="chart-svg-container">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Horizontal Grid lines */}
              <line x1="40" y1="30" x2="480" y2="30" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3" />
              <line x1="40" y1="80" x2="480" y2="80" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3" />
              <line x1="40" y1="130" x2="480" y2="130" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3" />
              <line x1="40" y1="180" x2="480" y2="180" stroke="rgba(255, 255, 255, 0.1)" />

              {/* Y Axis labels */}
              <text x="30" y="35" fill="var(--text-muted)" fontSize="10" textAnchor="end">100%</text>
              <text x="30" y="85" fill="var(--text-muted)" fontSize="10" textAnchor="end">75%</text>
              <text x="30" y="135" fill="var(--text-muted)" fontSize="10" textAnchor="end">50%</text>
              <text x="30" y="185" fill="var(--text-muted)" fontSize="10" textAnchor="end">0</text>

              {/* Area path */}
              <path
                d="M 40 180 L 40 130 Q 110 140 150 110 T 260 80 T 370 50 T 480 35 L 480 180 Z"
                fill="url(#areaGrad)"
              />

              {/* Line path */}
              <path
                d="M 40 130 Q 110 140 150 110 T 260 80 T 370 50 T 480 35"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3"
              />

              {/* Markers & Tooltips */}
              <circle cx="40" cy="130" r="4" fill="var(--primary)" />
              <circle cx="150" cy="110" r="4" fill="var(--primary)" />
              <circle cx="260" cy="80" r="4" fill="var(--primary)" />
              <circle cx="370" cy="50" r="4" fill="var(--primary)" />
              <circle cx="480" cy="35" r="5" fill="#ffffff" stroke="var(--primary)" strokeWidth="2" className="chart-tooltip-dot" />

              {/* X Axis labels */}
              <text x="40" y="202" fill="var(--text-muted)" fontSize="10" textAnchor="middle">2021</text>
              <text x="150" y="202" fill="var(--text-muted)" fontSize="10" textAnchor="middle">2022</text>
              <text x="260" y="202" fill="var(--text-muted)" fontSize="10" textAnchor="middle">2023</text>
              <text x="370" y="202" fill="var(--text-muted)" fontSize="10" textAnchor="middle">2024</text>
              <text x="480" y="202" fill="var(--text-muted)" fontSize="10" textAnchor="middle">2025/2026</text>
            </svg>
          </div>

          {/* Chart 2: Bar Chart */}
          <div className="chart-card-wrapper">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Distribusi Mahasiswa per Program Studi
            </h3>
            <svg viewBox="0 0 500 220" className="chart-svg-container">
              {/* Horizontal Guidelines */}
              <line x1="40" y1="30" x2="480" y2="30" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3" />
              <line x1="40" y1="105" x2="480" y2="105" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3" />
              <line x1="40" y1="180" x2="480" y2="180" stroke="rgba(255, 255, 255, 0.1)" />

              {/* Y Axis labels */}
              <text x="30" y="35" fill="var(--text-muted)" fontSize="10" textAnchor="end">1,000</text>
              <text x="30" y="110" fill="var(--text-muted)" fontSize="10" textAnchor="end">500</text>
              <text x="30" y="185" fill="var(--text-muted)" fontSize="10" textAnchor="end">0</text>

              {/* Bar 1 (Teknik Informatika) */}
              <rect x="80" y="55" width="50" height="125" rx="4" fill="rgba(16, 185, 129, 0.85)" />
              <text x="105" y="45" fill="var(--text-primary)" fontSize="11" fontWeight="700" textAnchor="middle">830</text>

              {/* Bar 2 (Sistem Informasi) */}
              <rect x="225" y="85" width="50" height="95" rx="4" fill="rgba(59, 130, 246, 0.85)" />
              <text x="250" y="75" fill="var(--text-primary)" fontSize="11" fontWeight="700" textAnchor="middle">632</text>

              {/* Bar 3 (Teknik Komputer) */}
              <rect x="370" y="130" width="50" height="50" rx="4" fill="rgba(245, 158, 11, 0.85)" />
              <text x="395" y="120" fill="var(--text-primary)" fontSize="11" fontWeight="700" textAnchor="middle">330</text>

              {/* X Axis labels */}
              <text x="105" y="202" fill="var(--text-muted)" fontSize="10" textAnchor="middle">Teknik Informatika</text>
              <text x="250" y="202" fill="var(--text-muted)" fontSize="10" textAnchor="middle">Sistem Informasi</text>
              <text x="395" y="202" fill="var(--text-muted)" fontSize="10" textAnchor="middle">Teknik Komputer</text>
            </svg>
          </div>
        </div>

        {/* Right Column: Donut Chart */}
        <div>
          {/* Chart 3: Donut Chart */}
          <div className="chart-card-wrapper" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
              Status Mahasiswa Aktif
            </h3>
            
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, margin: '2rem 0' }}>
              <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background circle track */}
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  stroke="rgba(255, 255, 255, 0.04)"
                  strokeWidth="16"
                  fill="none"
                />
                
                {/* Inactive students layer */}
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  stroke="var(--danger)"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={circ}
                  strokeDashoffset="0"
                />

                {/* Active students layer */}
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  stroke="var(--primary)"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={circ}
                  strokeDashoffset={activeOffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                />
              </svg>
              
              {/* Central text block */}
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{activePercentage}%</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Aktif</span>
              </div>
            </div>

            {/* Custom chart legend */}
            <div className="chart-legend" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1.25rem' }}>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: 'var(--primary)' }}></span>
                <span>Aktif: <strong>{activeStudents}</strong></span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: 'var(--danger)' }}></span>
                <span>Tidak Aktif: <strong>{inactiveStudents}</strong></span>
              </div>
            </div>
          </div>
        </div>
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
