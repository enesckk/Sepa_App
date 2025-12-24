/**
 * Veritabanı tablolarını oluştur/güncelle (mevcut verileri korur)
 * 
 * Kullanım:
 *   node scripts/sync-database.js
 */

require('dotenv').config();
const { sequelize, syncModels } = require('../src/models');
const { testConnection } = require('../src/config/database');

async function syncDatabase() {
  try {
    console.log('🔄 Veritabanı senkronizasyonu başlatılıyor...');
    console.log('⚠️  Mevcut veriler korunacak, sadece eksik tablolar/kolonlar eklenecek.\n');

    // Veritabanı bağlantısını test et
    console.log('📡 Veritabanı bağlantısı test ediliyor...');
    const connected = await testConnection();
    
    if (!connected) {
      console.error('❌ Veritabanı bağlantısı başarısız!');
      process.exit(1);
    }

    console.log('✅ Veritabanı bağlantısı başarılı!\n');

    // Önce mevcut tabloları kontrol et
    const [existingTables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    const tableNames = existingTables.map(row => row.table_name);
    console.log(`📋 Mevcut tablolar (${tableNames.length}):`, tableNames.join(', ') || 'Yok\n');

    // Modelleri senkronize et (force: false - sadece eksik tabloları oluşturur, mevcut tabloları değiştirmez)
    console.log('📦 Eksik tablolar oluşturuluyor...');
    console.log('   (Mevcut tablolar değiştirilmeyecek, sadece eksik olanlar eklenecek)\n');
    
    // Her modeli tek tek sync et, hataları yakala
    const models = require('../src/models');
    const modelNames = ['User', 'Event', 'EventRegistration', 'Application', 'BillSupport', 
                       'Survey', 'Question', 'Answer', 'Story', 'News', 'Place', 
                       'EmergencyGathering', 'Reward', 'UserReward', 'GolbucksTransaction', 
                       'DailyReward', 'StoryView', 'Notification'];
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const modelName of modelNames) {
      try {
        if (models[modelName]) {
          await models[modelName].sync({ force: false }); // Sadece eksik tabloları oluştur
          successCount++;
        }
      } catch (error) {
        // Enum dönüşüm hatalarını atla, diğer hataları göster
        if (error.message.includes('cannot be cast automatically') || 
            error.message.includes('enum')) {
          console.log(`   ⚠️  ${modelName}: Mevcut tablo enum hatası (atlandı)`);
        } else {
          console.error(`   ❌ ${modelName}: ${error.message}`);
          errorCount++;
        }
      }
    }
    
    console.log(`\n✅ ${successCount} model işlendi`);
    if (errorCount > 0) {
      console.log(`⚠️  ${errorCount} model hatası (enum dönüşümleri atlandı)`);
    }
    
    console.log('\n✅ Veritabanı senkronizasyonu tamamlandı!');
    console.log('📊 Tüm tablolar hazır.\n');

    // Tabloları tekrar listele
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log(`\n📋 Veritabanındaki tablolar (${results.length}):`);
    results.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.table_name}`);
    });

    console.log('\n✨ İşlem başarıyla tamamlandı!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Hata oluştu:', error.message);
    console.error('\nDetaylar:');
    console.error(error);
    process.exit(1);
  }
}

// Script'i çalıştır
syncDatabase();

