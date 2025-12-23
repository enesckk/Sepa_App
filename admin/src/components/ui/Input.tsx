import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  iconLeft,
  iconRight,
  fullWidth = true,
  className = '',
  ...rest
}) => {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-text mb-2">{label}</label>
      )}
      <div className="relative">
        {iconLeft && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-secondary">
            {iconLeft}
          </span>
        )}
        <input
          className={`w-full px-4 py-2 border rounded-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
            iconLeft ? 'pl-10' : ''
          } ${iconRight ? 'pr-10' : ''} ${
            error ? 'border-error focus:ring-error' : 'border-border'
          } ${className}`}
          {...rest}
        />
        {iconRight && (
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary">
            {iconRight}
          </span>
        )}
      </div>
      {helperText && !error && (
        <p className="mt-1 text-sm text-text-secondary">{helperText}</p>
      )}
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};

export default Input;

