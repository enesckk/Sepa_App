'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Newspaper,
  CheckSquare,
  Gift,
  MapPin,
  AlertTriangle,
  Bell,
  Settings,
  LogOut,
  Image as ImageIcon,
  Menu,
  X,
} from 'lucide-react';
import { authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Kullanıcılar', href: '/users' },
  { icon: Calendar, label: 'Etkinlikler', href: '/events' },
  { icon: ImageIcon, label: 'Stories', href: '/stories' },
  { icon: Newspaper, label: 'Haberler', href: '/news' },
  { icon: CheckSquare, label: 'Anketler', href: '/surveys' },
  { icon: Gift, label: 'Ödüller', href: '/rewards' },
  { icon: FileText, label: 'Başvurular', href: '/applications' },
  { icon: FileText, label: 'Askıda Fatura', href: '/bill-supports' },
  { icon: MapPin, label: 'Şehir Rehberi', href: '/places' },
  { icon: AlertTriangle, label: 'Afet Toplanma', href: '/emergency-gathering' },
  { icon: Bell, label: 'Bildirimler', href: '/notifications' },
  { icon: Settings, label: 'Ayarlar', href: '/settings' },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          !isCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onToggle}
      />

      {/* Sidebar */}
      <aside
        className={`
          bg-gradient-to-b from-emerald-600 to-emerald-700 h-screen fixed left-0 top-0 flex flex-col z-50 shadow-xl
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-80'}
          ${isCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className={`px-5 py-6 border-b border-emerald-500/30 flex-shrink-0 ${isCollapsed ? 'px-4' : ''}`}>
          <div className={`flex items-center gap-4 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white font-bold text-xl">Ş</span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <h1 className="font-bold text-white text-lg leading-tight">Şehitkamil</h1>
                <p className="text-xs text-emerald-100 leading-tight mt-0.5">Yönetici Paneli</p>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <div className="px-5 py-4 border-b border-emerald-500/30 flex-shrink-0 md:block hidden">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            title={isCollapsed ? 'Menüyü Aç' : 'Menüyü Kapat'}
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Menu Section */}
        <nav className="flex-1 overflow-y-auto px-5 py-6">
          <ul className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200
                      ${isActive
                        ? 'bg-white text-emerald-700 shadow-lg font-semibold'
                        : 'text-emerald-50 hover:bg-white/10 hover:text-white'
                      }
                      ${isCollapsed ? 'justify-center px-4' : ''}
                    `}
                    title={isCollapsed ? item.label : ''}
                  >
                    <Icon size={22} className="flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="text-base whitespace-nowrap">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="px-5 py-4 border-t border-emerald-500/30 flex-shrink-0">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-4 px-6 py-4 text-white hover:bg-white/10 rounded-xl 
              transition-all duration-200
              ${isCollapsed ? 'justify-center px-4' : ''}
            `}
            title={isCollapsed ? 'Çıkış Yap' : ''}
          >
            <LogOut size={22} className="flex-shrink-0" />
            {!isCollapsed && <span className="text-base whitespace-nowrap">Çıkış Yap</span>}
          </button>
        </div>

        {/* Mobile Close Button */}
        <div className="px-5 py-3 border-t border-emerald-500/30 flex-shrink-0 md:hidden">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center px-4 py-2.5 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>
      </aside>
    </>
  );
}

