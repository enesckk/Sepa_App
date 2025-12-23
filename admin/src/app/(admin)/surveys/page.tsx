'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableColumn } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';

interface SurveyItem {
  id: string;
  title: string;
  status: string;
  golbucks_reward: number;
  expires_at: string | null;
}

const mockData: SurveyItem[] = [];

export default function SurveysPage() {
  const [open, setOpen] = useState(false);

  const columns: TableColumn<SurveyItem>[] = [
    { key: 'title', header: 'Başlık' },
    { key: 'status', header: 'Durum', render: (row) => <Badge variant="info">{row.status}</Badge> },
    { key: 'golbucks_reward', header: 'Ödül' },
    { key: 'expires_at', header: 'Bitiş' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Anketler</h1>
          <p className="text-text-secondary text-sm mt-1">
            Anketleri yönetin, soru ekleyin.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>Yeni Anket</Button>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Ara..." />
          <Select
            options={[
              { label: 'Durum: Tümü', value: '' },
              { label: 'Aktif', value: 'active' },
              { label: 'Taslak', value: 'draft' },
              { label: 'Pasif', value: 'inactive' },
            ]}
          />
          <Select
            options={[
              { label: 'Ödül: Tümü', value: '' },
              { label: '0+', value: '0' },
              { label: '10+', value: '10' },
              { label: '50+', value: '50' },
            ]}
          />
        </div>
      </div>

      <Table<SurveyItem>
        columns={columns}
        data={mockData}
        loading={false}
        emptyState={<EmptyState description="Henüz anket eklenmedi." />}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Yeni Anket"
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
          <Input label="Başlık" placeholder="Anket başlığı" />
          <Textarea label="Açıklama" placeholder="Kısa açıklama" rows={3} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Durum"
              options={[
                { label: 'Taslak', value: 'draft' },
                { label: 'Aktif', value: 'active' },
                { label: 'Pasif', value: 'inactive' },
              ]}
            />
            <Input label="Gölbucks Ödülü" type="number" placeholder="10" />
            <Input label="Bitiş Tarihi" type="date" />
          </div>
          <div className="bg-background border border-border rounded-card p-3 text-sm text-text-secondary">
            Soru ekleme ve düzenleme fonksiyonları bu iskeletin sonraki adımında bağlanacak.
          </div>
        </div>
      </Modal>
    </div>
  );
}

