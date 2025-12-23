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

interface PlaceItem {
  id: string;
  name: string;
  type: string;
  address: string;
  is_active: boolean;
}

const mockData: PlaceItem[] = [];

export default function PlacesPage() {
  const [open, setOpen] = useState(false);

  const columns: TableColumn<PlaceItem>[] = [
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
          <h1 className="text-3xl font-bold text-text">Şehir Rehberi</h1>
          <p className="text-text-secondary text-sm mt-1">
            Mekanları yönetin, konum ve görselleri ekleyin.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>Yeni Mekan</Button>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Ara..." />
          <Select
            options={[
              { label: 'Tür: Tümü', value: '' },
              { label: 'Cami', value: 'mosque' },
              { label: 'Park', value: 'park' },
              { label: 'Hastane', value: 'hospital' },
              { label: 'Okul', value: 'school' },
              { label: 'Restoran', value: 'restaurant' },
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

      <Table<PlaceItem>
        columns={columns}
        data={mockData}
        loading={false}
        emptyState={<EmptyState description="Henüz mekan eklenmedi." />}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Yeni Mekan"
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
          <Input label="Ad" placeholder="Mekan adı" />
          <Textarea label="Açıklama" placeholder="Kısa açıklama" rows={3} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Tür"
              options={[
                { label: 'Cami', value: 'mosque' },
                { label: 'Park', value: 'park' },
                { label: 'Hastane', value: 'hospital' },
                { label: 'Okul', value: 'school' },
                { label: 'Restoran', value: 'restaurant' },
                { label: 'Diğer', value: 'other' },
              ]}
            />
            <Input label="Telefon" placeholder="+90 342 ..." />
            <Input label="Web" placeholder="https://..." />
            <Input label="E-posta" type="email" placeholder="info@example.com" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Enlem" placeholder="37.0662" />
            <Input label="Boylam" placeholder="37.3833" />
            <Input label="Adres" placeholder="Açık adres" />
            <Input label="Çalışma Saatleri" placeholder="08:00 - 18:00" />
          </div>
          <FileUpload
            label="Kapak Görseli"
            accept="image/*"
            onFilesSelected={() => {}}
            helperText="Maks 5MB, JPG/PNG"
          />
        </div>
      </Modal>
    </div>
  );
}

