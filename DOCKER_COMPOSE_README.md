# Docker Compose Kullanım Kılavuzu

## 🚀 Hızlı Başlangıç

### Production Ortamı
```bash
docker-compose up -d
```

### Development Ortamı
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## 📋 Servisler

### 1. Backend API
- **Port**: 4000
- **Build**: `./backend` dizininden
- **Health Check**: `http://localhost:4000/health`
- **Bağımlılıklar**: db, redis

### 2. PostgreSQL Database
- **Port**: 5432
- **Database**: superapp
- **User**: admin
- **Password**: secret
- **Volume**: pgdata (kalıcı veri)

### 3. Redis Cache
- **Port**: 6379
- **Image**: redis:7

## 🔧 Komutlar

### Servisleri Başlat
```bash
docker-compose up -d
```

### Servisleri Durdur
```bash
docker-compose down
```

### Servisleri Yeniden Başlat
```bash
docker-compose restart
```

### Logları Görüntüle
```bash
# Tüm servisler
docker-compose logs -f

# Belirli bir servis
docker-compose logs -f backend
docker-compose logs -f db
docker-compose logs -f redis
```

### Servis Durumunu Kontrol Et
```bash
docker-compose ps
```

### Container'a Bağlan
```bash
# Backend
docker-compose exec backend sh

# Database
docker-compose exec db psql -U admin -d superapp

# Redis
docker-compose exec redis redis-cli
```

### Volume'ları Temizle
```bash
# Servisleri durdur ve volume'ları sil
docker-compose down -v
```

## 🔐 Güvenlik Notları

⚠️ **ÖNEMLİ**: Production ortamında şifreleri değiştirin!

1. `.env` dosyası oluşturun:
```env
POSTGRES_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_here
```

2. `docker-compose.yml` dosyasında environment variables kullanın:
```yaml
environment:
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

## 🌐 Network

Tüm servisler `superapp_network` adlı bridge network üzerinde çalışır. Servisler birbirlerine servis adlarıyla erişebilir:
- Backend → `db:5432`
- Backend → `redis:6379`

## 📊 Health Checks

Tüm servislerde health check tanımlı:
- **Backend**: `/health` endpoint'i kontrol edilir
- **Database**: `pg_isready` komutu ile kontrol
- **Redis**: `redis-cli ping` ile kontrol

## 🔄 Development vs Production

### Development
- Hot reload aktif
- Source code volume mount edilir
- Development dependencies yüklenir

### Production
- Optimize edilmiş build
- Sadece production dependencies
- Restart policy: `unless-stopped`

## 🐛 Sorun Giderme

### Port zaten kullanılıyor
```bash
# Port'u kullanan process'i bul
lsof -i :4000
lsof -i :5432
lsof -i :6379

# Process'i durdur veya docker-compose.yml'de port'u değiştir
```

### Database bağlantı hatası
```bash
# Database loglarını kontrol et
docker-compose logs db

# Database container'ının çalıştığını doğrula
docker-compose ps db
```

### Redis bağlantı hatası
```bash
# Redis loglarını kontrol et
docker-compose logs redis

# Redis'e bağlan ve test et
docker-compose exec redis redis-cli ping
```

## 📝 Environment Variables

Production için `.env` dosyası oluşturun:
```env
# Database
POSTGRES_DB=superapp
POSTGRES_USER=admin
POSTGRES_PASSWORD=your_secure_password

# Backend
NODE_ENV=production
PORT=4000
JWT_SECRET=your_jwt_secret_key

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
```

## 🎯 Örnek Kullanım

### 1. İlk Kurulum
```bash
# Servisleri başlat
docker-compose up -d

# Logları kontrol et
docker-compose logs -f

# Health check
curl http://localhost:4000/health
```

### 2. Database Migration
```bash
# Backend container'ına bağlan
docker-compose exec backend sh

# Migration çalıştır
npm run migrate
```

### 3. Database Backup
```bash
# Backup al
docker-compose exec db pg_dump -U admin superapp > backup.sql

# Restore et
docker-compose exec -T db psql -U admin superapp < backup.sql
```

## 📦 Volume Yönetimi

### Volume Listesi
```bash
docker volume ls
```

### Volume Detayları
```bash
docker volume inspect app_pgdata
```

### Volume'u Sil
```bash
docker volume rm app_pgdata
```

