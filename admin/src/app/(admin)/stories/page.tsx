'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableColumn } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { FileUpload } from '@/components/ui/FileUpload';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/ToastProvider';
import { adminService, StoriesResponse } from '@/lib/services/admin';
import { Edit, Trash2, Eye } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  expires_at?: string;
  is_active: boolean;
  view_count: number;
  order: number;
  created_at: string;
}

export default function StoriesPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    expires_at: '',
    order: '0',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    data: storiesData,
    isLoading,
    isError,
    error,
  } = useQuery<StoriesResponse, Error>({
    queryKey: ['adminStories', search],
    queryFn: () => adminService.getStories(),
  });

  const stories = (storiesData?.stories || []).filter((story) =>
    search ? story.title.toLowerCase().includes(search.toLowerCase()) : true
  );

  const createMutation = useMutation({
    mutationFn: (formDataToSend: FormData) => adminService.createStory(formDataToSend),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStories'] });
      showToast('success', 'Story başarıyla oluşturuldu.');
      handleCloseModal();
    },
    onError: (error: any) => {
      showToast('error', 'Story oluşturulurken bir hata oluştu.', error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formDataToSend }: { id: string; formDataToSend: FormData }) =>
      adminService.updateStory(id, formDataToSend),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStories'] });
      showToast('success', 'Story başarıyla güncellendi.');
      handleCloseModal();
    },
    onError: (error: any) => {
      showToast('error', 'Story güncellenirken bir hata oluştu.', error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteStory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStories'] });
      showToast('success', 'Story başarıyla silindi.');
    },
    onError: (error: any) => {
      showToast('error', 'Story silinirken bir hata oluştu.', error.message);
    },
  });

  const handleOpenModal = (story?: Story) => {
    if (story) {
      setSelectedStory(story);
      setFormData({
        title: story.title,
        description: story.description || '',
        expires_at: story.expires_at ? new Date(story.expires_at).toISOString().split('T')[0] : '',
        order: story.order.toString(),
      });
      setImagePreview(story.image_url || null);
    } else {
      setSelectedStory(null);
      setFormData({
        title: '',
        description: '',
        expires_at: '',
        order: '0',
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedStory(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = () => {
    if (!formData.title || (!imageFile && !imagePreview)) {
      showToast('error', 'Lütfen başlık ve görsel ekleyin.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    if (formData.expires_at) formDataToSend.append('expires_at', formData.expires_at);
    formDataToSend.append('order', formData.order);
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    } else if (imagePreview && selectedStory) {
      formDataToSend.append('image_url', imagePreview);
    }

    if (selectedStory) {
      updateMutation.mutate({ id: selectedStory.id, formDataToSend });
    } else {
      createMutation.mutate(formDataToSend);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu story\'yi silmek istediğinize emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const columns: TableColumn<Story>[] = [
    {
      key: 'title',
      header: 'Story',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {row.image_url ? (
            <img
              src={row.image_url}
              alt={row.title}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                objectFit: 'cover',
                marginRight: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              }}
            />
          ) : (
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.15)',
            }}>
              <Eye style={{ color: '#ffffff' }} size={24} />
            </div>
          )}
          <div>
            <div style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#0f172a',
              marginBottom: '4px',
            }}>
              {row.title}
            </div>
            {row.description && (
              <div style={{
                fontSize: '13px',
                color: '#64748b',
                maxWidth: '300px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {row.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'order',
      header: 'Sıra',
      render: (row) => (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '6px 12px',
          backgroundColor: '#ecfdf5',
          borderRadius: '8px',
          border: '1px solid #d1fae5',
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#059669',
          }}>
            {row.order}
          </span>
        </div>
      ),
    },
    {
      key: 'view_count',
      header: 'Görüntülenme',
      render: (row) => (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          backgroundColor: '#eff6ff',
          borderRadius: '8px',
          border: '1px solid #bfdbfe',
        }}>
          <Eye style={{ color: '#3b82f6' }} size={16} />
          <span style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#2563eb',
          }}>
            {row.view_count}
          </span>
        </div>
      ),
    },
    {
      key: 'expires_at',
      header: 'Bitiş Tarihi',
      render: (row) => (
        <span style={{
          fontSize: '14px',
          color: '#475569',
        }}>
          {row.expires_at
            ? new Date(row.expires_at).toLocaleDateString('tr-TR')
            : 'Süresiz'}
        </span>
      ),
    },
    {
      key: 'is_active',
      header: 'Durum',
      render: (row) => (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '6px 12px',
          backgroundColor: row.is_active ? '#ecfdf5' : '#fef2f2',
          borderRadius: '8px',
          border: `1px solid ${row.is_active ? '#d1fae5' : '#fecaca'}`,
        }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 600,
            color: row.is_active ? '#059669' : '#dc2626',
          }}>
            {row.is_active ? 'Aktif' : 'Pasif'}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'İşlemler',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => handleOpenModal(row)}
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ecfdf5',
              border: '1px solid #d1fae5',
              borderRadius: '8px',
              color: '#10b981',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d1fae5';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ecfdf5';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fee2e2';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fef2f2';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Trash2 size={16} />
          </button>
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
    showToast('error', 'Stories yüklenirken bir hata oluştu.', error.message);
    return (
      <EmptyState
        title="Veriler Yüklenemedi"
        description="Story listesi alınamadı. Lütfen daha sonra tekrar deneyin."
      />
    );
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}>
        <button
          onClick={() => handleOpenModal()}
          style={{
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
          Yeni Story
        </button>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #d1fae5',
        padding: '24px',
        background: 'linear-gradient(to bottom, #ffffff, #f0fdf4)',
      }}>
        <Input
          placeholder="Ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table<Story>
        columns={columns}
        data={stories}
        loading={isLoading}
        emptyState={<EmptyState description="Henüz story eklenmedi." />}
      />

      <Modal
        open={open}
        onClose={handleCloseModal}
        title={selectedStory ? 'Story Düzenle' : 'Yeni Story'}
        footer={
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}>
            <button
              onClick={handleCloseModal}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.color = '#475569';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              İptal
            </button>
            <button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              style={{
                padding: '10px 20px',
                backgroundColor: createMutation.isPending || updateMutation.isPending ? '#94a3b8' : '#10b981',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: createMutation.isPending || updateMutation.isPending ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
              }}
              onMouseEnter={(e) => {
                if (!createMutation.isPending && !updateMutation.isPending) {
                  e.currentTarget.style.backgroundColor = '#059669';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!createMutation.isPending && !updateMutation.isPending) {
                  e.currentTarget.style.backgroundColor = '#10b981';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)';
                }
              }}
            >
              {createMutation.isPending || updateMutation.isPending ? 'Kaydediliyor...' : (selectedStory ? 'Güncelle' : 'Oluştur')}
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            label="Başlık *"
            placeholder="Story başlığı"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Textarea
            label="Açıklama"
            placeholder="Kısa açıklama"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            <Input
              label="Sıra"
              type="number"
              placeholder="1"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: e.target.value })}
            />
            <Input
              label="Bitiş Tarihi (Opsiyonel)"
              type="date"
              value={formData.expires_at}
              onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
            />
          </div>
          <FileUpload
            label="Görsel *"
            accept="image/*"
            onFilesSelected={(files) => {
              if (files.length > 0) {
                setImageFile(files[0]);
                const reader = new FileReader();
                reader.onloadend = () => {
                  setImagePreview(reader.result as string);
                };
                reader.readAsDataURL(files[0]);
              }
            }}
            helperText="Maks 5MB, JPG/PNG"
          />
        </div>
      </Modal>
    </div>
  );
}
