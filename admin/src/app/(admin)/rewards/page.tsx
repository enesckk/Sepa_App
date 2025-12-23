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
import { adminService, RewardsResponse } from '@/lib/services/admin';
import { Edit, Trash2 } from 'lucide-react';

interface Reward {
  id: string;
  title: string;
  description?: string;
  category: string;
  points: number;
  stock: number | null;
  validity_days?: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export default function RewardsPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'physical',
    points: '',
    stock: '',
    validity_days: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    data: rewardsData,
    isLoading,
    isError,
    error,
  } = useQuery<RewardsResponse, Error>({
    queryKey: ['adminRewards', search],
    queryFn: () => adminService.getRewards(),
  });

  const rewards = (rewardsData?.rewards || []).filter((reward) =>
    search ? reward.title.toLowerCase().includes(search.toLowerCase()) : true
  );

  const createMutation = useMutation({
    mutationFn: (formDataToSend: FormData) => adminService.createReward(formDataToSend),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRewards'] });
      showToast('success', 'Ödül başarıyla oluşturuldu.');
      handleCloseModal();
    },
    onError: (error: any) => {
      showToast('error', 'Ödül oluşturulurken bir hata oluştu.', error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formDataToSend }: { id: string; formDataToSend: FormData }) =>
      adminService.updateReward(id, formDataToSend),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRewards'] });
      showToast('success', 'Ödül başarıyla güncellendi.');
      handleCloseModal();
    },
    onError: (error: any) => {
      showToast('error', 'Ödül güncellenirken bir hata oluştu.', error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteReward(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRewards'] });
      showToast('success', 'Ödül başarıyla silindi.');
    },
    onError: (error: any) => {
      showToast('error', 'Ödül silinirken bir hata oluştu.', error.message);
    },
  });

  const handleOpenModal = (reward?: Reward) => {
    if (reward) {
      setSelectedReward(reward);
      setFormData({
        title: reward.title,
        description: reward.description || '',
        category: reward.category,
        points: reward.points.toString(),
        stock: reward.stock?.toString() || '',
        validity_days: reward.validity_days?.toString() || '',
      });
      setImagePreview(reward.image_url || null);
    } else {
      setSelectedReward(null);
      setFormData({
        title: '',
        description: '',
        category: 'physical',
        points: '',
        stock: '',
        validity_days: '',
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedReward(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.points) {
      showToast('error', 'Lütfen başlık ve puan ekleyin.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('points', formData.points);
    if (formData.stock) formDataToSend.append('stock', formData.stock);
    if (formData.validity_days) formDataToSend.append('validity_days', formData.validity_days);
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    } else if (imagePreview && selectedReward) {
      formDataToSend.append('image_url', imagePreview);
    }

    if (selectedReward) {
      updateMutation.mutate({ id: selectedReward.id, formDataToSend });
    } else {
      createMutation.mutate(formDataToSend);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu ödülü silmek istediğinize emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const columns: TableColumn<Reward>[] = [
    {
      key: 'title',
      header: 'Ödül',
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
            {row.description && (
              <div className="text-sm text-text-secondary line-clamp-1">{row.description}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'points',
      header: 'Puan',
      render: (row) => <span className="font-semibold text-green-600">{row.points} ₺</span>,
    },
    {
      key: 'stock',
      header: 'Stok',
      render: (row) => (row.stock === null ? 'Sınırsız' : row.stock),
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
    showToast('error', 'Ödüller yüklenirken bir hata oluştu.', error.message);
    return (
      <EmptyState
        title="Veriler Yüklenemedi"
        description="Ödül listesi alınamadı. Lütfen daha sonra tekrar deneyin."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Ödüller</h1>
          <p className="text-text-secondary text-sm mt-1">
            Ödül ve stok yönetimi.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>Yeni Ödül</Button>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4">
        <Input
          placeholder="Ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table<Reward>
        columns={columns}
        data={rewards}
        loading={isLoading}
        emptyState={<EmptyState description="Henüz ödül eklenmedi." />}
      />

      <Modal
        open={open}
        onClose={handleCloseModal}
        title={selectedReward ? 'Ödül Düzenle' : 'Yeni Ödül'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleCloseModal}>
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {selectedReward ? 'Güncelle' : 'Oluştur'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Başlık *"
            placeholder="Ödül adı"
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
            <Select
              label="Kategori"
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              options={[
                { label: 'Fiziksel', value: 'physical' },
                { label: 'Dijital', value: 'digital' },
                { label: 'Deneyim', value: 'experience' },
                { label: 'İndirim', value: 'discount' },
                { label: 'Partner', value: 'partner' },
                { label: 'Diğer', value: 'other' },
              ]}
            />
            <Input
              label="Puan *"
              type="number"
              placeholder="50"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: e.target.value })}
            />
            <Input
              label="Stok (boş bırak = sınırsız)"
              type="number"
              placeholder="10"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            />
            <Input
              label="Geçerlilik (gün) opsiyonel"
              type="number"
              placeholder="30"
              value={formData.validity_days}
              onChange={(e) => setFormData({ ...formData, validity_days: e.target.value })}
            />
          </div>
          <FileUpload
            label="Görsel"
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
