import React from 'react';
import './Label.css';

const Label = ({ htmlFor, children, required, className = '' }) => {
  return (
    <label htmlFor={htmlFor} className={`atom-label ${className}`}>
      {children}
      {required && <span className="label-required">*</span>}
    </label>
  );
};

export default Label;
