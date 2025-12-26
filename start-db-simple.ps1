# Basit Docker Compose başlatma scripti (Docker Desktop ile)

Write-Host "🐳 Docker ile PostgreSQL ve Redis başlatılıyor..." -ForegroundColor Cyan

# Proje dizinine git
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Docker Compose ile sadece veritabanı servislerini başlat
Write-Host "📦 Container'lar başlatılıyor..." -ForegroundColor Yellow

# Docker Desktop kullanıyorsak direkt docker-compose çalışır
docker-compose -f docker-compose.db.yml up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Container'lar başlatıldı!" -ForegroundColor Green
    
    # Servislerin hazır olmasını bekle
    Write-Host "⏳ Veritabanı servislerinin hazır olması bekleniyor..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # PostgreSQL bağlantısını kontrol et
    $pgCheck = docker exec sehitkamil_db pg_isready -U admin -d superapp 2>&1
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
    $redisCheck = docker exec sehitkamil_redis redis-cli ping 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Redis başarıyla başlatıldı!" -ForegroundColor Green
        Write-Host "   Host: localhost" -ForegroundColor Gray
        Write-Host "   Port: 6379" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  Redis başlatılıyor..." -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "📋 Çalışan container'ları görmek için:" -ForegroundColor Cyan
    Write-Host "   docker ps" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🛑 Durdurmak için:" -ForegroundColor Cyan
    Write-Host "   docker-compose -f docker-compose.db.yml down" -ForegroundColor Gray
} else {
    Write-Host "❌ Docker Compose başlatılamadı!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Lütfen kontrol edin:" -ForegroundColor Yellow
    Write-Host "   1. Docker Desktop çalışıyor mu?" -ForegroundColor Gray
    Write-Host "   2. WSL entegrasyonu aktif mi? (Docker Desktop > Settings > WSL Integration)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Alternatif: WSL'de çalıştırın:" -ForegroundColor Yellow
    Write-Host "   wsl docker-compose -f docker-compose.db.yml up -d" -ForegroundColor Gray
}



