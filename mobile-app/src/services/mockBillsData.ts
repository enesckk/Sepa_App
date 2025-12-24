/**
 * Mock bills data
 * This file contains sample bill data for development and testing
 */

export interface Bill {
  id: string;
  type: 'electricity' | 'water' | 'gas' | 'internet' | 'phone' | 'other';
  firstName: string;
  lastName: string;
  subscriberNumber: string;
  amount: number;
  supportedBy?: number;
  status?: 'pending' | 'supported' | 'paid';
}

export interface BillType {
  label: string;
  icon: string;
}

export const billTypes: Record<string, BillType> = {
  electricity: {
    label: 'Elektrik',
    icon: '⚡',
  },
  water: {
    label: 'Su',
    icon: '💧',
  },
  gas: {
    label: 'Doğalgaz',
    icon: '🔥',
  },
  internet: {
    label: 'İnternet',
    icon: '📶',
  },
  phone: {
    label: 'Telefon',
    icon: '📱',
  },
  other: {
    label: 'Diğer',
    icon: '📋',
  },
};

