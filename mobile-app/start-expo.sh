#!/bin/bash

# Expo Başlatma Scripti

# Renkler
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Expo Başlatılıyor...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Dizin kontrolü
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Hata: package.json bulunamadı!${NC}"
    echo -e "${YELLOW}   Bu script mobile-app dizininde çalıştırılmalı${NC}"
    exit 1
fi

# Node modules kontrolü
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules bulunamadı, yükleniyor...${NC}"
    npm install
fi

# Eski process'leri temizle
if lsof -ti:8081 &> /dev/null; then
    echo -e "${YELLOW}⚠️  Port 8081'de çalışan process bulundu, kapatılıyor...${NC}"
    lsof -ti:8081 | xargs kill -9 2>/dev/null || true
    sleep 1
fi

# Expo'yu başlat
echo -e "${GREEN}🚀 Expo başlatılıyor...${NC}"
echo -e "${BLUE}   QR kod ve bağlantı bilgileri aşağıda görünecek${NC}"
echo ""

npx expo start --clear

