'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { GlobalSearch } from './GlobalSearch';
import { authService } from '@/lib/auth';

// Sayfa başlıkları mapping
const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Kullanıcılar',
  '/events': 'Etkinlikler',
  '/stories': 'Stories',
  '/news': 'Haberler',
  '/surveys': 'Anketler',
  '/rewards': 'Ödüller',
  '/applications': 'Başvurular',
  '/bill-supports': 'Askıda Fatura',
  '/places': 'Şehir Rehberi',
  '/emergency-gathering': 'Afet Toplanma',
  '/notifications': 'Bildirimler',
  '/settings': 'Ayarlar',
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  const [collapsed, setCollapsed] = useState(true);
  
  const pageTitle = pageTitles[pathname] || 'Dashboard';

  useEffect(() => {
    const checkAuth = async () => {
      if (pathname === '/login') {
        setLoading(false);
        return;
      }

      if (!authService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      try {
        const user = await authService.getCurrentUser();
        if (user.role !== 'admin' && user.role !== 'super_admin') {
          await authService.logout();
          router.push('/login');
          return;
        }
        setLoading(false);
      } catch {
        await authService.logout();
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <div className="text-slate-600 font-medium">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (pathname === '/login') return <>{children}</>;

  // ✅ width ile birebir aynı px değerleri
  const sidebarWidth = collapsed ? 80 : 320;

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden">
      <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((v) => !v)} />

      {/* ✅ Tailwind ml-* yerine inline style: kesin çalışır */}
      <div
        className="h-screen flex flex-col overflow-x-hidden"
        style={{
          marginLeft: `${sidebarWidth}px`,
          transition: 'margin-left 200ms ease-in-out',
        }}
      >
        {/* Modern Topbar */}
        <header 
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 40,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ width: '100%', padding: '24px 32px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              gap: '32px' 
            }}>
              {/* Page Title */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#0f172a',
                  letterSpacing: '-0.025em',
                  margin: 0,
                  lineHeight: 1.2,
                }}>
                  {pageTitle}
                </h1>
              </div>
              
              {/* Search */}
              <div style={{ width: '420px', flexShrink: 0 }}>
                <GlobalSearch />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div 
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: 'transparent' }}
        >
          <div style={{ 
            width: '100%', 
            maxWidth: '1280px', 
            margin: '0 auto', 
            padding: '32px' 
          }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
