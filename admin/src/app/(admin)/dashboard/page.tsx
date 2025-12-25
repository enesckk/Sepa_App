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

  const colorStyles = {
    blue: { gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
    green: { gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    orange: { gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
    purple: { gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
        marginBottom: '32px',
      }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          const colorStyle = colorStyles[card.color as keyof typeof colorStyles];
          return (
            <div
              key={card.title}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
                padding: '24px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    background: colorStyle.gradient,
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <Icon style={{ color: '#ffffff' }} size={28} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{
                  color: '#64748b',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  margin: 0,
                }}>
                  {card.title}
                </h3>
                <p style={{
                  fontSize: '36px',
                  fontWeight: 700,
                  color: '#0f172a',
                  margin: 0,
                  lineHeight: 1.2,
                }}>
                  {card.value.toLocaleString()}
                </p>
                <p style={{
                  fontSize: '13px',
                  color: '#10b981',
                  fontWeight: 600,
                  margin: 0,
                }}>
                  {card.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
      }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            padding: '32px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '28px',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              flexShrink: 0,
            }}>
              <Users style={{ color: '#ffffff' }} size={24} />
            </div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
            }}>
              Kullanıcı İstatistikleri
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0',
              borderBottom: '1px solid #f1f5f9',
            }}>
              <span style={{
                color: '#64748b',
                fontWeight: 500,
                fontSize: '15px',
              }}>
                Aktif Kullanıcılar
              </span>
              <span style={{
                fontWeight: 700,
                color: '#0f172a',
                fontSize: '24px',
              }}>
                {stats.users.active.toLocaleString()}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0',
              borderBottom: '1px solid #f1f5f9',
            }}>
              <span style={{
                color: '#64748b',
                fontWeight: 500,
                fontSize: '15px',
              }}>
                Bu Hafta Yeni
              </span>
              <span style={{
                fontWeight: 700,
                color: '#10b981',
                fontSize: '24px',
              }}>
                {stats.users.newThisWeek.toLocaleString()}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0',
            }}>
              <span style={{
                color: '#64748b',
                fontWeight: 500,
                fontSize: '15px',
              }}>
                Bu Ay Yeni
              </span>
              <span style={{
                fontWeight: 700,
                color: '#10b981',
                fontSize: '24px',
              }}>
                {stats.users.newThisMonth.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            padding: '32px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '28px',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              flexShrink: 0,
            }}>
              <Calendar style={{ color: '#ffffff' }} size={24} />
            </div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
            }}>
              Etkinlik İstatistikleri
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0',
              borderBottom: '1px solid #f1f5f9',
            }}>
              <span style={{
                color: '#64748b',
                fontWeight: 500,
                fontSize: '15px',
              }}>
                Toplam Etkinlik
              </span>
              <span style={{
                fontWeight: 700,
                color: '#0f172a',
                fontSize: '24px',
              }}>
                {stats.events.total.toLocaleString()}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0',
            }}>
              <span style={{
                color: '#64748b',
                fontWeight: 500,
                fontSize: '15px',
              }}>
                Toplam Kayıt
              </span>
              <span style={{
                fontWeight: 700,
                color: '#10b981',
                fontSize: '24px',
              }}>
                {stats.events.totalRegistrations.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

