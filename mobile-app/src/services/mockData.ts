/**
 * Mock stories data
 * This file contains sample story data for development and testing
 */

export interface Story {
  id: string;
  title: string;
  description?: string;
  image: string; // image_url yerine image kullanılıyor component'lerde
  isViewed?: boolean; // computed - kullanıcı tarafından izlenip izlenmediği
}

export const mockStories: Story[] = [
  {
    id: '1',
    title: 'Yeni Etkinlikler',
    description: 'Bu ay düzenlenecek etkinlikleri keşfedin',
    image: 'https://picsum.photos/400/600?random=51',
    isViewed: false,
  },
  {
    id: '2',
    title: 'Belediye Duyuruları',
    description: 'Önemli duyurular ve haberler',
    image: 'https://picsum.photos/400/600?random=52',
    isViewed: false,
  },
  {
    id: '3',
    title: 'Kültür Festivali',
    description: 'Şehitkamil Kültür Festivali başlıyor!',
    image: 'https://picsum.photos/400/600?random=53',
    isViewed: true,
  },
  {
    id: '4',
    title: 'Spor Etkinlikleri',
    description: 'Haftalık spor programları',
    image: 'https://picsum.photos/400/600?random=54',
    isViewed: false,
  },
  {
    id: '5',
    title: 'Çevre Projesi',
    description: 'Sıfır Atık projesi hakkında bilgiler',
    image: 'https://picsum.photos/400/600?random=55',
    isViewed: false,
  },
  {
    id: '6',
    title: 'Eğitim Kursları',
    description: 'Ücretsiz kurslar ve eğitimler',
    image: 'https://picsum.photos/400/600?random=56',
    isViewed: true,
  },
  {
    id: '7',
    title: 'Sağlık Hizmetleri',
    description: 'Ücretsiz sağlık taramaları',
    image: 'https://picsum.photos/400/600?random=57',
    isViewed: false,
  },
  {
    id: '8',
    title: 'Sosyal Yardımlar',
    description: 'Belediye sosyal yardım programları',
    image: 'https://picsum.photos/400/600?random=58',
    isViewed: false,
  },
];

/**
 * Mock weather data
 */
export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export const mockWeatherData: WeatherData = {
  temperature: 22,
  condition: 'Güneşli',
  humidity: 45,
  windSpeed: 12,
};

/**
 * Mock notices data
 */
export interface Notice {
  id: string;
  message: string;
  type?: 'info' | 'warning' | 'error';
}

export const mockNotices: Notice[] = [
  {
    id: '1',
    message: 'Şehitkamil Belediyesi yeni hizmetlerini keşfedin',
    type: 'info',
  },
  {
    id: '2',
    message: 'Günlük ödülünüzü almayı unutmayın!',
    type: 'warning',
  },
  {
    id: '3',
    message: 'Yeni etkinlikler için takipte kalın',
    type: 'info',
  },
];

