'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableColumn } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { FileUpload } from '@/components/ui/FileUpload';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/ToastProvider';
import { adminService, NewsResponse } from '@/lib/services/admin';
import { Edit, Trash2 } from 'lucide-react';

interface News {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category: string;
  image_url?: string;
  published_at?: string;
  is_active: boolean;
  view_count: number;
  author?: string;
  created_at: string;
}

export default function NewsPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    category: 'haber',
    published_at: '',
    author: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    data: newsData,
    isLoading,
    isError,
    error,
  } = useQuery<NewsResponse, Error>({
    queryKey: ['adminNews', page, limit, search, categoryFilter],
    queryFn: () =>
      adminService.getNews({
        limit,
        offset: (page - 1) * limit,
        search: search || undefined,
        category: categoryFilter || undefined,
      }),
  });

  const news = newsData?.news || [];
  const totalNews = newsData?.total || 0;
  const totalPages = Math.ceil(totalNews / limit);

  const createMutation = useMutation({
    mutationFn: (formDataToSend: FormData) => adminService.createNews(formDataToSend),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNews'] });
      showToast('success', 'Haber başarıyla oluşturuldu.');
      handleCloseModal();
    },
    onError: (error: any) => {
      showToast('error', 'Haber oluşturulurken bir hata oluştu.', error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formDataToSend }: { id: string; formDataToSend: FormData }) =>
      adminService.updateNews(id, formDataToSend),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNews'] });
      showToast('success', 'Haber başarıyla güncellendi.');
      handleCloseModal();
    },
    onError: (error: any) => {
      showToast('error', 'Haber güncellenirken bir hata oluştu.', error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNews'] });
      showToast('success', 'Haber başarıyla silindi.');
    },
    onError: (error: any) => {
      showToast('error', 'Haber silinirken bir hata oluştu.', error.message);
    },
  });

  const handleOpenModal = (newsItem?: News) => {
    if (newsItem) {
      setSelectedNews(newsItem);
      setFormData({
        title: newsItem.title,
        content: newsItem.content,
        summary: newsItem.summary || '',
        category: newsItem.category,
        published_at: newsItem.published_at
          ? new Date(newsItem.published_at).toISOString().split('T')[0]
          : '',
        author: newsItem.author || '',
      });
      setImagePreview(newsItem.image_url || null);
    } else {
      setSelectedNews(null);
      setFormData({
        title: '',
        content: '',
        summary: '',
        category: 'haber',
        published_at: '',
        author: '',
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedNews(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content) {
      showToast('error', 'Lütfen başlık ve içerik ekleyin.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);
    if (formData.summary) formDataToSend.append('summary', formData.summary);
    formDataToSend.append('category', formData.category);
    if (formData.published_at) formDataToSend.append('published_at', formData.published_at);
    if (formData.author) formDataToSend.append('author', formData.author);
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    } else if (imagePreview && selectedNews) {
      formDataToSend.append('image_url', imagePreview);
    }

    if (selectedNews) {
      updateMutation.mutate({ id: selectedNews.id, formDataToSend });
    } else {
      createMutation.mutate(formDataToSend);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu haberi silmek istediğinize emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const columns: TableColumn<News>[] = [
    {
      key: 'title',
      header: 'Başlık',
      render: (row) => (
        <div className="flex items-center">
          {row.image_url && (
            <img
              src={row.image_url}
              alt={row.title}
              className="w-12 h-12 rounded-lg object-cover mr-3"
            />
          )}
          <div>
            <div className="font-medium">{row.title}</div>
            {row.summary && (
              <div className="text-sm text-text-secondary line-clamp-1">{row.summary}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Kategori',
      render: (row) => (
        <Badge variant="blue">
          {row.category === 'haber'
            ? 'Haber'
            : row.category === 'duyuru'
            ? 'Duyuru'
            : row.category === 'etkinlik'
            ? 'Etkinlik'
            : row.category === 'proje'
            ? 'Proje'
            : row.category === 'basin'
            ? 'Basın'
            : 'Diğer'}
        </Badge>
      ),
    },
    {
      key: 'published_at',
      header: 'Yayın Tarihi',
      render: (row) => (
        <div>
          {row.published_at
            ? new Date(row.published_at).toLocaleDateString('tr-TR')
            : new Date(row.created_at).toLocaleDateString('tr-TR')}
        </div>
      ),
    },
    {
      key: 'view_count',
      header: 'Görüntülenme',
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
    showToast('error', 'Haberler yüklenirken bir hata oluştu.', error.message);
    return (
      <EmptyState
        title="Veriler Yüklenemedi"
        description="Haber listesi alınamadı. Lütfen daha sonra tekrar deneyin."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Haberler</h1>
          <p className="text-text-secondary text-sm mt-1">
            Haber ve duyuruları yönetin.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>Yeni Haber</Button>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
            options={[
              { label: 'Kategori: Tümü', value: '' },
              { label: 'Haber', value: 'haber' },
              { label: 'Duyuru', value: 'duyuru' },
              { label: 'Etkinlik', value: 'etkinlik' },
              { label: 'Proje', value: 'proje' },
              { label: 'Basın', value: 'basin' },
            ]}
          />
        </div>
      </div>

      <Table<News>
        columns={columns}
        data={news}
        loading={isLoading}
        emptyState={<EmptyState description="Henüz haber eklenmedi." />}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          onPageChange: setPage,
        }}
      />

      <Modal
        open={open}
        onClose={handleCloseModal}
        title={selectedNews ? 'Haber Düzenle' : 'Yeni Haber'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleCloseModal}>
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {selectedNews ? 'Güncelle' : 'Oluştur'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Başlık *"
            placeholder="Haber başlığı"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Textarea
            label="Özet"
            placeholder="Kısa özet"
            rows={3}
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          />
          <Textarea
            label="İçerik *"
            placeholder="Haber içeriği"
            rows={5}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Kategori"
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              options={[
                { label: 'Haber', value: 'haber' },
                { label: 'Duyuru', value: 'duyuru' },
                { label: 'Etkinlik', value: 'etkinlik' },
                { label: 'Proje', value: 'proje' },
                { label: 'Basın', value: 'basin' },
                { label: 'Diğer', value: 'other' },
              ]}
            />
            <Input
              label="Yayın Tarihi"
              type="date"
              value={formData.published_at}
              onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
            />
            <Input
              label="Yazar"
              placeholder="Yazar adı"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
          </div>
          <FileUpload
            label="Kapak Görseli"
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
