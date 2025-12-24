/**
 * Mock locations/places data
 * This file contains sample place data for development and testing
 */

export type PlaceType = 'mosque' | 'pharmacy' | 'facility' | 'wedding';

export interface Place {
  id: string;
  name: string;
  description?: string;
  type: PlaceType;
  category?: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  workingHours?: string;
  image_url?: string;
  images?: string[];
  features?: string[];
  distance?: number; // in meters (computed)
  isFavorite?: boolean; // computed
}

export interface PlaceCategory {
  id: string;
  label: string;
  icon: string;
}

export const placeCategories: PlaceCategory[] = [
  {
    id: 'mosque',
    label: 'Camiler',
    icon: '🕌',
  },
  {
    id: 'pharmacy',
    label: 'Eczaneler',
    icon: '💊',
  },
  {
    id: 'facility',
    label: 'Tesisler',
    icon: '🏢',
  },
  {
    id: 'wedding',
    label: 'Nikah Salonları',
    icon: '💒',
  },
];

export const getPlaceIcon = (type: PlaceType): string => {
  const icons: Record<PlaceType, string> = {
    mosque: '🕌',
    pharmacy: '💊',
    facility: '🏢',
    wedding: '💒',
  };
  return icons[type] || '📍';
};

export const mockPlaces: Place[] = [
  // Mosques
  {
    id: '1',
    name: 'Şehitkamil Merkez Camii',
    description: 'Şehitkamil ilçesinin merkez camisi. Geniş avlusu ve modern mimarisi ile dikkat çekiyor.',
    type: 'mosque',
    address: 'Şehitkamil Merkez, Gaziantep',
    latitude: 37.0594,
    longitude: 37.3825,
    phone: '+90 342 123 4567',
    workingHours: '24 saat açık',
    image_url: 'https://picsum.photos/400/300?random=11',
    images: [
      'https://picsum.photos/400/300?random=11',
      'https://picsum.photos/400/300?random=12',
    ],
    features: ['Park Yeri', 'Abdesthane', 'Kadınlar Bölümü'],
  },
  {
    id: '2',
    name: 'Fatih Camii',
    description: 'Tarihi Fatih Camii. Restore edilmiş tarihi yapısı ile ziyaretçilerini ağırlıyor.',
    type: 'mosque',
    address: 'Fatih Mahallesi, Şehitkamil, Gaziantep',
    latitude: 37.0610,
    longitude: 37.3840,
    phone: '+90 342 123 4568',
    workingHours: '24 saat açık',
    image_url: 'https://picsum.photos/400/300?random=13',
    features: ['Tarihi Yapı', 'Park Yeri'],
  },
  {
    id: '3',
    name: 'Yavuz Selim Camii',
    description: 'Modern mimari ile inşa edilmiş cami. Geniş cemaat kapasitesi.',
    type: 'mosque',
    address: 'Yavuz Selim Mahallesi, Şehitkamil, Gaziantep',
    latitude: 37.0578,
    longitude: 37.3810,
    workingHours: '24 saat açık',
    image_url: 'https://picsum.photos/400/300?random=14',
    features: ['Park Yeri', 'Abdesthane', 'Kütüphane'],
  },

  // Pharmacies
  {
    id: '4',
    name: 'Şehitkamil Eczanesi',
    description: '7/24 hizmet veren eczane. Acil ilaç temini için 24 saat açık.',
    type: 'pharmacy',
    address: 'Şehitkamil Merkez, Atatürk Bulvarı No: 15, Gaziantep',
    latitude: 37.0600,
    longitude: 37.3830,
    phone: '+90 342 123 4569',
    workingHours: '24 saat açık',
    image_url: 'https://picsum.photos/400/300?random=15',
    features: ['24 Saat', 'Reçetesiz İlaç', 'İlaç Siparişi'],
  },
  {
    id: '5',
    name: 'Sağlık Eczanesi',
    description: 'Deneyimli eczacı kadrosu ile hizmet veren modern eczane.',
    type: 'pharmacy',
    address: 'Fatih Mahallesi, İnönü Caddesi No: 42, Gaziantep',
    latitude: 37.0620,
    longitude: 37.3850,
    phone: '+90 342 123 4570',
    workingHours: '08:00 - 22:00',
    image_url: 'https://picsum.photos/400/300?random=16',
    features: ['Danışmanlık', 'İlaç Siparişi', 'Vitaminler'],
  },
  {
    id: '6',
    name: 'Merkez Eczanesi',
    description: 'Şehitkamil merkezde konumlanmış güvenilir eczane.',
    type: 'pharmacy',
    address: 'Merkez Mahallesi, Cumhuriyet Caddesi No: 28, Gaziantep',
    latitude: 37.0585,
    longitude: 37.3820,
    phone: '+90 342 123 4571',
    workingHours: '09:00 - 21:00',
    image_url: 'https://picsum.photos/400/300?random=17',
    features: ['Reçetesiz İlaç', 'Danışmanlık'],
  },

  // Facilities
  {
    id: '7',
    name: 'Şehitkamil Kültür Merkezi',
    description: 'Konserler, tiyatro gösterileri ve kültürel etkinlikler için modern tesis.',
    type: 'facility',
    address: 'Kültür Mahallesi, Sanat Caddesi No: 1, Gaziantep',
    latitude: 37.0630,
    longitude: 37.3860,
    phone: '+90 342 123 4572',
    workingHours: '09:00 - 18:00',
    image_url: 'https://picsum.photos/400/300?random=18',
    images: [
      'https://picsum.photos/400/300?random=18',
      'https://picsum.photos/400/300?random=19',
      'https://picsum.photos/400/300?random=20',
    ],
    features: ['Konser Salonu', 'Tiyatro Sahnesi', 'Park Yeri', 'Kafeterya', 'WiFi'],
  },
  {
    id: '8',
    name: 'Şehitkamil Spor Kompleksi',
    description: 'Futbol, basketbol, voleybol ve diğer spor aktiviteleri için geniş tesis.',
    type: 'facility',
    address: 'Spor Mahallesi, Spor Caddesi No: 5, Gaziantep',
    latitude: 37.0640,
    longitude: 37.3870,
    phone: '+90 342 123 4573',
    workingHours: '06:00 - 22:00',
    image_url: 'https://picsum.photos/400/300?random=21',
    features: ['Futbol Sahası', 'Basketbol Sahası', 'Voleybol Sahası', 'Soyunma Odaları', 'Park Yeri'],
  },
  {
    id: '9',
    name: 'Şehitkamil Halk Eğitim Merkezi',
    description: 'Çeşitli kurslar ve eğitim programları sunan halk eğitim merkezi.',
    type: 'facility',
    address: 'Eğitim Mahallesi, Eğitim Caddesi No: 10, Gaziantep',
    latitude: 37.0650,
    longitude: 37.3880,
    phone: '+90 342 123 4574',
    workingHours: '08:00 - 17:00',
    image_url: 'https://picsum.photos/400/300?random=22',
    features: ['Kurslar', 'Atölyeler', 'Kütüphane', 'Park Yeri'],
  },
  {
    id: '10',
    name: 'Şehitkamil Belediye Binası',
    description: 'Belediye hizmetleri ve işlemler için ana hizmet binası.',
    type: 'facility',
    address: 'Belediye Mahallesi, Belediye Caddesi No: 1, Gaziantep',
    latitude: 37.0594,
    longitude: 37.3825,
    phone: '+90 342 123 4575',
    workingHours: '08:30 - 17:30',
    image_url: 'https://picsum.photos/400/300?random=23',
    features: ['Belediye Hizmetleri', 'Park Yeri', 'Engelli Erişimi'],
  },

  // Wedding Halls
  {
    id: '11',
    name: 'Şehitkamil Nikah Salonu',
    description: 'Modern ve şık nikah törenleri için ideal salon. Geniş kapasite ve lüks dekorasyon.',
    type: 'wedding',
    address: 'Nikah Mahallesi, Nikah Caddesi No: 20, Gaziantep',
    latitude: 37.0660,
    longitude: 37.3890,
    phone: '+90 342 123 4576',
    workingHours: '09:00 - 20:00',
    image_url: 'https://picsum.photos/400/300?random=24',
    images: [
      'https://picsum.photos/400/300?random=24',
      'https://picsum.photos/400/300?random=25',
    ],
    features: ['500 Kişilik', 'Ses Sistemi', 'Işık Sistemi', 'Park Yeri', 'Catering'],
  },
  {
    id: '12',
    name: 'Gül Nikah Salonu',
    description: 'Romantik ve şık nikah törenleri için özel tasarlanmış salon.',
    type: 'wedding',
    address: 'Gül Mahallesi, Gül Caddesi No: 15, Gaziantep',
    latitude: 37.0670,
    longitude: 37.3900,
    phone: '+90 342 123 4577',
    workingHours: '10:00 - 22:00',
    image_url: 'https://picsum.photos/400/300?random=26',
    features: ['300 Kişilik', 'Ses Sistemi', 'Park Yeri', 'Catering'],
  },
  {
    id: '13',
    name: 'Beyaz Nikah Salonu',
    description: 'Klasik ve zarif nikah törenleri için ideal mekan.',
    type: 'wedding',
    address: 'Beyaz Mahallesi, Beyaz Caddesi No: 8, Gaziantep',
    latitude: 37.0680,
    longitude: 37.3910,
    phone: '+90 342 123 4578',
    workingHours: '09:00 - 21:00',
    image_url: 'https://picsum.photos/400/300?random=27',
    features: ['400 Kişilik', 'Ses Sistemi', 'Işık Sistemi', 'Park Yeri'],
  },
];

