/**
 * Mock events data
 * This file contains sample event data for development and testing
 */

// Extended Event interface for mock data (includes additional fields for UI)
export interface Event {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  date: string; // YYYY-MM-DD format
  time?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  category: string;
  is_free: boolean; // Backend uses snake_case
  isFree?: boolean; // UI convenience (computed from is_free)
  isFamilyFriendly?: boolean; // UI-only field
  price?: number;
  capacity: number;
  registered: number;
  golbucks_reward: number; // Backend uses snake_case
  golbucksReward?: number; // UI convenience (computed from golbucks_reward)
  is_active: boolean;
  created_at: string;
}

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Şehitkamil Kültür Festivali',
    description:
      'Şehitkamil Belediyesi tarafından düzenlenen geleneksel kültür festivali. Müzik, dans, tiyatro ve yerel lezzetlerle dolu bir hafta sonu sizi bekliyor.',
    image_url: 'https://picsum.photos/400/300?random=1',
    date: new Date().toISOString().split('T')[0], // Today
    time: '14:00',
    location: 'Şehitkamil Kültür Merkezi',
    latitude: 37.0662,
    longitude: 37.3833,
    category: 'kultur',
    is_free: true,
    isFree: true,
    isFamilyFriendly: true,
    capacity: 500,
    registered: 234,
    golbucks_reward: 50,
    golbucksReward: 50,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Çocuklar İçin Bilim Atölyesi',
    description:
      '7-12 yaş arası çocuklar için eğlenceli bilim deneyleri ve atölye çalışmaları. Çocuklarınız bilimin eğlenceli dünyasını keşfedecek.',
    image_url: 'https://picsum.photos/400/300?random=2',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: '10:00',
    location: 'Şehitkamil Bilim Merkezi',
    latitude: 37.0662,
    longitude: 37.3833,
    category: 'egitim',
    is_free: true,
    isFree: true,
    isFamilyFriendly: true,
    capacity: 30,
    registered: 18,
    golbucks_reward: 30,
    golbucksReward: 30,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Yoga ve Meditasyon Seansı',
    description:
      'Haftalık yoga ve meditasyon seansı. Stres atmak ve zihinsel sağlığınızı korumak için harika bir fırsat.',
    image_url: 'https://picsum.photos/400/300?random=3',
    date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // Day after tomorrow
    time: '18:00',
    location: 'Şehitkamil Spor Kompleksi',
    latitude: 37.0662,
    longitude: 37.3833,
    category: 'sosyal',
    is_free: false,
    isFree: false,
    isFamilyFriendly: false,
    price: 25,
    capacity: 40,
    registered: 12,
    golbucks_reward: 20,
    golbucksReward: 20,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Yerel Sanatçılar Konseri',
    description:
      'Gaziantep\'in yetenekli yerel sanatçılarının sahne alacağı özel bir konser gecesi. Müziğin büyülü dünyasında kaybolun.',
    image_url: 'https://picsum.photos/400/300?random=4',
    date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    time: '20:00',
    location: 'Şehitkamil Açık Hava Tiyatrosu',
    latitude: 37.0662,
    longitude: 37.3833,
    category: 'konser',
    is_free: true,
    isFree: true,
    isFamilyFriendly: true,
    capacity: 300,
    registered: 156,
    golbucks_reward: 40,
    golbucksReward: 40,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Çevre Temizlik Etkinliği',
    description:
      'Mahallemizi temiz tutmak için birlikte çalışalım. Çevre bilinci ve farkındalık oluşturma etkinliği.',
    image_url: 'https://picsum.photos/400/300?random=5',
    date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    time: '09:00',
    location: 'Şehitkamil Parkı',
    latitude: 37.0662,
    longitude: 37.3833,
    category: 'sosyal',
    is_free: true,
    isFree: true,
    isFamilyFriendly: true,
    capacity: 100,
    registered: 67,
    golbucks_reward: 60,
    golbucksReward: 60,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Dijital Okuryazarlık Kursu',
    description:
      'Yaşlı vatandaşlarımız için temel bilgisayar ve internet kullanımı kursu. Teknoloji dünyasına adım atın.',
    image_url: 'https://picsum.photos/400/300?random=6',
    date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    time: '14:00',
    location: 'Şehitkamil Halk Eğitim Merkezi',
    latitude: 37.0662,
    longitude: 37.3833,
    category: 'egitim',
    is_free: true,
    isFree: true,
    isFamilyFriendly: false,
    capacity: 25,
    registered: 8,
    golbucks_reward: 35,
    golbucksReward: 35,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Açık Hava Sinema Gecesi',
    description:
      'Yaz akşamlarında açık havada sinema keyfi. Ailece izleyebileceğiniz özel film gösterimi.',
    image_url: 'https://picsum.photos/400/300?random=7',
    date: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    time: '21:00',
    location: 'Şehitkamil Belediye Bahçesi',
    latitude: 37.0662,
    longitude: 37.3833,
    category: 'tiyatro',
    is_free: true,
    isFree: true,
    isFamilyFriendly: true,
    capacity: 200,
    registered: 89,
    golbucks_reward: 25,
    golbucksReward: 25,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    title: 'Spor Turnuvası',
    description:
      'Futbol, basketbol ve voleybol turnuvaları. Takım olarak kayıt olabilir veya bireysel katılım sağlayabilirsiniz.',
    image_url: 'https://picsum.photos/400/300?random=8',
    date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    time: '10:00',
    location: 'Şehitkamil Spor Kompleksi',
    latitude: 37.0662,
    longitude: 37.3833,
    category: 'spor',
    is_free: false,
    isFree: false,
    isFamilyFriendly: true,
    price: 50,
    capacity: 80,
    registered: 45,
    golbucks_reward: 75,
    golbucksReward: 75,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export interface EventCategory {
  id: string;
  label: string;
  icon: string;
}

export const eventCategories: EventCategory[] = [
  {
    id: 'all',
    label: 'Tümü',
    icon: '🌟',
  },
  {
    id: 'konser',
    label: 'Konser',
    icon: '🎵',
  },
  {
    id: 'tiyatro',
    label: 'Tiyatro',
    icon: '🎭',
  },
  {
    id: 'spor',
    label: 'Spor',
    icon: '⚽',
  },
  {
    id: 'kultur',
    label: 'Kültür',
    icon: '🎨',
  },
  {
    id: 'egitim',
    label: 'Eğitim',
    icon: '📚',
  },
  {
    id: 'sosyal',
    label: 'Sosyal',
    icon: '👥',
  },
];

