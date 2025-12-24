/**
 * Mock rewards data
 * This file contains reward category data for development and testing
 */

export interface RewardCategory {
  id: string;
  label: string;
  icon: string;
}

export const rewardCategories: RewardCategory[] = [
  {
    id: 'all',
    label: 'Tümü',
    icon: '🌟',
  },
  {
    id: 'physical',
    label: 'Fiziksel',
    icon: '📦',
  },
  {
    id: 'digital',
    label: 'Dijital',
    icon: '💻',
  },
  {
    id: 'partner',
    label: 'Partner',
    icon: '🤝',
  },
];

