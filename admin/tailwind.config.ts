import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          DEFAULT: '#2E7D32',
          light: '#4CAF50',
          dark: '#1B5E20',
        },
        // Secondary Colors
        secondary: {
          DEFAULT: '#F57C00',
          light: '#FF9800',
        },
        // Quick Access Colors
        purple: {
          DEFAULT: '#8B5CF6',
          dark: '#7C3AED',
        },
        orange: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        blue: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
        },
        green: {
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        // Neutral Colors
        background: '#F8F9FA',
        surface: '#FFFFFF',
        text: {
          DEFAULT: '#1F2937',
          secondary: '#6B7280',
        },
        border: '#E5E7EB',
        // Status Colors
        error: '#D32F2F',
        success: {
          DEFAULT: '#388E3C',
          dark: '#2E7D32',
        },
        warning: '#F57C00',
        info: '#1976D2',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'input': '8px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
export default config;

