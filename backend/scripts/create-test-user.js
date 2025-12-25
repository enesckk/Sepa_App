/**
 * Test Kullanıcı Oluşturma Scripti
 * 
 * Kullanım:
 * node scripts/create-test-user.js
 */

const { User } = require('../src/models');
const { sequelize } = require('../src/config/database');

async function createTestUser() {
  try {
    // Veritabanı bağlantısını kontrol et
    await sequelize.authenticate();
    console.log('✅ Veritabanı bağlantısı başarılı');

    // Test kullanıcı bilgileri
    const userData = {
      name: 'Test Kullanıcı',
      email: 'test@example.com',
      password: 'test123',
      phone: '05551234567',
      mahalle: 'Test Mahalle',
      is_active: true,
      golbucks: 0,
    };

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await User.findOne({ where: { email: userData.email } });
    
    if (existingUser) {
      console.log('⚠️  Kullanıcı zaten mevcut!');
      console.log(`📧 Email: ${userData.email}`);
      console.log(`🔑 Şifre: test123`);
      console.log(`👤 Ad: ${existingUser.name}`);
    } else {
      // Yeni kullanıcı oluştur
      const user = await User.create(userData);
      console.log('✅ Test kullanıcı başarıyla oluşturuldu!');
      console.log(`📧 Email: ${userData.email}`);
      console.log(`🔑 Şifre: test123`);
      console.log(`👤 Ad: ${userData.name}`);
      console.log(`📱 Telefon: ${userData.phone}`);
      console.log(`📍 Mahalle: ${userData.mahalle}`);
    }

    console.log('\n🎉 Test kullanıcı hazır!');
    console.log('\nGiriş bilgileri:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email: ${userData.email}`);
    console.log(`Şifre: test123`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Hata:', error.message);
    if (error.original) {
      console.error('Detay:', error.original.message);
    }
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Script doğrudan çalıştırılıyorsa
if (require.main === module) {
  createTestUser();
}

module.exports = { createTestUser };


