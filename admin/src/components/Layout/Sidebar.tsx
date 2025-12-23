'use client';

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

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  return (
    <div className="w-64 bg-surface border-r border-border h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold">Ş</span>
          </div>
          <div>
            <h1 className="font-bold text-text">Şehitkamil</h1>
            <p className="text-xs text-text-secondary">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-button transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:bg-background hover:text-text'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-red-50 rounded-button transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
}

