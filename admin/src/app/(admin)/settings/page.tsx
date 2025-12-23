'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/ToastProvider';
import { settingsService, AdminSettings } from '@/lib/services/settings';

export default function SettingsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AdminSettings>({
    apiUrl: '',
    cdnUrl: '',
    language: 'tr',
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
        language: 'tr',
        theme: 'light',
      };
      setFormData(defaultSettings);
      settingsService.updateSettings(defaultSettings);
      showToast('success', 'Ayarlar varsayılan değerlere sıfırlandı.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Ayarlar</h1>
          <p className="text-text-secondary text-sm mt-1">
            Admin panel ayarları ve bağlantılar.
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-card shadow-card p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-text mb-4">API & CDN Ayarları</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="API URL"
              placeholder="https://api.sehitkamil.bel.tr/api"
              value={formData.apiUrl || ''}
              onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
              helperText="Backend API base URL'i"
            />
            <Input
              label="CDN URL (opsiyonel)"
              placeholder="https://cdn.sehitkamil.bel.tr"
              value={formData.cdnUrl || ''}
              onChange={(e) => setFormData({ ...formData, cdnUrl: e.target.value })}
              helperText="CDN base URL'i (görseller için)"
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text mb-4">Görünüm & Dil</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Dil"
              value={formData.language}
              onValueChange={(value: any) => setFormData({ ...formData, language: value })}
              options={[
                { label: 'Türkçe', value: 'tr' },
                { label: 'English', value: 'en' },
              ]}
            />
            <Select
              label="Tema"
              value={formData.theme}
              onValueChange={(value: any) => {
                setFormData({ ...formData, theme: value });
                settingsService.applyTheme(value);
              }}
              options={[
                { label: 'Açık', value: 'light' },
                { label: 'Koyu', value: 'dark' },
              ]}
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text mb-4">Notlar</h2>
          <Textarea
            label="Operasyonel Notlar"
            placeholder="Operasyonel notlar, hatırlatmalar..."
            rows={5}
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            helperText="Bu notlar sadece sizin tarafınızdan görülebilir"
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border">
          <Button variant="secondary" onClick={handleReset}>
            Varsayılanlara Sıfırla
          </Button>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => {
              const settings = settingsService.getSettings();
              setFormData(settings);
            }}>
              İptal
            </Button>
            <Button onClick={handleSubmit} loading={loading}>
              Kaydet
            </Button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-card p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Bilgi</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Ayarlar tarayıcınızın localStorage'ında saklanır</li>
          <li>• API URL değişikliği sayfa yenilendikten sonra geçerli olur</li>
          <li>• Tema değişikliği anında uygulanır</li>
          <li>• Notlar sadece bu cihazda görülebilir</li>
        </ul>
      </div>
    </div>
  );
}
