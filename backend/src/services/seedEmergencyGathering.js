const { EmergencyGathering } = require('../models');

/**
 * Seed initial emergency gathering areas
 * This can be run manually or on server start
 */
const seedEmergencyGathering = async () => {
  try {
    const areas = [
      {
        name: 'Şehitkamil Merkez Toplanma Alanı',
        description: 'Merkez mahalle toplanma alanı, geniş açık alan',
        address: 'Merkez Mahalle, Atatürk Bulvarı, Şehitkamil/Gaziantep',
        latitude: 37.0662,
        longitude: 37.3833,
        capacity: 5000,
        type: 'open_area',
        facilities: ['Water', 'Toilet', 'First Aid', 'Parking'],
        contact_phone: '0342 111 22 33',
        is_active: true,
      },
      {
        name: 'Şehitkamil Spor Kompleksi',
        description: 'Kapalı spor salonu, acil durumlarda toplanma alanı',
        address: 'Spor Mahallesi, Spor Caddesi No:20, Şehitkamil/Gaziantep',
        latitude: 37.0630,
        longitude: 37.3800,
        capacity: 3000,
        type: 'building',
        facilities: ['Water', 'Toilet', 'First Aid', 'Shelter', 'Parking'],
        contact_phone: '0342 222 33 44',
        is_active: true,
      },
      {
        name: 'Atatürk Parkı Toplanma Alanı',
        description: 'Park alanı, açık hava toplanma noktası',
        address: 'Merkez Mahalle, Atatürk Parkı, Şehitkamil/Gaziantep',
        latitude: 37.0650,
        longitude: 37.3820,
        capacity: 2000,
        type: 'park',
        facilities: ['Water', 'Toilet', 'Parking'],
        contact_phone: '0342 333 44 55',
        is_active: true,
      },
      {
        name: 'Yenişehir İlkokulu',
        description: 'Okul binası, kapalı alan toplanma noktası',
        address: 'Yenişehir Mahallesi, Eğitim Caddesi No:15, Şehitkamil/Gaziantep',
        latitude: 37.0700,
        longitude: 37.3900,
        capacity: 1500,
        type: 'school',
        facilities: ['Water', 'Toilet', 'First Aid', 'Shelter'],
        contact_phone: '0342 444 55 66',
        is_active: true,
      },
      {
        name: 'Fatih Mahalle Toplanma Alanı',
        description: 'Açık alan toplanma noktası',
        address: 'Fatih Mahallesi, İnönü Caddesi, Şehitkamil/Gaziantep',
        latitude: 37.0720,
        longitude: 37.3920,
        capacity: 1000,
        type: 'open_area',
        facilities: ['Water', 'Parking'],
        contact_phone: '0342 555 66 77',
        is_active: true,
      },
    ];

    // Check if areas already exist
    const existingCount = await EmergencyGathering.count();
    if (existingCount > 0) {
      console.log('ℹ️  Emergency gathering areas already exist, skipping seed');
      return;
    }

    // Create areas
    await EmergencyGathering.bulkCreate(areas);
    console.log(`✅ ${areas.length} emergency gathering areas seeded successfully`);
  } catch (error) {
    console.error('❌ Error seeding emergency gathering areas:', error.message);
  }
};

module.exports = { seedEmergencyGathering };

