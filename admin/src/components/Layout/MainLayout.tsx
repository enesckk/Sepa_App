'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
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
      if (pathname === '/login') {
        setLoading(false);
        return;
      }

      if (!authService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      try {
        await authService.getCurrentUser();
        setLoading(false);
      } catch (error) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Yükleniyor...</div>
      </div>
    );
  }

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

