'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Table, TableColumn } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';

interface NotificationItem {
  id: string;
  title: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

const mockData: NotificationItem[] = [];

export default function NotificationsPage() {
  const [loading] = useState(false);

  const columns: TableColumn<NotificationItem>[] = [
    { key: 'title', header: 'Başlık' },
    { key: 'type', header: 'Tür' },
    { key: 'created_at', header: 'Tarih' },
    {
      key: 'is_read',
      header: 'Durum',
      render: (row) => (
        <Badge variant={row.is_read ? 'default' : 'info'}>
          {row.is_read ? 'Okundu' : 'Yeni'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Bildirimler</h1>
          <p className="text-text-secondary text-sm mt-1">
            Kullanıcılara bildirim gönderin ve geçmişi görün.
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4 space-y-4">
        <h2 className="text-lg font-semibold text-text">Yeni Bildirim Gönder</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Başlık" placeholder="Bildirim başlığı" />
          <Select
            label="Tür"
            options={[
              { label: 'Bilgi', value: 'info' },
              { label: 'Başarı', value: 'success' },
              { label: 'Uyarı', value: 'warning' },
              { label: 'Hata', value: 'error' },
              { label: 'Etkinlik', value: 'event' },
              { label: 'Ödül', value: 'reward' },
              { label: 'Sistem', value: 'system' },
            ]}
          />
          <Input label="Hedef Kullanıcı (ID) - boş bırak tümü" placeholder="user-id veya boş" />
          <Textarea label="Mesaj" placeholder="Bildirim mesajı" rows={3} />
        </div>
        <div className="flex justify-end">
          <Button>Gönder</Button>
        </div>
      </div>

      <Table<NotificationItem>
        columns={columns}
        data={mockData}
        loading={loading}
        emptyState={<EmptyState description="Henüz bildirim yok." />}
      />
    </div>
  );
}

