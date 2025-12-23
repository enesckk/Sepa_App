'use client';

import { useEffect } from 'react';
import {
  Users,
  Calendar,
  FileText,
  Gift,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/lib/services/admin';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/ToastProvider';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  events: {
    total: number;
    active: number;
    totalRegistrations: number;
    eventsToday: number;
  };
  applications: {
    total: number;
    pending: number;
    resolved: number;
    newToday: number;
  };
  golbucks: {
    totalTransactions: number;
    totalDistributed: number;
    totalRedeemed: number;
  };
}

export default function DashboardPage() {
  const { showToast } = useToast();

  const { data, isLoading, isError } = useQuery<DashboardStats>({
    queryKey: ['admin', 'dashboard-stats'],
    queryFn: () => adminService.getDashboardStats(),
  });

  useEffect(() => {
    if (isError) {
      showToast({
        variant: 'error',
        title: 'Hata',
        message: 'Dashboard verileri alınamadı',
      });
    }
  }, [isError, showToast]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!data) {
    return <EmptyState title="Veri yok" description="Dashboard verisi alınamadı." />;
  }

  const stats = data;

  const statCards = [
    {
      title: 'Toplam Kullanıcı',
      value: stats.users.total,
      change: `+${stats.users.newToday} bugün`,
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Aktif Etkinlikler',
      value: stats.events.active,
      change: `${stats.events.eventsToday} bugün`,
      icon: Calendar,
      color: 'green',
    },
    {
      title: 'Bekleyen Başvurular',
      value: stats.applications.pending,
      change: `+${stats.applications.newToday} bugün`,
      icon: FileText,
      color: 'orange',
    },
    {
      title: 'Dağıtılan Gölbucks',
      value: stats.golbucks.totalDistributed,
      change: `${stats.golbucks.totalTransactions} işlem`,
      icon: Gift,
      color: 'purple',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          const colorClasses = {
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            orange: 'bg-orange-500',
            purple: 'bg-purple-500',
          };
          return (
            <div
              key={card.title}
              className="bg-surface rounded-card shadow-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${colorClasses[card.color as keyof typeof colorClasses]} rounded-button flex items-center justify-center`}
                >
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-text-secondary text-sm mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-text mb-2">{card.value}</p>
              <p className="text-sm text-text-secondary">{card.change}</p>
            </div>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-card shadow-card p-6">
          <h2 className="text-xl font-bold text-text mb-4">Kullanıcı İstatistikleri</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Aktif Kullanıcılar</span>
              <span className="font-semibold">{stats.users.active}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Bu Hafta Yeni</span>
              <span className="font-semibold">{stats.users.newThisWeek}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Bu Ay Yeni</span>
              <span className="font-semibold">{stats.users.newThisMonth}</span>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-card shadow-card p-6">
          <h2 className="text-xl font-bold text-text mb-4">Etkinlik İstatistikleri</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Toplam Etkinlik</span>
              <span className="font-semibold">{stats.events.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Toplam Kayıt</span>
              <span className="font-semibold">{stats.events.totalRegistrations}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

