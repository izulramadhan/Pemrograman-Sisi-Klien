import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="molecule-pagination" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', padding: '0 0.5rem' }}>
      <div className="pagination-info" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Halaman <strong style={{ color: 'var(--text-primary)' }}>{currentPage}</strong> dari <strong style={{ color: 'var(--text-primary)' }}>{totalPages}</strong>
      </div>
      
      <div className="pagination-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn arrow-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--border-radius-sm)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: currentPage === 1 ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
            color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage === 1 ? 0.4 : 1,
            transition: 'all 0.2s ease'
          }}
          title="Halaman Sebelumnya"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p) => {
          const isActive = currentPage === p;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`pagination-btn num-btn ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: 'var(--border-radius-sm)',
                border: '1px solid ' + (isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)'),
                background: isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.02)',
                color: isActive ? '#0d0d13' : 'var(--text-primary)',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn arrow-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--border-radius-sm)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: currentPage === totalPages ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
            color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage === totalPages ? 0.4 : 1,
            transition: 'all 0.2s ease'
          }}
          title="Halaman Selanjutnya"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
