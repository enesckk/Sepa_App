import React, { useState, useEffect } from 'react';
import { TableSkeleton } from './Skeleton';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  pagination?: PaginationProps;
  selectable?: boolean;
  getId?: (row: T) => string;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function Table<T>({ 
  columns, 
  data, 
  loading, 
  emptyState, 
  pagination,
  selectable = false,
  getId = (row: T) => (row as any).id,
  selectedIds = [],
  onSelectionChange
}: TableProps<T>) {
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(selectedIds);

  useEffect(() => {
    if (onSelectionChange) {
      setInternalSelectedIds(selectedIds);
    }
  }, [selectedIds, onSelectionChange]);

  const handleSelectAll = (checked: boolean) => {
    const newSelectedIds = checked ? data.map(getId) : [];
    if (onSelectionChange) {
      onSelectionChange(newSelectedIds);
    } else {
      setInternalSelectedIds(newSelectedIds);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const currentIds = onSelectionChange ? selectedIds : internalSelectedIds;
    const newSelectedIds = checked
      ? [...currentIds, id]
      : currentIds.filter((selectedId) => selectedId !== id);
    
    if (onSelectionChange) {
      onSelectionChange(newSelectedIds);
    } else {
      setInternalSelectedIds(newSelectedIds);
    }
  };

  const currentSelectedIds = onSelectionChange ? selectedIds : internalSelectedIds;
  const allSelected = data.length > 0 && currentSelectedIds.length === data.length;
  const someSelected = currentSelectedIds.length > 0 && currentSelectedIds.length < data.length;

  if (loading) {
    return <TableSkeleton rows={5} columns={columns.length} />;
  }

  if (!data || data.length === 0) {
    return emptyState || (
      <div className="py-6 text-center text-text-secondary">Kayıt bulunamadı</div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
          }}>
            <tr>
              {selectable && (
                <th style={{ padding: '16px', width: '48px' }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      accentColor: '#10b981',
                    }}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key.toString()}
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const rowId = getId(row);
              const isSelected = currentSelectedIds.includes(rowId);
              return (
                <tr 
                  key={idx}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#ecfdf5' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.borderLeft = '3px solid #10b981';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderLeft = 'none';
                    }
                  }}
                  onClick={() => {
                    if (selectable && onSelectionChange) {
                      handleSelectRow(rowId, !isSelected);
                    }
                  }}
                >
                  {selectable && (
                    <td style={{ padding: '16px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectRow(rowId, e.target.checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer',
                          accentColor: '#10b981',
                        }}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key.toString()}
                      style={{
                        padding: '16px',
                        whiteSpace: 'nowrap',
                        fontSize: '14px',
                        color: '#0f172a',
                      }}
                    >
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pagination && pagination.totalPages > 1 && (
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{
            fontSize: '14px',
            color: '#64748b',
          }}>
            Sayfa {pagination.currentPage} / {pagination.totalPages}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                backgroundColor: pagination.currentPage === 1 ? '#f8fafc' : '#ffffff',
                color: pagination.currentPage === 1 ? '#94a3b8' : '#0f172a',
                cursor: pagination.currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (pagination.currentPage !== 1) {
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.backgroundColor = '#f0fdf4';
                }
              }}
              onMouseLeave={(e) => {
                if (pagination.currentPage !== 1) {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }
              }}
            >
              Önceki
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                backgroundColor: pagination.currentPage === pagination.totalPages ? '#f8fafc' : '#ffffff',
                color: pagination.currentPage === pagination.totalPages ? '#94a3b8' : '#0f172a',
                cursor: pagination.currentPage === pagination.totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (pagination.currentPage !== pagination.totalPages) {
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.backgroundColor = '#f0fdf4';
                }
              }}
              onMouseLeave={(e) => {
                if (pagination.currentPage !== pagination.totalPages) {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }
              }}
            >
              Sonraki
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;

