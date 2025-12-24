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
import { adminService, DashboardStats } from '@/lib/services/admin';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/ToastProvider';

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
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">Dashboard</h1>
        <p className="text-slate-600 text-lg">Yönetim paneli genel bakış</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {statCards.map((card) => {
          const Icon = card.icon;
          const colorClasses = {
            blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
            green: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
            orange: 'bg-gradient-to-br from-orange-500 to-orange-600',
            purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
          };
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-md border border-slate-200 p-8 hover:shadow-xl hover:border-slate-300 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-8">
                <div
                  className={`w-20 h-20 ${colorClasses[card.color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center shadow-md`}
                >
                  <Icon className="text-white" size={28} />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-slate-600 text-sm font-medium uppercase tracking-wide">{card.title}</h3>
                <p className="text-4xl font-bold text-slate-900">{card.value.toLocaleString()}</p>
                <p className="text-sm text-emerald-600 font-medium">{card.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-10 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <Users className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Kullanıcı İstatistikleri</h2>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center py-5 border-b border-slate-100">
              <span className="text-slate-600 font-medium text-base">Aktif Kullanıcılar</span>
              <span className="font-bold text-slate-900 text-2xl">{stats.users.active.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-5 border-b border-slate-100">
              <span className="text-slate-600 font-medium text-base">Bu Hafta Yeni</span>
              <span className="font-bold text-emerald-600 text-2xl">{stats.users.newThisWeek.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-5">
              <span className="text-slate-600 font-medium text-base">Bu Ay Yeni</span>
              <span className="font-bold text-emerald-600 text-2xl">{stats.users.newThisMonth.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-10 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <Calendar className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Etkinlik İstatistikleri</h2>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center py-5 border-b border-slate-100">
              <span className="text-slate-600 font-medium text-base">Toplam Etkinlik</span>
              <span className="font-bold text-slate-900 text-2xl">{stats.events.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-5">
              <span className="text-slate-600 font-medium text-base">Toplam Kayıt</span>
              <span className="font-bold text-emerald-600 text-2xl">{stats.events.totalRegistrations.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

