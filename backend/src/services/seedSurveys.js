const { Survey, Question } = require('../models');

/**
 * Seed initial surveys with questions
 * This can be run manually or on server start
 */
const seedSurveys = async () => {
  try {
    // Check if surveys already exist
    const existingCount = await Survey.count();
    if (existingCount > 0) {
      console.log('ℹ️  Surveys already exist, checking for missing surveys...');
      
      // Check which surveys are missing and add them
      const existingTitles = (await Survey.findAll({ attributes: ['title'] })).map(s => s.title);
      const newSurveys = getSurveysData().filter(s => !existingTitles.includes(s.title));
      
      if (newSurveys.length > 0) {
        for (const surveyData of newSurveys) {
          await createSurveyWithQuestions(surveyData);
        }
        console.log(`✅ ${newSurveys.length} new surveys added successfully`);
      } else {
        console.log('ℹ️  All surveys already exist');
      }
      return;
    }

    // Create all surveys
    const surveysData = getSurveysData();
    for (const surveyData of surveysData) {
      await createSurveyWithQuestions(surveyData);
    }
    console.log(`✅ ${surveysData.length} surveys seeded successfully`);
  } catch (error) {
    console.error('❌ Error seeding surveys:', error.message);
    throw error;
  }
};

/**
 * Get surveys data
 */
