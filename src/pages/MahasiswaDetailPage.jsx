import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, GraduationCap, Percent, Smartphone, MapPin, Hash } from 'lucide-react';
import Card from '../components/molecules/Card';
import Button from '../components/atoms/Button';
import initialStudents from '../data/students.json';
import './MahasiswaDetailPage.css';

const MahasiswaDetailPage = () => {
  const { id } = useParams();
  
  // Read from localStorage or fallback
  const saved = localStorage.getItem('pemsik_students');
  const students = saved ? JSON.parse(saved) : initialStudents;
  
  const student = students.find(s => s.id === parseInt(id));

  if (!student) {
    return (
      <div className="mahasiswa-detail-container">
        <Card title="Mahasiswa Tidak Ditemukan" subtitle="Data profil mahasiswa tidak dapat dimuat">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Maaf, data mahasiswa dengan ID tersebut tidak ditemukan dalam sistem database kami.
          </p>
          <Link to="/admin/mahasiswa">
            <Button variant="secondary">
              <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
              Kembali ke Daftar
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mahasiswa-detail-container">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Profil Mahasiswa</h2>
          <p className="admin-page-subtitle">Detail akademik dan data lengkap mahasiswa</p>
        </div>
        <Link to="/admin/mahasiswa">
          <Button variant="secondary">
            <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
            Kembali
          </Button>
        </Link>
      </div>

      <Card className="detail-card">
        <div className="detail-header-profile">
          <div className="detail-avatar-circle">
            <User size={48} className="detail-avatar-icon" />
          </div>
          <div className="detail-title-block">
            <h3 className="detail-name">{student.name}</h3>
            <p className="detail-prodi-subtitle">{student.prodi}</p>
          </div>
          <div className={`status-badge status-${student.status ? 'active' : 'inactive'} detail-status-badge`}>
            {student.status ? 'Aktif' : 'Tidak Aktif'}
          </div>
        </div>

        <div className="detail-info-grid">
          <div className="detail-info-item">
            <div className="item-icon-box"><Hash size={18} /></div>
            <div className="item-content">
              <p className="item-label">NIM (Nomor Induk Mahasiswa)</p>
              <p className="item-value">{student.nim}</p>
            </div>
          </div>

          <div className="detail-info-item">
            <div className="item-icon-box"><Mail size={18} /></div>
            <div className="item-content">
              <p className="item-label">Email Institusi</p>
              <p className="item-value">{student.email}</p>
            </div>
          </div>

          <div className="detail-info-item">
            <div className="item-icon-box"><GraduationCap size={18} /></div>
            <div className="item-content">
              <p className="item-label">Program Studi</p>
              <p className="item-value">{student.prodi}</p>
            </div>
          </div>

          <div className="detail-info-item">
            <div className="item-icon-box"><Percent size={18} /></div>
            <div className="item-content">
              <p className="item-label">IPK Terakhir</p>
              <p className="item-value" style={{ fontWeight: 700, color: 'var(--primary-hover)' }}>{student.ipk}</p>
            </div>
          </div>

          <div className="detail-info-item">
            <div className="item-icon-box"><Smartphone size={18} /></div>
            <div className="item-content">
              <p className="item-label">No. HP / Whatsapp</p>
              <p className="item-value">{student.hp}</p>
            </div>
          </div>

          <div className="detail-info-item">
            <div className="item-icon-box"><MapPin size={18} /></div>
            <div className="item-content">
              <p className="item-label">Alamat Lengkap</p>
              <p className="item-value">{student.address}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MahasiswaDetailPage;
