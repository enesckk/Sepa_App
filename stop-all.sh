#!/bin/bash

# Şehitkamil Belediyesi Süper Uygulama - Tüm Sistem Durdurma Scripti

# Renkler
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Şehitkamil Belediyesi Süper Uygulama - Sistem Durduruluyor${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Backend'i durdur
echo -e "${YELLOW}1️⃣  Backend durduruluyor...${NC}"
if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID 2>/dev/null || true
        echo -e "${GREEN}   ✅ Backend durduruldu (PID: $BACKEND_PID)${NC}"
    else
        echo -e "${YELLOW}   ℹ️  Backend process bulunamadı${NC}"
    fi
    rm -f logs/backend.pid
else
    # PID dosyası yoksa port 4000'deki process'i kapat
    if lsof -ti:4000 &> /dev/null; then
        lsof -ti:4000 | xargs kill -9 2>/dev/null || true
        echo -e "${GREEN}   ✅ Port 4000'deki process durduruldu${NC}"
    else
        echo -e "${YELLOW}   ℹ️  Backend çalışmıyor${NC}"
    fi
fi
echo ""

echo -e "${GREEN}✅ Sistem durduruldu!${NC}"
echo ""

