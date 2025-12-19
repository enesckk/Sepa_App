// Mock emergency gathering areas data
export interface EmergencyGatheringArea {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  capacity?: number; // Maximum capacity
  features?: string[];
  distance?: number; // in km
  isFavorite?: boolean;
  images?: string[];
  contactPhone?: string;
  status?: 'active' | 'temporary' | 'closed'; // Status of the area
}

export const mockEmergencyGatheringAreas: EmergencyGatheringArea[] = [
  {
    id: '1',
    name: 'Şehitkamil Belediye Binası',
    description: 'Ana toplanma alanı, geniş park alanı mevcut',
    latitude: 37.0662,
    longitude: 37.3833,
    address: 'Merkez Mahallesi, Şehitkamil Belediye Binası, Gaziantep',
    capacity: 5000,
    features: ['Geniş Alan', 'Park Yeri', 'Tuvalet', 'İlk Yardım', 'Su'],
    distance: 0.5,
    status: 'active',
    contactPhone: '+90 342 XXX XX XX',
    images: ['https://picsum.photos/400/300?random=emergency1'],
  },
  {
    id: '2',
    name: 'Yenişehir Spor Kompleksi',
    description: 'Kapalı ve açık alan, acil durum için hazır',
    latitude: 37.0700,
    longitude: 37.3900,
    address: 'Yenişehir Mahallesi, Spor Kompleksi, Gaziantep',
    capacity: 3000,
    features: ['Kapalı Alan', 'Açık Alan', 'Park Yeri', 'Tuvalet', 'Su'],
    distance: 1.2,
    status: 'active',
    images: ['https://picsum.photos/400/300?random=emergency2'],
  },
  {
    id: '3',
    name: 'Güney Mahalle Parkı',
    description: 'Açık hava toplanma alanı',
    latitude: 37.0600,
    longitude: 37.3700,
    address: 'Güney Mahallesi, Park Alanı, Gaziantep',
    capacity: 2000,
    features: ['Açık Alan', 'Park Yeri', 'Tuvalet'],
    distance: 1.8,
    status: 'active',
    images: ['https://picsum.photos/400/300?random=emergency3'],
  },
  {
    id: '4',
    name: 'Kuzey Mahalle Kültür Merkezi',
    description: 'Kapalı toplanma alanı, acil durum için kullanılabilir',
    latitude: 37.0750,
    longitude: 37.3950,
    address: 'Kuzey Mahallesi, Kültür Merkezi, Gaziantep',
    capacity: 1500,
    features: ['Kapalı Alan', 'Park Yeri', 'Tuvalet', 'İlk Yardım'],
    distance: 2.1,
    status: 'active',
    contactPhone: '+90 342 XXX XX XX',
    images: ['https://picsum.photos/400/300?random=emergency4'],
  },
  {
    id: '5',
    name: 'Doğu Mahalle Okul Bahçesi',
    description: 'Geçici toplanma alanı, okul bahçesi',
    latitude: 37.0550,
    longitude: 37.3750,
    address: 'Doğu Mahallesi, İlkokul Bahçesi, Gaziantep',
    capacity: 1000,
    features: ['Açık Alan', 'Park Yeri', 'Tuvalet'],
    distance: 2.5,
    status: 'temporary',
    images: ['https://picsum.photos/400/300?random=emergency5'],
  },
];

