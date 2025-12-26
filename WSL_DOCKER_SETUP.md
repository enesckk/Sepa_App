# WSL Üzerinden Docker ile PostgreSQL Başlatma

Bu rehber, Windows üzerinde WSL (Windows Subsystem for Linux) kullanarak Docker ile PostgreSQL ve Redis'i başlatmanızı sağlar.

## 📋 Ön Gereksinimler

1. **WSL2 Kurulu Olmalı**
   ```powershell
   wsl --list --verbose
   ```
   Eğer WSL2 yoksa:
   ```powershell
   wsl --install
   ```

2. **Docker Desktop Kurulu Olmalı**
   - Docker Desktop'ı indirin ve kurun: https://www.docker.com/products/docker-desktop
   - Docker Desktop ayarlarında "Use the WSL 2 based engine" seçeneğini aktif edin

3. **WSL'de Docker Servisinin Çalıştığından Emin Olun**
   ```bash
   wsl sudo service docker start
   ```

## 🚀 Hızlı Başlangıç

### Yöntem 1: PowerShell Script (Önerilen)

Windows PowerShell'de proje dizininde:

```powershell
.\start-db-wsl.ps1
```

### Yöntem 2: WSL Bash Script

WSL terminalinde:

```bash
chmod +x start-db-wsl.sh
./start-db-wsl.sh
```

### Yöntem 3: Manuel Docker Compose

WSL terminalinde proje dizinine gidin:

```bash
wsl
cd /mnt/c/Users/Dell/Documents/PROJECT/Sehitkamil/Sepa/Sepa_App
docker-compose -f docker-compose.db.yml up -d
```

## ✅ Bağlantı Bilgileri

PostgreSQL bağlantı bilgileri:
- **Host**: `localhost` (Windows'tan) veya `db` (Docker network içinden)
- **Port**: `5432`
- **Database**: `superapp`
- **User**: `admin`
- **Password**: `secret`

Redis bağlantı bilgileri:
- **Host**: `localhost`
- **Port**: `6379`

## 🔧 Backend .env Dosyası Ayarları

`backend/.env` dosyanızı oluşturun veya güncelleyin:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=superapp
DB_USER=admin
DB_PASSWORD=secret

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=4000
NODE_ENV=development

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Firebase (optional, for push notifications)
# FIREBASE_SERVICE_ACCOUNT_KEY=path/to/serviceAccountKey.json
```

## 📊 Container Durumunu Kontrol Etme

```bash
# WSL'de
wsl docker ps

# Veya PowerShell'de
wsl docker ps
```

## 📝 Logları Görüntüleme

```bash
# Tüm loglar
wsl docker-compose -f docker-compose.db.yml logs -f

# Sadece PostgreSQL logları
wsl docker-compose -f docker-compose.db.yml logs -f db

# Sadece Redis logları
wsl docker-compose -f docker-compose.db.yml logs -f redis
```

## 🛑 Servisleri Durdurma

```bash
# Servisleri durdur (veriler korunur)
wsl docker-compose -f docker-compose.db.yml stop

# Servisleri durdur ve container'ları kaldır (veriler korunur)
wsl docker-compose -f docker-compose.db.yml down

# Servisleri durdur, container'ları kaldır ve volume'ları sil (VERİLER SİLİNİR!)
wsl docker-compose -f docker-compose.db.yml down -v
```

## 🔍 Sorun Giderme

### Docker çalışmıyor

```bash
# WSL'de Docker servisini başlat
wsl sudo service docker start

# Docker Desktop'ı başlatın (Windows'ta)
```

### Port zaten kullanılıyor

Eğer 5432 portu zaten kullanılıyorsa, `docker-compose.db.yml` dosyasında portu değiştirin:

```yaml
ports:
  - "5433:5432"  # Windows'tan 5433, container içinde 5432
```

Ve `.env` dosyasında:
```env
DB_PORT=5433
```

### Veritabanı bağlantı hatası

1. Container'ların çalıştığını kontrol edin:
   ```bash
   wsl docker ps
   ```

2. PostgreSQL'in hazır olduğunu kontrol edin:
   ```bash
   wsl docker exec sehitkamil_db pg_isready -U admin -d superapp
   ```

3. Backend'in `.env` dosyasını kontrol edin

### Veritabanı sıfırlama

```bash
# Container'ları ve volume'ları sil
wsl docker-compose -f docker-compose.db.yml down -v

# Yeniden başlat
wsl docker-compose -f docker-compose.db.yml up -d
```

## 📚 Ek Kaynaklar

- [Docker Desktop WSL 2 Backend](https://docs.docker.com/desktop/wsl/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Redis Docker Hub](https://hub.docker.com/_/redis)



