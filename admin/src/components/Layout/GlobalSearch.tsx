'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Users, Calendar, Newspaper, CheckSquare, Gift, MapPin, AlertTriangle, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
      if (event.key === 'Escape') setIsOpen(false);
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

    const filtered = searchConfig
      .filter((config) => config.label.toLowerCase().includes(query.toLowerCase()))
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
    <div ref={searchRef} style={{ position: 'relative', width: '100%', zIndex: 10 }}>
      <div style={{ position: 'relative' }}>
        <Search 
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94a3b8',
            zIndex: 10,
          }}
          size={18} 
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Ara... (⌘K)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            paddingLeft: '42px',
            paddingRight: query ? '42px' : '16px',
            paddingTop: '12px',
            paddingBottom: '12px',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            outline: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: '#0f172a',
            fontSize: '14px',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#10b981';
            e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            setIsOpen(true);
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
          onMouseEnter={(e) => {
            if (document.activeElement !== e.target) {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            }
          }}
          onMouseLeave={(e) => {
            if (document.activeElement !== e.target) {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            }
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              zIndex: 10,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#475569';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          marginTop: '8px',
          width: '100%',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          zIndex: 50,
          maxHeight: '384px',
          overflowY: 'auto',
        }}>
          {results.map((result, index) => (
            <button
              type="button"
              key={result.id}
              onClick={() => handleSelect(result)}
              style={{
                width: '100%',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: index === selectedIndex ? '#ecfdf5' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (index !== selectedIndex) {
                  e.currentTarget.style.backgroundColor = '#f0fdf4';
                }
              }}
              onMouseLeave={(e) => {
                if (index !== selectedIndex) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div style={{ color: '#059669', display: 'flex', alignItems: 'center' }}>
                {result.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: 500, 
                  color: '#0f172a',
                  fontSize: '14px',
                }}>
                  {result.title}
                </div>
                {result.subtitle && (
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#64748b',
                    marginTop: '2px',
                  }}>
                    {result.subtitle}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          marginTop: '8px',
          width: '100%',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          zIndex: 50,
          padding: '16px',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '14px',
        }}>
          Sonuç bulunamadı
        </div>
      )}
    </div>
  );
}
