// Mock rewards data
export interface Reward {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'physical' | 'digital' | 'partner';
  price: number; // Gölbucks cinsinden
  stock?: number;
  validityDays?: number;
  partnerName?: string;
  qrCode?: string;
  referenceCode?: string;
}

export const mockRewards: Reward[] = [
  {
    id: '1',
    title: '1 Kahve',
    description: 'Anlaşmalı kafelerde geçerli 1 adet kahve kuponu. Sıcak veya soğuk içecek seçeneği mevcuttur.',
    image: 'https://picsum.photos/300/300?random=coffee',
    category: 'partner',
    price: 100,
    stock: 50,
    validityDays: 30,
    partnerName: 'Starbucks, Kahve Dünyası',
    qrCode: 'COFFEE-2024-001',
  },
  {
    id: '2',
    title: '%50 Tiyatro Bileti',
    description: 'Şehitkamil Kültür Merkezi tiyatro gösterilerinde geçerli %50 indirim kuponu.',
    image: 'https://picsum.photos/300/300?random=theater',
    category: 'digital',
    price: 200,
    stock: 20,
    validityDays: 60,
    referenceCode: 'THEATER-50-2024',
  },
  {
    id: '3',
    title: 'Belediye Logolu T-Shirt',
    description: 'Şehitkamil Belediyesi özel tasarım t-shirt. %100 pamuk, çeşitli bedenler mevcuttur.',
    image: 'https://picsum.photos/300/300?random=tshirt',
    category: 'physical',
    price: 300,
    stock: 15,
    validityDays: 90,
  },
  {
    id: '4',
    title: 'Spor Salonu 1 Aylık Üyelik',
    description: 'Anlaşmalı spor salonlarında 1 aylık ücretsiz üyelik. Tüm aktiviteler dahil.',
    image: 'https://picsum.photos/300/300?random=gym',
    category: 'partner',
    price: 500,
    stock: 10,
    validityDays: 90,
    partnerName: 'FitZone, PowerGym',
    qrCode: 'GYM-2024-001',
  },
  {
    id: '5',
    title: 'Sinema Bileti',
    description: 'Anlaşmalı sinema salonlarında geçerli 1 adet sinema bileti kuponu.',
    image: 'https://picsum.photos/300/300?random=cinema',
    category: 'partner',
    price: 150,
    stock: 30,
    validityDays: 45,
    partnerName: 'CinemaMax, MovieWorld',
    qrCode: 'CINEMA-2024-001',
  },
  {
    id: '6',
    title: 'Belediye Yıllık Ajanda',
    description: '2024 yılı için özel tasarım ajanda. Ciltli, takvim ve not sayfaları içerir.',
    image: 'https://picsum.photos/300/300?random=planner',
    category: 'physical',
    price: 250,
    stock: 25,
    validityDays: 365,
  },
  {
    id: '7',
    title: 'Restoran %25 İndirim',
    description: 'Anlaşmalı restoranlarda geçerli %25 indirim kuponu. Tüm menü için geçerlidir.',
    image: 'https://picsum.photos/300/300?random=restaurant',
    category: 'partner',
    price: 180,
    stock: 40,
    validityDays: 30,
    partnerName: 'Lezzet Durağı, Şehir Sofrası',
    qrCode: 'REST-2024-001',
  },
  {
    id: '8',
    title: 'E-Kitap Kuponu',
    description: 'Dijital kütüphane platformunda geçerli e-kitap indirme kuponu. 5 kitap seçme hakkı.',
    image: 'https://picsum.photos/300/300?random=ebook',
    category: 'digital',
    price: 120,
    stock: 100,
    validityDays: 60,
    referenceCode: 'EBOOK-2024-001',
  },
];

export const rewardCategories = [
  { id: 'all', label: 'Tümü', icon: '🎁' },
  { id: 'physical', label: 'Fiziksel Ödüller', icon: '📦' },
  { id: 'digital', label: 'Dijital Kuponlar', icon: '💳' },
  { id: 'partner', label: 'Anlaşmalı İşletmeler', icon: '🤝' },
];

