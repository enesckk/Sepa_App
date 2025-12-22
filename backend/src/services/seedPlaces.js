const { Place } = require('../models');

/**
 * Seed initial places (cami, eczane, tesis, nikah salonu)
 * This can be run manually or on server start
 */
const seedPlaces = async () => {
  try {
    const places = [
      // Camiler
      {
        name: 'Şehitkamil Merkez Camii',
        description: 'Şehitkamil ilçesinin merkez camisi',
        type: 'mosque',
        category: 'mosque',
        address: 'Merkez Mahallesi, Atatürk Bulvarı No:1, Şehitkamil/Gaziantep',
        latitude: 37.0662,
        longitude: 37.3833,
        phone: '0342 123 45 67',
        working_hours: '24/7',
        is_active: true,
      },
      {
        name: 'Fatih Camii',
        description: 'Fatih Mahallesi camisi',
        type: 'mosque',
        category: 'mosque',
        address: 'Fatih Mahallesi, İnönü Caddesi, Şehitkamil/Gaziantep',
        latitude: 37.0700,
        longitude: 37.3900,
        phone: '0342 234 56 78',
        working_hours: '24/7',
        is_active: true,
      },
      // Eczaneler
      {
        name: 'Merkez Eczanesi',
        description: '7/24 hizmet veren eczane',
        type: 'pharmacy',
        category: 'pharmacy',
        address: 'Merkez Mahallesi, Cumhuriyet Caddesi No:15, Şehitkamil/Gaziantep',
        latitude: 37.0680,
        longitude: 37.3850,
        phone: '0342 345 67 89',
        working_hours: '24/7',
        is_active: true,
      },
      {
        name: 'Sağlık Eczanesi',
        description: 'Nöbetçi eczane',
        type: 'pharmacy',
        category: 'pharmacy',
        address: 'Yeni Mahalle, Sağlık Sokak No:8, Şehitkamil/Gaziantep',
        latitude: 37.0720,
        longitude: 37.3880,
        phone: '0342 456 78 90',
        working_hours: '08:00-22:00',
        is_active: true,
      },
      // Nikah Salonları
      {
        name: 'Şehitkamil Nikah Salonu',
        description: 'Belediye nikah salonu',
        type: 'wedding',
        category: 'wedding',
        address: 'Belediye Binası, Nikah Salonu, Şehitkamil/Gaziantep',
        latitude: 37.0662,
        longitude: 37.3833,
        phone: '0342 111 22 33',
        working_hours: '09:00-17:00',
        features: ['Parking', 'Accessible', 'WiFi'],
        is_active: true,
      },
      // Parklar
      {
        name: 'Atatürk Parkı',
        description: 'Merkez park, çocuk oyun alanı ve yürüyüş yolları',
        type: 'park',
        category: 'park',
        address: 'Merkez Mahallesi, Atatürk Parkı, Şehitkamil/Gaziantep',
        latitude: 37.0650,
        longitude: 37.3820,
        working_hours: '06:00-23:00',
        features: ['Playground', 'Walking Path', 'Picnic Area'],
        is_active: true,
      },
      // Kültür Merkezleri
      {
        name: 'Şehitkamil Kültür Merkezi',
        description: 'Tiyatro, konser ve kültürel etkinlikler',
        type: 'cultural',
        category: 'cultural',
        address: 'Kültür Mahallesi, Sanat Caddesi No:10, Şehitkamil/Gaziantep',
        latitude: 37.0640,
        longitude: 37.3810,
        phone: '0342 222 33 44',
        working_hours: '09:00-21:00',
        features: ['Theater', 'Concert Hall', 'Exhibition Space'],
        is_active: true,
      },
      // Spor Tesisleri
      {
        name: 'Şehitkamil Spor Kompleksi',
        description: 'Futbol sahası, basketbol sahası ve fitness salonu',
        type: 'sports',
        category: 'sports',
        address: 'Spor Mahallesi, Spor Caddesi No:20, Şehitkamil/Gaziantep',
        latitude: 37.0630,
        longitude: 37.3800,
        phone: '0342 333 44 55',
        working_hours: '06:00-22:00',
        features: ['Football Field', 'Basketball Court', 'Fitness Center'],
        is_active: true,
      },
    ];

    // Check if places already exist
    const existingCount = await Place.count();
    if (existingCount > 0) {
      console.log('ℹ️  Places already exist, skipping seed');
      return;
    }

    // Create places
    await Place.bulkCreate(places);
    console.log(`✅ ${places.length} places seeded successfully`);
  } catch (error) {
    console.error('❌ Error seeding places:', error.message);
  }
};

module.exports = { seedPlaces };

