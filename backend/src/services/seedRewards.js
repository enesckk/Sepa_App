const { Reward } = require('../models');

/**
 * Seed initial rewards for Gölmarket
 * This can be run manually or on server start
 */
const seedRewards = async () => {
  try {
    const rewards = [
      // Kahve Ödülleri (50 puan)
      {
        title: '1 Kahve',
        description: 'Anlaşmalı kafelerde geçerli 1 adet kahve kuponu',
        category: 'partner',
        points: 50,
        stock: 100,
        validity_days: 30,
        partner_name: 'Anlaşmalı Kafeler',
        is_active: true,
      },
      {
        title: '2 Kahve',
        description: 'Anlaşmalı kafelerde geçerli 2 adet kahve kuponu',
        category: 'partner',
        points: 90,
        stock: 50,
        validity_days: 30,
        partner_name: 'Anlaşmalı Kafeler',
        is_active: true,
      },
      // Tiyatro Ödülleri
      {
        title: '%50 Tiyatro Bileti',
        description: 'Şehitkamil Kültür Merkezi tiyatro gösterilerinde geçerli',
        category: 'discount',
        points: 100,
        stock: 30,
        validity_days: 60,
        partner_name: 'Şehitkamil Kültür Merkezi',
        is_active: true,
      },
      {
        title: 'Ücretsiz Tiyatro Bileti',
        description: 'Şehitkamil Kültür Merkezi tiyatro gösterilerinde geçerli',
        category: 'experience',
        points: 200,
        stock: 20,
        validity_days: 60,
        partner_name: 'Şehitkamil Kültür Merkezi',
        is_active: true,
      },
      // Fiziksel Ödüller
      {
        title: 'Belediye Logolu T-Shirt',
        description: 'Şehitkamil Belediyesi özel tasarım t-shirt',
        category: 'physical',
        points: 150,
        stock: 25,
        validity_days: 90,
        partner_name: 'Şehitkamil Belediyesi',
        is_active: true,
      },
      {
        title: 'Belediye Logolu Çanta',
        description: 'Şehitkamil Belediyesi özel tasarım çanta',
        category: 'physical',
        points: 200,
        stock: 15,
        validity_days: 90,
        partner_name: 'Şehitkamil Belediyesi',
        is_active: true,
      },
      {
        title: 'Belediye Logolu Şapka',
        description: 'Şehitkamil Belediyesi özel tasarım şapka',
        category: 'physical',
        points: 100,
        stock: 30,
        validity_days: 90,
        partner_name: 'Şehitkamil Belediyesi',
        is_active: true,
      },
      {
        title: 'Bisiklet',
        description: 'Şehitkamil Belediyesi özel tasarım bisiklet',
        category: 'physical',
        points: 2000,
        stock: 5,
        validity_days: 180,
        partner_name: 'Şehitkamil Belediyesi',
        is_active: true,
      },
      {
        title: 'Kitap Seti',
        description: 'Eğitici ve eğlenceli kitap seti (5 kitap)',
        category: 'physical',
        points: 300,
        stock: 20,
        validity_days: 90,
        partner_name: 'Şehitkamil Belediyesi',
        is_active: true,
      },
      {
        title: 'Futbol Topu',
        description: 'Kaliteli futbol topu',
        category: 'physical',
        points: 250,
        stock: 15,
        validity_days: 90,
        partner_name: 'Şehitkamil Belediyesi',
        is_active: true,
      },
      {
        title: 'Spor Ayakkabısı',
        description: 'Rahat ve dayanıklı spor ayakkabısı',
        category: 'physical',
        points: 800,
        stock: 10,
        validity_days: 120,
        partner_name: 'Şehitkamil Belediyesi',
        is_active: true,
      },
      {
        title: 'Basketbol Topu',
        description: 'Kaliteli basketbol topu',
        category: 'physical',
        points: 200,
        stock: 15,
        validity_days: 90,
        partner_name: 'Şehitkamil Belediyesi',
        is_active: true,
      },
      {
        title: 'Voleybol Topu',
        description: 'Kaliteli voleybol topu',
        category: 'physical',
        points: 180,
        stock: 15,
        validity_days: 90,
        partner_name: 'Şehitkamil Belediyesi',
        is_active: true,
      },
      {
        title: 'Çocuk Bisikleti',
        description: 'Güvenli çocuk bisikleti',
        category: 'physical',
        points: 1200,
        stock: 8,
        validity_days: 180,
        partner_name: 'Şehitkamil Belediyesi',
        is_active: true,
      },
      {
        title: 'Spor Çantası',
        description: 'Pratik ve dayanıklı spor çantası',
        category: 'physical',
        points: 150,
        stock: 25,
        validity_days: 90,
        partner_name: 'Şehitkamil Belediyesi',
        is_active: true,
      },
      {
        title: 'Su Matarası',
        description: 'Çevre dostu su matarası',
        category: 'physical',
        points: 80,
        stock: 50,
        validity_days: 90,
        partner_name: 'Şehitkamil Belediyesi',
        is_active: true,
      },
      {
        title: 'Havlu Seti',
        description: 'Kaliteli havlu seti (2 adet)',
        category: 'physical',
        points: 120,
        stock: 30,
        validity_days: 90,
        partner_name: 'Şehitkamil Belediyesi',
        is_active: true,
      },
      {
        title: 'Powerbank',
        description: '10000mAh güç bankası',
        category: 'physical',
        points: 400,
        stock: 12,
        validity_days: 90,
        partner_name: 'Şehitkamil Belediyesi',
        is_active: true,
      },
      // Spor Salonu
      {
        title: '1 Aylık Spor Salonu Üyeliği',
        description: 'Anlaşmalı spor salonlarında geçerli 1 aylık üyelik',
        category: 'experience',
        points: 300,
        stock: 10,
        validity_days: 90,
        partner_name: 'Anlaşmalı Spor Salonları',
        is_active: true,
      },
      // İndirim Kuponları
      {
        title: '%20 Belediye Hizmetleri İndirimi',
        description: 'Belediye hizmetlerinde geçerli %20 indirim kuponu',
        category: 'discount',
        points: 75,
        stock: null, // Sınırsız
        validity_days: 30,
        partner_name: 'Şehitkamil Belediyesi',
        is_active: true,
      },
      {
        title: '%10 Belediye Hizmetleri İndirimi',
        description: 'Belediye hizmetlerinde geçerli %10 indirim kuponu',
        category: 'discount',
        points: 40,
        stock: null, // Sınırsız
        validity_days: 30,
        partner_name: 'Şehitkamil Belediyesi',
        is_active: true,
      },
    ];

    // Check if rewards already exist
    const existingCount = await Reward.count();
    if (existingCount > 0) {
      console.log('ℹ️  Rewards already exist, checking for missing rewards...');
      
      // Check which rewards are missing and add them
      const existingTitles = (await Reward.findAll({ attributes: ['title'] })).map(r => r.title);
      const newRewards = rewards.filter(r => !existingTitles.includes(r.title));
      
      if (newRewards.length > 0) {
        await Reward.bulkCreate(newRewards);
        console.log(`✅ ${newRewards.length} new rewards added successfully`);
      } else {
        console.log('ℹ️  All rewards already exist');
      }
      return;
    }

    // Create rewards
    await Reward.bulkCreate(rewards);
    console.log(`✅ ${rewards.length} rewards seeded successfully`);
  } catch (error) {
    console.error('❌ Error seeding rewards:', error.message);
  }
};

module.exports = { seedRewards };

