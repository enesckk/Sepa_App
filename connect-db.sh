#!/bin/bash
# PostgreSQL Veritabanına Bağlanma Scripti

echo "🔌 Veritabanına bağlanılıyor..."
echo "📊 Database: superapp"
echo "👤 User: admin"
echo ""

# Docker container çalışıyorsa container içinden bağlan
if docker ps | grep -q sehitkamil_db; then
    echo "🐳 Docker container'dan bağlanılıyor..."
    docker exec -it sehitkamil_db psql -U admin -d superapp
else
    echo "💻 Doğrudan bağlanılıyor..."
    PGPASSWORD=secret psql -h localhost -p 5432 -U admin -d superapp
fi

