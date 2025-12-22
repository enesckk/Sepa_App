const { News } = require('../models');

/**
 * Seed initial news items
 * This can be run manually or on server start
 */
const seedNews = async () => {
  try {
    const newsItems = [
      {
        title: 'Şehitkamil Belediyesi Yeni Projeleri Açıkladı',
        summary: 'Belediye başkanı yeni dönem projelerini vatandaşlarla paylaştı',
        content: 'Şehitkamil Belediyesi, 2024 yılı için planlanan yeni projeleri açıkladı. Projeler arasında park düzenlemeleri, yol yapım çalışmaları ve sosyal tesisler yer alıyor. Belediye Başkanı, vatandaşların ihtiyaçlarını ön planda tutarak çalışmalarına devam edeceklerini belirtti.',
        category: 'haber',
        published_at: new Date(),
        author: 'Şehitkamil Belediyesi',
        is_active: true,
      },
      {
        title: 'Su Kesintisi Duyurusu',
        summary: 'Yarın saat 10:00-16:00 arası su kesintisi olacaktır',
        content: 'Bakım çalışmaları nedeniyle yarın (15 Mart 2024) saat 10:00-16:00 arası Merkez Mahalle ve çevresinde su kesintisi olacaktır. Vatandaşlarımızın bu süre zarfında su kullanımını planlamaları önemle rica olunur.',
        category: 'duyuru',
        published_at: new Date(),
        author: 'Su İşleri Müdürlüğü',
        is_active: true,
      },
      {
        title: 'Yaz Konseri Başlıyor',
        summary: 'Gaziantep Senfoni Orkestrası eşliğinde unutulmaz bir akşam',
        content: 'Şehitkamil Kültür Merkezi\'nde düzenlenecek yaz konseri için biletler satışa çıktı. Konser 15 Temmuz 2024 tarihinde saat 20:00\'de başlayacak. Gaziantep Senfoni Orkestrası\'nın sahne alacağı konser için biletler belediye gişelerinden ve online platformlardan temin edilebilir.',
        category: 'etkinlik',
        published_at: new Date(),
        author: 'Kültür ve Sosyal İşler Müdürlüğü',
        is_active: true,
      },
      {
        title: 'Yeni Park Projesi Tamamlandı',
        summary: 'Merkez Mahalle\'de yeni park alanı hizmete açıldı',
        content: 'Merkez Mahalle\'de yapımı devam eden yeni park projesi tamamlandı. Park alanında çocuk oyun grupları, yürüyüş yolları, oturma alanları ve yeşil alanlar bulunuyor. Vatandaşlarımız park alanından ücretsiz olarak yararlanabilir.',
        category: 'proje',
        published_at: new Date(),
        author: 'Park ve Bahçeler Müdürlüğü',
        is_active: true,
      },
      {
        title: 'Belediye Hizmetleri Hakkında Basın Açıklaması',
        summary: 'Belediye başkanı basın mensuplarıyla bir araya geldi',
        content: 'Şehitkamil Belediye Başkanı, basın mensuplarıyla bir araya gelerek belediye hizmetleri hakkında bilgi verdi. Yapılan çalışmalar, devam eden projeler ve gelecek planları hakkında detaylı açıklamalar yapıldı.',
        category: 'basin',
        published_at: new Date(),
        author: 'Basın ve Halkla İlişkiler Müdürlüğü',
        is_active: true,
      },
    ];

    // Check if news already exist
    const existingCount = await News.count();
    if (existingCount > 0) {
      console.log('ℹ️  News already exist, skipping seed');
      return;
    }

    // Create news
    await News.bulkCreate(newsItems);
    console.log(`✅ ${newsItems.length} news items seeded successfully`);
  } catch (error) {
    console.error('❌ Error seeding news:', error.message);
  }
};

module.exports = { seedNews };

