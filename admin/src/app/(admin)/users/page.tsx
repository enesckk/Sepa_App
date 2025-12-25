'use client';

import { useEffect, useMemo, useState } from 'react';
import { Users as UsersIcon, Search, Edit, Trash2, Download, FileSpreadsheet } from 'lucide-react';
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
import { exportToCSV, exportToExcel, prepareTableData } from '@/lib/utils/export';
import { BulkActions, type BulkAction } from '@/components/ui/BulkActions';
import { AdvancedFilters, type FilterOption } from '@/components/ui/AdvancedFilters';

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, any>>({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
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

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => adminService.deleteUser(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      showToast('success', `${selectedIds.length} kullanıcı başarıyla silindi.`);
      setSelectedIds([]);
    },
    onError: (error: any) => {
      showToast('error', 'Kullanıcılar silinirken bir hata oluştu.', error.message);
    },
  });

  const bulkActions: BulkAction[] = [
    {
      label: 'Seçilenleri Sil',
      icon: <Trash2 size={16} />,
      variant: 'danger',
      confirmMessage: '{count} kullanıcıyı silmek istediğinize emin misiniz?',
      action: async (ids: string[]) => {
        bulkDeleteMutation.mutate(ids);
      },
    },
  ];

  useEffect(() => {
    if (isError) {
      showToast('error', 'Kullanıcı listesi alınamadı');
    }
  }, [isError, showToast]);

  const filteredUsers = useMemo(() => {
    let users = (data?.users as User[]) || [];
    
    // Apply advanced filters
    if (advancedFilters.golbucks_min) {
      users = users.filter((u) => u.golbucks >= Number(advancedFilters.golbucks_min));
    }
    if (advancedFilters.golbucks_max) {
      users = users.filter((u) => u.golbucks <= Number(advancedFilters.golbucks_max));
    }
    if (advancedFilters.created_at_start) {
      users = users.filter((u) => new Date(u.created_at) >= new Date(advancedFilters.created_at_start));
    }
    if (advancedFilters.created_at_end) {
      users = users.filter((u) => new Date(u.created_at) <= new Date(advancedFilters.created_at_end));
    }
    if (advancedFilters.mahalle) {
      users = users.filter((u) => u.mahalle?.toLowerCase().includes(advancedFilters.mahalle.toLowerCase()));
    }
    
    return users;
  }, [data, advancedFilters]);

  const filterOptions: FilterOption[] = [
    {
      key: 'mahalle',
      label: 'Mahalle',
      type: 'text',
      placeholder: 'Mahalle ara...',
    },
    {
      key: 'golbucks',
      label: 'Gölbucks',
      type: 'numberRange',
    },
    {
      key: 'created_at',
      label: 'Kayıt Tarihi',
      type: 'dateRange',
    },
  ];

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
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id);
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  // Export functions
  const handleExportCSV = () => {
    const exportColumns = columns.filter((col) => col.key !== 'actions');
    const { headers, rows } = prepareTableData(filteredUsers, exportColumns);
    exportToCSV({
      filename: 'kullanicilar',
      headers,
      data: rows,
    });
    showToast('success', 'CSV dosyası indirildi.');
  };

  const handleExportExcel = async () => {
    try {
      const exportColumns = columns.filter((col) => col.key !== 'actions');
      const { headers, rows } = prepareTableData(filteredUsers, exportColumns);
      await exportToExcel({
        filename: 'kullanicilar',
        headers,
        data: rows,
      });
      showToast('success', 'Excel dosyası indirildi.');
    } catch (error: any) {
      showToast('error', 'Excel export hatası:', error.message);
    }
  };

  const columns: TableColumn<User>[] = [
    {
      key: 'name',
      header: 'Kullanıcı',
      render: (user) => {
        const initials = user.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.15)',
              flexShrink: 0,
            }}>
              <span style={{
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}>
                {initials}
              </span>
            </div>
            <div>
              <div style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#0f172a',
                marginBottom: '4px',
              }}>
                {user.name}
              </div>
              {user.phone && (
                <div style={{
                  fontSize: '13px',
                  color: '#64748b',
                }}>
                  {user.phone}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'email',
      header: 'E-posta',
      render: (user) => (
        <span style={{
          fontSize: '14px',
          color: '#475569',
        }}>
          {user.email}
        </span>
      ),
    },
    {
      key: 'golbucks',
      header: 'Gölbucks',
      render: (user) => (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          backgroundColor: '#ecfdf5',
          borderRadius: '8px',
          border: '1px solid #d1fae5',
        }}>
          <span style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#059669',
          }}>
            {user.golbucks} ₺
          </span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rol',
      render: (user) => {
        const roleConfig = {
          super_admin: { label: 'Süper Admin', color: '#7c3aed', bg: '#f3e8ff', border: '#e9d5ff' },
          admin: { label: 'Admin', color: '#8b5cf6', bg: '#f5f3ff', border: '#e9d5ff' },
          user: { label: 'Kullanıcı', color: '#10b981', bg: '#ecfdf5', border: '#d1fae5' },
        };
        const config = roleConfig[user.role] || roleConfig.user;
        return (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 12px',
            backgroundColor: config.bg,
            borderRadius: '8px',
            border: `1px solid ${config.border}`,
          }}>
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: config.color,
            }}>
              {config.label}
            </span>
          </div>
        );
      },
    },
    {
      key: 'is_active',
      header: 'Durum',
      render: (user) => (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '6px 12px',
          backgroundColor: user.is_active ? '#ecfdf5' : '#fef2f2',
          borderRadius: '8px',
          border: `1px solid ${user.is_active ? '#d1fae5' : '#fecaca'}`,
        }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 600,
            color: user.is_active ? '#059669' : '#dc2626',
          }}>
            {user.is_active ? 'Aktif' : 'Pasif'}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'İşlemler',
      render: (user) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => handleOpenModal(user)}
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
            onClick={() => handleDelete(user)}
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
    return <LoadingSpinner />;
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: '24px',
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
          CSV İndir
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
          Excel İndir
        </button>
      </div>

      {/* Search Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #d1fae5',
        padding: '24px',
        marginBottom: '24px',
        background: 'linear-gradient(to bottom, #ffffff, #f0fdf4)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#10b981',
            }} size={20} />
            <input
              type="text"
              placeholder="Kullanıcı ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '46px',
                paddingRight: '16px',
                paddingTop: '14px',
                paddingBottom: '14px',
                border: '2px solid #d1fae5',
                borderRadius: '12px',
                outline: 'none',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981';
                e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)';
                e.target.style.backgroundColor = '#f0fdf4';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1fae5';
                e.target.style.boxShadow = 'none';
                e.target.style.backgroundColor = '#ffffff';
              }}
            />
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}>
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
      </div>

      {/* Advanced Filters */}
      <div style={{ marginBottom: '24px' }}>
        <AdvancedFilters
          filters={filterOptions}
          values={advancedFilters}
          onChange={setAdvancedFilters}
          onReset={() => setAdvancedFilters({})}
        />
      </div>

      {/* Users Table */}
      <Table<User>
        columns={columns}
        data={filteredUsers}
        loading={isLoading}
        emptyState={<EmptyState description="Kullanıcı bulunamadı" />}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedIds={selectedIds}
        actions={bulkActions}
        onClearSelection={() => setSelectedIds([])}
        totalCount={filteredUsers.length}
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
