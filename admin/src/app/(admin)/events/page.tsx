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

interface EventItem {
  id: string;
  title: string;
  date: string;
  category: string;
  is_active: boolean;
}

const mockData: EventItem[] = [];

export default function EventsPage() {
  const [open, setOpen] = useState(false);

  const columns: TableColumn<EventItem>[] = [
    { key: 'title', header: 'Başlık' },
    { key: 'date', header: 'Tarih' },
    { key: 'category', header: 'Kategori' },
    {
      key: 'is_active',
      header: 'Durum',
      render: (row) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-button ${
            row.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {row.is_active ? 'Aktif' : 'Pasif'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Etkinlikler</h1>
          <p className="text-text-secondary text-sm mt-1">
            Etkinlikleri yönetin, yeni etkinlik ekleyin.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>Yeni Etkinlik</Button>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Ara..." />
          <Select
            options={[
              { label: 'Tümü', value: '' },
              { label: 'Kültür', value: 'kultur' },
              { label: 'Spor', value: 'spor' },
              { label: 'Eğitim', value: 'egitim' },
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

      <Table<EventItem>
        columns={columns}
        data={mockData}
        loading={false}
        emptyState={<EmptyState description="Henüz etkinlik eklenmedi." />}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Yeni Etkinlik"
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
          <Input label="Başlık" placeholder="Etkinlik başlığı" />
          <Textarea label="Açıklama" placeholder="Etkinlik açıklaması" rows={4} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Tarih" type="date" />
            <Input label="Saat" type="time" />
            <Input label="Konum" placeholder="Şehitkamil Kongre ve Kültür Merkezi" />
            <Select
              label="Kategori"
              options={[
                { label: 'Kültür', value: 'kultur' },
                { label: 'Spor', value: 'spor' },
                { label: 'Eğitim', value: 'egitim' },
                { label: 'Sosyal', value: 'sosyal' },
              ]}
            />
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

