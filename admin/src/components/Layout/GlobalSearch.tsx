'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Users, Calendar, Newspaper, CheckSquare, Gift, MapPin, AlertTriangle, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';

interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  url: string;
  icon: React.ReactNode;
}

const searchConfig = [
  { type: 'users', label: 'Kullanıcılar', icon: <Users size={16} />, url: '/users' },
  { type: 'events', label: 'Etkinlikler', icon: <Calendar size={16} />, url: '/events' },
  { type: 'news', label: 'Haberler', icon: <Newspaper size={16} />, url: '/news' },
  { type: 'surveys', label: 'Anketler', icon: <CheckSquare size={16} />, url: '/surveys' },
  { type: 'rewards', label: 'Ödüller', icon: <Gift size={16} />, url: '/rewards' },
  { type: 'applications', label: 'Başvurular', icon: <FileText size={16} />, url: '/applications' },
  { type: 'places', label: 'Şehir Rehberi', icon: <MapPin size={16} />, url: '/places' },
  { type: 'emergency', label: 'Afet Toplanma', icon: <AlertTriangle size={16} />, url: '/emergency-gathering' },
  { type: 'notifications', label: 'Bildirimler', icon: <Bell size={16} />, url: '/notifications' },
];

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Simple search - filter by type labels
    const filtered = searchConfig
      .filter((config) =>
        config.label.toLowerCase().includes(query.toLowerCase())
      )
      .map((config) => ({
        id: config.type,
        type: config.type,
        title: config.label,
        url: config.url,
        icon: config.icon,
      }));

    setResults(filtered);
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    router.push(result.url);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-lg">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 z-10" size={20} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Ara... (⌘K)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-12 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900 placeholder:text-slate-400 text-base"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 z-10"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result)}
              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-emerald-50 transition-colors ${
                index === selectedIndex ? 'bg-emerald-50' : ''
              }`}
            >
              <div className="text-emerald-600">{result.icon}</div>
              <div className="flex-1 text-left">
                <div className="font-medium text-slate-900">{result.title}</div>
                {result.subtitle && (
                  <div className="text-sm text-slate-500">{result.subtitle}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-4 text-center text-slate-500">
          Sonuç bulunamadı
        </div>
      )}
    </div>
  );
}

