#!/bin/bash
# En Kolay Veritabanı Görüntüleme

echo "🔍 Veritabanı kontrol ediliyor..."
echo ""

# Veritabanına bağlan ve tabloları göster
PGPASSWORD=secret psql -h localhost -p 5432 -U admin -d superapp <<EOF

-- Tabloları listele
\dt

-- Eğer tablolar varsa verileri göster
SELECT 
    '📊 TABLOLAR:' as info,
    COUNT(*) as toplam_tablo
FROM information_schema.tables 
WHERE table_schema = 'public';

-- bill_supports varsa göster
DO \$\$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bill_supports') THEN
        RAISE NOTICE '💳 FATURALAR:';
    END IF;
END \$\$;

SELECT 
    bill_type,
    amount,
    COALESCE(supported_amount, 0) as desteklenen,
    COALESCE(supported_by_count, 0) as destekleyen_sayisi,
    status
FROM bill_supports 
ORDER BY created_at DESC 
LIMIT 5;

-- Kullanıcılar varsa göster
DO \$\$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        RAISE NOTICE '👥 KULLANICILAR:';
    END IF;
END \$\$;

SELECT name, email, golbucks 
FROM users 
ORDER BY created_at DESC 
LIMIT 5;

EOF

echo ""
echo "💡 Tablolar yoksa backend'i başlatın: cd backend && npm start"

