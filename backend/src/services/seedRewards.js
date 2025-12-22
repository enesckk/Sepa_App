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
      console.log('ℹ️  Rewards already exist, skipping seed');
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

