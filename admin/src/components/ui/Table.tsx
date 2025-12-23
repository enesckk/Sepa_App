import React from 'react';

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
}

export function Table<T>({ columns, data, loading, emptyState, pagination }: TableProps<T>) {
  if (loading) {
    return (
      <div className="py-6 text-center text-text-secondary">Yükleniyor...</div>
    );
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
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-background">
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
            ))}
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

