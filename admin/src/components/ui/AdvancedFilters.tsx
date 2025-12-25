'use client';

import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { X, Filter, Calendar } from 'lucide-react';

export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'numberRange';
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
}

interface AdvancedFiltersProps {
  filters: FilterOption[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onReset: () => void;
}

export function AdvancedFilters({ filters, values, onChange, onReset }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    onChange({ ...values, [key]: value });
  };

  const handleRemoveFilter = (key: string) => {
    const newValues = { ...values };
    delete newValues[key];
    onChange(newValues);
  };

  const activeFiltersCount = Object.keys(values).filter((key) => values[key] !== '' && values[key] !== null && values[key] !== undefined).length;

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      padding: '20px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={20} style={{ color: '#10b981' }} />
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#0f172a',
            margin: 0,
          }}>
            Gelişmiş Filtreler
          </h3>
          {activeFiltersCount > 0 && (
            <span style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontSize: '12px',
              padding: '4px 10px',
              borderRadius: '12px',
              fontWeight: 600,
            }}>
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {activeFiltersCount > 0 && (
            <button
              onClick={onReset}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <X size={16} />
              Temizle
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              padding: '8px 16px',
              backgroundColor: isOpen ? '#10b981' : '#ffffff',
              border: '1px solid #10b981',
              borderRadius: '8px',
              color: isOpen ? '#ffffff' : '#10b981',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!isOpen) {
                e.currentTarget.style.backgroundColor = '#f0fdf4';
              }
            }}
            onMouseLeave={(e) => {
              if (!isOpen) {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }
            }}
          >
            {isOpen ? 'Gizle' : 'Göster'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #f1f5f9',
        }}>
          {filters.map((filter) => {
            if (filter.type === 'text') {
              return (
                <Input
                  key={filter.key}
                  label={filter.label}
                  placeholder={filter.placeholder || ` ${filter.label} ara...`}
                  value={values[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                />
              );
            }

            if (filter.type === 'select') {
              return (
                <Select
                  key={filter.key}
                  label={filter.label}
                  value={values[filter.key] || ''}
                  onValueChange={(value) => handleFilterChange(filter.key, value)}
                  options={[
                    { label: `Tümü: ${filter.label}`, value: '' },
                    ...(filter.options || []),
                  ]}
                />
              );
            }

            if (filter.type === 'date') {
              return (
                <Input
                  key={filter.key}
                  label={filter.label}
                  type="date"
                  value={values[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                />
              );
            }

            if (filter.type === 'number') {
              return (
                <Input
                  key={filter.key}
                  label={filter.label}
                  type="number"
                  placeholder={filter.placeholder}
                  value={values[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                />
              );
            }

            if (filter.type === 'dateRange') {
              return (
                <div key={filter.key} style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                }}>
                  <Input
                    label={`${filter.label} (Başlangıç)`}
                    type="date"
                    value={values[`${filter.key}_start`] || ''}
                    onChange={(e) => handleFilterChange(`${filter.key}_start`, e.target.value)}
                  />
                  <Input
                    label={`${filter.label} (Bitiş)`}
                    type="date"
                    value={values[`${filter.key}_end`] || ''}
                    onChange={(e) => handleFilterChange(`${filter.key}_end`, e.target.value)}
                  />
                </div>
              );
            }

            if (filter.type === 'numberRange') {
              return (
                <div key={filter.key} style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                }}>
                  <Input
                    label={`${filter.label} (Min)`}
                    type="number"
                    placeholder="Min"
                    value={values[`${filter.key}_min`] || ''}
                    onChange={(e) => handleFilterChange(`${filter.key}_min`, e.target.value)}
                  />
                  <Input
                    label={`${filter.label} (Max)`}
                    type="number"
                    placeholder="Max"
                    value={values[`${filter.key}_max`] || ''}
                    onChange={(e) => handleFilterChange(`${filter.key}_max`, e.target.value)}
                  />
                </div>
              );
            }

            return null;
          })}
        </div>
      )}

      {/* Active Filters Tags */}
      {activeFiltersCount > 0 && (
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          {Object.entries(values).map(([key, value]) => {
            if (!value || value === '') return null;
            const filter = filters.find((f) => f.key === key || f.key === key.replace('_start', '').replace('_end', '').replace('_min', '').replace('_max', ''));
            if (!filter) return null;

            let displayValue = value;
            if (filter.type === 'select') {
              const option = filter.options?.find((opt) => opt.value === value);
              displayValue = option?.label || value;
            }

            return (
              <div
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #d1fae5',
                  color: '#059669',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                <span style={{ fontWeight: 600 }}>{filter.label}:</span>
                <span>{displayValue}</span>
                <button
                  onClick={() => handleRemoveFilter(key)}
                  style={{
                    marginLeft: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#059669',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#d1fae5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

