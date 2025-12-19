#!/bin/bash

# Expo Go için Optimize Edilmiş Başlatma Scripti

echo "🧹 Temizlik yapılıyor..."

# Tüm Expo/Metro process'lerini öldür
lsof -ti:8081,8082,19000,19001,19002 | xargs kill -9 2>/dev/null
pkill -f "expo\|metro" 2>/dev/null

# Cache'leri temizle
rm -rf .expo .expo-shared .metro node_modules/.cache .turbo

echo "✅ Temizlik tamamlandı"
echo ""
echo "🚀 Expo Go için başlatılıyor (Tunnel modu)..."
echo ""

# Tunnel modu ile başlat (en güvenilir)
npx expo start --tunnel --clear --port 8081

