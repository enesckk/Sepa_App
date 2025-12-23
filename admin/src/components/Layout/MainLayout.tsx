'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { GlobalSearch } from './GlobalSearch';
import { authService } from '@/lib/auth';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check for login page
      if (pathname === '/login') {
        setLoading(false);
        return;
      }

      // Check if token exists
      if (!authService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      // Verify token and get user
      try {
        const user = await authService.getCurrentUser();
        
        // Check if user is admin
        if (user.role !== 'admin' && user.role !== 'super_admin') {
          await authService.logout();
          router.push('/login');
          return;
        }

        setLoading(false);
      } catch (error) {
        // Token invalid or expired
        await authService.logout();
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-text-secondary">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  // Don't show sidebar on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="sticky top-0 z-40 bg-surface border-b border-border p-4">
          <div className="max-w-7xl mx-auto">
            <GlobalSearch />
          </div>
        </div>
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
