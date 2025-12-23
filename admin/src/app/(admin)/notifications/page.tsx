'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Table, TableColumn } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/ToastProvider';
import { adminService } from '@/lib/services/admin';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    user_id: '',
    user_ids: '',
    send_to_all: false,
  });

  const {
    data: notificationsData,
    isLoading,
    isError,
    error,
  } = useQuery<{ notifications: Notification[]; total: number }, Error>({
    queryKey: ['adminNotifications'],
    queryFn: () => adminService.getNotifications({ limit: 50 }),
  });

  const notifications = notificationsData?.notifications || [];

  const createMutation = useMutation({
    mutationFn: (data: any) => adminService.createNotification(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
      showToast(
        'success',
        `${response.count || 1} bildirim başarıyla gönderildi.`
      );
      setFormData({
        title: '',
        message: '',
        type: 'info',
        user_id: '',
        user_ids: '',
        send_to_all: false,
      });
    },
    onError: (error: any) => {
      showToast('error', 'Bildirim gönderilirken bir hata oluştu.', error.message);
    },
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.message) {
      showToast('error', 'Lütfen başlık ve mesaj ekleyin.');
      return;
    }

    const payload: any = {
      title: formData.title,
      message: formData.message,
      type: formData.type,
    };

    if (formData.send_to_all) {
      payload.send_to_all = true;
    } else if (formData.user_ids) {
      // Parse comma-separated user IDs
      const ids = formData.user_ids
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
      if (ids.length > 0) {
        payload.user_ids = ids;
      }
    } else if (formData.user_id) {
      payload.user_id = formData.user_id;
    } else {
      showToast('error', 'Lütfen hedef kullanıcı seçin veya "Tüm Kullanıcılara Gönder" seçeneğini işaretleyin.');
      return;
    }

    createMutation.mutate(payload);
  };

  const columns: TableColumn<Notification>[] = [
    {
      key: 'title',
      header: 'Başlık',
    },
    {
      key: 'message',
      header: 'Mesaj',
      render: (row) => (
        <div className="max-w-md truncate">{row.message}</div>
      ),
    },
    {
      key: 'type',
      header: 'Tür',
      render: (row) => (
        <Badge
          variant={
            row.type === 'success'
              ? 'success'
              : row.type === 'error'
              ? 'error'
              : row.type === 'warning'
              ? 'warning'
              : 'info'
          }
        >
          {row.type === 'success'
            ? 'Başarı'
            : row.type === 'error'
            ? 'Hata'
            : row.type === 'warning'
            ? 'Uyarı'
            : row.type === 'event'
            ? 'Etkinlik'
            : row.type === 'reward'
            ? 'Ödül'
            : row.type === 'system'
            ? 'Sistem'
            : 'Bilgi'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Tarih',
      render: (row) => (
        <div>{new Date(row.created_at).toLocaleString('tr-TR')}</div>
      ),
    },
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    showToast('error', 'Bildirimler yüklenirken bir hata oluştu.', error.message);
  }

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

      <div className="bg-surface rounded-card shadow-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-text">Yeni Bildirim Gönder</h2>
        <div className="space-y-4">
          <Input
            label="Başlık *"
            placeholder="Bildirim başlığı"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Textarea
            label="Mesaj *"
            placeholder="Bildirim mesajı"
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          <Select
            label="Tür"
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
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
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.send_to_all}
                onChange={(e) =>
                  setFormData({ ...formData, send_to_all: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-sm text-text">Tüm Kullanıcılara Gönder</span>
            </label>
          </div>
          {!formData.send_to_all && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Hedef Kullanıcı ID (tek kullanıcı)"
                placeholder="user-id"
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              />
              <Input
                label="Hedef Kullanıcı ID'leri (virgülle ayırın)"
                placeholder="user-id1, user-id2, user-id3"
                value={formData.user_ids}
                onChange={(e) => setFormData({ ...formData, user_ids: e.target.value })}
              />
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            loading={createMutation.isPending}
            disabled={!formData.title || !formData.message}
          >
            Gönder
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-text mb-4">Bildirim Geçmişi</h2>
        <Table<Notification>
          columns={columns}
          data={notifications}
          loading={isLoading}
          emptyState={<EmptyState description="Henüz bildirim yok." />}
        />
      </div>
    </div>
  );
}
