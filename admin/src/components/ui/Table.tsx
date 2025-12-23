import React from 'react';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyState?: React.ReactNode;
}

export function Table<T>({ columns, data, loading, emptyState }: TableProps<T>) {
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
    </div>
  );
}

export default Table;

