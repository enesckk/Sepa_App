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

interface GatheringItem {
  id: string;
  name: string;
  type: string;
  address: string;
  is_active: boolean;
}

const mockData: GatheringItem[] = [];

export default function EmergencyGatheringPage() {
  const [open, setOpen] = useState(false);

  const columns: TableColumn<GatheringItem>[] = [
    { key: 'name', header: 'Ad' },
    { key: 'type', header: 'Tür' },
    { key: 'address', header: 'Adres' },
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
          <h1 className="text-3xl font-bold text-text">Afet Toplanma Alanları</h1>
          <p className="text-text-secondary text-sm mt-1">
            Toplanma alanlarını yönetin, konum ve kapasite ekleyin.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>Yeni Alan</Button>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Ara..." />
          <Select
            options={[
              { label: 'Tür: Tümü', value: '' },
              { label: 'Açık Alan', value: 'open_area' },
              { label: 'Bina', value: 'building' },
              { label: 'Park', value: 'park' },
              { label: 'Okul', value: 'school' },
              { label: 'Stadyum', value: 'stadium' },
            ]}
          />
          <Select
            options={[
              { label: 'Durum: Tümü', value: '' },
              { label: 'Aktif', value: 'true' },
              { label: 'Pasif', value: 'false' },
            ]}
          />
        </div>
      </div>

      <Table<GatheringItem>
        columns={columns}
        data={mockData}
        loading={false}
        emptyState={<EmptyState description="Henüz kayıt yok." />}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Yeni Afet Toplanma Alanı"
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
          <Input label="Ad" placeholder="Alan adı" />
          <Textarea label="Açıklama" placeholder="Kısa açıklama" rows={3} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Tür"
              options={[
                { label: 'Açık Alan', value: 'open_area' },
                { label: 'Bina', value: 'building' },
                { label: 'Park', value: 'park' },
                { label: 'Okul', value: 'school' },
                { label: 'Stadyum', value: 'stadium' },
                { label: 'Diğer', value: 'other' },
              ]}
            />
            <Input label="Kapasite" type="number" placeholder="5000" />
            <Input label="Enlem" placeholder="37.0662" />
            <Input label="Boylam" placeholder="37.3833" />
          </div>
          <FileUpload
            label="Görsel (opsiyonel)"
            accept="image/*"
            onFilesSelected={() => {}}
            helperText="Maks 5MB, JPG/PNG"
          />
        </div>
      </Modal>
    </div>
  );
}

