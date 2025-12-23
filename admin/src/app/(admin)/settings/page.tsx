'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

export default function SettingsPage() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="API URL" placeholder="https://api.sehitkamil.bel.tr/api" />
          <Input label="CDN URL (opsiyonel)" placeholder="https://cdn.sehitkamil.bel.tr" />
          <Select
            label="Dil"
            options={[
              { label: 'Türkçe', value: 'tr' },
              { label: 'English', value: 'en' },
            ]}
          />
          <Select
            label="Tema"
            options={[
              { label: 'Açık', value: 'light' },
              { label: 'Koyu', value: 'dark' },
            ]}
          />
        </div>
        <Textarea label="Notlar" placeholder="Operasyonel notlar" rows={3} />
        <div className="flex justify-end gap-3">
          <Button variant="secondary">İptal</Button>
          <Button>Kaydet</Button>
        </div>
      </div>
    </div>
  );
}

