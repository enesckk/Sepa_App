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
import { Edit } from 'lucide-react';

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
          <div className="font-medium">{row.subject}</div>
          {row.user && (
            <div className="text-sm text-text-secondary">{row.user.name} ({row.user.email})</div>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tür',
      render: (row) => (
        <Badge variant="blue">
          {row.type === 'complaint'
            ? 'Şikayet'
            : row.type === 'request'
            ? 'Talep'
            : row.type === 'marriage'
            ? 'Nikah'
            : row.type === 'muhtar_message'
            ? 'Muhtar Mesaj'
            : 'Diğer'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Tarih',
      render: (row) => <div>{new Date(row.created_at).toLocaleDateString('tr-TR')}</div>,
    },
    {
      key: 'status',
      header: 'Durum',
      render: (row) => (
        <Badge
          variant={
            row.status === 'resolved'
              ? 'success'
              : row.status === 'in_progress'
              ? 'info'
              : row.status === 'rejected'
              ? 'error'
              : 'warning'
          }
        >
          {row.status === 'resolved'
            ? 'Tamamlandı'
            : row.status === 'in_progress'
            ? 'İşlemde'
            : row.status === 'rejected'
            ? 'Reddedildi'
            : row.status === 'closed'
            ? 'Kapandı'
            : 'Beklemede'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'İşlemler',
      render: (row) => (
        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(row)}>
          <Edit className="w-4 h-4" />
        </Button>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Başvurular</h1>
          <p className="text-text-secondary text-sm mt-1">
            Kullanıcı başvurularını görüntüleyin ve durum güncelleyin.
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleCloseModal}>
              İptal
            </Button>
            <Button onClick={handleSubmit} loading={updateMutation.isPending}>
              Kaydet
            </Button>
          </div>
        }
      >
        {selectedApplication && (
          <div className="space-y-4">
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
