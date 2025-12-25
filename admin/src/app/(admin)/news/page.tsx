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
import { Edit, Trash2, Download, FileSpreadsheet, Newspaper, Eye } from 'lucide-react';
import { exportToCSV, exportToExcel, prepareTableData } from '@/lib/utils/export';

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

  // Export functions
  const handleExportCSV = () => {
    const exportColumns = columns.filter((col) => col.key !== 'actions');
    const { headers, rows } = prepareTableData(news, exportColumns);
    exportToCSV({
      filename: 'haberler',
      headers,
      data: rows,
    });
    showToast('success', 'CSV dosyası indirildi.');
  };

  const handleExportExcel = async () => {
    try {
      const exportColumns = columns.filter((col) => col.key !== 'actions');
      const { headers, rows } = prepareTableData(news, exportColumns);
      await exportToExcel({
        filename: 'haberler',
        headers,
        data: rows,
      });
      showToast('success', 'Excel dosyası indirildi.');
    } catch (error: any) {
      showToast('error', 'Excel export hatası:', error.message);
    }
  };

  const columns: TableColumn<News>[] = [
    {
      key: 'title',
      header: 'Başlık',
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
              <Newspaper style={{ color: '#ffffff' }} size={24} />
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
            {row.summary && (
              <div style={{
                fontSize: '13px',
                color: '#64748b',
                maxWidth: '300px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {row.summary}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Kategori',
      render: (row) => {
        const categoryLabels: Record<string, string> = {
          haber: 'Haber',
          duyuru: 'Duyuru',
          etkinlik: 'Etkinlik',
          proje: 'Proje',
          basin: 'Basın',
        };
        const categoryColors: Record<string, { bg: string; border: string; color: string }> = {
          haber: { bg: '#eff6ff', border: '#bfdbfe', color: '#2563eb' },
          duyuru: { bg: '#fef3c7', border: '#fde68a', color: '#d97706' },
          etkinlik: { bg: '#ecfdf5', border: '#d1fae5', color: '#059669' },
          proje: { bg: '#f3e8ff', border: '#e9d5ff', color: '#7c3aed' },
          basin: { bg: '#fce7f3', border: '#fbcfe8', color: '#be185d' },
        };
        const label = categoryLabels[row.category] || 'Diğer';
        const colors = categoryColors[row.category] || { bg: '#f1f5f9', border: '#e2e8f0', color: '#64748b' };
        
        return (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 12px',
            backgroundColor: colors.bg,
            borderRadius: '8px',
            border: `1px solid ${colors.border}`,
          }}>
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: colors.color,
            }}>
              {label}
            </span>
          </div>
        );
      },
    },
    {
      key: 'published_at',
      header: 'Yayın Tarihi',
      render: (row) => (
        <span style={{
          fontSize: '14px',
          color: '#475569',
        }}>
          {row.published_at
            ? new Date(row.published_at).toLocaleDateString('tr-TR')
            : new Date(row.created_at).toLocaleDateString('tr-TR')}
        </span>
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
    showToast('error', 'Haberler yüklenirken bir hata oluştu.', error.message);
    return (
      <EmptyState
        title="Veriler Yüklenemedi"
        description="Haber listesi alınamadı. Lütfen daha sonra tekrar deneyin."
      />
    );
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
          Yeni Haber
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
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
              {createMutation.isPending || updateMutation.isPending ? 'Kaydediliyor...' : (selectedNews ? 'Güncelle' : 'Oluştur')}
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
          />
        </div>
      </Modal>
    </div>
  );
}
