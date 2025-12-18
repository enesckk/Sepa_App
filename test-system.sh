#!/bin/bash

# Şehitkamil Belediyesi Süper Uygulama - Sistem Test Scripti
# Bu script tüm sistemin çalışıp çalışmadığını test eder

echo "🧪 Şehitkamil Belediyesi Süper Uygulama - Sistem Testi"
echo "=================================================="
echo ""

# Renk kodları
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test sonuçları
TESTS_PASSED=0
TESTS_FAILED=0

# Test fonksiyonu
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Test: $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" == "$expected_status" ]; then
        echo -e "${GREEN}✓ BAŞARILI${NC} (Status: $response)"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ BAŞARISIZ${NC} (Beklenen: $expected_status, Alınan: $response)"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Docker servislerini kontrol et
echo "📦 Docker Servislerini Kontrol Ediyorum..."
echo ""

# Backend container kontrolü
if docker ps | grep -q "sehitkamil_backend"; then
    echo -e "${GREEN}✓ Backend container çalışıyor${NC}"
else
    echo -e "${RED}✗ Backend container çalışmıyor${NC}"
    echo "   Çalıştırmak için: docker-compose up -d"
    exit 1
fi

# Database container kontrolü
if docker ps | grep -q "sehitkamil_db"; then
    echo -e "${GREEN}✓ Database container çalışıyor${NC}"
else
    echo -e "${RED}✗ Database container çalışmıyor${NC}"
    exit 1
fi

# Redis container kontrolü
if docker ps | grep -q "sehitkamil_redis"; then
    echo -e "${GREEN}✓ Redis container çalışıyor${NC}"
else
    echo -e "${RED}✗ Redis container çalışmıyor${NC}"
    exit 1
fi

echo ""
echo "🌐 API Endpoint'lerini Test Ediyorum..."
echo ""

# Backend API testleri
BACKEND_URL="http://localhost:4000"

test_endpoint "Root Endpoint (GET /)" "$BACKEND_URL/" 200
test_endpoint "Health Check (GET /health)" "$BACKEND_URL/health" 200
test_endpoint "API Info (GET /api)" "$BACKEND_URL/api" 200
test_endpoint "404 Handler" "$BACKEND_URL/nonexistent" 404

echo ""
echo "📊 Test Sonuçları"
echo "=================================================="
echo -e "${GREEN}Başarılı: $TESTS_PASSED${NC}"
echo -e "${RED}Başarısız: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 Tüm testler başarılı! Sistem çalışıyor.${NC}"
    exit 0
else
    echo -e "${RED}❌ Bazı testler başarısız oldu. Lütfen kontrol edin.${NC}"
    exit 1
fi

