# 🖥️ Localhost Çalışması İçin Gerekli Sistemler

## 📊 Özet Tablo

| Sistem | Zorunlu | Versiyon | Port | Açıklama |
|--------|---------|----------|------|----------|
| **Node.js** | ✅ Evet | v18+ | - | Runtime environment |
| **PostgreSQL** | ✅ Evet | v14+ | 5432 | Veritabanı |
| **npm/yarn** | ✅ Evet | v9+ | - | Paket yöneticisi |
| **Redis** | 🟡 Önerilir | v6+ | 6379 | Cache sistemi |
| **Docker** | 🟢 Opsiyonel | v20+ | - | Kolay kurulum için |
| **Firebase** | 🟢 Opsiyonel | - | - | Push notifications |
| **Expo CLI** | 🟢 Opsiyonel | SDK 54+ | - | Mobile app için |

---

## 🏗️ Sistem Mimarisi

```
┌─────────────────────────────────────────────────────────────┐
│                    LOCALHOST ORTAMI                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   Backend   │  │ Mobile App  │  │ Admin Panel │      │
│  │  (Express)  │  │   (Expo)    │  │  (Next.js)  │      │
│  │  Port:4000  │  │ Port:8081   │  │ Port:3000   │      │
│  │  Node.js    │  │  React Native│ │   React     │      │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘      │
│         │                 │                 │              │
│         └─────────────────┼─────────────────┘              │
│                           │                                │
│                  ┌─────────▼─────────┐                     │
│                  │   PostgreSQL DB   │                     │
│                  │    Port: 5432     │                     │
│                  │   Database:       │                     │
│                  │   sehitkamil_db   │                     │
│                  └─────────┬─────────┘                     │
│                            │                                │
│                  ┌─────────▼─────────┐                     │
│                  │   Redis Cache     │                     │
│                  │    Port: 6379    │                     │
│                  │   (Opsiyonel)     │                     │
│                  └───────────────────┘                     │
│                                                             │
│  ┌──────────────────────────────────────────────┐         │
│  │  Firebase Cloud Messaging (Opsiyonel)        │         │
│  │  Push Notifications için                      │         │
│  └──────────────────────────────────────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔴 Zorunlu Sistemler (Mutlaka Gerekli)

### 1. **Node.js Runtime**
- **Versiyon:** v18.0.0 veya üzeri
- **Kontrol:** `node --version`
- **Kurulum:** https://nodejs.org/
- **Kullanım:** Backend, Mobile App ve Admin Panel için

### 2. **PostgreSQL Database**
- **Versiyon:** v14.0.0+ (v15 önerilir)
- **Port:** 5432
- **Database:** `sehitkamil_db` veya `superapp`
- **Kontrol:** `pg_isready` veya `psql --version`
- **Kurulum:**
  ```bash
  # macOS
  brew install postgresql@15
  
  # Linux
  sudo apt-get install postgresql
  
  # Docker (önerilen)
  docker-compose up -d db
  ```

### 3. **npm veya yarn**
- **Versiyon:** npm v9.0.0+ veya yarn v1.22+
- **Kontrol:** `npm --version`
- **Kurulum:** Node.js ile birlikte gelir

---

## 🟡 Önerilen Sistemler (Opsiyonel ama Önerilir)

### 4. **Redis Cache**
- **Versiyon:** v6.0.0+ (v7 önerilir)
- **Port:** 6379
- **Kontrol:** `redis-cli ping` (PONG dönerse çalışıyor)
- **Kurulum:**
  ```bash
  # macOS
  brew install redis
  
  # Linux
  sudo apt-get install redis-server
  
  # Docker (önerilen)
  docker-compose up -d redis
  ```
- **Not:** Redis olmadan da çalışır ama cache devre dışı kalır

### 5. **Docker & Docker Compose**
- **Versiyon:** Docker 20.10+, Docker Compose 2.0+
- **Kontrol:** `docker --version`
- **Kurulum:** https://www.docker.com/get-started
- **Kullanım:** Kolay database ve Redis kurulumu için

---

## 🟢 Opsiyonel Sistemler

### 6. **Firebase (Push Notifications)**
- **Gereksinim:** Firebase service account key
- **Kurulum:** Firebase Console'dan proje oluşturun
- **Not:** Firebase olmadan da çalışır, sadece push notifications devre dışı kalır

### 7. **Expo CLI**
- **Versiyon:** Expo SDK 54+
- **Kontrol:** `npx expo --version`
- **Not:** npx ile kullanılabilir, global kurulum gerekmez

---

## 📦 Her Proje İçin Gereksinimler

### Backend (`/backend`)
- ✅ Node.js v18+
- ✅ PostgreSQL v14+
- 🟡 Redis v6+ (önerilir)
- 🟢 Firebase (push notifications için)

### Mobile App (`/mobile-app`)
- ✅ Node.js v18+
- ✅ Expo SDK 54+
- ✅ Backend API'ye erişim

### Admin Panel (`/admin`)
- ✅ Node.js v18+
- ✅ Next.js 16+
- ✅ Backend API'ye erişim

---

## 🔧 Port Kullanımları

| Servis | Port | Protokol | Durum |
|--------|------|----------|-------|
| Backend API | 4000 | HTTP | ✅ Zorunlu |
| Admin Panel | 3000 | HTTP | ✅ Zorunlu |
| Mobile App (Expo) | 8081 | HTTP | ✅ Zorunlu |
| Expo Metro | 19000 | HTTP | ✅ Zorunlu (Mobile) |
| PostgreSQL | 5432 | TCP | ✅ Zorunlu |
| Redis | 6379 | TCP | 🟡 Önerilir |

---

## ✅ Minimum Sistem Gereksinimleri

### Development Ortamı
- **OS:** macOS, Linux, veya Windows
- **RAM:** En az 4GB (8GB önerilir)
- **Disk:** En az 2GB boş alan
- **CPU:** Herhangi bir modern CPU

### Çalıştırma İçin Minimum
1. ✅ Node.js v18+
2. ✅ PostgreSQL v14+
3. ✅ npm/yarn

---

## 🚀 Hızlı Kurulum (Docker ile)

```bash
# Tüm servisleri tek komutla başlat
docker-compose up -d

# Sadece database ve Redis
docker-compose up -d db redis
```

---

## 🔍 Sistem Kontrolü

```bash
# Node.js
node --version  # v18.0.0+

# npm
npm --version   # v9.0.0+

# PostgreSQL
psql --version  # v14.0.0+
pg_isready      # Çalışıyor mu?

# Redis
redis-cli ping  # PONG dönerse çalışıyor

# Docker
docker --version
docker-compose --version
```

---

## 📝 Özet

### Zorunlu Sistemler
1. ✅ **Node.js v18+** - Runtime
2. ✅ **PostgreSQL v14+** - Database
3. ✅ **npm/yarn** - Paket yöneticisi

### Önerilen Sistemler
4. 🟡 **Redis v6+** - Cache için
5. 🟡 **Docker** - Kolay kurulum için

### Opsiyonel Sistemler
6. 🟢 **Firebase** - Push notifications
7. 🟢 **Expo CLI** - Mobile app development

---

## 🎯 Sonuç

**Minimum Gereksinimler:**
- Node.js + PostgreSQL + npm = ✅ Çalışır

**Önerilen Kurulum:**
- Node.js + PostgreSQL + Redis + Docker = ✅ Optimal

**Tam Kurulum:**
- Tüm sistemler = ✅ Production'a yakın ortam

---

Detaylı kurulum için: [SETUP_GUIDE.md](./SETUP_GUIDE.md)

