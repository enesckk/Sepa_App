// Mock application/issue types
export interface IssueType {
  id: string;
  label: string;
  icon: string;
}

export const issueTypes: IssueType[] = [
  { id: 'cleaning', label: 'Temizlik', icon: '🧹' },
  { id: 'transport', label: 'Ulaşım', icon: '🚌' },
  { id: 'infrastructure', label: 'Altyapı', icon: '🏗️' },
  { id: 'parks', label: 'Parklar', icon: '🌳' },
  { id: 'lighting', label: 'Aydınlatma', icon: '💡' },
  { id: 'water', label: 'Su', icon: '💧' },
  { id: 'waste', label: 'Çöp', icon: '🗑️' },
  { id: 'other', label: 'Diğer', icon: '📋' },
];

export interface Application {
  id: string;
  type: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  photos: string[];
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
}

