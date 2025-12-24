'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { GlobalSearch } from './GlobalSearch';
import { authService } from '@/lib/auth';
import { Menu } from 'lucide-react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-600 font-medium">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  // Don't show sidebar on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      
      {/* Main Content Area */}
      <main 
        className={`
          flex-1 flex flex-col overflow-hidden bg-slate-50
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'md:ml-20 ml-0' : 'md:ml-80 ml-0'}
        `}
      >
        {/* Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
          <div className="w-full px-4 md:px-8 py-4 md:py-6">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Menüyü Aç/Kapat"
              >
                <Menu size={24} />
              </button>
              
              {/* Search */}
              <div className="flex-1">
                <GlobalSearch />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
