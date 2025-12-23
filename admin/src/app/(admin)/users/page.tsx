'use client';

import { useEffect, useMemo, useState } from 'react';
import { Users as UsersIcon, Search, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, UsersResponse } from '@/lib/services/admin';
import { Table, TableColumn } from '@/components/ui/Table';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    mahalle: '',
    golbucks: '0',
    role: 'user' as 'user' | 'admin' | 'super_admin',
    is_active: true,
  });

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

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      showToast('success', 'Kullanıcı başarıyla güncellendi.');
      handleCloseModal();
    },
    onError: (error: any) => {
      showToast('error', 'Kullanıcı güncellenirken bir hata oluştu.', error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      showToast('success', 'Kullanıcı başarıyla silindi.');
    },
    onError: (error: any) => {
      showToast('error', 'Kullanıcı silinirken bir hata oluştu.', error.message);
    },
  });

  useEffect(() => {
    if (isError) {
      showToast('error', 'Kullanıcı listesi alınamadı');
    }
  }, [isError, showToast]);

  const filteredUsers = useMemo(() => (data?.users as User[]) || [], [data]);

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      mahalle: user.mahalle || '',
      golbucks: user.golbucks.toString(),
      role: user.role,
      is_active: user.is_active,
    });
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      mahalle: '',
      golbucks: '0',
      role: 'user',
      is_active: true,
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      showToast('error', 'Lütfen ad ve e-posta alanlarını doldurun.');
      return;
    }

    if (!selectedUser) {
      return;
    }

    const updateData: any = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      mahalle: formData.mahalle || null,
      golbucks: parseInt(formData.golbucks),
      role: formData.role,
      is_active: formData.is_active,
    };

    updateMutation.mutate({ id: selectedUser.id, data: updateData });
  };

  const handleDelete = (user: User) => {
    if (
      confirm(
        `"${user.name}" adlı kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`
      )
    ) {
      deleteMutation.mutate(user.id);
    }
  };

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
        <Badge
          variant={
            user.role === 'admin' || user.role === 'super_admin' ? 'purple' : 'blue'
          }
        >
          {user.role === 'super_admin'
            ? 'Süper Admin'
            : user.role === 'admin'
            ? 'Admin'
            : 'Kullanıcı'}
        </Badge>
      ),
    },
    {
      key: 'is_active',
      header: 'Durum',
      render: (user) => (
        <Badge variant={user.is_active ? 'success' : 'error'}>
          {user.is_active ? 'Aktif' : 'Pasif'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'İşlemler',
      render: (user) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(user)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="dangerGhost" size="sm" onClick={() => handleDelete(user)}>
            <Trash2 className="w-4 h-4" />
          </Button>
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
            onValueChange={setRole}
            options={[
              { label: 'Rol: Tümü', value: '' },
              { label: 'Kullanıcı', value: 'user' },
              { label: 'Admin', value: 'admin' },
              { label: 'Süper Admin', value: 'super_admin' },
            ]}
          />
          <Select
            value={status}
            onValueChange={setStatus}
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

      {/* Edit Modal */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        title={`Kullanıcı Düzenle - ${selectedUser?.name}`}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleCloseModal}>
              İptal
            </Button>
            <Button onClick={handleSubmit} loading={updateMutation.isPending}>
              Kaydet
            </Button>
          </div>
        }
      >
        {selectedUser && (
          <div className="space-y-4">
            <Input
              label="Ad Soyad *"
              placeholder="Kullanıcı adı"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="E-posta *"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Telefon"
              placeholder="+90 5XX XXX XX XX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Mahalle"
              placeholder="Mahalle adı"
              value={formData.mahalle}
              onChange={(e) => setFormData({ ...formData, mahalle: e.target.value })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Gölbucks"
                type="number"
                placeholder="0"
                value={formData.golbucks}
                onChange={(e) => setFormData({ ...formData, golbucks: e.target.value })}
              />
              <Select
                label="Rol"
                value={formData.role}
                onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                options={[
                  { label: 'Kullanıcı', value: 'user' },
                  { label: 'Admin', value: 'admin' },
                  { label: 'Süper Admin', value: 'super_admin' },
                ]}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="is_active" className="text-sm text-text">
                Aktif kullanıcı
              </label>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
