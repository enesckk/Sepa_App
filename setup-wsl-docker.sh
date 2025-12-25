#!/bin/bash

# WSL Docker kurulum ve yapılandırma scripti

echo "🔧 WSL Docker yapılandırması..."

# Docker grubuna kullanıcıyı ekle (sudo şifresi gerekecek)
sudo usermod -aG docker $USER

echo "✅ Kullanıcı docker grubuna eklendi."
echo ""
echo "⚠️  ÖNEMLİ: Değişikliklerin etkili olması için WSL'i kapatıp yeniden açmanız gerekiyor!"
echo "   WSL'i kapatmak için: wsl --shutdown"
echo "   Sonra yeni bir WSL terminali açın"
echo ""
echo "Alternatif olarak Docker Desktop kullanabilirsiniz (önerilen):"
echo "   1. Docker Desktop'ı Windows'ta başlatın"
echo "   2. Settings > Resources > WSL Integration"
echo "   3. WSL distro'nuzu aktif edin"


