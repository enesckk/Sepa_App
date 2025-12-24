/**
 * Mock emergency gathering areas data
 * This file contains sample emergency gathering area data for development and testing
 */

export interface EmergencyGatheringArea {
  id: string;
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  features?: string[]; // Facilities/features available
  contactPhone?: string;
  image_url?: string;
  images?: string[];
  distance?: number; // in kilometers (computed)
  isFavorite?: boolean; // computed
}

export const mockEmergencyGatheringAreas: EmergencyGatheringArea[] = [
  {
    id: '1',
    name: 'Şehitkamil Merkez Toplanma Alanı',
    description:
      'Merkez mahalle toplanma alanı. Geniş açık alan, acil durumlarda binlerce kişiyi ağırlayabilir. Su, tuvalet ve ilk yardım hizmetleri mevcuttur.',
    address: 'Merkez Mahalle, Atatürk Bulvarı, Şehitkamil/Gaziantep',
    latitude: 37.0662,
    longitude: 37.3833,
    capacity: 5000,
    features: ['Su', 'Tuvalet', 'İlk Yardım', 'Park Yeri', 'Açık Alan'],
    contactPhone: '+90 342 111 22 33',
    image_url: 'https://picsum.photos/400/300?random=31',
    images: [
      'https://picsum.photos/400/300?random=31',
      'https://picsum.photos/400/300?random=32',
    ],
  },
  {
    id: '2',
    name: 'Şehitkamil Spor Kompleksi',
    description:
      'Kapalı spor salonu. Kötü hava koşullarında sığınak olarak kullanılabilir. Geniş kapasite ve modern tesisler.',
    address: 'Spor Mahallesi, Spor Caddesi No:20, Şehitkamil/Gaziantep',
    latitude: 37.0630,
    longitude: 37.3800,
    capacity: 3000,
    features: ['Su', 'Tuvalet', 'İlk Yardım', 'Sığınak', 'Park Yeri', 'Kapalı Alan'],
    contactPhone: '+90 342 222 33 44',
    image_url: 'https://picsum.photos/400/300?random=33',
    images: [
      'https://picsum.photos/400/300?random=33',
      'https://picsum.photos/400/300?random=34',
    ],
  },
  {
    id: '3',
    name: 'Atatürk Parkı Toplanma Alanı',
    description:
      'Park alanı, açık hava toplanma noktası. Geniş yeşil alan ve temel ihtiyaçlar için tesisler mevcuttur.',
    address: 'Merkez Mahalle, Atatürk Parkı, Şehitkamil/Gaziantep',
    latitude: 37.0650,
    longitude: 37.3820,
    capacity: 2000,
    features: ['Su', 'Tuvalet', 'Park Yeri', 'Açık Alan', 'Yeşil Alan'],
    contactPhone: '+90 342 333 44 55',
    image_url: 'https://picsum.photos/400/300?random=35',
  },
  {
    id: '4',
    name: 'Yenişehir İlkokulu',
    description:
      'Okul binası, acil durumlarda toplanma ve sığınma alanı olarak kullanılabilir. Geniş bahçe ve kapalı alanlar.',
    address: 'Yenişehir Mahallesi, Eğitim Caddesi No:15, Şehitkamil/Gaziantep',
    latitude: 37.0670,
    longitude: 37.3840,
    capacity: 1500,
    features: ['Su', 'Tuvalet', 'İlk Yardım', 'Sığınak', 'Park Yeri', 'Kapalı Alan'],
    contactPhone: '+90 342 444 55 66',
    image_url: 'https://picsum.photos/400/300?random=36',
  },
  {
    id: '5',
    name: 'Fatih Mahallesi Toplanma Alanı',
    description:
      'Mahalle toplanma alanı. Açık alan ve temel ihtiyaçlar için tesisler.',
    address: 'Fatih Mahallesi, Fatih Caddesi, Şehitkamil/Gaziantep',
    latitude: 37.0610,
    longitude: 37.3840,
    capacity: 1000,
    features: ['Su', 'Tuvalet', 'Park Yeri', 'Açık Alan'],
    contactPhone: '+90 342 555 66 77',
    image_url: 'https://picsum.photos/400/300?random=37',
  },
  {
    id: '6',
    name: 'Şehitkamil Kültür Merkezi',
    description:
      'Kültür merkezi binası. Kapalı alan ve geniş salonlar. Kötü hava koşullarında ideal sığınak.',
    address: 'Kültür Mahallesi, Sanat Caddesi No:1, Şehitkamil/Gaziantep',
    latitude: 37.0630,
    longitude: 37.3860,
    capacity: 2500,
    features: ['Su', 'Tuvalet', 'İlk Yardım', 'Sığınak', 'Park Yeri', 'Kapalı Alan', 'Geniş Salon'],
    contactPhone: '+90 342 666 77 88',
    image_url: 'https://picsum.photos/400/300?random=38',
    images: [
      'https://picsum.photos/400/300?random=38',
      'https://picsum.photos/400/300?random=39',
    ],
  },
  {
    id: '7',
    name: 'Belediye Meydanı Toplanma Alanı',
    description:
      'Belediye binası önü geniş meydan. Merkezi konum ve kolay erişim.',
    address: 'Belediye Mahallesi, Belediye Caddesi, Şehitkamil/Gaziantep',
    latitude: 37.0594,
    longitude: 37.3825,
    capacity: 3000,
    features: ['Su', 'Tuvalet', 'İlk Yardım', 'Park Yeri', 'Açık Alan', 'Merkezi Konum'],
    contactPhone: '+90 342 777 88 99',
    image_url: 'https://picsum.photos/400/300?random=40',
  },
  {
    id: '8',
    name: 'Güvenlik Mahallesi Toplanma Alanı',
    description:
      'Mahalle toplanma alanı. Açık alan ve temel ihtiyaçlar.',
    address: 'Güvenlik Mahallesi, Güvenlik Caddesi, Şehitkamil/Gaziantep',
    latitude: 37.0580,
    longitude: 37.3810,
    capacity: 1200,
    features: ['Su', 'Tuvalet', 'Park Yeri', 'Açık Alan'],
    contactPhone: '+90 342 888 99 00',
    image_url: 'https://picsum.photos/400/300?random=41',
  },
];

