'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableColumn } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { FileUpload } from '@/components/ui/FileUpload';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';

interface RewardItem {
  id: string;
  title: string;
  points: number;
  stock: number | null;
  is_active: boolean;
}

const mockData: RewardItem[] = [];

export default function RewardsPage() {
  const [open, setOpen] = useState(false);

  const columns: TableColumn<RewardItem>[] = [
    { key: 'title', header: 'Ödül' },
    { key: 'points', header: 'Puan' },
    {
      key: 'stock',
      header: 'Stok',
      render: (row) => (row.stock === null ? 'Sınırsız' : row.stock),
    },
    {
      key: 'is_active',
      header: 'Durum',
      render: (row) => (
        <Badge variant={row.is_active ? 'success' : 'error'}>
          {row.is_active ? 'Aktif' : 'Pasif'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Ödüller</h1>
          <p className="text-text-secondary text-sm mt-1">
            Ödül ve stok yönetimi.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>Yeni Ödül</Button>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Ara..." />
          <Select
            options={[
              { label: 'Durum: Tümü', value: '' },
              { label: 'Aktif', value: 'true' },
              { label: 'Pasif', value: 'false' },
            ]}
          />
          <Select
            options={[
              { label: 'Stok: Tümü', value: '' },
              { label: 'Sınırsız', value: 'null' },
              { label: 'Stoklu', value: 'stock' },
            ]}
          />
        </div>
      </div>

      <Table<RewardItem>
        columns={columns}
        data={mockData}
        loading={false}
        emptyState={<EmptyState description="Henüz ödül eklenmedi." />}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Yeni Ödül"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              İptal
            </Button>
            <Button>Kaydet</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Başlık" placeholder="Ödül adı" />
          <Textarea label="Açıklama" placeholder="Kısa açıklama" rows={3} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Puan" type="number" placeholder="50" />
            <Input label="Stok (boş bırak = sınırsız)" type="number" placeholder="10" />
            <Input label="Geçerlilik (gün) opsiyonel" type="number" placeholder="30" />
          </div>
          <FileUpload
            label="Görsel"
            accept="image/*"
            onFilesSelected={() => {}}
            helperText="Maks 5MB, JPG/PNG"
          />
        </div>
      </Modal>
    </div>
  );
}

