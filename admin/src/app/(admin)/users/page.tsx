'use client';

import { useEffect, useMemo, useState } from 'react';
import { Users as UsersIcon, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminService, UsersResponse } from '@/lib/services/admin';
import { Table, TableColumn } from '@/components/ui/Table';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/ToastProvider';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  mahalle: string | null;
  golbucks: number;
  role: 'user' | 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
}

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const { showToast } = useToast();

  const { data, isLoading, isError } = useQuery<UsersResponse>({
    queryKey: ['admin', 'users', search, role, status],
    queryFn: () =>
      adminService.getUsers({
        search,
        role,
        is_active: status || undefined,
        limit: 50,
        offset: 0,
      }),
  });

  useEffect(() => {
    if (isError) {
      showToast({
        variant: 'error',
        title: 'Hata',
        message: 'Kullanıcı listesi alınamadı',
      });
    }
  }, [isError, showToast]);

  const filteredUsers = useMemo(() => (data?.users as User[]) || [], [data]);

  const columns: TableColumn<User>[] = [
    {
      key: 'name',
      header: 'Kullanıcı',
      render: (user) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-medium">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-text">{user.name}</div>
            {user.phone && (
              <div className="text-sm text-text-secondary">{user.phone}</div>
            )}
          </div>
        </div>
      ),
    },
    { key: 'email', header: 'E-posta' },
    {
      key: 'golbucks',
      header: 'Gölbucks',
      render: (user) => (
        <span className="text-sm font-semibold text-green-600">
          {user.golbucks} ₺
        </span>
      ),
    },
    {
      key: 'role',
      header: 'Rol',
      render: (user) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-button ${
            user.role === 'admin' || user.role === 'super_admin'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {user.role === 'super_admin'
            ? 'Süper Admin'
            : user.role === 'admin'
            ? 'Admin'
            : 'Kullanıcı'}
        </span>
      ),
    },
    {
      key: 'is_active',
      header: 'Durum',
      render: (user) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-button ${
            user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {user.is_active ? 'Aktif' : 'Pasif'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'İşlemler',
      render: () => (
        <div className="text-sm">
          <button className="text-primary hover:text-primary-dark mr-4">Düzenle</button>
          <button className="text-error hover:text-red-700">Sil</button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-text">Kullanıcılar</h1>
      </div>

      {/* Search Bar */}
      <div className="bg-surface rounded-card shadow-card p-4 mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
          <input
            type="text"
            placeholder="Kullanıcı ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-input focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { label: 'Rol: Tümü', value: '' },
              { label: 'Kullanıcı', value: 'user' },
              { label: 'Admin', value: 'admin' },
              { label: 'Süper Admin', value: 'super_admin' },
            ]}
          />
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { label: 'Durum: Tümü', value: '' },
              { label: 'Aktif', value: 'true' },
              { label: 'Pasif', value: 'false' },
            ]}
          />
        </div>
      </div>

      {/* Users Table */}
      <Table<User>
        columns={columns}
        data={filteredUsers}
        loading={isLoading}
        emptyState={<EmptyState description="Kullanıcı bulunamadı" />}
      />

      {filteredUsers.length === 0 && !isLoading && (
        <div className="text-center py-12 text-text-secondary">Kullanıcı bulunamadı</div>
      )}
    </div>
  );
}

