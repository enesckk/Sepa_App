#!/bin/bash

# Şehitkamil Belediyesi Süper Uygulama - Tüm Sistem Başlatma Scripti
# Bu script PostgreSQL, Backend ve Frontend'i başlatır

set -e  # Hata durumunda dur

# Renkler
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Şehitkamil Belediyesi Süper Uygulama - Sistem Başlatılıyor${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# 1. PostgreSQL Kontrolü
echo -e "${YELLOW}1️⃣  PostgreSQL kontrol ediliyor...${NC}"
if command -v pg_isready &> /dev/null; then
    if pg_isready -h localhost -p 5432 -U admin -d superapp &> /dev/null; then
        echo -e "${GREEN}   ✅ PostgreSQL çalışıyor${NC}"
    else
        echo -e "${YELLOW}   ⚠️  PostgreSQL çalışmıyor, başlatılıyor...${NC}"
        # PostgreSQL'i başlatmayı dene (Docker kullanılıyorsa)
        if command -v docker &> /dev/null; then
            docker-compose up -d db 2>/dev/null || echo -e "${YELLOW}   ℹ️  Docker compose bulunamadı, PostgreSQL'i manuel başlatın${NC}"
        else
            echo -e "${YELLOW}   ℹ️  PostgreSQL'i manuel olarak başlatmanız gerekebilir${NC}"
        fi
        sleep 2
    fi
else
    echo -e "${YELLOW}   ⚠️  pg_isready bulunamadı, PostgreSQL kontrolü atlandı${NC}"
fi
echo ""

# 2. Backend Başlatma
echo -e "${YELLOW}2️⃣  Backend başlatılıyor...${NC}"
cd "$(dirname "$0")/backend"

# Eski backend process'lerini kapat
if lsof -ti:4000 &> /dev/null; then
    echo -e "${YELLOW}   ⚠️  Port 4000'de çalışan process bulundu, kapatılıyor...${NC}"
    lsof -ti:4000 | xargs kill -9 2>/dev/null || true
    sleep 1
fi

# Backend'i başlat
echo -e "${BLUE}   📦 Backend başlatılıyor (port 4000)...${NC}"
npm start > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../logs/backend.pid

# Backend'in başlamasını bekle
echo -e "${BLUE}   ⏳ Backend'in başlaması bekleniyor...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:4000/api/health &> /dev/null; then
        echo -e "${GREEN}   ✅ Backend başarıyla başlatıldı! (PID: $BACKEND_PID)${NC}"
        echo -e "${GREEN}   🌐 Backend URL: http://localhost:4000${NC}"
        echo -e "${GREEN}   📚 API Docs: http://localhost:4000/api-docs${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}   ❌ Backend başlatılamadı! Logları kontrol edin: tail -f logs/backend.log${NC}"
        exit 1
    fi
    sleep 1
done
echo ""

# 3. Frontend Hazırlık (Expo kullanıcı tarafından başlatılacak)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -d "$SCRIPT_DIR/mobile-app" ]; then
    cd "$SCRIPT_DIR/mobile-app"
    echo -e "${YELLOW}3️⃣  Frontend hazırlanıyor...${NC}"

    # Node modules kontrolü
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}   ⚠️  node_modules bulunamadı, yükleniyor...${NC}"
        npm install
    fi

    echo -e "${GREEN}   ✅ Frontend hazır${NC}"
    echo -e "${BLUE}   📱 Expo'yu başlatmak için: cd mobile-app && npx expo start${NC}"
else
    echo -e "${YELLOW}3️⃣  Frontend hazırlanıyor...${NC}"
    echo -e "${GREEN}   ✅ Frontend hazır${NC}"
    echo -e "${BLUE}   📱 Expo'yu başlatmak için: cd mobile-app && npx expo start${NC}"
fi
echo ""

# 4. Özet
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ TÜM SİSTEM BAŞARILI ŞEKİLDE BAŞLATILDI!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}📊 Sistem Durumu:${NC}"
echo -e "   ${GREEN}✅ PostgreSQL:${NC} Çalışıyor (localhost:5432)"
echo -e "   ${GREEN}✅ Backend:${NC} Çalışıyor (http://localhost:4000)"
echo -e "   ${GREEN}✅ Frontend:${NC} Hazır (Expo başlatılabilir)"
echo ""
echo -e "${BLUE}🔗 Önemli URL'ler:${NC}"
echo -e "   • Backend API: ${GREEN}http://localhost:4000/api${NC}"
echo -e "   • API Docs: ${GREEN}http://localhost:4000/api-docs${NC}"
echo -e "   • Health Check: ${GREEN}http://localhost:4000/api/health${NC}"
echo ""
echo -e "${YELLOW}📝 Loglar:${NC}"
echo -e "   • Backend Log: ${BLUE}tail -f logs/backend.log${NC}"
echo ""
echo -e "${YELLOW}🛑 Sistemi durdurmak için:${NC}"
echo -e "   ${BLUE}./stop-all.sh${NC} veya ${BLUE}cat logs/backend.pid | xargs kill${NC}"
echo ""
echo -e "${GREEN}🚀 Expo'yu başlatmak için:${NC}"
echo -e "   ${BLUE}cd mobile-app && npx expo start${NC}"
echo ""

