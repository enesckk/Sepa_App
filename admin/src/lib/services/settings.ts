/**
 * Settings Service - Manages admin panel settings in localStorage
 */

export interface AdminSettings {
  apiUrl?: string;
  cdnUrl?: string;
  language: 'tr' | 'en';
  theme: 'light' | 'dark';
  notes?: string;
}

const SETTINGS_KEY = 'admin_settings';

const defaultSettings: AdminSettings = {
  language: 'tr',
  theme: 'light',
};

export const settingsService = {
  /**
   * Get all settings
   */
  getSettings(): AdminSettings {
    if (typeof window === 'undefined') {
      return defaultSettings;
    }

    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }

    return defaultSettings;
  },

  /**
   * Update settings
   */
  updateSettings(settings: Partial<AdminSettings>): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));

      // Apply theme immediately if changed
      if (settings.theme) {
        this.applyTheme(settings.theme);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  },

  /**
   * Apply theme to document
   */
  applyTheme(theme: 'light' | 'dark'): void {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  },

  /**
   * Initialize settings on app load
   */
  initialize(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const settings = this.getSettings();
    this.applyTheme(settings.theme);
  },
};

// Initialize on import
if (typeof window !== 'undefined') {
  settingsService.initialize();
}

