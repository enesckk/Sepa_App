'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableColumn } from '@/components/ui/Table';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/ToastProvider';
import { adminService, BillSupportsResponse } from '@/lib/services/admin';
import { Edit, Download, FileSpreadsheet, Receipt, Calendar, User, DollarSign, CheckCircle } from 'lucide-react';
import { exportToCSV, exportToExcel, prepareTableData } from '@/lib/utils/export';

interface BillSupport {
  id: string;
  bill_type: string;
  amount: number;
  description?: string;
  status: string;
  user?: { name: string; email: string };
  reference_number?: string;
  admin_response?: string;
  created_at: string;
}

export default function BillSupportsPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedBillSupport, setSelectedBillSupport] = useState<BillSupport | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [billTypeFilter, setBillTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [formData, setFormData] = useState({
    status: '',
    admin_response: '',
  });

  const {
    data: billSupportsData,
    isLoading,
    isError,
    error,
  } = useQuery<BillSupportsResponse, Error>({
    queryKey: ['adminBillSupports', page, limit, search, statusFilter, billTypeFilter],
    queryFn: () =>
      adminService.getBillSupports({
        limit,
        offset: (page - 1) * limit,
        search: search || undefined,
        status: statusFilter || undefined,
        bill_type: billTypeFilter || undefined,
      }),
  });

  const billSupports = billSupportsData?.billSupports || [];
  const totalBillSupports = billSupportsData?.total || 0;
  const totalPages = Math.ceil(totalBillSupports / limit);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: string; admin_response?: string } }) =>
      adminService.updateBillSupportStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBillSupports'] });
      showToast('success', 'Askıda fatura durumu başarıyla güncellendi.');
      handleCloseModal();
    },
    onError: (error: any) => {
      showToast('error', 'Askıda fatura durumu güncellenirken bir hata oluştu.', error.message);
    },
  });

  const handleOpenModal = (billSupport: BillSupport) => {
    setSelectedBillSupport(billSupport);
    setFormData({
      status: billSupport.status,
      admin_response: billSupport.admin_response || '',
    });
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedBillSupport(null);
    setFormData({
      status: '',
      admin_response: '',
    });
  };

  const handleSubmit = () => {
    if (!selectedBillSupport || !formData.status) {
      showToast('error', 'Lütfen durum seçin.');
      return;
    }

    updateMutation.mutate({
      id: selectedBillSupport.id,
      data: {
        status: formData.status,
        admin_response: formData.admin_response || undefined,
      },
    });
  };

  // Export functions
  const handleExportCSV = () => {
    const exportColumns = columns.filter((col) => col.key !== 'actions');
    const { headers, rows } = prepareTableData(billSupports, exportColumns);
    exportToCSV({
      filename: 'askida_fatura',
      headers,
      data: rows,
    });
    showToast('success', 'CSV dosyası indirildi.');
  };

  const handleExportExcel = async () => {
    try {
      const exportColumns = columns.filter((col) => col.key !== 'actions');
      const { headers, rows } = prepareTableData(billSupports, exportColumns);
      await exportToExcel({
        filename: 'askida_fatura',
        headers,
        data: rows,
      });
      showToast('success', 'Excel dosyası indirildi.');
    } catch (error: any) {
      showToast('error', 'Excel export hatası:', error.message);
    }
  };

  const columns: TableColumn<BillSupport>[] = [
    {
      key: 'bill_type',
      header: 'Fatura',
      render: (row) => (
        <div>
          <div style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#0f172a',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Receipt style={{ color: '#10b981' }} size={18} />
            {row.bill_type === 'electricity'
              ? 'Elektrik'
              : row.bill_type === 'water'
              ? 'Su'
              : row.bill_type === 'gas'
              ? 'Doğalgaz'
              : row.bill_type === 'internet'
              ? 'İnternet'
              : row.bill_type === 'phone'
              ? 'Telefon'
              : 'Diğer'}
          </div>
          {row.user && (
            <div style={{
              fontSize: '13px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <User size={14} />
              {row.user.name}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Tutar',
      render: (row) => (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          backgroundColor: '#ecfdf5',
          borderRadius: '8px',
          border: '1px solid #d1fae5',
        }}>
          <DollarSign style={{ color: '#10b981' }} size={16} />
          <span style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#059669',
          }}>
            {row.amount.toFixed(2)} ₺
          </span>
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Tarih',
      render: (row) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <Calendar style={{ color: '#64748b' }} size={16} />
          <span style={{
            fontSize: '14px',
            color: '#475569',
          }}>
            {new Date(row.created_at).toLocaleDateString('tr-TR')}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Durum',
      render: (row) => {
        const statusConfig: Record<string, { label: string; bg: string; border: string; color: string }> = {
          approved: { label: 'Onaylandı', bg: '#ecfdf5', border: '#d1fae5', color: '#059669' },
          pending: { label: 'Beklemede', bg: '#fef3c7', border: '#fde68a', color: '#d97706' },
          rejected: { label: 'Reddedildi', bg: '#fef2f2', border: '#fecaca', color: '#dc2626' },
          paid: { label: 'Ödendi', bg: '#eff6ff', border: '#bfdbfe', color: '#2563eb' },
          cancelled: { label: 'İptal', bg: '#f1f5f9', border: '#e2e8f0', color: '#64748b' },
        };
        const config = statusConfig[row.status] || { label: 'Bilinmiyor', bg: '#f1f5f9', border: '#e2e8f0', color: '#64748b' };
        
        return (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: config.bg,
            borderRadius: '8px',
            border: `1px solid ${config.border}`,
          }}>
            {(row.status === 'approved' || row.status === 'paid') && <CheckCircle size={14} style={{ color: config.color }} />}
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: config.color,
            }}>
              {config.label}
            </span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'İşlemler',
      render: (row) => (
        <button
          onClick={() => handleOpenModal(row)}
          style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ecfdf5',
            border: '1px solid #d1fae5',
            borderRadius: '8px',
            color: '#10b981',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#d1fae5';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ecfdf5';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Edit size={16} />
        </button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    showToast('error', 'Askıda fatura başvuruları yüklenirken bir hata oluştu.', error.message);
    return (
      <EmptyState
        title="Veriler Yüklenemedi"
        description="Askıda fatura listesi alınamadı. Lütfen daha sonra tekrar deneyin."
      />
    );
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '12px',
      }}>
        <button
          onClick={handleExportCSV}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#ffffff',
            border: '1px solid #10b981',
            borderRadius: '10px',
            color: '#10b981',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ecfdf5';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Download size={16} />
          CSV
        </button>
        <button
          onClick={handleExportExcel}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#10b981',
            border: 'none',
            borderRadius: '10px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#10b981';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)';
          }}
        >
          <FileSpreadsheet size={16} />
          Excel
        </button>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #d1fae5',
        padding: '24px',
        background: 'linear-gradient(to bottom, #ffffff, #f0fdf4)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          <Input
            placeholder="Ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
            options={[
              { label: 'Durum: Tümü', value: '' },
              { label: 'Beklemede', value: 'pending' },
              { label: 'Onaylandı', value: 'approved' },
              { label: 'Reddedildi', value: 'rejected' },
              { label: 'Ödendi', value: 'paid' },
            ]}
          />
          <Select
            value={billTypeFilter}
            onValueChange={setBillTypeFilter}
            options={[
              { label: 'Tür: Tümü', value: '' },
              { label: 'Elektrik', value: 'electricity' },
              { label: 'Su', value: 'water' },
              { label: 'Doğalgaz', value: 'gas' },
              { label: 'İnternet', value: 'internet' },
              { label: 'Telefon', value: 'phone' },
              { label: 'Diğer', value: 'other' },
            ]}
          />
        </div>
      </div>

      <Table<BillSupport>
        columns={columns}
        data={billSupports}
        loading={isLoading}
        emptyState={<EmptyState description="Henüz başvuru yok." />}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          onPageChange: setPage,
        }}
      />

      <Modal
        open={open}
        onClose={handleCloseModal}
        title={`Askıda Fatura Durumu - ${selectedBillSupport?.reference_number || selectedBillSupport?.id}`}
        footer={
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}>
            <button
              onClick={handleCloseModal}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.color = '#475569';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              İptal
            </button>
            <button
              onClick={handleSubmit}
              disabled={updateMutation.isPending}
              style={{
                padding: '10px 20px',
                backgroundColor: updateMutation.isPending ? '#94a3b8' : '#10b981',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: updateMutation.isPending ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
              }}
              onMouseEnter={(e) => {
                if (!updateMutation.isPending) {
                  e.currentTarget.style.backgroundColor = '#059669';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!updateMutation.isPending) {
                  e.currentTarget.style.backgroundColor = '#10b981';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)';
                }
              }}
            >
              {updateMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        }
      >
        {selectedBillSupport && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="p-3 bg-background rounded-lg">
              <div className="text-sm text-text-secondary mb-1">Fatura Türü</div>
              <div className="font-medium">
                {selectedBillSupport.bill_type === 'electricity'
                  ? 'Elektrik'
                  : selectedBillSupport.bill_type === 'water'
                  ? 'Su'
                  : selectedBillSupport.bill_type === 'gas'
                  ? 'Doğalgaz'
                  : selectedBillSupport.bill_type === 'internet'
                  ? 'İnternet'
                  : selectedBillSupport.bill_type === 'phone'
                  ? 'Telefon'
                  : 'Diğer'}
              </div>
            </div>
            <div className="p-3 bg-background rounded-lg">
              <div className="text-sm text-text-secondary mb-1">Tutar</div>
              <div className="font-medium text-lg">{selectedBillSupport.amount.toFixed(2)} ₺</div>
            </div>
            {selectedBillSupport.description && (
              <div className="p-3 bg-background rounded-lg">
                <div className="text-sm text-text-secondary mb-1">Açıklama</div>
                <div>{selectedBillSupport.description}</div>
              </div>
            )}
            <Select
              label="Durum *"
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              options={[
                { label: 'Beklemede', value: 'pending' },
                { label: 'Onaylandı', value: 'approved' },
                { label: 'Reddedildi', value: 'rejected' },
                { label: 'Ödendi', value: 'paid' },
                { label: 'İptal', value: 'cancelled' },
              ]}
            />
            <Textarea
              label="Yanıt"
              placeholder="Kısa yanıt/ açıklama"
              rows={3}
              value={formData.admin_response}
              onChange={(e) => setFormData({ ...formData, admin_response: e.target.value })}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
