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
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text mb-2">{label}</label>
      )}
      <div
        className="border-2 border-dashed border-border rounded-card p-4 bg-background hover:border-primary transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <div className="flex items-center gap-3 text-text-secondary">
          <div className="w-10 h-10 rounded-full bg-surface shadow-sm flex items-center justify-center">
            <Upload size={18} className="text-text-secondary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text">Dosya yükle</p>
            <p className="text-xs text-text-secondary">
              {multiple ? 'Birden çok dosya seçebilirsiniz' : 'Tek dosya seçebilirsiniz'}
            </p>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleSelect}
        />
      </div>
      {helperText && (
        <p className="mt-2 text-xs text-text-secondary">{helperText}</p>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {selectedFiles.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center justify-between px-3 py-2 bg-surface border border-border rounded-input"
            >
              <div className="text-sm text-text truncate">{file.name}</div>
              <button
                type="button"
                className="text-text-secondary hover:text-text"
                onClick={() => handleRemove(idx)}
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

