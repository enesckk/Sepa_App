/**
 * Export utilities for CSV and Excel
 */

export interface ExportOptions {
  filename?: string;
  headers?: string[];
  data: any[][];
}

/**
 * Export data to CSV
 */
export function exportToCSV(options: ExportOptions): void {
  const { filename = 'export', headers, data } = options;

  // Create CSV content
  let csvContent = '';

  // Add headers if provided
  if (headers && headers.length > 0) {
    csvContent += headers.map((h) => `"${h}"`).join(',') + '\n';
  }

  // Add data rows
  data.forEach((row) => {
    csvContent += row.map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(',') + '\n';
  });

  // Create blob and download
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Export data to Excel (XLSX format using SheetJS)
 * Note: Requires xlsx library to be installed
 */
export async function exportToExcel(options: ExportOptions): Promise<void> {
  const { filename = 'export', headers, data } = options;

  try {
    // Dynamic import for xlsx
    const XLSX = await import('xlsx');

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Prepare worksheet data
    const wsData: any[][] = [];

    // Add headers if provided
    if (headers && headers.length > 0) {
      wsData.push(headers);
    }

    // Add data rows
    data.forEach((row) => {
      wsData.push(row);
    });

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Auto-size columns
    const colWidths = headers
      ? headers.map((_, colIndex) => {
          const maxLength = Math.max(
            headers[colIndex]?.length || 0,
            ...data.map((row) => String(row[colIndex] || '').length)
          );
          return { wch: Math.min(maxLength + 2, 50) };
        })
      : [];

    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate Excel file
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
  } catch (error) {
    console.error('Excel export error:', error);
    throw new Error('Excel export requires xlsx library. Install it with: npm install xlsx');
  }
}

/**
 * Convert table data to export format
 */
export function prepareTableData<T>(
  data: T[],
  columns: Array<{ key: string; header: string; render?: (row: T) => any }>
): { headers: string[]; rows: any[][] } {
  const headers = columns.map((col) => col.header);
  const rows = data.map((row) =>
    columns.map((col) => {
      if (col.render) {
        const rendered = col.render(row);
        // Extract text from React elements or return as string
        if (typeof rendered === 'string' || typeof rendered === 'number') {
          return rendered;
        }
        // For complex renders, try to extract text content
        return String(rendered || '');
      }
      return (row as any)[col.key] || '';
    })
  );

  return { headers, rows };
}

