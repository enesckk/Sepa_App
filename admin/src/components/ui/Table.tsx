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
    <div className="bg-surface rounded-card shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              {selectable && (
                <th className="px-6 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key.toString()}
                  className={`px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider ${col.className || ''
                    }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, idx) => {
              const rowId = getId(row);
              const isSelected = currentSelectedIds.includes(rowId);
              return (
                <tr 
                  key={idx} 
                  className={`hover:bg-background ${isSelected ? 'bg-blue-50' : ''}`}
                >
                  {selectable && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(rowId, e.target.checked)}
                        className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key.toString()}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-text ${col.className || ''
                        }`}
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
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            Sayfa {pagination.currentPage} / {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 text-sm border border-border rounded-button disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background"
            >
              Önceki
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 text-sm border border-border rounded-button disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background"
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

