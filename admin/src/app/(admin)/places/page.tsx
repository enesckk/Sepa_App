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
import { adminService, PlacesResponse } from '@/lib/services/admin';

interface Place {
  id: string;
  name: string;
  type: string;
  category?: string;
  address: string;
  phone?: string;
  image_url?: string;
  created_at: string;
}

export default function PlacesPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

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
        <div className="flex items-center">
          {row.image_url && (
            <img
              src={row.image_url}
              alt={row.name}
              className="w-12 h-12 rounded-lg object-cover mr-3"
            />
          )}
          <div>
            <div className="font-medium">{row.name}</div>
            {row.category && (
              <div className="text-sm text-text-secondary">{row.category}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tür',
      render: (row) => (
        <Badge variant="blue">
          {row.type === 'mosque'
            ? 'Cami'
            : row.type === 'pharmacy'
            ? 'Eczane'
            : row.type === 'facility'
            ? 'Tesis'
            : row.type === 'wedding'
            ? 'Nikah Salonu'
            : row.type === 'park'
            ? 'Park'
            : row.type === 'library'
            ? 'Kütüphane'
            : row.type === 'sports'
            ? 'Spor Tesisi'
            : row.type === 'cultural'
            ? 'Kültür Merkezi'
            : row.type === 'health'
            ? 'Sağlık Tesisi'
            : row.type === 'education'
            ? 'Eğitim Tesisi'
            : 'Diğer'}
        </Badge>
      ),
    },
    {
      key: 'address',
      header: 'Adres',
    },
    {
      key: 'phone',
      header: 'Telefon',
      render: (row) => <div>{row.phone || '-'}</div>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Şehir Rehberi</h1>
          <p className="text-text-secondary text-sm mt-1">
            Mekanları görüntüleyin ve yönetin.
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
    </div>
  );
}
