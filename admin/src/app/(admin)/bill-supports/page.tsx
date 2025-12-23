'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableColumn } from '@/components/ui/Table';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';

interface BillSupportItem {
  id: string;
  bill_type: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const mockData: BillSupportItem[] = [];

export default function BillSupportsPage() {
  const [open, setOpen] = useState(false);

  const columns: TableColumn<BillSupportItem>[] = [
    { key: 'bill_type', header: 'Fatura Türü' },
    { key: 'amount', header: 'Tutar' },
    { key: 'created_at', header: 'Tarih' },
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
              : 'error'
          }
        >
          {row.status === 'approved'
            ? 'Onaylandı'
            : row.status === 'pending'
            ? 'Beklemede'
            : 'Reddedildi'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Askıda Fatura</h1>
          <p className="text-text-secondary text-sm mt-1">
            Askıda fatura başvurularını görüntüleyin ve durum güncelleyin.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>Durum Güncelle</Button>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Ara..." />
          <Select
            options={[
              { label: 'Durum: Tümü', value: '' },
              { label: 'Beklemede', value: 'pending' },
              { label: 'Onaylandı', value: 'approved' },
              { label: 'Reddedildi', value: 'rejected' },
            ]}
          />
          <Select
            options={[
              { label: 'Tür: Tümü', value: '' },
              { label: 'Elektrik', value: 'electricity' },
              { label: 'Su', value: 'water' },
              { label: 'Doğalgaz', value: 'gas' },
              { label: 'İnternet', value: 'internet' },
              { label: 'Diğer', value: 'other' },
            ]}
          />
        </div>
      </div>

      <Table<BillSupportItem>
        columns={columns}
        data={mockData}
        loading={false}
        emptyState={<EmptyState description="Henüz başvuru yok." />}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Askıda Fatura Durumu"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Kapat
            </Button>
            <Button>Kaydet</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Referans No" placeholder="BILL-123" />
          <Select
            label="Durum"
            options={[
              { label: 'Beklemede', value: 'pending' },
              { label: 'Onaylandı', value: 'approved' },
              { label: 'Reddedildi', value: 'rejected' },
            ]}
          />
          <Textarea label="Yanıt" placeholder="Kısa yanıt/ açıklama" rows={3} />
        </div>
      </Modal>
    </div>
  );
}

