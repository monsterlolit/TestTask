import React from 'react';
import './Checkbox.css';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  id,
  className = '',
}) => {
  const checkboxClasses = [
    'checkbox-wrapper',
    disabled ? 'checkbox-wrapper--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.checked);
  };

  return (
    <label className={checkboxClasses}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        id={id}
        className="checkbox-input"
      />
      <span className="checkbox-mark"></span>
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  );
};
