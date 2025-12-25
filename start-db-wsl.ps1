# WSL üzerinden Docker ile PostgreSQL ve Redis başlatma PowerShell scripti

Write-Host "🐳 Docker ile PostgreSQL ve Redis başlatılıyor..." -ForegroundColor Cyan

# WSL'de Docker'ın çalıştığını kontrol et
$wslCheck = wsl docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker çalışmıyor. Lütfen WSL'de Docker'ı başlatın:" -ForegroundColor Red
    Write-Host "   wsl sudo service docker start" -ForegroundColor Yellow
    exit 1
}

# Proje dizinine git
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Docker Compose ile sadece veritabanı servislerini başlat
Write-Host "📦 Container'lar başlatılıyor..." -ForegroundColor Yellow
wsl docker-compose -f docker-compose.db.yml up -d

# Servislerin hazır olmasını bekle
Write-Host "⏳ Veritabanı servislerinin hazır olması bekleniyor..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# PostgreSQL bağlantısını kontrol et
$pgCheck = wsl docker exec sehitkamil_db pg_isready -U admin -d superapp 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ PostgreSQL başarıyla başlatıldı!" -ForegroundColor Green
    Write-Host "   Host: localhost" -ForegroundColor Gray
    Write-Host "   Port: 5432" -ForegroundColor Gray
    Write-Host "   Database: superapp" -ForegroundColor Gray
    Write-Host "   User: admin" -ForegroundColor Gray
    Write-Host "   Password: secret" -ForegroundColor Gray
} else {
    Write-Host "⚠️  PostgreSQL başlatılıyor, lütfen birkaç saniye bekleyin..." -ForegroundColor Yellow
}

# Redis bağlantısını kontrol et
$redisCheck = wsl docker exec sehitkamil_redis redis-cli ping 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Redis başarıyla başlatıldı!" -ForegroundColor Green
    Write-Host "   Host: localhost" -ForegroundColor Gray
    Write-Host "   Port: 6379" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Redis başlatılıyor..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Çalışan container'ları görmek için:" -ForegroundColor Cyan
Write-Host "   wsl docker ps" -ForegroundColor Gray
Write-Host ""
Write-Host "🛑 Durdurmak için:" -ForegroundColor Cyan
Write-Host "   wsl docker-compose -f docker-compose.db.yml down" -ForegroundColor Gray
Write-Host ""
Write-Host "📊 Logları görmek için:" -ForegroundColor Cyan
Write-Host "   wsl docker-compose -f docker-compose.db.yml logs -f" -ForegroundColor Gray


