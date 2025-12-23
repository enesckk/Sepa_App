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
    <div className="bg-surface rounded-card shadow-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-text-secondary" />
          <h3 className="font-medium text-text">Gelişmiş Filtreler</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <X size={16} className="mr-1" />
              Temizle
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? 'Gizle' : 'Göster'}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
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
                <div key={filter.key} className="grid grid-cols-2 gap-2">
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
                <div key={filter.key} className="grid grid-cols-2 gap-2">
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
        <div className="mt-4 flex flex-wrap gap-2">
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
                className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
              >
                <span className="font-medium">{filter.label}:</span>
                <span>{displayValue}</span>
                <button
                  onClick={() => handleRemoveFilter(key)}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
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

