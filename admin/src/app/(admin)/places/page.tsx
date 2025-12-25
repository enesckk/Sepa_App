'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/Input';
import { Table, TableColumn } from '@/components/ui/Table';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { FileUpload } from '@/components/ui/FileUpload';
import { useToast } from '@/components/ui/ToastProvider';
import { adminService, PlacesResponse } from '@/lib/services/admin';
import { Download, FileSpreadsheet, MapPin, Phone, Building2, Tag, Edit, Trash2, Plus } from 'lucide-react';
import { exportToCSV, exportToExcel, prepareTableData } from '@/lib/utils/export';

interface Place {
  id: string;
  name: string;
  type: string;
  category?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
  email?: string;
  working_hours?: string;
  image_url?: string;
  description?: string;
  created_at: string;
}

export default function PlacesPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: 'mosque',
    category: '',
    address: '',
    latitude: '',
    longitude: '',
    phone: '',
    website: '',
    email: '',
    working_hours: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    data: placesData,
    isLoading,
    isError,
    error,
  } = useQuery<PlacesResponse, Error>({
    queryKey: ['adminPlaces', search, typeFilter],
    queryFn: () =>
      adminService.getPlaces({
        search: search || undefined,
        type: typeFilter || undefined,
      }),
  });

  const places = placesData?.places || [];

  const createMutation = useMutation({
    mutationFn: (formDataToSend: FormData) => adminService.createPlace(formDataToSend),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPlaces'] });
      showToast('success', 'Mekan başarıyla oluşturuldu.');
      handleCloseModal();
    },
    onError: (error: any) => {
      showToast('error', 'Mekan oluşturulurken bir hata oluştu.', error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formDataToSend }: { id: string; formDataToSend: FormData }) =>
      adminService.updatePlace(id, formDataToSend),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPlaces'] });
      showToast('success', 'Mekan başarıyla güncellendi.');
      handleCloseModal();
    },
    onError: (error: any) => {
      showToast('error', 'Mekan güncellenirken bir hata oluştu.', error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deletePlace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPlaces'] });
      showToast('success', 'Mekan başarıyla silindi.');
    },
    onError: (error: any) => {
      showToast('error', 'Mekan silinirken bir hata oluştu.', error.message);
    },
  });

  const handleOpenModal = (place?: Place) => {
    if (place) {
      setSelectedPlace(place);
      setFormData({
        name: place.name,
        type: place.type,
        category: place.category || '',
        address: place.address,
        latitude: place.latitude?.toString() || '',
        longitude: place.longitude?.toString() || '',
        phone: place.phone || '',
        website: place.website || '',
        email: place.email || '',
        working_hours: place.working_hours || '',
        description: place.description || '',
      });
      setImagePreview(place.image_url || null);
    } else {
      setSelectedPlace(null);
      setFormData({
        name: '',
        type: 'mosque',
        category: '',
        address: '',
        latitude: '',
        longitude: '',
        phone: '',
        website: '',
        email: '',
        working_hours: '',
        description: '',
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedPlace(null);
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      name: '',
      type: 'mosque',
      category: '',
      address: '',
      latitude: '',
      longitude: '',
      phone: '',
      website: '',
      email: '',
      working_hours: '',
      description: '',
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.address) {
      showToast('error', 'Lütfen mekan adı ve adres ekleyin.');
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      showToast('error', 'Lütfen enlem ve boylam ekleyin.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('type', formData.type);
    if (formData.category) formDataToSend.append('category', formData.category);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('latitude', formData.latitude);
    formDataToSend.append('longitude', formData.longitude);
    if (formData.phone) formDataToSend.append('phone', formData.phone);
    if (formData.website) formDataToSend.append('website', formData.website);
    if (formData.email) formDataToSend.append('email', formData.email);
    if (formData.working_hours) formDataToSend.append('working_hours', formData.working_hours);
    if (formData.description) formDataToSend.append('description', formData.description);
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    } else if (imagePreview && selectedPlace) {
      formDataToSend.append('image_url', imagePreview);
    }

    if (selectedPlace) {
      updateMutation.mutate({ id: selectedPlace.id, formDataToSend });
    } else {
      createMutation.mutate(formDataToSend);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu mekanı silmek istediğinize emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  // Export functions
  const handleExportCSV = () => {
    const exportColumns = columns.filter((col) => col.key !== 'actions');
    const { headers, rows } = prepareTableData(places, exportColumns);
    exportToCSV({
      filename: 'sehir_rehberi',
      headers,
      data: rows,
    });
    showToast('success', 'CSV dosyası indirildi.');
  };

  const handleExportExcel = async () => {
    try {
      const exportColumns = columns.filter((col) => col.key !== 'actions');
      const { headers, rows } = prepareTableData(places, exportColumns);
      await exportToExcel({
        filename: 'sehir_rehberi',
        headers,
        data: rows,
      });
      showToast('success', 'Excel dosyası indirildi.');
    } catch (error: any) {
      showToast('error', 'Excel export hatası:', error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    showToast('error', 'Mekanlar yüklenirken bir hata oluştu.', error.message);
    return (
      <EmptyState
        title="Veriler Yüklenemedi"
        description="Mekan listesi alınamadı. Lütfen daha sonra tekrar deneyin."
      />
    );
  }

  const columns: TableColumn<Place>[] = [
    {
      key: 'name',
      header: 'Mekan',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {row.image_url ? (
            <img
              src={row.image_url}
              alt={row.name}
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
              <Building2 style={{ color: '#ffffff' }} size={24} />
            </div>
          )}
          <div>
            <div style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#0f172a',
              marginBottom: '4px',
            }}>
              {row.name}
            </div>
            {row.category && (
              <div style={{
                fontSize: '13px',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <Tag size={12} />
                {row.category}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tür',
      render: (row) => {
        const typeLabels: Record<string, string> = {
          mosque: 'Cami',
          pharmacy: 'Eczane',
          facility: 'Tesis',
          wedding: 'Nikah Salonu',
          park: 'Park',
          library: 'Kütüphane',
          sports: 'Spor Tesisi',
          cultural: 'Kültür Merkezi',
          health: 'Sağlık Tesisi',
          education: 'Eğitim Tesisi',
        };
        const typeColors: Record<string, { bg: string; border: string; color: string }> = {
          mosque: { bg: '#fef3c7', border: '#fde68a', color: '#d97706' },
          pharmacy: { bg: '#fce7f3', border: '#fbcfe8', color: '#be185d' },
          facility: { bg: '#eff6ff', border: '#bfdbfe', color: '#2563eb' },
          wedding: { bg: '#f3e8ff', border: '#e9d5ff', color: '#7c3aed' },
          park: { bg: '#ecfdf5', border: '#d1fae5', color: '#059669' },
          library: { bg: '#fef2f2', border: '#fecaca', color: '#dc2626' },
          sports: { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a' },
          cultural: { bg: '#fef3c7', border: '#fde68a', color: '#d97706' },
          health: { bg: '#fee2e2', border: '#fecaca', color: '#dc2626' },
          education: { bg: '#dbeafe', border: '#bfdbfe', color: '#2563eb' },
        };
        const label = typeLabels[row.type] || 'Diğer';
        const colors = typeColors[row.type] || { bg: '#f1f5f9', border: '#e2e8f0', color: '#64748b' };
        
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
      key: 'address',
      header: 'Adres',
      render: (row) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          maxWidth: '300px',
        }}>
          <MapPin style={{ color: '#64748b', flexShrink: 0 }} size={16} />
          <span style={{
            fontSize: '14px',
            color: '#475569',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {row.address}
          </span>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Telefon',
      render: (row) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          {row.phone ? (
            <>
              <Phone style={{ color: '#64748b' }} size={16} />
              <span style={{
                fontSize: '14px',
                color: '#475569',
              }}>
                {row.phone}
              </span>
            </>
          ) : (
            <span style={{
              fontSize: '14px',
              color: '#94a3b8',
            }}>
              -
            </span>
          )}
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

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '12px',
      }}>
        <button
          onClick={() => handleOpenModal()}
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
          <Plus size={16} />
          Yeni Mekan
        </button>
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
            value={typeFilter}
            onValueChange={setTypeFilter}
            options={[
              { label: 'Tür: Tümü', value: '' },
              { label: 'Cami', value: 'mosque' },
              { label: 'Eczane', value: 'pharmacy' },
              { label: 'Tesis', value: 'facility' },
              { label: 'Nikah Salonu', value: 'wedding' },
              { label: 'Park', value: 'park' },
              { label: 'Kütüphane', value: 'library' },
              { label: 'Spor Tesisi', value: 'sports' },
              { label: 'Kültür Merkezi', value: 'cultural' },
              { label: 'Sağlık Tesisi', value: 'health' },
              { label: 'Eğitim Tesisi', value: 'education' },
            ]}
          />
        </div>
      </div>

      <Table<Place>
        columns={columns}
        data={places}
        loading={isLoading}
        emptyState={<EmptyState description="Henüz mekan eklenmedi." />}
      />

      <Modal
        open={open}
        onClose={handleCloseModal}
        title={selectedPlace ? 'Mekan Düzenle' : 'Yeni Mekan'}
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
              {createMutation.isPending || updateMutation.isPending ? 'Kaydediliyor...' : (selectedPlace ? 'Güncelle' : 'Oluştur')}
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            label="Mekan Adı *"
            placeholder="Mekan adı"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Textarea
            label="Açıklama"
            placeholder="Kısa açıklama"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Input
            label="Adres *"
            placeholder="Tam adres"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            <Select
              label="Tür *"
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
              options={[
                { label: 'Cami', value: 'mosque' },
                { label: 'Eczane', value: 'pharmacy' },
                { label: 'Tesis', value: 'facility' },
                { label: 'Nikah Salonu', value: 'wedding' },
                { label: 'Park', value: 'park' },
                { label: 'Kütüphane', value: 'library' },
                { label: 'Spor Tesisi', value: 'sports' },
                { label: 'Kültür Merkezi', value: 'cultural' },
                { label: 'Sağlık Tesisi', value: 'health' },
                { label: 'Eğitim Tesisi', value: 'education' },
                { label: 'Diğer', value: 'other' },
              ]}
            />
            <Input
              label="Kategori"
              placeholder="Kategori"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            <Input
              label="Telefon"
              placeholder="0342 123 45 67"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Website"
              placeholder="https://example.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
            <Input
              label="E-posta"
              placeholder="info@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Çalışma Saatleri"
              placeholder="09:00-18:00"
              value={formData.working_hours}
              onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
            />
            <Input
              label="Enlem (Latitude) *"
              type="number"
              step="0.00000001"
              placeholder="37.0662"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            />
            <Input
              label="Boylam (Longitude) *"
              type="number"
              step="0.00000001"
              placeholder="37.3833"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
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
          />
        </div>
      </Modal>
    </div>
  );
}
