#!/bin/bash
# Basit Veritabanı Görüntüleme Scripti

echo "🔌 Veritabanına bağlanılıyor..."
echo ""

# Tabloları listele
echo "📊 TABLOLAR:"
echo "──────────────────────────────────────────────────"
psql -h localhost -p 5432 -U admin -d superapp -c "\dt" 2>&1 | grep -v "^$" | tail -n +4

echo ""
echo "💳 FATURALAR (İlk 5):"
echo "──────────────────────────────────────────────────"
psql -h localhost -p 5432 -U admin -d superapp -c "SELECT id, bill_type, amount, COALESCE(supported_amount, 0) as supported, COALESCE(supported_by_count, 0) as supporters, status FROM bill_supports ORDER BY created_at DESC LIMIT 5;" 2>&1 | grep -v "^-" | grep -v "^$" | tail -n +3

echo ""
echo "💰 DESTEK İŞLEMLERİ (İlk 5):"
echo "──────────────────────────────────────────────────"
psql -h localhost -p 5432 -U admin -d superapp -c "SELECT amount, payment_method, status, created_at FROM bill_support_transactions ORDER BY created_at DESC LIMIT 5;" 2>&1 | grep -v "^-" | grep -v "^$" | tail -n +3

echo ""
echo "👥 KULLANICILAR (İlk 5):"
echo "──────────────────────────────────────────────────"
psql -h localhost -p 5432 -U admin -d superapp -c "SELECT name, email, golbucks FROM users ORDER BY created_at DESC LIMIT 5;" 2>&1 | grep -v "^-" | grep -v "^$" | tail -n +3

echo ""
echo "📈 İSTATİSTİKLER:"
echo "──────────────────────────────────────────────────"
psql -h localhost -p 5432 -U admin -d superapp -c "SELECT (SELECT COUNT(*) FROM bill_supports) as faturalar, (SELECT COUNT(*) FROM bill_support_transactions) as destekler, (SELECT COUNT(*) FROM users) as kullanicilar;" 2>&1 | grep -v "^-" | grep -v "^$" | tail -n +3

echo ""
echo "✅ Tamamlandı!"

