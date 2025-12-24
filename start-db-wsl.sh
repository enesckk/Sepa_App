#!/bin/bash

# WSL üzerinden Docker ile PostgreSQL ve Redis başlatma scripti

echo "🐳 Docker ile PostgreSQL ve Redis başlatılıyor..."

# WSL'de Docker'ın çalıştığını kontrol et
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker çalışmıyor. Lütfen Docker Desktop'ı başlatın veya Docker servisini başlatın:"
    echo "   sudo service docker start"
    exit 1
fi

# Proje dizinine git
cd "$(dirname "$0")"

# Docker Compose ile sadece veritabanı servislerini başlat
docker-compose -f docker-compose.db.yml up -d

# Servislerin hazır olmasını bekle
echo "⏳ Veritabanı servislerinin hazır olması bekleniyor..."
sleep 5

# PostgreSQL bağlantısını kontrol et
if docker exec sehitkamil_db pg_isready -U admin -d superapp > /dev/null 2>&1; then
    echo "✅ PostgreSQL başarıyla başlatıldı!"
    echo "   Host: localhost"
    echo "   Port: 5432"
    echo "   Database: superapp"
    echo "   User: admin"
    echo "   Password: secret"
else
    echo "⚠️  PostgreSQL başlatılıyor, lütfen birkaç saniye bekleyin..."
fi

# Redis bağlantısını kontrol et
if docker exec sehitkamil_redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis başarıyla başlatıldı!"
    echo "   Host: localhost"
    echo "   Port: 6379"
else
    echo "⚠️  Redis başlatılıyor..."
fi

echo ""
echo "📋 Çalışan container'ları görmek için:"
echo "   docker ps"
echo ""
echo "🛑 Durdurmak için:"
echo "   docker-compose -f docker-compose.db.yml down"
echo ""
echo "📊 Logları görmek için:"
echo "   docker-compose -f docker-compose.db.yml logs -f"

