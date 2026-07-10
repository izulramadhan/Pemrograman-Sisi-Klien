import React from 'react';
import Label from '../atoms/Label';
import Input from '../atoms/Input';
import './FormField.css';

const FormField = ({
  label,
  id,
  type,
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
    <div className={`molecule-form-field ${className}`}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <Input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        error={error}
        disabled={disabled}
        {...props}
      />
      {error && <span className="field-error-msg">{error}</span>}
    </div>
  );
};

export default FormField;
