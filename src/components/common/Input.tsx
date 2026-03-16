import React from 'react';
import './Input.css';

export interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'search';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon,
  disabled = false,
  name,
  required = false,
  className = '',
}) => {
  const inputClasses = [
    'input-wrapper',
    error ? 'input-wrapper--error' : '',
    disabled ? 'input-wrapper--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.value);
  };

  return (
    <div className={inputClasses}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-field-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          name={name}
          required={required}
          className="input-field"
        />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};
