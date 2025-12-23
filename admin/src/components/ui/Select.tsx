import React from 'react';

interface Option {
  label: string;
  value: string | number;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: Option[];
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  onValueChange?: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  fullWidth = true,
  className = '',
  onValueChange,
  onChange,
  ...rest
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onValueChange) {
      onValueChange(e.target.value);
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-text mb-2">{label}</label>
      )}
      <select
        className={`w-full px-4 py-2 border rounded-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
          error ? 'border-error focus:ring-error' : 'border-border'
        } ${className}`}
        onChange={handleChange}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {helperText && !error && (
        <p className="mt-1 text-sm text-text-secondary">{helperText}</p>
      )}
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};

export default Select;

