# 🐳 Docker ile Uygulama Nasıl Ayağa Kaldırılır?

Bu dokümantasyon, Şehitkamil Belediyesi Süper Uygulamasını Docker kullanarak sıfırdan nasıl çalıştıracağınızı adım adım açıklar.

---

## 📋 Gereksinimler

### Gerekli Araçlar

Aşağıdaki araçların sisteminizde yüklü olması gerekmektedir:

1. **Docker Desktop** (veya Docker Engine + Docker Compose)
   - Windows/Mac: [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Linux: Docker Engine + Docker Compose
   - Minimum versiyon: Docker 20.10+, Docker Compose 2.0+

2. **Git** (opsiyonel - projeyi klonlamak için)

### Sistem Gereksinimleri

- **RAM**: Minimum 4GB (önerilen 8GB)
- **Disk**: Minimum 10GB boş alan
- **İşlemci**: 64-bit işlemci

---

## 🚀 Hızlı Başlangıç

### 1. Projeyi İndirin

```bash
# Git ile klonlayın
git clone <repository-url>
cd APP

# Veya ZIP olarak indirip açın
```

### 2. Environment Variables Ayarlayın

Proje kök dizininde `.env` dosyası oluşturun:

```env
# Server Configuration
NODE_ENV=production
PORT=4000

# Database Configuration
DB_HOST=db
DB_PORT=5432
DB_NAME=superapp
DB_USER=admin
DB_PASSWORD=secret

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d

# SMS Provider Configuration (Opsiyonel)
SMS_PROVIDER=netgsm
SMS_API_KEY=your_sms_api_key
SMS_API_SECRET=your_sms_api_secret

# OneSignal Configuration (Opsiyonel)
ONESIGNAL_APP_ID=your_onesignal_app_id
ONESIGNAL_API_KEY=your_onesignal_api_key
```

**Not**: Production ortamında `DB_PASSWORD` ve `JWT_SECRET` değerlerini mutlaka değiştirin!

### 3. Docker Servislerini Başlatın

```bash
# Tüm servisleri build edip başlat
docker-compose up --build -d
```

Bu komut:
- ✅ Backend API'yi build eder
- ✅ PostgreSQL veritabanını başlatır
- ✅ Redis cache'i başlatır
- ✅ Tüm servisleri arka planda çalıştırır (`-d` flag'i)

### 4. Servislerin Durumunu Kontrol Edin

```bash
# Tüm container'ların durumunu görüntüle
docker-compose ps
```

Çıktı şöyle görünmelidir:
```
NAME                  STATUS          PORTS
sehitkamil_backend    Up (healthy)    0.0.0.0:4000->4000/tcp
sehitkamil_db         Up (healthy)    0.0.0.0:5432->5432/tcp
sehitkamil_redis      Up (healthy)    0.0.0.0:6379->6379/tcp
```

---

## 🌐 Servis Erişim Bilgileri

### Backend API

- **URL**: http://localhost:4000
- **Health Check**: http://localhost:4000/health
- **API Endpoint**: http://localhost:4000/api

### PostgreSQL Veritabanı

- **Host**: `localhost` (host machine'den) veya `db` (container içinden)
- **Port**: `5432`
- **Database**: `superapp`
- **Username**: `admin`
- **Password**: `secret` (veya `.env` dosyasındaki değer)

**Bağlantı String Örneği**:
```
postgresql://admin:secret@localhost:5432/superapp
```

### Redis Cache

- **Host**: `localhost` (host machine'den) veya `redis` (container içinden)
- **Port**: `6379`

**Bağlantı Örneği**:
```
redis://localhost:6379
```

---

## 📊 Servis Detayları

### Backend API (Node.js/Express)

- **Container Adı**: `sehitkamil_backend`
- **Port**: `4000:4000`
- **Build**: `./backend` dizininden
- **Health Check**: `/health` endpoint'i
- **Loglar**: `docker-compose logs -f backend`

### PostgreSQL Database

- **Container Adı**: `sehitkamil_db`
- **Image**: `postgres:15`
- **Port**: `5432:5432`
- **Volume**: `pgdata` (kalıcı veri)
- **Init Script**: `backend/db/init.sql` (ilk başlatmada otomatik çalışır)
- **Loglar**: `docker-compose logs -f db`

### Redis Cache

- **Container Adı**: `sehitkamil_redis`
- **Image**: `redis:7`
- **Port**: `6379:6379`
- **Loglar**: `docker-compose logs -f redis`

---

## 🔧 Yaygın Komutlar

### Servisleri Başlat

```bash
# Tüm servisleri başlat
docker-compose up -d

# Build ile birlikte başlat
docker-compose up --build -d
```

### Servisleri Durdur

```bash
# Servisleri durdur (container'ları kaldırmaz)
docker-compose stop

# Servisleri durdur ve container'ları kaldır
docker-compose down

# Volume'ları da sil (veritabanı verileri silinir!)
docker-compose down -v
```

### Logları Görüntüle

```bash
# Tüm servislerin logları
docker-compose logs -f

# Belirli bir servisin logları
docker-compose logs -f backend
docker-compose logs -f db
docker-compose logs -f redis
```

### Servis Durumunu Kontrol Et

```bash
# Container durumları
docker-compose ps

# Health check sonuçları
docker ps
```

### Container'a Bağlan

```bash
# Backend container'ına bağlan
docker-compose exec backend sh

# Database container'ına bağlan
docker-compose exec db psql -U admin -d superapp

# Redis container'ına bağlan
docker-compose exec redis redis-cli
```

---

## 🧪 Test ve Doğrulama

### 1. Health Check

```bash
# API health check
curl http://localhost:4000/health
```

Beklenen yanıt:
```json
{
  "status": "OK",
  "timestamp": "2024-03-15T10:00:00.000Z",
  "uptime": 123.45,
  "environment": "production"
}
```

### 2. API Endpoint Testi

```bash
# API ana endpoint
curl http://localhost:4000/api
```

### 3. Veritabanı Bağlantısı

```bash
# PostgreSQL'e bağlan
docker-compose exec db psql -U admin -d superapp

# Tabloları listele
\dt

# Örnek sorgu
SELECT * FROM users;
```

### 4. Redis Bağlantısı

```bash
# Redis'e bağlan
docker-compose exec redis redis-cli

# Ping testi
PING
# Yanıt: PONG
```

---

## 🔄 Development Modu

Development ortamında çalıştırmak için:

```bash
# Development compose dosyası ile başlat
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
```

Bu modda:
- ✅ Hot reload aktif
- ✅ Source code volume mount edilir
- ✅ Development dependencies yüklenir

---

## 🐛 Sorun Giderme

### Port Zaten Kullanılıyor

**Hata**: `Bind for 0.0.0.0:4000 failed: port is already allocated`

**Çözüm**:
```bash
# Port'u kullanan process'i bul
lsof -i :4000  # Mac/Linux
netstat -ano | findstr :4000  # Windows

# Process'i durdur veya docker-compose.yml'de port'u değiştir
```

### Container Başlamıyor

```bash
# Logları kontrol et
docker-compose logs backend

# Container'ı yeniden başlat
docker-compose restart backend
```

### Veritabanı Bağlantı Hatası

```bash
# Database loglarını kontrol et
docker-compose logs db

# Database container'ının çalıştığını doğrula
docker-compose ps db

# Database'i yeniden başlat
docker-compose restart db
```

### Volume Sorunları

```bash
# Volume'ları listele
docker volume ls

# Volume'u sil ve yeniden başlat (veriler silinir!)
docker-compose down -v
docker-compose up -d
```

### Build Hatası

```bash
# Cache olmadan yeniden build
docker-compose build --no-cache

# Tüm image'ları temizle
docker system prune -a
```

---

## 📝 İlk Kurulum Sonrası

### Veritabanı Tabloları

İlk başlatmada `backend/db/init.sql` dosyası otomatik çalışır ve şu tablolar oluşturulur:

- ✅ `users` - Kullanıcı bilgileri
- ✅ `events` - Etkinlik bilgileri
- ✅ `rewards` - Ödül bilgileri

### Örnek Veriler

Development için örnek veriler eklenmiştir:
- 1 test kullanıcı
- 2 örnek etkinlik
- 3 örnek ödül

**Not**: Production'da örnek verileri kaldırın!

---

## 🔒 Güvenlik Notları

⚠️ **ÖNEMLİ**: Production ortamında mutlaka yapın:

1. **Şifreleri Değiştirin**
   - `DB_PASSWORD`: Güçlü bir şifre kullanın
   - `JWT_SECRET`: Rastgele, güvenli bir key oluşturun

2. **.env Dosyasını Koruyun**
   - `.env` dosyasını Git'e commit etmeyin
   - `.gitignore` dosyasına ekleyin

3. **Port Erişimini Kısıtlayın**
   - Production'da sadece gerekli port'ları expose edin
   - Firewall kuralları ekleyin

4. **Volume Güvenliği**
   - Database volume'larını düzenli yedekleyin
   - Şifreli volume kullanın (production için)

---

## 📚 Ek Kaynaklar

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)

---

## ✅ Başarı Kontrol Listesi

Sistemin doğru çalıştığını kontrol edin:

- [ ] Docker ve Docker Compose yüklü
- [ ] `.env` dosyası oluşturuldu
- [ ] `docker-compose up --build -d` komutu başarılı
- [ ] Tüm container'lar `Up (healthy)` durumunda
- [ ] http://localhost:4000/health endpoint'i çalışıyor
- [ ] Veritabanı tabloları oluşturuldu
- [ ] Redis bağlantısı çalışıyor

---

## 💡 İpuçları

1. **Log Takibi**: Development sırasında `docker-compose logs -f` ile logları takip edin
2. **Resource Monitoring**: `docker stats` ile container kaynak kullanımını izleyin
3. **Backup**: Düzenli olarak database volume'unu yedekleyin
4. **Cleanup**: Kullanılmayan image ve volume'ları temizleyin: `docker system prune`

---

**Sorularınız için**: Proje dokümantasyonuna veya issue tracker'a bakın.

**Son Güncelleme**: 2024-03-15

