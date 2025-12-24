/**
 * Eksik kolonları ekle (mevcut verileri korur)
 * 
 * Kullanım:
 *   node scripts/add-missing-columns.js
 */

require('dotenv').config();
const { sequelize } = require('../src/config/database');
const { testConnection } = require('../src/config/database');

async function addMissingColumns() {
  try {
    console.log('🔄 Eksik kolonlar kontrol ediliyor...\n');

    // Veritabanı bağlantısını test et
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Veritabanı bağlantısı başarısız!');
      process.exit(1);
    }

    console.log('✅ Veritabanı bağlantısı başarılı!\n');

    // Events tablosuna image_url kolonu ekle (eğer yoksa)
    try {
      const [checkColumn] = await sequelize.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'events' 
        AND column_name = 'image_url';
      `);

      if (checkColumn.length === 0) {
        console.log('📝 events tablosuna image_url kolonu ekleniyor...');
        await sequelize.query(`
          ALTER TABLE events 
          ADD COLUMN image_url VARCHAR(500);
        `);
        console.log('✅ image_url kolonu eklendi!\n');
      } else {
        console.log('✅ image_url kolonu zaten mevcut.\n');
      }
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ image_url kolonu zaten mevcut.\n');
      } else {
        throw error;
      }
    }

    // Diğer eksik kolonları kontrol et ve ekle
    const columnsToCheck = [
      { table: 'events', column: 'image_url', type: 'VARCHAR(500)', nullable: true },
      { table: 'rewards', column: 'image_url', type: 'VARCHAR(500)', nullable: true },
    ];

    for (const { table, column, type, nullable } of columnsToCheck) {
      try {
        const [check] = await sequelize.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = '${table}' 
          AND column_name = '${column}';
        `);

        if (check.length === 0) {
          console.log(`📝 ${table} tablosuna ${column} kolonu ekleniyor...`);
          const nullClause = nullable ? '' : 'NOT NULL';
          await sequelize.query(`
            ALTER TABLE ${table} 
            ADD COLUMN ${column} ${type} ${nullClause};
          `);
          console.log(`✅ ${column} kolonu eklendi!`);
        }
      } catch (error) {
        if (!error.message.includes('already exists')) {
          console.error(`⚠️  ${table}.${column} eklenirken hata:`, error.message);
        }
      }
    }

    console.log('\n✨ İşlem tamamlandı!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Hata oluştu:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Script'i çalıştır
addMissingColumns();

