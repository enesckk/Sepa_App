'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableColumn } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { FileUpload } from '@/components/ui/FileUpload';
import { Textarea } from '@/components/ui/Textarea';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';

interface StoryItem {
  id: string;
  title: string;
  order: number;
  is_active: boolean;
}

const mockData: StoryItem[] = [];

export default function StoriesPage() {
  const [open, setOpen] = useState(false);

  const columns: TableColumn<StoryItem>[] = [
    { key: 'title', header: 'Başlık' },
    { key: 'order', header: 'Sıra' },
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
          <h1 className="text-3xl font-bold text-text">Stories</h1>
          <p className="text-text-secondary text-sm mt-1">
            Story ekleyin, sıralayın ve yönetin.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>Yeni Story</Button>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Ara..." />
          <Input placeholder="Sıraya göre filtrele" />
        </div>
      </div>

      <Table<StoryItem>
        columns={columns}
        data={mockData}
        loading={false}
        emptyState={<EmptyState description="Henüz story eklenmedi." />}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Yeni Story"
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
          <Input label="Başlık" placeholder="Story başlığı" />
          <Textarea label="Açıklama" placeholder="Kısa açıklama" rows={3} />
          <Input label="Sıra" type="number" placeholder="1" />
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

