// Mock surveys data
export interface SurveyOption {
  id: string;
  text: string;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  type: 'single' | 'multiple';
  options: SurveyOption[];
  reward: number; // Gölbucks reward
  isCompleted?: boolean;
}

export const mockSurveys: Survey[] = [
  {
    id: '1',
    title: 'Şehitkamil Belediyesi Hizmet Memnuniyeti Anketi',
    description: 'Belediye hizmetlerimiz hakkındaki görüşlerinizi paylaşın',
    type: 'single',
    options: [
      { id: '1', text: 'Çok Memnunum' },
      { id: '2', text: 'Memnunum' },
      { id: '3', text: 'Kararsızım' },
      { id: '4', text: 'Memnun Değilim' },
      { id: '5', text: 'Hiç Memnun Değilim' },
    ],
    reward: 20,
  },
  {
    id: '2',
    title: 'Yeni Park Alanı Önerileri',
    description: 'Hangi bölgelerde park alanı açılmasını istersiniz?',
    type: 'multiple',
    options: [
      { id: '1', text: 'Merkez Mahalle' },
      { id: '2', text: 'Yenişehir' },
      { id: '3', text: 'Güney Mahalle' },
      { id: '4', text: 'Kuzey Mahalle' },
      { id: '5', text: 'Doğu Mahalle' },
    ],
    reward: 30,
  },
  {
    id: '3',
    title: 'Toplu Taşıma Kullanım Sıklığı',
    description: 'Belediye otobüslerini ne sıklıkla kullanıyorsunuz?',
    type: 'single',
    options: [
      { id: '1', text: 'Her Gün' },
      { id: '2', text: 'Haftada Birkaç Kez' },
      { id: '3', text: 'Ayda Birkaç Kez' },
      { id: '4', text: 'Nadiren' },
      { id: '5', text: 'Hiç Kullanmıyorum' },
    ],
    reward: 25,
  },
];

