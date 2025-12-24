const { Event } = require('../models');
const { sequelize } = require('../config/database');

/**
 * Seed events into database
 * Creates sample events if they don't exist
 */
const seedEvents = async () => {
  try {
    console.log('🌱 Seeding events...');

    const events = [
      {
        title: 'Ukkaşe Gezisi',
        description: `Şehitkamil Belediyesi olarak düzenlediğimiz Ukkaşe Gezisi'ne katılmak için başvurunuzu yapın. Gezi sırasında rehber eşliğinde tarihi ve kültürel yerleri ziyaret edeceğiz.

**Gezi Detayları:**
- Tarih: Belirlenecek
- Süre: 1 Gün
- Ulaşım: Belediye tarafından sağlanacak
- Öğle Yemeği: Dahil
- Rehber: Profesyonel rehber eşliğinde

**Başvuru Şartları:**
- TC Kimlik Numarası
- İsim ve Soyisim
- Telefon Numarası
- E-posta Adresi

**Önemli Notlar:**
- Gezi kontenjanı sınırlıdır
- Başvurular öncelik sırasına göre değerlendirilecektir
- Gezi günü yanınızda kimlik belgenizi bulundurmanız gerekmektedir`,
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 gün sonra
        time: '08:00',
        location: 'Şehitkamil Belediyesi Önü',
        latitude: 37.0662,
        longitude: 37.3833,
        category: 'kultur',
        is_free: true,
        price: 0,
        capacity: 50,
        registered: 0,
        golbucks_reward: 100,
        is_active: true,
        image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
      },
      {
        title: 'Ankara Gezisi',
        description: `Şehitkamil Belediyesi tarafından düzenlenen Ankara Gezisi'ne katılarak başkentimizin tarihi ve kültürel zenginliklerini keşfedin.

**Gezi Programı:**
- Anıtkabir ziyareti
- TBMM gezisi
- Ankara Kalesi
- Anadolu Medeniyetleri Müzesi
- Atatürk Orman Çiftliği

**Gezi Detayları:**
- Tarih: Belirlenecek
- Süre: 2 Gün 1 Gece
- Konaklama: 3 yıldızlı otel
- Ulaşım: Lüks otobüs
- Tüm öğünler dahil

**Başvuru Şartları:**
- TC Kimlik Numarası (zorunlu)
- İsim ve Soyisim (zorunlu)
- Telefon Numarası (zorunlu)
- E-posta Adresi (zorunlu)
- Sağlık durumu bilgisi (varsa özel durumlar)

**Önemli Notlar:**
- Gezi kontenjanı 40 kişi ile sınırlıdır
- Başvurular öncelik sırasına göre değerlendirilecektir
- Gezi sırasında kimlik belgenizi yanınızda bulundurmanız zorunludur
- Gezi programı hava koşullarına göre değişiklik gösterebilir`,
        date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 45 gün sonra
        time: '07:00',
        location: 'Şehitkamil Belediyesi Önü',
        latitude: 37.0662,
        longitude: 37.3833,
        category: 'kultur',
        is_free: false,
        price: 500.00,
        capacity: 40,
        registered: 0,
        golbucks_reward: 200,
        is_active: true,
        image_url: 'https://images.unsplash.com/photo-1580073148780-8f4a69f6d15a?w=800',
      },
    ];

    let createdCount = 0;
    let existingCount = 0;

    for (const eventData of events) {
      const [event, created] = await Event.findOrCreate({
        where: { title: eventData.title },
        defaults: eventData,
      });

      if (created) {
        createdCount++;
        console.log(`  ✅ Oluşturuldu: ${eventData.title}`);
      } else {
        existingCount++;
        // Update existing event if needed
        await event.update(eventData);
        console.log(`  ℹ️  Güncellendi: ${eventData.title}`);
      }
    }

    console.log(`\n✅ Etkinlik seed işlemi tamamlandı!`);
    console.log(`   📊 Oluşturulan: ${createdCount}`);
    console.log(`   🔄 Güncellenen: ${existingCount}`);
    console.log(`   📋 Toplam: ${events.length}`);

    return {
      success: true,
      created: createdCount,
      updated: existingCount,
      total: events.length,
    };
  } catch (error) {
    console.error('❌ Etkinlik seed hatası:', error);
    throw error;
  }
};

// Run seed if called directly
if (require.main === module) {
  seedEvents()
    .then(() => {
      console.log('✅ Seed işlemi başarıyla tamamlandı');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed işlemi başarısız:', error);
      process.exit(1);
    });
}

module.exports = seedEvents;
