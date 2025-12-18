// Mock events data
export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  category: 'konser' | 'tiyatro' | 'spor' | 'kultur' | 'egitim' | 'sosyal';
  location: string;
  latitude?: number;
  longitude?: number;
  isFree: boolean;
  isFamilyFriendly: boolean;
  price?: number;
  capacity: number;
  registered: number;
  golbucksReward: number;
}

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Yaz Konseri - Gaziantep Orkestrası',
    description: 'Şehitkamil Belediyesi yaz konseri serisinin ilki. Gaziantep Senfoni Orkestrası eşliğinde unutulmaz bir akşam.',
    image: 'https://picsum.photos/400/300?random=1',
    date: '2024-03-15',
    time: '20:00',
    category: 'konser',
    location: 'Şehitkamil Kültür Merkezi',
    latitude: 37.0662,
    longitude: 37.3833,
    isFree: false,
    isFamilyFriendly: true,
    price: 50,
    capacity: 500,
    registered: 320,
    golbucksReward: 50,
  },
  {
    id: '2',
    title: 'Çocuk Tiyatrosu - Kırmızı Başlıklı Kız',
    description: 'Çocuklar için özel tiyatro gösterisi. 3-12 yaş arası çocuklar için uygundur.',
    image: 'https://picsum.photos/400/300?random=2',
    date: '2024-03-12',
    time: '14:00',
    category: 'tiyatro',
    location: 'Şehitkamil Çocuk Merkezi',
    latitude: 37.0662,
    longitude: 37.3833,
    isFree: true,
    isFamilyFriendly: true,
    capacity: 200,
    registered: 150,
    golbucksReward: 30,
  },
  {
    id: '3',
    title: 'Futbol Turnuvası - Mahalleler Arası',
    description: 'Şehitkamil mahalleleri arası futbol turnuvası. Final maçı ve ödül töreni.',
    image: 'https://picsum.photos/400/300?random=3',
    date: '2024-03-18',
    time: '15:00',
    category: 'spor',
    location: 'Şehitkamil Stadyumu',
    latitude: 37.0662,
    longitude: 37.3833,
    isFree: true,
    isFamilyFriendly: true,
    capacity: 1000,
    registered: 450,
    golbucksReward: 40,
  },
  {
    id: '4',
    title: 'Kitap Okuma Günü',
    description: 'Toplumsal kitap okuma etkinliği. Tüm vatandaşlarımız davetlidir.',
    image: 'https://picsum.photos/400/300?random=4',
    date: '2024-03-10',
    time: '10:00',
    category: 'kultur',
    location: 'Şehitkamil Kütüphanesi',
    latitude: 37.0662,
    longitude: 37.3833,
    isFree: true,
    isFamilyFriendly: true,
    capacity: 300,
    registered: 180,
    golbucksReward: 25,
  },
  {
    id: '5',
    title: 'Dijital Okuryazarlık Kursu',
    description: 'Yaşlı vatandaşlarımız için ücretsiz dijital okuryazarlık kursu.',
    image: 'https://picsum.photos/400/300?random=5',
    date: '2024-03-20',
    time: '09:00',
    category: 'egitim',
    location: 'Şehitkamil Halk Eğitim Merkezi',
    latitude: 37.0662,
    longitude: 37.3833,
    isFree: true,
    isFamilyFriendly: false,
    capacity: 50,
    registered: 35,
    golbucksReward: 60,
  },
  {
    id: '6',
    title: 'Yerel Ürünler Fuarı',
    description: 'Gaziantep\'in yerel üreticilerinin katıldığı fuar. Organik ürünler ve el sanatları.',
    image: 'https://picsum.photos/400/300?random=6',
    date: '2024-03-22',
    time: '11:00',
    category: 'sosyal',
    location: 'Şehitkamil Fuar Alanı',
    latitude: 37.0662,
    longitude: 37.3833,
    isFree: true,
    isFamilyFriendly: true,
    capacity: 800,
    registered: 520,
    golbucksReward: 35,
  },
];

export const eventCategories = [
  { id: 'all', label: 'Tümü', icon: '🎭' },
  { id: 'konser', label: 'Konser', icon: '🎵' },
  { id: 'tiyatro', label: 'Tiyatro', icon: '🎭' },
  { id: 'spor', label: 'Spor', icon: '⚽' },
  { id: 'kultur', label: 'Kültür', icon: '📚' },
  { id: 'egitim', label: 'Eğitim', icon: '🎓' },
  { id: 'sosyal', label: 'Sosyal', icon: '🤝' },
];

