import React, { useState, useEffect } from 'react';
import Modal from '../components/organisms/Modal';
import Form from '../components/molecules/Form';
import Button from '../components/atoms/Button';

const UserModal = ({ isModalOpen, onClose, onSubmit, selectedUser }) => {
  const [role, setRole] = useState('Viewer');
  const [read, setRead] = useState(true);
  const [write, setWrite] = useState(false);
  const [del, setDel] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedUser) {
      setRole(selectedUser.role || 'Viewer');
      const perms = selectedUser.permissions || [];
      setRead(perms.includes('read'));
      setWrite(perms.includes('write'));
      setDel(perms.includes('delete'));
    }
    setError('');
  }, [selectedUser, isModalOpen]);

  if (!isModalOpen || !selectedUser) return null;

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const permissions = [];
    if (read) permissions.push('read');
    if (write) permissions.push('write');
    if (del) permissions.push('delete');

    if (permissions.length === 0) {
      setError('Pengguna minimal harus memiliki 1 hak akses (permission)!');
      return;
    }

    onSubmit({
      role,
      permissions
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onClose}
      title={`Edit Hak Akses: ${selectedUser.name}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Simpan Perubahan
          </Button>
        </>
      }
    >
      {error && (
        <div className="login-general-error" style={{ marginBottom: '1.25rem' }}>
          {error}
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <div className="molecule-form-field" style={{ marginBottom: '1.5rem' }}>
          <label className="atom-label">Role Pengguna</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="atom-input"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-primary)', outline: 'none' }}
          >
            <option value="Super Admin" style={{ background: '#12121d' }}>Super Admin</option>
            <option value="Dosen" style={{ background: '#12121d' }}>Dosen</option>
            <option value="Viewer" style={{ background: '#12121d' }}>Viewer</option>
          </select>
        </div>

        <div className="molecule-form-field">
          <label className="atom-label" style={{ marginBottom: '0.75rem' }}>Hak Akses (Permissions)</label>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={read}
                onChange={(e) => setRead(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Read (Membaca Data)</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mengizinkan pengguna melihat dashboard dan detail data.</span>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={write}
                onChange={(e) => setWrite(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Write (Menambah & Mengubah Data)</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mengizinkan pengguna membuka form tambah/edit dan menyimpan data.</span>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={del}
                onChange={(e) => setDel(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Delete (Menghapus Data)</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mengizinkan pengguna menghapus rekaman data dari sistem.</span>
              </div>
            </label>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default UserModal;
