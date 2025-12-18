// Mock locations data
export type PlaceType = 'mosque' | 'pharmacy' | 'facility' | 'wedding';

export interface Place {
  id: string;
  name: string;
  description: string;
  type: PlaceType;
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  workingHours?: string;
  features?: string[];
  distance?: number; // in meters
  isFavorite?: boolean;
  images?: string[];
}

export const mockPlaces: Place[] = [
  // Camiler
  {
    id: '1',
    name: 'Şehitkamil Merkez Camii',
    description: '24 saat açık, engelli erişimi var',
    type: 'mosque',
    latitude: 37.0662,
    longitude: 37.3833,
    address: 'Merkez Mahallesi, Şehitkamil',
    phone: '+90 342 XXX XX XX',
    workingHours: '24 saat açık',
    features: ['Engelli Erişimi', 'Park Alanı', 'Abdesthane'],
    distance: 350,
    images: ['https://picsum.photos/400/300?random=mosque1'],
  },
  {
    id: '2',
    name: 'Yenişehir Camii',
    description: 'Cuma namazı için geniş avlu',
    type: 'mosque',
    latitude: 37.0700,
    longitude: 37.3900,
    address: 'Yenişehir Mahallesi, Şehitkamil',
    features: ['Geniş Avlu', 'Park Alanı'],
    distance: 850,
    images: ['https://picsum.photos/400/300?random=mosque2'],
  },
  {
    id: '3',
    name: 'Güney Mahalle Camii',
    description: 'Modern mimari, klima sistemi',
    type: 'mosque',
    latitude: 37.0600,
    longitude: 37.3750,
    address: 'Güney Mahallesi, Şehitkamil',
    features: ['Klima', 'Modern Mimari'],
    distance: 1200,
    images: ['https://picsum.photos/400/300?random=mosque3'],
  },
  // Eczaneler
  {
    id: '4',
    name: 'Merkez Eczanesi',
    description: 'Nöbetçi eczane - 24 saat açık',
    type: 'pharmacy',
    latitude: 37.0650,
    longitude: 37.3820,
    address: 'Merkez Mahallesi, Atatürk Bulvarı No:15',
    phone: '+90 342 XXX XX XX',
    workingHours: '24 saat açık (Nöbetçi)',
    features: ['Nöbetçi', '24 Saat', 'Reçetesiz İlaç'],
    distance: 200,
    images: ['https://picsum.photos/400/300?random=pharmacy1'],
  },
  {
    id: '5',
    name: 'Sağlık Eczanesi',
    description: 'Nöbetçi eczane',
    type: 'pharmacy',
    latitude: 37.0680,
    longitude: 37.3850,
    address: 'Yenişehir Mahallesi, Sağlık Sokak No:8',
    phone: '+90 342 XXX XX XX',
    workingHours: '24 saat açık (Nöbetçi)',
    features: ['Nöbetçi', '24 Saat'],
    distance: 600,
    images: ['https://picsum.photos/400/300?random=pharmacy2'],
  },
  {
    id: '6',
    name: 'Güven Eczanesi',
    description: 'Nöbetçi eczane - acil ilaç servisi',
    type: 'pharmacy',
    latitude: 37.0620,
    longitude: 37.3800,
    address: 'Güney Mahallesi, Güven Caddesi No:22',
    phone: '+90 342 XXX XX XX',
    workingHours: '24 saat açık (Nöbetçi)',
    features: ['Nöbetçi', 'Acil Servis'],
    distance: 950,
    images: ['https://picsum.photos/400/300?random=pharmacy3'],
  },
  // Tesisler
  {
    id: '7',
    name: 'Şehitkamil Kültür Merkezi',
    description: 'Konser, tiyatro ve etkinlik salonu',
    type: 'facility',
    latitude: 37.0670,
    longitude: 37.3840,
    address: 'Merkez Mahallesi, Kültür Caddesi No:1',
    phone: '+90 342 XXX XX XX',
    workingHours: '09:00 - 22:00',
    features: ['Konser Salonu', 'Tiyatro', 'Sergi Alanı', 'Kafeterya'],
    distance: 400,
    images: ['https://picsum.photos/400/300?random=facility1'],
  },
  {
    id: '8',
    name: 'Şehitkamil Spor Kompleksi',
    description: 'Futbol, basketbol, yüzme havuzu',
    type: 'facility',
    latitude: 37.0690,
    longitude: 37.3880,
    address: 'Yenişehir Mahallesi, Spor Caddesi',
    phone: '+90 342 XXX XX XX',
    workingHours: '06:00 - 23:00',
    features: ['Futbol Sahası', 'Basketbol', 'Yüzme Havuzu', 'Fitness'],
    distance: 750,
    images: ['https://picsum.photos/400/300?random=facility2'],
  },
  {
    id: '9',
    name: 'Şehitkamil Halk Kütüphanesi',
    description: 'Okuma salonu, internet erişimi',
    type: 'facility',
    latitude: 37.0640,
    longitude: 37.3810,
    address: 'Merkez Mahallesi, Kütüphane Sokak No:5',
    phone: '+90 342 XXX XX XX',
    workingHours: '08:00 - 20:00',
    features: ['Okuma Salonu', 'İnternet', 'Çocuk Bölümü'],
    distance: 300,
    images: ['https://picsum.photos/400/300?random=facility3'],
  },
  // Nikah Salonları
  {
    id: '10',
    name: 'Belediye Nikah Salonu',
    description: 'Modern nikah salonu, 200 kişilik',
    type: 'wedding',
    latitude: 37.0665,
    longitude: 37.3835,
    address: 'Belediye Binası, Merkez Mahallesi',
    phone: '+90 342 XXX XX XX',
    workingHours: '09:00 - 17:00 (Hafta içi)',
    features: ['200 Kişilik', 'Modern Dekor', 'Fotoğraf Stüdyosu'],
    distance: 250,
    images: ['https://picsum.photos/400/300?random=wedding1'],
  },
  {
    id: '11',
    name: 'Şehitkamil Nikah Evi',
    description: 'Geleneksel nikah salonu',
    type: 'wedding',
    latitude: 37.0685,
    longitude: 37.3865,
    address: 'Yenişehir Mahallesi, Nikah Caddesi No:12',
    phone: '+90 342 XXX XX XX',
    workingHours: '09:00 - 17:00 (Hafta içi)',
    features: ['150 Kişilik', 'Geleneksel Dekor'],
    distance: 650,
    images: ['https://picsum.photos/400/300?random=wedding2'],
  },
];

export const placeCategories = [
  { id: 'mosque', label: 'Camiler', icon: '🕌' },
  { id: 'pharmacy', label: 'Eczaneler', icon: '💊' },
  { id: 'facility', label: 'Tesisler', icon: '🏛️' },
  { id: 'wedding', label: 'Nikah Salonları', icon: '💒' },
];

export const getPlaceIcon = (type: PlaceType): string => {
  const icons: Record<PlaceType, string> = {
    mosque: '🕌',
    pharmacy: '💊',
    facility: '🏛️',
    wedding: '💒',
  };
  return icons[type];
};

