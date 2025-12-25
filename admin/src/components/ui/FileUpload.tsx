import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
  label?: string;
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  helperText?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onFilesSelected,
  accept = 'image/*',
  multiple = false,
  helperText,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const arr = Array.from(files);
    setSelectedFiles(arr);
    onFilesSelected(arr);
  };

  const handleRemove = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    onFilesSelected(updated);
  };

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: 500,
          color: '#0f172a',
          marginBottom: '8px',
        }}>
          {label}
        </label>
      )}
      <div
        style={{
          border: '2px dashed #d1fae5',
          borderRadius: '12px',
          padding: '24px',
          backgroundColor: '#f0fdf4',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onClick={() => inputRef.current?.click()}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#10b981';
          e.currentTarget.style.backgroundColor = '#ecfdf5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#d1fae5';
          e.currentTarget.style.backgroundColor = '#f0fdf4';
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#64748b',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Upload size={20} style={{ color: '#10b981' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#0f172a',
              margin: 0,
              marginBottom: '4px',
            }}>
              Dosya yükle
            </p>
            <p style={{
              fontSize: '12px',
              color: '#64748b',
              margin: 0,
            }}>
              {multiple ? 'Birden çok dosya seçebilirsiniz' : 'Tek dosya seçebilirsiniz'}
            </p>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          style={{ display: 'none' }}
          accept={accept}
          multiple={multiple}
          onChange={handleSelect}
        />
      </div>
      {helperText && (
        <p style={{
          marginTop: '8px',
          fontSize: '12px',
          color: '#64748b',
        }}>
          {helperText}
        </p>
      )}

      {selectedFiles.length > 0 && (
        <div style={{
          marginTop: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {selectedFiles.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
              }}
            >
              <div style={{
                fontSize: '14px',
                color: '#0f172a',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}>
                {file.name}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                style={{
                  marginLeft: '12px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                  e.currentTarget.style.color = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;

