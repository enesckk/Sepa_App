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
import { Edit } from 'lucide-react';

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

  const columns: TableColumn<BillSupport>[] = [
    {
      key: 'bill_type',
      header: 'Fatura',
      render: (row) => (
        <div>
          <div className="font-medium">
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
            <div className="text-sm text-text-secondary">{row.user.name}</div>
          )}
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Tutar',
      render: (row) => <span className="font-semibold">{row.amount.toFixed(2)} ₺</span>,
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
            row.status === 'approved'
              ? 'success'
              : row.status === 'pending'
              ? 'warning'
              : row.status === 'rejected'
              ? 'error'
              : row.status === 'paid'
              ? 'info'
              : 'default'
          }
        >
          {row.status === 'approved'
            ? 'Onaylandı'
            : row.status === 'pending'
            ? 'Beklemede'
            : row.status === 'rejected'
            ? 'Reddedildi'
            : row.status === 'paid'
            ? 'Ödendi'
            : row.status === 'cancelled'
            ? 'İptal'
            : 'Bilinmiyor'}
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
    showToast('error', 'Askıda fatura başvuruları yüklenirken bir hata oluştu.', error.message);
    return (
      <EmptyState
        title="Veriler Yüklenemedi"
        description="Askıda fatura listesi alınamadı. Lütfen daha sonra tekrar deneyin."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Askıda Fatura</h1>
          <p className="text-text-secondary text-sm mt-1">
            Askıda fatura başvurularını görüntüleyin ve durum güncelleyin.
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
        {selectedBillSupport && (
          <div className="space-y-4">
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
