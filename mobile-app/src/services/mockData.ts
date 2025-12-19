// Mock data for development
export const mockWeatherData = {
  temperature: 22,
  condition: 'Güneşli',
  humidity: 65,
  windSpeed: 12,
  icon: 'sunny',
};

export interface Story {
  id: string;
  image: string;
  title: string;
  description: string;
  isViewed?: boolean; // İzlenme durumu
}

export const mockStories: Story[] = [
  {
    id: '1',
    image: 'https://via.placeholder.com/300x400/2E7D32/FFFFFF?text=Başkan',
    title: 'Başkan',
    description: 'Başkan\'ın güncel paylaşımları',
    isViewed: false,
  },
  {
    id: '2',
    image: 'https://via.placeholder.com/300x400/4CAF50/FFFFFF?text=Projeler',
    title: 'Projeler',
    description: 'Yeni projeler ve gelişmeler',
    isViewed: true,
  },
  {
    id: '3',
    image: 'https://via.placeholder.com/300x400/1B5E20/FFFFFF?text=Etkinlikler',
    title: 'Etkinlikler',
    description: 'Yaklaşan etkinlikler',
    isViewed: false,
  },
  {
    id: '4',
    image: 'https://via.placeholder.com/300x400/388E3C/FFFFFF?text=Çevre',
    title: 'Çevre Çalışması',
    description: 'Çevre projeleri ve faaliyetler',
    isViewed: true,
  },
  {
    id: '5',
    image: 'https://via.placeholder.com/300x400/66BB6A/FFFFFF?text=Spor',
    title: 'Spor',
    description: 'Spor etkinlikleri ve turnuvalar',
    isViewed: false,
  },
];

export const mockNotices = [
  'Yarın su kesintisi olacaktır. Planlamanızı buna göre yapın.',
  'Yeni park alanı açılışı 15 Mart\'ta gerçekleşecek.',
  'Kültür merkezi kayıtları başladı. Detaylar için tıklayın.',
];

