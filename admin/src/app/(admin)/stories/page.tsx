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
        <div className="flex items-center">
          {row.image_url && (
            <img
              src={row.image_url}
              alt={row.title}
              className="w-16 h-16 rounded-lg object-cover mr-3"
            />
          )}
          <div>
            <div className="font-medium">{row.title}</div>
            {row.description && (
              <div className="text-sm text-text-secondary line-clamp-1">{row.description}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'order',
      header: 'Sıra',
    },
    {
      key: 'view_count',
      header: 'Görüntülenme',
      render: (row) => (
        <div className="flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          {row.view_count}
        </div>
      ),
    },
    {
      key: 'expires_at',
      header: 'Bitiş Tarihi',
      render: (row) => (
        <div>
          {row.expires_at
            ? new Date(row.expires_at).toLocaleDateString('tr-TR')
            : 'Süresiz'}
        </div>
      ),
    },
    {
      key: 'is_active',
      header: 'Durum',
      render: (row) => (
        <Badge variant={row.is_active ? 'success' : 'error'}>
          {row.is_active ? 'Aktif' : 'Pasif'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'İşlemler',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(row)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="dangerGhost" size="sm" onClick={() => handleDelete(row.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Stories</h1>
          <p className="text-text-secondary text-sm mt-1">
            Story ekleyin, sıralayın ve yönetin.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>Yeni Story</Button>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4">
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
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleCloseModal}>
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {selectedStory ? 'Güncelle' : 'Oluştur'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            preview={imagePreview}
          />
        </div>
      </Modal>
    </div>
  );
}
