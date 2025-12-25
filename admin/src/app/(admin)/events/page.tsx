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
import { adminService, EventsResponse } from '@/lib/services/admin';
import { Calendar, Users, Edit, Trash2, Eye, Download, FileSpreadsheet } from 'lucide-react';
import { exportToCSV, exportToExcel, prepareTableData } from '@/lib/utils/export';

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location: string;
  category?: string;
  is_active: boolean;
  capacity?: number;
  registered: number;
  is_free: boolean;
  price?: number;
  golbucks_reward: number;
  image_url?: string;
  created_at: string;
}

export default function EventsPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [viewRegistrationsOpen, setViewRegistrationsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    latitude: '',
    longitude: '',
    category: '',
    is_free: 'true',
    price: '',
    capacity: '',
    golbucks_reward: '0',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch events
  const {
    data: eventsData,
    isLoading,
    isError,
    error,
  } = useQuery<EventsResponse, Error>({
    queryKey: ['adminEvents', page, limit, search, categoryFilter, statusFilter],
    queryFn: () =>
      adminService.getEvents({
        limit,
        offset: (page - 1) * limit,
        search: search || undefined,
        category: categoryFilter || undefined,
        is_active: statusFilter === 'true' ? true : statusFilter === 'false' ? false : undefined,
      }),
  });

  const events = eventsData?.events || [];
  const totalEvents = eventsData?.total || 0;
  const totalPages = Math.ceil(totalEvents / limit);

  // Create event mutation
  const createMutation = useMutation({
    mutationFn: (formDataToSend: FormData) => adminService.createEvent(formDataToSend),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      showToast('success', 'Etkinlik başarıyla oluşturuldu.');
      handleCloseModal();
    },
    onError: (error: any) => {
      showToast('error', 'Etkinlik oluşturulurken bir hata oluştu.', error.message);
    },
  });

  // Update event mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, formDataToSend }: { id: string; formDataToSend: FormData }) =>
      adminService.updateEvent(id, formDataToSend),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      showToast('success', 'Etkinlik başarıyla güncellendi.');
      handleCloseModal();
    },
    onError: (error: any) => {
      showToast('error', 'Etkinlik güncellenirken bir hata oluştu.', error.message);
    },
  });

  // Delete event mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      showToast('success', 'Etkinlik başarıyla silindi.');
    },
    onError: (error: any) => {
      showToast('error', 'Etkinlik silinirken bir hata oluştu.', error.message);
    },
  });

  // Fetch event registrations
  const { data: registrationsData, isLoading: isLoadingRegistrations } = useQuery<{ registrations: any[] }>({
    queryKey: ['eventRegistrations', selectedEvent?.id],
    queryFn: async () => {
      const response = await adminService.getEventRegistrations(selectedEvent!.id);
      return response as { registrations: any[] };
    },
    enabled: !!selectedEvent && viewRegistrationsOpen,
  });

  const handleOpenModal = (event?: Event) => {
    if (event) {
      setSelectedEvent(event);
      setFormData({
        title: event.title,
        description: event.description || '',
        date: event.date,
        time: event.time || '',
        location: event.location,
        latitude: '',
        longitude: '',
        category: event.category || '',
        is_free: event.is_free ? 'true' : 'false',
        price: event.price?.toString() || '',
        capacity: event.capacity?.toString() || '',
        golbucks_reward: event.golbucks_reward.toString(),
      });
      setImagePreview(event.image_url || null);
    } else {
      setSelectedEvent(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        latitude: '',
        longitude: '',
        category: '',
        is_free: 'true',
        price: '',
        capacity: '',
        golbucks_reward: '0',
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedEvent(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.date || !formData.location) {
      showToast('error', 'Lütfen zorunlu alanları doldurun.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('date', formData.date);
    formDataToSend.append('time', formData.time);
    formDataToSend.append('location', formData.location);
    if (formData.latitude) formDataToSend.append('latitude', formData.latitude);
    if (formData.longitude) formDataToSend.append('longitude', formData.longitude);
    if (formData.category) formDataToSend.append('category', formData.category);
    formDataToSend.append('is_free', formData.is_free);
    if (formData.price) formDataToSend.append('price', formData.price);
    if (formData.capacity) formDataToSend.append('capacity', formData.capacity);
    formDataToSend.append('golbucks_reward', formData.golbucks_reward);
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    if (selectedEvent) {
      updateMutation.mutate({ id: selectedEvent.id, formDataToSend });
    } else {
      createMutation.mutate(formDataToSend);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewRegistrations = (event: Event) => {
    setSelectedEvent(event);
    setViewRegistrationsOpen(true);
  };

  const columns: TableColumn<Event>[] = [
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
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                objectFit: 'cover',
                marginRight: '12px',
                border: '1px solid #e2e8f0',
              }}
            />
          ) : (
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.15)',
            }}>
              <Calendar style={{ color: '#ffffff' }} size={20} />
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
            {row.category && (
              <div style={{
                fontSize: '13px',
                color: '#64748b',
              }}>
                {row.category}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Tarih',
      render: (row) => (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            color: '#0f172a',
            marginBottom: '4px',
          }}>
            <Calendar style={{ color: '#10b981', marginRight: '6px' }} size={16} />
            {new Date(row.date).toLocaleDateString('tr-TR')}
          </div>
          {row.time && (
            <div style={{
              fontSize: '12px',
              color: '#64748b',
            }}>
              {row.time}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Konum',
      render: (row) => (
        <span style={{
          fontSize: '14px',
          color: '#475569',
        }}>
          {row.location}
        </span>
      ),
    },
    {
      key: 'registered',
      header: 'Kayıt',
      render: (row) => (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          backgroundColor: '#ecfdf5',
          borderRadius: '8px',
          border: '1px solid #d1fae5',
        }}>
          <Users style={{ color: '#10b981' }} size={16} />
          <span style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#059669',
          }}>
            {row.registered} / {row.capacity || '∞'}
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
            onClick={() => handleViewRegistrations(row)}
            title="Kayıtları Görüntüle"
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              color: '#3b82f6',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#dbeafe';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#eff6ff';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Eye size={16} />
          </button>
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

  // Export functions
  const handleExportCSV = () => {
    const exportColumns = columns.filter((col) => col.key !== 'actions');
    const { headers, rows } = prepareTableData(events, exportColumns);
    exportToCSV({
      filename: 'etkinlikler',
      headers,
      data: rows,
    });
    showToast('success', 'CSV dosyası indirildi.');
  };

  const handleExportExcel = async () => {
    try {
      const exportColumns = columns.filter((col) => col.key !== 'actions');
      const { headers, rows } = prepareTableData(events, exportColumns);
      await exportToExcel({
        filename: 'etkinlikler',
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
    showToast('error', 'Etkinlikler yüklenirken bir hata oluştu.', error.message);
    return (
      <EmptyState
        title="Veriler Yüklenemedi"
        description="Etkinlik listesi alınamadı. Lütfen daha sonra tekrar deneyin."
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
          Yeni Etkinlik
        </button>
      </div>

      {/* Filters */}
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
              { label: 'Tüm Kategoriler', value: '' },
              { label: 'Kültür', value: 'kultur' },
              { label: 'Spor', value: 'spor' },
              { label: 'Eğitim', value: 'egitim' },
              { label: 'Sosyal', value: 'sosyal' },
            ]}
          />
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
            options={[
              { label: 'Durum: Tümü', value: '' },
              { label: 'Aktif', value: 'true' },
              { label: 'Pasif', value: 'false' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <Table<Event>
        columns={columns}
        data={events}
        loading={isLoading}
        emptyState={<EmptyState description="Henüz etkinlik eklenmedi." />}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          onPageChange: setPage,
        }}
      />

      {/* Create/Edit Modal */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        title={selectedEvent ? 'Etkinlik Düzenle' : 'Yeni Etkinlik'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleCloseModal}>
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {selectedEvent ? 'Güncelle' : 'Oluştur'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Başlık *"
            placeholder="Etkinlik başlığı"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Textarea
            label="Açıklama"
            placeholder="Etkinlik açıklaması"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tarih *"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <Input
              label="Saat"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
            <Input
              label="Konum *"
              placeholder="Şehitkamil Kongre ve Kültür Merkezi"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Select
              label="Kategori"
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              options={[
                { label: 'Kategori Seçin', value: '' },
                { label: 'Kültür', value: 'kultur' },
                { label: 'Spor', value: 'spor' },
                { label: 'Eğitim', value: 'egitim' },
                { label: 'Sosyal', value: 'sosyal' },
              ]}
            />
            <Input
              label="Enlem (Latitude)"
              type="number"
              step="any"
              placeholder="37.1234"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            />
            <Input
              label="Boylam (Longitude)"
              type="number"
              step="any"
              placeholder="37.1234"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            />
            <Select
              label="Ücretsiz mi?"
              value={formData.is_free}
              onValueChange={(value) => setFormData({ ...formData, is_free: value })}
              options={[
                { label: 'Evet', value: 'true' },
                { label: 'Hayır', value: 'false' },
              ]}
            />
            {formData.is_free === 'false' && (
              <Input
                label="Fiyat (₺)"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            )}
            <Input
              label="Kapasite"
              type="number"
              placeholder="100"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            />
            <Input
              label="Gölbucks Ödülü"
              type="number"
              placeholder="0"
              value={formData.golbucks_reward}
              onChange={(e) => setFormData({ ...formData, golbucks_reward: e.target.value })}
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

      {/* Registrations Modal */}
      <Modal
        open={viewRegistrationsOpen}
        onClose={() => {
          setViewRegistrationsOpen(false);
          setSelectedEvent(null);
        }}
        title={`${selectedEvent?.title} - Kayıtlar`}
        footer={
          <Button variant="secondary" onClick={() => setViewRegistrationsOpen(false)}>
            Kapat
          </Button>
        }
      >
        {isLoadingRegistrations ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-2">
            {registrationsData?.registrations && registrationsData.registrations.length > 0 ? (
              registrationsData.registrations.map((reg: any) => (
                <div
                  key={reg.id}
                  className="p-3 bg-background rounded-lg flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{reg.user?.name || 'Bilinmeyen'}</div>
                    <div className="text-sm text-text-secondary">{reg.user?.email}</div>
                  </div>
                  <Badge variant={reg.status === 'registered' ? 'success' : 'warning'}>
                    {reg.status === 'registered'
                      ? 'Kayıtlı'
                      : reg.status === 'cancelled'
                      ? 'İptal'
                      : reg.status === 'attended'
                      ? 'Katıldı'
                      : 'Gelmedi'}
                  </Badge>
                </div>
              ))
            ) : (
              <EmptyState description="Henüz kayıt yok." />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
