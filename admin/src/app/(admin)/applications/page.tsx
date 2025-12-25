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
import { adminService, ApplicationsResponse } from '@/lib/services/admin';
import { exportToCSV, exportToExcel, prepareTableData } from '@/lib/utils/export';
import { Edit, Download, FileSpreadsheet, FileText, Calendar, User, CheckCircle } from 'lucide-react';

interface Application {
  id: string;
  type: string;
  subject: string;
  description: string;
  status: string;
  user?: { name: string; email: string };
  reference_number?: string;
  admin_response?: string;
  created_at: string;
}

export default function ApplicationsPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [formData, setFormData] = useState({
    status: '',
    admin_response: '',
  });

  const {
    data: applicationsData,
    isLoading,
    isError,
    error,
  } = useQuery<ApplicationsResponse, Error>({
    queryKey: ['adminApplications', page, limit, search, statusFilter, typeFilter],
    queryFn: () =>
      adminService.getApplications({
        limit,
        offset: (page - 1) * limit,
        search: search || undefined,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
      }),
  });

  const applications = applicationsData?.applications || [];
  const totalApplications = applicationsData?.total || 0;
  const totalPages = Math.ceil(totalApplications / limit);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: string; admin_response?: string } }) =>
      adminService.updateApplicationStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminApplications'] });
      showToast('success', 'Başvuru durumu başarıyla güncellendi.');
      handleCloseModal();
    },
    onError: (error: any) => {
      showToast('error', 'Başvuru durumu güncellenirken bir hata oluştu.', error.message);
    },
  });

  const handleOpenModal = (application: Application) => {
    setSelectedApplication(application);
    setFormData({
      status: application.status,
      admin_response: application.admin_response || '',
    });
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedApplication(null);
    setFormData({
      status: '',
      admin_response: '',
    });
  };

  // Export functions
  const handleExportCSV = () => {
    const exportColumns = columns.filter((col) => col.key !== 'actions');
    const { headers, rows } = prepareTableData(applications, exportColumns);
    exportToCSV({
      filename: 'basvurular',
      headers,
      data: rows,
    });
    showToast('success', 'CSV dosyası indirildi.');
  };

  const handleExportExcel = async () => {
    try {
      const exportColumns = columns.filter((col) => col.key !== 'actions');
      const { headers, rows } = prepareTableData(applications, exportColumns);
      await exportToExcel({
        filename: 'basvurular',
        headers,
        data: rows,
      });
      showToast('success', 'Excel dosyası indirildi.');
    } catch (error: any) {
      showToast('error', 'Excel export hatası:', error.message);
    }
  };

  const handleSubmit = () => {
    if (!selectedApplication || !formData.status) {
      showToast('error', 'Lütfen durum seçin.');
      return;
    }

    updateMutation.mutate({
      id: selectedApplication.id,
      data: {
        status: formData.status,
        admin_response: formData.admin_response || undefined,
      },
    });
  };

  const columns: TableColumn<Application>[] = [
    {
      key: 'subject',
      header: 'Konu',
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
            <FileText style={{ color: '#10b981' }} size={18} />
            {row.subject}
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
              {row.user.name} ({row.user.email})
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tür',
      render: (row) => {
        const typeLabels: Record<string, string> = {
          complaint: 'Şikayet',
          request: 'Talep',
          marriage: 'Nikah',
          muhtar_message: 'Muhtar Mesaj',
        };
        const typeColors: Record<string, { bg: string; border: string; color: string }> = {
          complaint: { bg: '#fef2f2', border: '#fecaca', color: '#dc2626' },
          request: { bg: '#eff6ff', border: '#bfdbfe', color: '#2563eb' },
          marriage: { bg: '#f3e8ff', border: '#e9d5ff', color: '#7c3aed' },
          muhtar_message: { bg: '#ecfdf5', border: '#d1fae5', color: '#059669' },
        };
        const label = typeLabels[row.type] || 'Diğer';
        const colors = typeColors[row.type] || { bg: '#f1f5f9', border: '#e2e8f0', color: '#64748b' };
        
        return (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 12px',
            backgroundColor: colors.bg,
            borderRadius: '8px',
            border: `1px solid ${colors.border}`,
          }}>
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: colors.color,
            }}>
              {label}
            </span>
          </div>
        );
      },
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
          resolved: { label: 'Tamamlandı', bg: '#ecfdf5', border: '#d1fae5', color: '#059669' },
          in_progress: { label: 'İşlemde', bg: '#eff6ff', border: '#bfdbfe', color: '#2563eb' },
          rejected: { label: 'Reddedildi', bg: '#fef2f2', border: '#fecaca', color: '#dc2626' },
          closed: { label: 'Kapandı', bg: '#f1f5f9', border: '#e2e8f0', color: '#64748b' },
          pending: { label: 'Beklemede', bg: '#fef3c7', border: '#fde68a', color: '#d97706' },
        };
        const config = statusConfig[row.status] || statusConfig.pending;
        
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
            {row.status === 'resolved' && <CheckCircle size={14} style={{ color: config.color }} />}
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
    showToast('error', 'Başvurular yüklenirken bir hata oluştu.', error.message);
    return (
      <EmptyState
        title="Veriler Yüklenemedi"
        description="Başvuru listesi alınamadı. Lütfen daha sonra tekrar deneyin."
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
              { label: 'İşlemde', value: 'in_progress' },
              { label: 'Tamamlandı', value: 'resolved' },
              { label: 'Reddedildi', value: 'rejected' },
            ]}
          />
          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
            options={[
              { label: 'Tür: Tümü', value: '' },
              { label: 'Şikayet', value: 'complaint' },
              { label: 'Talep', value: 'request' },
              { label: 'Nikah', value: 'marriage' },
              { label: 'Muhtar Mesaj', value: 'muhtar_message' },
              { label: 'Diğer', value: 'other' },
            ]}
          />
        </div>
      </div>

      <Table<Application>
        columns={columns}
        data={applications}
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
        title={`Başvuru Durumu Güncelle - ${selectedApplication?.reference_number || selectedApplication?.id}`}
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
        {selectedApplication && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="p-3 bg-background rounded-lg">
              <div className="text-sm text-text-secondary mb-1">Konu</div>
              <div className="font-medium">{selectedApplication.subject}</div>
            </div>
            <div className="p-3 bg-background rounded-lg">
              <div className="text-sm text-text-secondary mb-1">Açıklama</div>
              <div>{selectedApplication.description}</div>
            </div>
            <Select
              label="Durum *"
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              options={[
                { label: 'Beklemede', value: 'pending' },
                { label: 'İşlemde', value: 'in_progress' },
                { label: 'Tamamlandı', value: 'resolved' },
                { label: 'Reddedildi', value: 'rejected' },
                { label: 'Kapandı', value: 'closed' },
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
