import React from 'react';
import './Form.css';

const Form = ({ title, subtitle, onSubmit, children, className = '' }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className={`molecule-form ${className}`} noValidate>
      {(title || subtitle) && (
        <div className="form-header">
          {title && <h2 className="form-title">{title}</h2>}
          {subtitle && <p className="form-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="form-content">{children}</div>
    </form>
  );
};

export default Form;
