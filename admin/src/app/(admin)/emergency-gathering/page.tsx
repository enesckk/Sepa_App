'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/Input';
import { Table, TableColumn } from '@/components/ui/Table';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/ToastProvider';
import { adminService, EmergencyGatheringResponse } from '@/lib/services/admin';

interface EmergencyGathering {
  id: string;
  name: string;
  type: string;
  address: string;
  capacity?: number;
  contact_phone?: string;
  created_at: string;
}

export default function EmergencyGatheringPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

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
    },
    {
      key: 'type',
      header: 'Tür',
      render: (row) => (
        <Badge variant="blue">
          {row.type === 'open_area'
            ? 'Açık Alan'
            : row.type === 'building'
            ? 'Bina'
            : row.type === 'stadium'
            ? 'Stadyum'
            : row.type === 'park'
            ? 'Park'
            : row.type === 'school'
            ? 'Okul'
            : 'Diğer'}
        </Badge>
      ),
    },
    {
      key: 'address',
      header: 'Adres',
    },
    {
      key: 'capacity',
      header: 'Kapasite',
      render: (row) => <div>{row.capacity ? `${row.capacity} kişi` : '-'}</div>,
    },
    {
      key: 'contact_phone',
      header: 'İletişim',
      render: (row) => <div>{row.contact_phone || '-'}</div>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Afet Toplanma Alanları</h1>
          <p className="text-text-secondary text-sm mt-1">
            Toplanma alanlarını görüntüleyin ve yönetin.
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
}