const getSurveysData = () => {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setMonth(expiresAt.getMonth() + 3); // 3 months from now

  return [
    {
      title: 'Belediye Hizmetleri Memnuniyet Anketi',
      description: 'Belediye hizmetlerimiz hakkındaki görüşlerinizi paylaşın. Görüşleriniz bizim için çok değerli!',
      status: 'active',
      golbucks_reward: 50,
      expires_at: expiresAt,
      is_active: true,
      questions: [
        {
          text: 'Genel olarak belediye hizmetlerinden memnun musunuz?',
          type: 'yes_no',
          options: ['Evet', 'Hayır'],
          is_required: true,
          order: 1,
        },
        {
          text: 'Belediye hizmetlerini nasıl değerlendirirsiniz?',
          type: 'rating',
          options: null,
          is_required: true,
          order: 2,
        },
        {
          text: 'En çok hangi belediye hizmetlerinden memnunsunuz? (Birden fazla seçebilirsiniz)',
          type: 'multiple_choice',
          options: [
            'Temizlik hizmetleri',
            'Park ve bahçe düzenlemeleri',
            'Sosyal etkinlikler',
            'Kültürel faaliyetler',
            'Spor tesisleri',
            'Eğitim programları',
            'Sağlık hizmetleri',
            'Ulaşım hizmetleri',
          ],
          is_required: true,
          order: 3,
        },
        {
          text: 'Belediye hizmetlerinde iyileştirilmesi gereken alanlar nelerdir?',
          type: 'text',
          options: null,
          is_required: false,
          order: 4,
        },
        {
          text: 'Belediye ile iletişim kurmak için hangi yöntemi tercih edersiniz?',
          type: 'single_choice',
          options: [
            'Mobil uygulama',
            'Web sitesi',
            'Telefon',
            'Belediye binası',
            'Sosyal medya',
          ],
          is_required: true,
          order: 5,
        },
      ],
    },
    {
      title: 'Çevre ve Temizlik Anketi',
      description: 'Çevre bilinci ve temizlik konularındaki görüşlerinizi paylaşın.',
      status: 'active',
      golbucks_reward: 40,
      expires_at: expiresAt,
      is_active: true,
      questions: [
        {
          text: 'Çevre temizliği konusunda kendinizi ne kadar bilinçli görüyorsunuz?',
          type: 'rating',
          options: null,
          is_required: true,
          order: 1,
        },
        {
          text: 'Geri dönüşüm yapıyor musunuz?',
          type: 'yes_no',
          options: ['Evet', 'Hayır'],
          is_required: true,
          order: 2,
        },
        {
          text: 'Hangi geri dönüşüm malzemelerini ayırıyorsunuz? (Birden fazla seçebilirsiniz)',
          type: 'multiple_choice',
          options: [
            'Plastik',
            'Kağıt',
            'Cam',
            'Metal',
            'Pil',
            'Elektronik atık',
            'Hiçbiri',
          ],
          is_required: false,
          order: 3,
        },
        {
          text: 'Mahallenizdeki temizlik hizmetlerinden memnun musunuz?',
          type: 'single_choice',
          options: [
            'Çok memnunum',
            'Memnunum',
            'Kararsızım',
            'Memnun değilim',
            'Hiç memnun değilim',
          ],
          is_required: true,
          order: 4,
        },
        {
          text: 'Çevre temizliği konusunda önerileriniz nelerdir?',
          type: 'text',
          options: null,
          is_required: false,
          order: 5,
        },
      ],
    },
    {
      title: 'Sosyal Etkinlikler ve Kültürel Faaliyetler Anketi',
      description: 'Düzenlenen etkinlikler ve kültürel faaliyetler hakkındaki görüşlerinizi paylaşın.',
      status: 'active',
      golbucks_reward: 60,
      expires_at: expiresAt,
      is_active: true,
      questions: [
        {
          text: 'Belediye tarafından düzenlenen etkinliklere katılıyor musunuz?',
          type: 'yes_no',
          options: ['Evet', 'Hayır'],
          is_required: true,
          order: 1,
        },
        {
          text: 'Hangi tür etkinliklere katılmak istersiniz? (Birden fazla seçebilirsiniz)',
          type: 'multiple_choice',
          options: [
            'Konserler',
            'Tiyatro gösterileri',
            'Spor etkinlikleri',
            'Çocuk etkinlikleri',
            'Eğitim seminerleri',
            'Festivaller',
            'Sergiler',
            'Diğer',
          ],
          is_required: true,
          order: 2,
        },
        {
          text: 'Etkinliklerin düzenlenme sıklığını nasıl değerlendirirsiniz?',
          type: 'single_choice',
          options: [
            'Çok sık',
            'Yeterli',
            'Az',
            'Çok az',
          ],
          is_required: true,
          order: 3,
        },
        {
          text: 'Etkinliklerin kalitesini nasıl değerlendirirsiniz?',
          type: 'rating',
          options: null,
          is_required: true,
          order: 4,
        },
        {
          text: 'Hangi günlerde etkinlik düzenlenmesini tercih edersiniz? (Birden fazla seçebilirsiniz)',
          type: 'multiple_choice',
          options: [
            'Hafta içi akşam',
            'Cumartesi',
            'Pazar',
            'Resmi tatiller',
            'Fark etmez',
          ],
          is_required: false,
          order: 5,
        },
        {
          text: 'Etkinlikler hakkında önerileriniz nelerdir?',
          type: 'text',
          options: null,
          is_required: false,
          order: 6,
        },
      ],
    },
    {
      title: 'Spor ve Sağlık Anketi',
      description: 'Spor tesisleri ve sağlık hizmetleri hakkındaki görüşlerinizi paylaşın.',
      status: 'active',
      golbucks_reward: 45,
      expires_at: expiresAt,
      is_active: true,
      questions: [
        {
          text: 'Belediye spor tesislerini kullanıyor musunuz?',
          type: 'yes_no',
          options: ['Evet', 'Hayır'],
          is_required: true,
          order: 1,
        },
        {
          text: 'Hangi spor tesislerini kullanıyorsunuz? (Birden fazla seçebilirsiniz)',
          type: 'multiple_choice',
          options: [
            'Futbol sahaları',
            'Basketbol sahaları',
            'Tenis kortları',
            'Yüzme havuzu',
            'Spor salonu',
            'Koşu parkurları',
            'Çocuk oyun alanları',
            'Hiçbiri',
          ],
          is_required: false,
          order: 2,
        },
        {
          text: 'Spor tesislerinin kalitesini nasıl değerlendirirsiniz?',
          type: 'rating',
          options: null,
          is_required: true,
          order: 3,
        },
        {
          text: 'Haftada kaç gün spor yapıyorsunuz?',
          type: 'number',
          options: null,
          is_required: false,
          order: 4,
        },
        {
          text: 'Spor tesislerinde hangi iyileştirmeleri istersiniz?',
          type: 'text',
          options: null,
          is_required: false,
          order: 5,
        },
      ],
    },
    {
      title: 'Ulaşım ve Trafik Anketi',
      description: 'Ulaşım hizmetleri ve trafik düzenlemeleri hakkındaki görüşlerinizi paylaşın.',
      status: 'active',
      golbucks_reward: 50,
      expires_at: expiresAt,
      is_active: true,
      questions: [
        {
          text: 'Günlük ulaşımınızı nasıl sağlıyorsunuz?',
          type: 'single_choice',
          options: [
            'Özel araç',
            'Toplu taşıma',
            'Bisiklet',
            'Yürüyerek',
            'Diğer',
          ],
          is_required: true,
          order: 1,
        },
        {
          text: 'Mahallenizdeki trafik düzenlemelerinden memnun musunuz?',
          type: 'single_choice',
          options: [
            'Çok memnunum',
            'Memnunum',
            'Kararsızım',
            'Memnun değilim',
            'Hiç memnun değilim',
          ],
          is_required: true,
          order: 2,
        },
        {
          text: 'Toplu taşıma hizmetlerini kullanıyor musunuz?',
          type: 'yes_no',
          options: ['Evet', 'Hayır'],
          is_required: true,
          order: 3,
        },
        {
          text: 'Toplu taşıma hizmetlerinin kalitesini nasıl değerlendirirsiniz?',
          type: 'rating',
          options: null,
          is_required: false,
          order: 4,
        },
        {
          text: 'Ulaşım konusunda önerileriniz nelerdir?',
          type: 'text',
          options: null,
          is_required: false,
          order: 5,
        },
      ],
    },
    {
      title: 'Gençlik ve Eğitim Anketi',
      description: 'Gençlere yönelik eğitim programları ve faaliyetler hakkındaki görüşlerinizi paylaşın.',
      status: 'active',
      golbucks_reward: 55,
      expires_at: expiresAt,
      is_active: true,
      questions: [
        {
          text: 'Belediye tarafından düzenlenen eğitim programlarına katılıyor musunuz?',
          type: 'yes_no',
          options: ['Evet', 'Hayır'],
          is_required: true,
          order: 1,
        },
        {
          text: 'Hangi konularda eğitim programları düzenlenmesini istersiniz? (Birden fazla seçebilirsiniz)',
          type: 'multiple_choice',
          options: [
            'Teknoloji',
            'Dil eğitimi',
            'Mesleki eğitim',
            'Sanat',
            'Müzik',
            'Spor',
            'Kişisel gelişim',
            'Diğer',
          ],
          is_required: true,
          order: 2,
        },
        {
          text: 'Eğitim programlarının kalitesini nasıl değerlendirirsiniz?',
          type: 'rating',
          options: null,
          is_required: true,
          order: 3,
        },
        {
          text: 'Eğitim programlarının ücretsiz olması önemli mi?',
          type: 'yes_no',
          options: ['Evet', 'Hayır'],
          is_required: true,
          order: 4,
        },
        {
          text: 'Eğitim programları hakkında önerileriniz nelerdir?',
          type: 'text',
          options: null,
          is_required: false,
          order: 5,
        },
      ],
    },
  ];
};

/**
 * Create survey with questions
 */
const createSurveyWithQuestions = async (surveyData) => {
  const { questions, ...surveyFields } = surveyData;
  
  const survey = await Survey.create(surveyFields);
  
  if (questions && questions.length > 0) {
    const questionRecords = questions.map(q => ({
      ...q,
      survey_id: survey.id,
    }));
    
    await Question.bulkCreate(questionRecords);
  }
  
  return survey;
};

module.exports = { seedSurveys };

