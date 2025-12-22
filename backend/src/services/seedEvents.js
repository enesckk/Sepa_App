const { Event } = require('../models');

/**
 * Seed initial events
 * This can be run manually or on server start
 */
const seedEvents = async () => {
  try {
    const events = [
      {
        title: 'Yaz Konseri',
        description: 'Gaziantep Senfoni Orkestrası eşliğinde unutulmaz bir akşam. Klasik müzik severler için özel bir konser.',
        date: '2024-07-15',
        time: '20:00:00',
        location: 'Şehitkamil Kültür Merkezi',
        latitude: 37.0662,
        longitude: 37.3833,
        category: 'konser',
        is_free: false,
        price: 50.00,
        capacity: 500,
        registered: 0,
        golbucks_reward: 50,
        is_active: true,
      },
      {
        title: 'Çocuk Tiyatrosu',
        description: 'Çocuklar için özel tiyatro gösterisi. Eğlenceli ve eğitici bir oyun.',
        date: '2024-07-12',
        time: '14:00:00',
        location: 'Şehitkamil Çocuk Merkezi',
        latitude: 37.0662,
        longitude: 37.3833,
        category: 'tiyatro',
        is_free: true,
        price: null,
        capacity: 200,
        registered: 0,
        golbucks_reward: 30,
        is_active: true,
      },
      {
        title: 'Spor Festivali',
        description: 'Açık hava spor aktiviteleri, yarışmalar ve eğlenceli etkinlikler.',
        date: '2024-08-01',
        time: '10:00:00',
        location: 'Şehitkamil Spor Kompleksi',
        latitude: 37.0662,
        longitude: 37.3833,
        category: 'spor',
        is_free: true,
        price: null,
        capacity: 1000,
        registered: 0,
        golbucks_reward: 25,
        is_active: true,
      },
      {
        title: 'Kitap Fuarı',
        description: 'Yazarlarla buluşma, imza günleri ve kitap söyleşileri.',
        date: '2024-08-20',
        time: '11:00:00',
        location: 'Şehitkamil Kültür Merkezi',
        latitude: 37.0662,
        longitude: 37.3833,
        category: 'kültür',
        is_free: true,
        price: null,
        capacity: 300,
        registered: 0,
        golbucks_reward: 20,
        is_active: true,
      },
      {
        title: 'Yemek Festivali',
        description: 'Gaziantep mutfağının lezzetlerini keşfedin. Yerel yemekler ve atölyeler.',
        date: '2024-09-05',
        time: '12:00:00',
        location: 'Şehitkamil Belediye Meydanı',
        latitude: 37.0662,
        longitude: 37.3833,
        category: 'festival',
        is_free: true,
        price: null,
        capacity: 2000,
        registered: 0,
        golbucks_reward: 40,
        is_active: true,
      },
    ];

    // Check if events already exist
    const existingCount = await Event.count();
    if (existingCount > 0) {
      console.log('ℹ️  Events already exist, skipping seed');
      return;
    }

    // Create events
    await Event.bulkCreate(events);
    console.log(`✅ ${events.length} events seeded successfully`);
  } catch (error) {
    console.error('❌ Error seeding events:', error.message);
  }
};

module.exports = { seedEvents };

