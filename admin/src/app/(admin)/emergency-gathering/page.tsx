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
import { useToast } from '@/components/ui/ToastProvider';
import { adminService, EmergencyGatheringResponse } from '@/lib/services/admin';
import { Download, FileSpreadsheet, MapPin, Phone, Users, AlertTriangle, Edit, Trash2, Plus } from 'lucide-react';
import { exportToCSV, exportToExcel, prepareTableData } from '@/lib/utils/export';

interface EmergencyGathering {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  contact_phone?: string;
  description?: string;
  facilities?: string[];
  is_active?: boolean;
  created_at: string;
}

export default function EmergencyGatheringPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<EmergencyGathering | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: 'open_area',
    address: '',
    latitude: '',
    longitude: '',
    capacity: '',
    contact_phone: '',
    description: '',
    facilities: [] as string[],
  });

  const {
    data: areasData,
    isLoading,
    isError,
    error,
  } = useQuery<EmergencyGatheringResponse, Error>({
    queryKey: ['adminEmergencyGathering', search, typeFilter],
    queryFn: () =>
      adminService.getEmergencyGatheringAreas({
        search: search || undefined,
        type: typeFilter || undefined,
      }),
  });

  const areas = areasData?.areas || [];

  const createMutation = useMutation({
    mutationFn: (data: any) => adminService.createEmergencyGathering(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEmergencyGathering'] });
      showToast('success', 'Toplanma alanı başarıyla oluşturuldu.');
      handleCloseModal();
    },
    onError: (error: any) => {
      showToast('error', 'Toplanma alanı oluşturulurken bir hata oluştu.', error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminService.updateEmergencyGathering(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEmergencyGathering'] });
      showToast('success', 'Toplanma alanı başarıyla güncellendi.');
      handleCloseModal();
    },
    onError: (error: any) => {
      showToast('error', 'Toplanma alanı güncellenirken bir hata oluştu.', error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteEmergencyGathering(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEmergencyGathering'] });
      showToast('success', 'Toplanma alanı başarıyla silindi.');
    },
    onError: (error: any) => {
      showToast('error', 'Toplanma alanı silinirken bir hata oluştu.', error.message);
    },
  });

  const handleOpenModal = (area?: EmergencyGathering) => {
    if (area) {
      setSelectedArea(area);
      setFormData({
        name: area.name,
        type: area.type,
        address: area.address,
        latitude: area.latitude?.toString() || '',
        longitude: area.longitude?.toString() || '',
        capacity: area.capacity?.toString() || '',
        contact_phone: area.contact_phone || '',
        description: area.description || '',
        facilities: area.facilities || [],
      });
    } else {
      setSelectedArea(null);
      setFormData({
        name: '',
        type: 'open_area',
        address: '',
        latitude: '',
        longitude: '',
        capacity: '',
        contact_phone: '',
        description: '',
        facilities: [],
      });
    }
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedArea(null);
    setFormData({
      name: '',
      type: 'open_area',
      address: '',
      latitude: '',
      longitude: '',
      capacity: '',
      contact_phone: '',
      description: '',
      facilities: [],
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.address) {
      showToast('error', 'Lütfen alan adı ve adres ekleyin.');
      return;
    }

    const payload: any = {
      name: formData.name,
      type: formData.type,
      address: formData.address,
      description: formData.description,
      facilities: formData.facilities,
    };

    if (formData.latitude) payload.latitude = parseFloat(formData.latitude);
    if (formData.longitude) payload.longitude = parseFloat(formData.longitude);
    if (formData.capacity) payload.capacity = parseInt(formData.capacity);
    if (formData.contact_phone) payload.contact_phone = formData.contact_phone;

    if (selectedArea) {
      updateMutation.mutate({ id: selectedArea.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu toplanma alanını silmek istediğinize emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  // Export functions
  const handleExportCSV = () => {
    const exportColumns = columns.filter((col) => col.key !== 'actions');
    const { headers, rows } = prepareTableData(areas, exportColumns);
    exportToCSV({
      filename: 'afet_toplanma',
      headers,
      data: rows,
    });
    showToast('success', 'CSV dosyası indirildi.');
  };

  const handleExportExcel = async () => {
    try {
      const exportColumns = columns.filter((col) => col.key !== 'actions');
      const { headers, rows } = prepareTableData(areas, exportColumns);
      await exportToExcel({
        filename: 'afet_toplanma',
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
    showToast('error', 'Toplanma alanları yüklenirken bir hata oluştu.', error.message);
    return (
      <EmptyState
        title="Veriler Yüklenemedi"
        description="Toplanma alanı listesi alınamadı. Lütfen daha sonra tekrar deneyin."
      />
    );
  }

  const columns: TableColumn<EmergencyGathering>[] = [
    {
      key: 'name',
      header: 'Alan Adı',
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
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(239, 68, 68, 0.15)',
            flexShrink: 0,
          }}>
            <AlertTriangle style={{ color: '#ffffff' }} size={20} />
          </div>
          <div>
            <div style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#0f172a',
            }}>
              {row.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tür',
      render: (row) => {
        const typeLabels: Record<string, string> = {
          open_area: 'Açık Alan',
          building: 'Bina',
          stadium: 'Stadyum',
          park: 'Park',
          school: 'Okul',
        };
        const typeColors: Record<string, { bg: string; border: string; color: string }> = {
          open_area: { bg: '#fef3c7', border: '#fde68a', color: '#d97706' },
          building: { bg: '#eff6ff', border: '#bfdbfe', color: '#2563eb' },
          stadium: { bg: '#ecfdf5', border: '#d1fae5', color: '#059669' },
          park: { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a' },
          school: { bg: '#f3e8ff', border: '#e9d5ff', color: '#7c3aed' },
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
      key: 'capacity',
      header: 'Kapasite',
      render: (row) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          {row.capacity ? (
            <>
              <Users style={{ color: '#64748b' }} size={16} />
              <span style={{
                fontSize: '14px',
                color: '#475569',
                fontWeight: 600,
              }}>
                {row.capacity} kişi
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
      key: 'contact_phone',
      header: 'İletişim',
      render: (row) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          {row.contact_phone ? (
            <>
              <Phone style={{ color: '#64748b' }} size={16} />
              <span style={{
                fontSize: '14px',
                color: '#475569',
              }}>
                {row.contact_phone}
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
          Yeni Toplanma Alanı
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
              { label: 'Açık Alan', value: 'open_area' },
              { label: 'Bina', value: 'building' },
              { label: 'Park', value: 'park' },
              { label: 'Okul', value: 'school' },
              { label: 'Stadyum', value: 'stadium' },
            ]}
          />
        </div>
      </div>

      <Table<EmergencyGathering>
        columns={columns}
        data={areas}
        loading={isLoading}
        emptyState={<EmptyState description="Henüz kayıt yok." />}
      />

      <Modal
        open={open}
        onClose={handleCloseModal}
        title={selectedArea ? 'Toplanma Alanı Düzenle' : 'Yeni Toplanma Alanı'}
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
              {createMutation.isPending || updateMutation.isPending ? 'Kaydediliyor...' : (selectedArea ? 'Güncelle' : 'Oluştur')}
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            label="Alan Adı *"
            placeholder="Toplanma alanı adı"
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
                { label: 'Açık Alan', value: 'open_area' },
                { label: 'Bina', value: 'building' },
                { label: 'Stadyum', value: 'stadium' },
                { label: 'Park', value: 'park' },
                { label: 'Okul', value: 'school' },
                { label: 'Diğer', value: 'other' },
              ]}
            />
            <Input
              label="Kapasite"
              type="number"
              placeholder="5000"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            />
            <Input
              label="İletişim Telefonu"
              placeholder="0342 111 22 33"
              value={formData.contact_phone}
              onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
            />
            <Input
              label="Enlem (Latitude)"
              type="number"
              step="0.00000001"
              placeholder="37.0662"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            />
            <Input
              label="Boylam (Longitude)"
              type="number"
              step="0.00000001"
              placeholder="37.3833"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
