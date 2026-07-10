import React from 'react';
import './Input.css';

const Input = ({
  type = 'text',
  id,
  name,
  placeholder,
  value,
  onChange,
  required,
  error,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`atom-input ${error ? 'input-error' : ''} ${className}`}
      {...props}
    />
  );
};

export default Input;
