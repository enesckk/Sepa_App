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
import { Download, FileSpreadsheet, Bell, Send, Calendar, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';
import { exportToCSV, exportToExcel, prepareTableData } from '@/lib/utils/export';

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
    queryFn: async () => {
      const response = await adminService.getNotifications({ limit: 50 });
      return response as { notifications: Notification[]; total: number };
    },
  });

  const notifications = notificationsData?.notifications || [];

  // Export functions
  const handleExportCSV = () => {
    const exportColumns = columns.filter((col) => col.key !== 'actions');
    const { headers, rows } = prepareTableData(notifications, exportColumns);
    exportToCSV({
      filename: 'bildirimler',
      headers,
      data: rows,
    });
    showToast('success', 'CSV dosyası indirildi.');
  };

  const handleExportExcel = async () => {
    try {
      const exportColumns = columns.filter((col) => col.key !== 'actions');
      const { headers, rows } = prepareTableData(notifications, exportColumns);
      await exportToExcel({
        filename: 'bildirimler',
        headers,
        data: rows,
      });
      showToast('success', 'Excel dosyası indirildi.');
    } catch (error: any) {
      showToast('error', 'Excel export hatası:', error.message);
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => adminService.createNotification(data),
    onSuccess: (response: any) => {
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
      render: (row) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(59, 130, 246, 0.15)',
            flexShrink: 0,
          }}>
            <Bell style={{ color: '#ffffff' }} size={20} />
          </div>
          <div>
            <div style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#0f172a',
            }}>
              {row.title}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'message',
      header: 'Mesaj',
      render: (row) => (
        <div style={{
          maxWidth: '400px',
          fontSize: '14px',
          color: '#475569',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {row.message}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tür',
      render: (row) => {
        const typeConfig: Record<string, { label: string; bg: string; border: string; color: string; icon: any }> = {
          success: { label: 'Başarı', bg: '#ecfdf5', border: '#d1fae5', color: '#059669', icon: CheckCircle },
          error: { label: 'Hata', bg: '#fef2f2', border: '#fecaca', color: '#dc2626', icon: XCircle },
          warning: { label: 'Uyarı', bg: '#fef3c7', border: '#fde68a', color: '#d97706', icon: AlertCircle },
          event: { label: 'Etkinlik', bg: '#f3e8ff', border: '#e9d5ff', color: '#7c3aed', icon: Bell },
          reward: { label: 'Ödül', bg: '#ecfdf5', border: '#d1fae5', color: '#059669', icon: CheckCircle },
          system: { label: 'Sistem', bg: '#f1f5f9', border: '#e2e8f0', color: '#64748b', icon: Info },
          info: { label: 'Bilgi', bg: '#eff6ff', border: '#bfdbfe', color: '#2563eb', icon: Info },
        };
        const config = typeConfig[row.type] || typeConfig.info;
        const Icon = config.icon;
        
        return (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: config.bg,
            borderRadius: '8px',
            border: `1px solid ${config.border}`,
          }}>
            <Icon size={14} style={{ color: config.color }} />
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: config.color,
            }}>
              {config.label}
            </span>
          </div>
        );
      },
    },
    {
      key: 'created_at',
      header: 'Tarih',
      render: (row) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <Calendar style={{ color: '#64748b' }} size={16} />
          <span style={{
            fontSize: '14px',
            color: '#475569',
          }}>
            {new Date(row.created_at).toLocaleString('tr-TR')}
          </span>
        </div>
      ),
    },
    {
      key: 'is_read',
      header: 'Durum',
      render: (row) => (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          backgroundColor: row.is_read ? '#f1f5f9' : '#eff6ff',
          borderRadius: '8px',
          border: `1px solid ${row.is_read ? '#e2e8f0' : '#bfdbfe'}`,
        }}>
          {!row.is_read && <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
          }} />}
          <span style={{
            fontSize: '13px',
            fontWeight: 600,
            color: row.is_read ? '#64748b' : '#2563eb',
          }}>
            {row.is_read ? 'Okundu' : 'Yeni'}
          </span>
        </div>
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
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #d1fae5',
        padding: '24px',
        background: 'linear-gradient(to bottom, #ffffff, #f0fdf4)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <Bell style={{ color: '#10b981' }} size={24} />
          <h2 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#0f172a',
          }}>
            Yeni Bildirim Gönder
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px',
            backgroundColor: formData.send_to_all ? '#ecfdf5' : '#f8fafc',
            borderRadius: '10px',
            border: `1px solid ${formData.send_to_all ? '#d1fae5' : '#e2e8f0'}`,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onClick={() => setFormData({ ...formData, send_to_all: !formData.send_to_all })}
          onMouseEnter={(e) => {
            if (!formData.send_to_all) {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }
          }}
          onMouseLeave={(e) => {
            if (!formData.send_to_all) {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }
          }}
          >
            <input
              type="checkbox"
              checked={formData.send_to_all}
              onChange={(e) =>
                setFormData({ ...formData, send_to_all: e.target.checked })
              }
              style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer',
                accentColor: '#10b981',
              }}
            />
            <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: formData.send_to_all ? '#059669' : '#64748b',
            }}>
              Tüm Kullanıcılara Gönder
            </span>
          </div>
          {!formData.send_to_all && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}>
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
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSubmit}
            disabled={!formData.title || !formData.message || createMutation.isPending}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: (!formData.title || !formData.message || createMutation.isPending) ? '#94a3b8' : '#10b981',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: (!formData.title || !formData.message || createMutation.isPending) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
            }}
            onMouseEnter={(e) => {
              if (formData.title && formData.message && !createMutation.isPending) {
                e.currentTarget.style.backgroundColor = '#059669';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (formData.title && formData.message && !createMutation.isPending) {
                e.currentTarget.style.backgroundColor = '#10b981';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)';
              }
            }}
          >
            <Send size={16} />
            {createMutation.isPending ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '12px',
      }}>
        <button
          onClick={handleExportCSV}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#ffffff',
            border: '1px solid #10b981',
            borderRadius: '10px',
            color: '#10b981',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ecfdf5';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Download size={16} />
          CSV
        </button>
        <button
          onClick={handleExportExcel}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#10b981',
            border: 'none',
            borderRadius: '10px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#10b981';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)';
          }}
        >
          <FileSpreadsheet size={16} />
          Excel
        </button>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
        padding: '24px',
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#0f172a',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <Bell style={{ color: '#10b981' }} size={24} />
          Bildirim Geçmişi
        </h2>
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
