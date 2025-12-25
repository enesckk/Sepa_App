/**
 * Admin Kullanıcı Oluşturma Scripti
 * 
 * Kullanım:
 * node scripts/create-admin.js
 * 
 * Veya direkt olarak:
 * node -e "require('./scripts/create-admin.js')"
 */

const { User } = require('../src/models');
const { sequelize } = require('../src/config/database');

async function createAdminUser() {
  try {
    // Veritabanı bağlantısını kontrol et
    await sequelize.authenticate();
    console.log('✅ Veritabanı bağlantısı başarılı');

    // Admin kullanıcı bilgileri
    const adminData = {
      name: 'Admin Kullanıcı',
      email: 'admin@sehitkamil.bel.tr',
      password: 'admin123', // Şifre otomatik olarak hash'lenecek
      phone: '05551234567',
      role: 'admin',
      is_active: true,
      golbucks: 0,
    };

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await User.findOne({ where: { email: adminData.email } });
    
    if (existingUser) {
      // Mevcut kullanıcıyı admin yap
      await existingUser.update({
        role: 'admin',
        is_active: true,
      });
      console.log('✅ Mevcut kullanıcı admin yapıldı');
      console.log(`📧 Email: ${adminData.email}`);
      console.log(`🔑 Şifre: admin123 (değiştirilmedi)`);
    } else {
      // Yeni admin kullanıcı oluştur
      const admin = await User.create(adminData);
      console.log('✅ Admin kullanıcı başarıyla oluşturuldu!');
      console.log(`📧 Email: ${adminData.email}`);
      console.log(`🔑 Şifre: admin123`);
      console.log(`👤 Ad: ${adminData.name}`);
      console.log(`🔐 Rol: ${adminData.role}`);
    }

    console.log('\n🎉 Admin kullanıcı hazır!');
    console.log('\nGiriş bilgileri:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email: ${adminData.email}`);
    console.log(`Şifre: admin123`);
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
  createAdminUser();
}

module.exports = { createAdminUser };







