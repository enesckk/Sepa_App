import React, { useRef, useCallback, useLayoutEffect } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const InputComponent: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  iconLeft,
  iconRight,
  fullWidth = true,
  className = '',
  onChange,
  value,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorPositionRef = useRef<number | null>(null);
  const wasFocusedRef = useRef(false);
  const previousValueRef = useRef<string | number | readonly string[] | undefined>(value);

  // Value değiştiğinde cursor pozisyonunu koru
  useLayoutEffect(() => {
    if (inputRef.current && wasFocusedRef.current && cursorPositionRef.current !== null && previousValueRef.current !== value) {
      const input = inputRef.current;
      // Focus'u geri ver
      if (document.activeElement !== input) {
        input.focus();
      }
      // Cursor pozisyonunu ayarla
      const newLength = input.value.length;
      const newPosition = Math.min(cursorPositionRef.current + 1, newLength);
      input.setSelectionRange(newPosition, newPosition);
      cursorPositionRef.current = null;
    }
    previousValueRef.current = value;
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Cursor pozisyonunu ve focus durumunu kaydet
    cursorPositionRef.current = e.target.selectionStart || 0;
    wasFocusedRef.current = document.activeElement === e.target;
    
    // onChange'i çağır
    if (onChange) {
      onChange(e);
    }
  }, [onChange]);

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-text mb-2">{label}</label>
      )}
      <div style={{ position: 'relative' }}>
        {iconLeft && (
          <span style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            paddingLeft: '12px',
            display: 'flex',
            alignItems: 'center',
            color: '#64748b',
          }}>
            {iconLeft}
          </span>
        )}
        <input
          ref={inputRef}
          value={value}
          style={{
            width: '100%',
            paddingLeft: iconLeft ? '40px' : '14px',
            paddingRight: iconRight ? '40px' : '14px',
            paddingTop: '12px',
            paddingBottom: '12px',
            border: error ? '1px solid #dc2626' : '1px solid #e2e8f0',
            borderRadius: '10px',
            outline: 'none',
            fontSize: '14px',
            transition: 'all 0.2s ease',
            backgroundColor: '#ffffff',
          }}
          onFocus={(e) => {
            wasFocusedRef.current = true;
            if (!error) {
              e.target.style.borderColor = '#10b981';
              e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            }
          }}
          onBlur={(e) => {
            wasFocusedRef.current = false;
            cursorPositionRef.current = null;
            if (!error) {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }
          }}
          onChange={handleChange}
          className={className}
          {...rest}
        />
        {iconRight && (
          <span style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            paddingRight: '12px',
            display: 'flex',
            alignItems: 'center',
            color: '#64748b',
          }}>
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

export const Input = React.memo(InputComponent);

export default Input;

