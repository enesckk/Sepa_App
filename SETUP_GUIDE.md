# 🚀 Uygulama Kurulum Rehberi

## 📋 Genel Bakış

Bu rehber, Şehitkamil Belediyesi Süper Uygulama'nın çalıştırılması için gerekli tüm adımları içerir.

## ⚠️ Ön Gereksinimler

- **Node.js** v18+ yüklü olmalı
- **PostgreSQL** v14+ yüklü ve çalışıyor olmalı
- **Redis** v6+ yüklü ve çalışıyor olmalı (opsiyonel ama önerilir)
- **Docker** ve **Docker Compose** (opsiyonel - kolay kurulum için)
- **npm** veya **yarn** paket yöneticisi

---

## 🔧 1. Backend Kurulumu

### 1.1 Paketleri Yükle

```bash
cd backend
npm install
```

### 1.2 Environment Variables Ayarla

`.env` dosyası oluşturun:

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin ve gerekli değerleri girin:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sehitkamil_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT (Güçlü secret'lar oluşturun!)
JWT_SECRET=your-very-secure-jwt-secret-key-minimum-32-characters-long
JWT_REFRESH_SECRET=your-very-secure-refresh-secret-key-minimum-32-characters-long

# Server
PORT=4000
NODE_ENV=development
```

### 1.3 Database Kurulumu

#### Seçenek 1: Docker ile (Önerilen)

```bash
# Proje root'undan
docker-compose up -d db

# Database hazır olana kadar bekleyin (10-15 saniye)
# init.sql otomatik olarak çalışacak
```

#### Seçenek 2: Manuel Kurulum

```bash
# PostgreSQL'de veritabanı oluştur
createdb sehitkamil_db

# Schema'yı uygula
psql -U postgres -d sehitkamil_db -f db/init.sql
```

### 1.4 Database Migration (fcm_token field için)

User model'e `fcm_token` field'ı eklendi. Eğer mevcut bir database varsa:

```sql
-- PostgreSQL'de çalıştırın
ALTER TABLE users ADD COLUMN IF NOT EXISTS fcm_token TEXT;
```

Veya Sequelize otomatik olarak ekleyecektir (development'ta `alter: true`).

### 1.5 Uploads Klasörü Oluştur

```bash
mkdir -p uploads/events uploads/stories uploads/news uploads/rewards uploads/applications
```

### 1.6 Backend'i Başlat

```bash
npm run dev
```

Backend `http://localhost:4000` adresinde çalışacak.

**Kontrol:**
- Health check: http://localhost:4000/health
- API docs: http://localhost:4000/api-docs
- API info: http://localhost:4000/api

---

## 📱 2. Mobile App Kurulumu

### 2.1 Paketleri Yükle

```bash
cd mobile-app
npm install
```

### 2.2 API Base URL Ayarla

`src/services/api/config.ts` dosyasında API base URL'i kontrol edin:

```typescript
BASE_URL: __DEV__ 
  ? 'http://localhost:4000/api'  // Backend port 4000'de çalışıyor
  : 'https://api.sehitkamil.bel.tr/api',
```

**ÖNEMLİ:** Backend port 4000'de çalışıyor, mobile app'te de 4000 olmalı!

### 2.3 Expo Development Build

```bash
# iOS Simulator için
npm run ios

# Android Emulator için
npm run android

# Web için
npm run web
```

### 2.4 Network Ayarları

**iOS Simulator:** `localhost` çalışır

**Android Emulator:** `10.0.2.2` kullanın veya bilgisayarınızın IP adresini kullanın:

```typescript
// Android için
BASE_URL: 'http://10.0.2.2:4000/api'
// VEYA
BASE_URL: 'http://YOUR_COMPUTER_IP:4000/api'
```

**Fiziksel Cihaz:** Bilgisayarınızın IP adresini kullanın:

```bash
# IP adresinizi öğrenin
# macOS/Linux:
ifconfig | grep "inet "

# Windows:
ipconfig
```

Sonra mobile app'te:
```typescript
BASE_URL: 'http://YOUR_IP:4000/api'
```

---

## 🖥️ 3. Admin Panel Kurulumu

### 3.1 Paketleri Yükle

```bash
cd admin
npm install
```

### 3.2 Environment Variables

`.env.local` dosyası oluşturun:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 3.3 Admin Panel'i Başlat

```bash
npm run dev
```

Admin panel `http://localhost:3000` adresinde çalışacak.

---

## 🐳 4. Docker ile Hızlı Kurulum (Önerilen)

### 4.1 Tüm Servisleri Başlat

```bash
# Proje root'undan
docker-compose up -d

# Logları izle
docker-compose logs -f
```

### 4.2 Servisler

- **Backend:** http://localhost:4000
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379
- **Admin Panel:** http://localhost:3000 (eğer docker-compose'da varsa)

---

## ✅ 5. Kurulum Kontrolü

### Backend Kontrolü

```bash
# Health check
curl http://localhost:4000/health

# API info
curl http://localhost:4000/api
```

### Database Kontrolü

```bash
# Docker ile
docker-compose exec db psql -U admin -d superapp -c "SELECT COUNT(*) FROM users;"

# Manuel
psql -U postgres -d sehitkamil_db -c "SELECT COUNT(*) FROM users;"
```

### Mobile App Kontrolü

1. Expo Go uygulamasını açın
2. QR kodu tarayın
3. Uygulama açıldığında login ekranı görünmeli

### Admin Panel Kontrolü

1. http://localhost:3000 adresine gidin
2. Login ekranı görünmeli

---

## 🔍 6. Yaygın Sorunlar ve Çözümleri

### Backend başlamıyor

**Sorun:** Port 4000 zaten kullanılıyor
**Çözüm:**
```bash
# Port'u değiştirin (.env'de PORT=4001)
# VEYA
# Kullanan process'i bulun ve durdurun
lsof -ti:4000 | xargs kill -9
```

### Database bağlantı hatası

**Sorun:** PostgreSQL çalışmıyor veya yanlış bilgiler
**Çözüm:**
```bash
# PostgreSQL'in çalıştığını kontrol edin
pg_isready

# Docker ile
docker-compose ps db
```

### Mobile app API'ye bağlanamıyor

**Sorun:** Network hatası
**Çözüm:**
- Backend'in çalıştığını kontrol edin
- API base URL'in doğru olduğunu kontrol edin
- Firewall ayarlarını kontrol edin
- Android emulator için `10.0.2.2` kullanın

### fcm_token field hatası

**Sorun:** Database'de fcm_token column yok
**Çözüm:**
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS fcm_token TEXT;
```

---

## 📝 7. İlk Kullanıcı Oluşturma

### Backend'den (API ile)

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@sehitkamil.gov.tr",
    "password": "password123"
  }'
```

### Database'den (SQL ile)

```sql
-- Şifre: password123 (bcrypt hash)
INSERT INTO users (name, email, password, role, golbucks) VALUES
('Admin User', 'admin@sehitkamil.gov.tr', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'admin', 0);
```

**NOT:** Production'da güçlü şifreler kullanın!

---

## 🎯 8. Sonraki Adımlar

1. ✅ Backend çalışıyor mu? → http://localhost:4000/health
2. ✅ Database bağlantısı var mı? → Backend loglarını kontrol edin
3. ✅ Mobile app bağlanabiliyor mu? → Login ekranını test edin
4. ✅ Admin panel çalışıyor mu? → http://localhost:3000

---

## 📞 Destek

Sorunlar için:
- Backend logs: `backend` klasöründe `npm run dev` çıktısını kontrol edin
- Database logs: `docker-compose logs db`
- Mobile app logs: Expo terminal çıktısını kontrol edin

---

## ✅ Kurulum Checklist

- [ ] Node.js v18+ yüklü
- [ ] PostgreSQL çalışıyor
- [ ] Redis çalışıyor (opsiyonel)
- [ ] Backend paketleri yüklendi (`npm install`)
- [ ] Backend `.env` dosyası oluşturuldu
- [ ] Database oluşturuldu ve schema uygulandı
- [ ] Backend çalışıyor (port 4000)
- [ ] Mobile app paketleri yüklendi
- [ ] Mobile app API URL'i ayarlandı
- [ ] Admin panel paketleri yüklendi
- [ ] Admin panel `.env.local` oluşturuldu
- [ ] Admin panel çalışıyor (port 3000)

---

**🎉 Kurulum tamamlandı! Uygulama kullanıma hazır.**

