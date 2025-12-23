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

interface NewsItem {
  id: string;
  title: string;
  category: string;
  published_at: string;
  is_active: boolean;
}

const mockData: NewsItem[] = [];

export default function NewsPage() {
  const [open, setOpen] = useState(false);

  const columns: TableColumn<NewsItem>[] = [
    { key: 'title', header: 'Başlık' },
    { key: 'category', header: 'Kategori' },
    { key: 'published_at', header: 'Yayın Tarihi' },
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
          <h1 className="text-3xl font-bold text-text">Haberler</h1>
          <p className="text-text-secondary text-sm mt-1">
            Haber ve duyuruları yönetin.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>Yeni Haber</Button>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Ara..." />
          <Select
            options={[
              { label: 'Kategori: Tümü', value: '' },
              { label: 'Haber', value: 'haber' },
              { label: 'Duyuru', value: 'duyuru' },
              { label: 'Etkinlik', value: 'etkinlik' },
              { label: 'Proje', value: 'proje' },
              { label: 'Basın', value: 'basin' },
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

      <Table<NewsItem>
        columns={columns}
        data={mockData}
        loading={false}
        emptyState={<EmptyState description="Henüz haber eklenmedi." />}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Yeni Haber"
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
          <Input label="Başlık" placeholder="Haber başlığı" />
          <Textarea label="Özet" placeholder="Kısa özet" rows={3} />
          <Textarea label="İçerik" placeholder="Haber içeriği" rows={5} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Kategori"
              options={[
                { label: 'Haber', value: 'haber' },
                { label: 'Duyuru', value: 'duyuru' },
                { label: 'Etkinlik', value: 'etkinlik' },
                { label: 'Proje', value: 'proje' },
                { label: 'Basın', value: 'basin' },
                { label: 'Diğer', value: 'other' },
              ]}
            />
            <Input label="Yayın Tarihi" type="date" />
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

