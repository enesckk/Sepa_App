#!/usr/bin/env node
/**
 * Hızlı Veritabanı Görüntüleme - Backend kullanarak
 */

const path = require('path');
process.chdir(path.join(__dirname, 'backend'));

const { sequelize } = require('./src/config/database');

async function quickView() {
  try {
    console.log('🔌 Veritabanına bağlanılıyor...\n');
    
    await sequelize.authenticate();
    console.log('✅ Bağlantı başarılı!\n');

    // Tabloları listele
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('📊 TABLOLAR:');
    console.log('─'.repeat(50));
    if (tables.length === 0) {
      console.log('   Henüz tablo yok. Backend\'i başlatın, tablolar otomatik oluşturulacak.\n');
    } else {
      tables.forEach((table, i) => {
        console.log(`${(i + 1).toString().padStart(2)}. ${table.table_name}`);
      });
      console.log('');
    }

    // bill_supports varsa göster
    if (tables.some(t => t.table_name === 'bill_supports')) {
      const [bills] = await sequelize.query(`
        SELECT 
          bs.id,
          bs.bill_type,
          bs.amount,
          COALESCE(bs.supported_amount, 0) as supported_amount,
          COALESCE(bs.supported_by_count, 0) as supported_by_count,
          bs.status,
          u.name as user_name,
          bs.created_at
        FROM bill_supports bs
        LEFT JOIN users u ON bs.user_id = u.id
        ORDER BY bs.created_at DESC
        LIMIT 5;
      `);
      
      console.log('💳 SON FATURALAR:');
      console.log('─'.repeat(100));
      if (bills.length === 0) {
        console.log('   Henüz fatura yok.\n');
      } else {
        bills.forEach((bill, i) => {
          const type = bill.bill_type.toUpperCase().padEnd(10);
          const amount = `${bill.amount}₺`.padEnd(10);
          const supported = `${bill.supported_amount}₺ (${bill.supported_by_count} kişi)`.padEnd(20);
          console.log(`${i + 1}. ${type} | ${amount} | Destek: ${supported} | ${bill.status} | ${bill.user_name || 'N/A'}`);
        });
        console.log('');
      }
    }

    // bill_support_transactions varsa göster
    if (tables.some(t => t.table_name === 'bill_support_transactions')) {
      const [transactions] = await sequelize.query(`
        SELECT 
          t.amount,
          t.payment_method,
          t.status,
          u.name as supporter_name,
          t.created_at
        FROM bill_support_transactions t
        LEFT JOIN users u ON t.supporter_id = u.id
        ORDER BY t.created_at DESC
        LIMIT 5;
      `);
      
      console.log('💰 SON DESTEK İŞLEMLERİ:');
      console.log('─'.repeat(80));
      if (transactions.length === 0) {
        console.log('   Henüz destek işlemi yok.\n');
      } else {
        transactions.forEach((t, i) => {
          console.log(`${i + 1}. ${t.amount}₺ | ${t.payment_method} | ${t.status} | ${t.supporter_name || 'N/A'}`);
        });
        console.log('');
      }
    }

    // İstatistikler
    if (tables.length > 0) {
      const [stats] = await sequelize.query(`
        SELECT 
          (SELECT COUNT(*) FROM bill_supports) as total_bills,
          (SELECT COUNT(*) FROM bill_support_transactions) as total_transactions,
          (SELECT COUNT(*) FROM users) as total_users;
      `);
      
      const s = stats[0];
      console.log('📈 İSTATİSTİKLER:');
      console.log('─'.repeat(50));
      console.log(`   Faturalar: ${s.total_bills}`);
      console.log(`   Destek İşlemleri: ${s.total_transactions}`);
      console.log(`   Kullanıcılar: ${s.total_users}`);
      console.log('');
    }

    await sequelize.close();
    console.log('✅ Tamamlandı!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    console.log('\n💡 İpucu: Backend\'i başlatın: cd backend && npm start');
    process.exit(1);
  }
}

quickView();

