import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  rows?: number;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  rows = 4,
  className = '',
  ...rest
}) => {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-text mb-2">{label}</label>
      )}
      <textarea
        rows={rows}
        style={{
          width: '100%',
          paddingLeft: '14px',
          paddingRight: '14px',
          paddingTop: '12px',
          paddingBottom: '12px',
          border: error ? '1px solid #dc2626' : '1px solid #e2e8f0',
          borderRadius: '10px',
          outline: 'none',
          fontSize: '14px',
          transition: 'all 0.2s ease',
          backgroundColor: '#ffffff',
          fontFamily: 'inherit',
          resize: 'vertical',
        }}
        onFocus={(e) => {
          if (!error) {
            e.target.style.borderColor = '#10b981';
            e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }
        }}
        className={className}
        {...rest}
      />
      {helperText && !error && (
        <p className="mt-1 text-sm text-text-secondary">{helperText}</p>
      )}
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};

export default Textarea;

