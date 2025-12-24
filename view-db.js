#!/usr/bin/env node
/**
 * Hızlı Veritabanı Görüntüleme Scripti
 * Kullanım: node view-db.js
 */

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'superapp',
  'admin',
  'secret',
  {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false,
  }
);

async function viewDatabase() {
  try {
    console.log('🔌 Veritabanına bağlanılıyor...\n');
    await sequelize.authenticate();
    console.log('✅ Bağlantı başarılı!\n');

    // Tüm tabloları listele
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('📊 TABLOLAR:');
    console.log('─'.repeat(50));
    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${table.table_name}`);
    });
    console.log('');

    // bill_supports tablosunu göster
    console.log('💳 FATURALAR (bill_supports):');
    console.log('─'.repeat(100));
    const [bills] = await sequelize.query(`
      SELECT 
        bs.id,
        bs.bill_type,
        bs.amount,
        bs.supported_amount,
        bs.supported_by_count,
        bs.status,
        u.name as user_name,
        bs.created_at
      FROM bill_supports bs
      LEFT JOIN users u ON bs.user_id = u.id
      ORDER BY bs.created_at DESC
      LIMIT 10;
    `);
    
    if (bills.length === 0) {
      console.log('   Henüz fatura yok.\n');
    } else {
      bills.forEach((bill, index) => {
        console.log(`${index + 1}. ${bill.bill_type.toUpperCase()} | ${bill.amount}₺ | Desteklenen: ${bill.supported_amount || 0}₺ (${bill.supported_by_count || 0} kişi) | Durum: ${bill.status} | Kullanıcı: ${bill.user_name || 'N/A'}`);
      });
      console.log('');
    }

    // bill_support_transactions tablosunu göster
    console.log('💰 DESTEK İŞLEMLERİ (bill_support_transactions):');
    console.log('─'.repeat(100));
    const [transactions] = await sequelize.query(`
      SELECT 
        t.id,
        t.amount,
        t.payment_method,
        t.status,
        u.name as supporter_name,
        bs.reference_number,
        t.created_at
      FROM bill_support_transactions t
      LEFT JOIN users u ON t.supporter_id = u.id
      LEFT JOIN bill_supports bs ON t.bill_support_id = bs.id
      ORDER BY t.created_at DESC
      LIMIT 10;
    `);
    
    if (transactions.length === 0) {
      console.log('   Henüz destek işlemi yok.\n');
    } else {
      transactions.forEach((t, index) => {
        console.log(`${index + 1}. ${t.amount}₺ | ${t.payment_method} | Durum: ${t.status} | Destekleyen: ${t.supporter_name || 'N/A'} | Ref: ${t.reference_number || 'N/A'}`);
      });
      console.log('');
    }

    // Kullanıcıları göster
    console.log('👥 KULLANICILAR (users):');
    console.log('─'.repeat(80));
    const [users] = await sequelize.query(`
      SELECT id, name, email, golbucks, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 10;
    `);
    
    if (users.length === 0) {
      console.log('   Henüz kullanıcı yok.\n');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} | ${user.email} | Gölbucks: ${user.golbucks || 0}`);
      });
      console.log('');
    }

    // İstatistikler
    console.log('📈 İSTATİSTİKLER:');
    console.log('─'.repeat(50));
    const [stats] = await sequelize.query(`
      SELECT 
        (SELECT COUNT(*) FROM bill_supports) as total_bills,
        (SELECT COUNT(*) FROM bill_supports WHERE status = 'pending') as pending_bills,
        (SELECT COUNT(*) FROM bill_support_transactions) as total_transactions,
        (SELECT COALESCE(SUM(supported_amount), 0) FROM bill_supports) as total_supported,
        (SELECT COUNT(*) FROM users) as total_users;
    `);
    
    const stat = stats[0];
    console.log(`   Toplam Fatura: ${stat.total_bills}`);
    console.log(`   Bekleyen Fatura: ${stat.pending_bills}`);
    console.log(`   Toplam Destek İşlemi: ${stat.total_transactions}`);
    console.log(`   Toplam Desteklenen Tutar: ${stat.total_supported}₺`);
    console.log(`   Toplam Kullanıcı: ${stat.total_users}`);
    console.log('');

    await sequelize.close();
    console.log('✅ Tamamlandı!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    console.log('\n💡 İpucu:');
    console.log('   1. PostgreSQL çalışıyor mu kontrol edin: lsof -i :5432');
    console.log('   2. Docker ile başlatın: docker-compose up -d db');
    console.log('   3. Backend çalışıyorsa PostgreSQL de çalışıyor olmalı');
    process.exit(1);
  }
}

viewDatabase();

