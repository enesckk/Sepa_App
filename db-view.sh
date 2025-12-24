#!/bin/bash
# Basit Veritabanı Görüntüleme Scripti

echo "🗄️  VERİTABANI GÖRÜNTÜLEME"
echo "════════════════════════════════════════"
echo ""

PGPASSWORD=secret psql -h localhost -p 5432 -U admin -d superapp <<EOF

-- Tabloları listele
\echo '📊 TABLOLAR:'
\dt

\echo ''
\echo '💳 FATURALAR (bill_supports):'
SELECT 
    id,
    bill_type,
    amount,
    COALESCE(supported_amount, 0) as desteklenen,
    COALESCE(supported_by_count, 0) as destekleyen_sayisi,
    status,
    created_at
FROM bill_supports 
ORDER BY created_at DESC 
LIMIT 10;

\echo ''
\echo '💰 DESTEK İŞLEMLERİ (bill_support_transactions):'
SELECT 
    id,
    amount,
    payment_method,
    status,
    created_at
FROM bill_support_transactions 
ORDER BY created_at DESC 
LIMIT 10;

\echo ''
\echo '👥 KULLANICILAR (users):'
SELECT 
    id,
    name,
    email,
    golbucks,
    created_at
FROM users 
ORDER BY created_at DESC 
LIMIT 10;

\echo ''
\echo '📈 İSTATİSTİKLER:'
SELECT 
    (SELECT COUNT(*) FROM bill_supports) as faturalar,
    (SELECT COUNT(*) FROM bill_support_transactions) as destekler,
    (SELECT COUNT(*) FROM users) as kullanicilar,
    (SELECT COALESCE(SUM(supported_amount), 0) FROM bill_supports) as toplam_desteklenen;

EOF

echo ""
echo "✅ Tamamlandı!"
echo ""
echo "💡 Daha fazla sorgu için:"
echo "   PGPASSWORD=secret psql -h localhost -p 5432 -U admin -d superapp"

