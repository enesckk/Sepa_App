// Mock bills data
export interface Bill {
  id: string;
  firstName: string;
  lastName: string;
  subscriberNumber: string;
  amount: number;
  type: 'electricity' | 'water' | 'gas' | 'internet';
  status: 'pending' | 'supported';
  supportedBy?: number;
  createdAt: string;
}

export const mockBills: Bill[] = [
  {
    id: '1',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    subscriberNumber: '1234567890',
    amount: 250,
    type: 'electricity',
    status: 'pending',
    supportedBy: 0,
    createdAt: '2024-03-10',
  },
  {
    id: '2',
    firstName: 'Ayşe',
    lastName: 'Demir',
    subscriberNumber: '0987654321',
    amount: 180,
    type: 'water',
    status: 'pending',
    supportedBy: 0,
    createdAt: '2024-03-11',
  },
  {
    id: '3',
    firstName: 'Mehmet',
    lastName: 'Kaya',
    subscriberNumber: '1122334455',
    amount: 320,
    type: 'gas',
    status: 'pending',
    supportedBy: 0,
    createdAt: '2024-03-12',
  },
];

export const billTypes = {
  electricity: { label: 'Elektrik', icon: '⚡' },
  water: { label: 'Su', icon: '💧' },
  gas: { label: 'Doğalgaz', icon: '🔥' },
  internet: { label: 'İnternet', icon: '📶' },
};

