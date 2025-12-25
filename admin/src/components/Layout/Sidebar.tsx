'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
} from 'lucide-react';
import { authService } from '@/lib/auth';

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

type Props = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

export default function Sidebar({ collapsed, onToggleCollapsed }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  return (
    <aside
      className={[
        'fixed left-0 top-0 h-screen z-50',
        'bg-gradient-to-br from-emerald-600 via-emerald-600 to-emerald-800',
        'backdrop-blur-xl',
        'flex flex-col',
        'border-r border-emerald-500/20',
        collapsed ? 'w-20' : 'w-80',
        'transition-all duration-300 ease-out',
        'overflow-hidden',
        'shadow-2xl shadow-emerald-900/20',
      ].join(' ')}
    >
      {/* Brand Section */}
      <div className="px-5 py-6 border-b border-emerald-500/20 flex-shrink-0 bg-gradient-to-r from-emerald-700/50 to-transparent">
        <div className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-3`}>
          {/* Hamburger Button */}
          <button
            type="button"
            onClick={onToggleCollapsed}
            className="w-12 h-12 rounded-2xl grid place-items-center bg-white text-emerald-700 hover:bg-emerald-50 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/10 hover:shadow-xl transition-all duration-200 flex-shrink-0 group"
            aria-label="Menüyü Aç/Kapat"
            title="Menüyü Aç/Kapat"
          >
            <Menu size={22} className="transition-transform duration-200 group-hover:rotate-90" />
          </button>

          {/* Logo */}
          {!collapsed && (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20 flex-shrink-0">
                <span className="text-white font-bold text-xl drop-shadow-lg">Ş</span>
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-white text-lg leading-tight tracking-tight drop-shadow-sm">
                  Şehitkamil Belediyesi
                </h1>
                <p className="text-xs text-emerald-100/90 leading-tight mt-0.5 font-medium">
                  Yönetici Paneli
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Menu Navigation */}
      <nav 
        className="flex-1 overflow-y-auto px-4 pb-6 scrollbar-hide"
        style={{ 
          paddingTop: '10px',
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE and Edge */
        }}
      >
        <ul style={{ listStyle: 'none' }}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li 
                key={item.href} 
                style={{ 
                  marginBottom: index < menuItems.length - 1 ? '10px' : '0'
                }}
              >
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={[
                    'group relative flex items-center gap-3 rounded-2xl transition-all duration-200',
                    collapsed ? 'justify-center px-0' : 'px-4',
                    'py-4',
                    isActive
                      ? 'bg-white text-emerald-700 shadow-xl shadow-emerald-900/10 font-semibold scale-[1.02]'
                      : 'text-emerald-50 hover:bg-white/15 hover:text-white hover:scale-[1.01]',
                  ].join(' ')}
                >
                  {/* Active Indicator */}
                  {isActive && !collapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-full shadow-lg shadow-emerald-500/50" />
                  )}

                  {/* Icon Container */}
                  <span
                    className={[
                      'relative w-11 h-11 rounded-xl grid place-items-center flex-shrink-0 transition-all duration-200',
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 shadow-md'
                        : 'bg-white/10 text-emerald-50 group-hover:bg-white/20 group-hover:scale-110',
                    ].join(' ')}
                  >
                    <Icon size={20} className="transition-transform duration-200 group-hover:scale-110" />
                  </span>

                  {/* Label */}
                  {!collapsed && (
                    <span className="font-medium text-sm whitespace-nowrap tracking-wide transition-all duration-200">
                      {item.label}
                    </span>
                  )}

                  {/* Hover Glow Effect */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="px-4 py-5 border-t border-emerald-500/20 flex-shrink-0 bg-gradient-to-r from-transparent to-emerald-700/30">
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? 'Çıkış Yap' : undefined}
          className={[
            'group w-full flex items-center gap-3 rounded-2xl transition-all duration-200',
            collapsed ? 'justify-center px-0' : 'px-4',
            'py-3.5 text-emerald-50 hover:bg-red-500/20 hover:text-red-100 font-medium',
            'hover:scale-[1.01] active:scale-[0.99]',
            'border border-transparent hover:border-red-400/30',
          ].join(' ')}
        >
          <span className="w-11 h-11 rounded-xl grid place-items-center bg-white/10 group-hover:bg-red-500/20 flex-shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:rotate-[-5deg]">
            <LogOut size={20} className="transition-transform duration-200" />
          </span>
          {!collapsed && (
            <span className="text-sm tracking-wide transition-all duration-200">
              Çıkış Yap
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
