'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/ToastProvider';
import { settingsService, AdminSettings } from '@/lib/services/settings';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Moon, Sun, Palette, FileText, Save, RotateCcw } from 'lucide-react';

export default function SettingsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AdminSettings>({
    theme: 'light',
    notes: '',
  });

  useEffect(() => {
    // Load settings on mount
    const settings = settingsService.getSettings();
    setFormData(settings);
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    try {
      settingsService.updateSettings(formData);
      showToast('success', 'Ayarlar başarıyla kaydedildi.');
    } catch (error: any) {
      showToast('error', 'Ayarlar kaydedilirken bir hata oluştu.', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('Tüm ayarları varsayılan değerlere sıfırlamak istediğinize emin misiniz?')) {
      const defaultSettings: AdminSettings = {
        theme: 'light',
        notes: '',
      };
      setFormData(defaultSettings);
      settingsService.updateSettings(defaultSettings);
      showToast('success', 'Ayarlar varsayılan değerlere sıfırlandı.');
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #d1fae5',
        padding: '24px',
        background: 'linear-gradient(to bottom, #ffffff, #f0fdf4)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Tema Ayarları */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.15)',
              }}>
                <Palette style={{ color: '#ffffff' }} size={22} />
              </div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#0f172a',
              }}>
                Görünüm Ayarları
              </h2>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '8px',
                }}>
                  Tema
                </label>
                <Select
                  value={formData.theme}
                  onValueChange={(value: any) => {
                    setFormData({ ...formData, theme: value });
                    settingsService.applyTheme(value);
                  }}
                  options={[
                    { label: 'Açık Tema', value: 'light' },
                    { label: 'Koyu Tema', value: 'dark' },
                  ]}
                />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '12px',
                  padding: '12px',
                  backgroundColor: formData.theme === 'dark' ? '#1e293b' : '#f8fafc',
                  borderRadius: '10px',
                  border: `1px solid ${formData.theme === 'dark' ? '#334155' : '#e2e8f0'}`,
                }}>
                  {formData.theme === 'dark' ? (
                    <Moon style={{ color: '#fbbf24' }} size={20} />
                  ) : (
                    <Sun style={{ color: '#f59e0b' }} size={20} />
                  )}
                  <span style={{
                    fontSize: '13px',
                    color: formData.theme === 'dark' ? '#cbd5e1' : '#64748b',
                    fontWeight: 500,
                  }}>
                    {formData.theme === 'dark' ? 'Koyu tema aktif' : 'Açık tema aktif'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notlar */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(59, 130, 246, 0.15)',
              }}>
                <FileText style={{ color: '#ffffff' }} size={22} />
              </div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#0f172a',
              }}>
                Notlar
              </h2>
            </div>
            <Textarea
              label="Operasyonel Notlar"
              placeholder="Operasyonel notlar, hatırlatmalar..."
              rows={5}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              helperText="Bu notlar sadece sizin tarafınızdan görülebilir"
            />
          </div>

          {/* Butonlar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0',
          }}>
            <button
              onClick={handleReset}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.color = '#475569';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              <RotateCcw size={16} />
              Varsayılanlara Sıfırla
            </button>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  const settings = settingsService.getSettings();
                  setFormData(settings);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.color = '#475569';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                İptal
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  backgroundColor: loading ? '#94a3b8' : '#10b981',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = '#059669';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = '#10b981';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)';
                  }
                }}
              >
                <Save size={16} />
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div style={{
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '16px',
        padding: '20px',
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#1e3a8a',
          marginBottom: '8px',
        }}>
          Bilgi
        </h3>
        <ul style={{
          fontSize: '14px',
          color: '#1e40af',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <li>• Ayarlar tarayıcınızın localStorage'ında saklanır</li>
          <li>• Tema değişikliği anında uygulanır</li>
          <li>• Notlar sadece bu cihazda görülebilir</li>
        </ul>
      </div>
    </div>
  );
}
