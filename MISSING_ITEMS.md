# ⚠️ Uygulama Çalışması İçin Eksikler

## 📋 Özet

Uygulamanın çalışması için aşağıdaki adımları tamamlamanız gerekiyor:

---

## 🔴 Kritik Eksikler (Mutlaka Yapılmalı)

### 1. Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
# .env dosyasını düzenleyin:
# - DB_HOST, DB_NAME, DB_USER, DB_PASSWORD
# - JWT_SECRET, JWT_REFRESH_SECRET (güçlü secret'lar!)
```

**Admin:**
```bash
cd admin
cp .env.example .env.local
# .env.local dosyasını düzenleyin:
# - NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 2. Paket Yükleme

```bash
# Backend (yeni paketler için)
cd backend
npm install

# Mobile App
cd mobile-app
npm install

# Admin
cd admin
npm install
```

### 3. Database Kurulumu

**Yeni Kurulum:**
```bash
# Docker ile (önerilen)
docker-compose up -d db

# VEYA Manuel
createdb sehitkamil_db
psql -U postgres -d sehitkamil_db -f backend/db/init.sql
```

**Mevcut Database:**
```bash
# fcm_token field'ı ekle
psql -U postgres -d sehitkamil_db -f backend/db/migration_add_fcm_token.sql
```

---

## 🟡 Önemli Eksikler (Önerilir)

### 4. Uploads Klasörleri

```bash
cd backend
mkdir -p uploads/events uploads/stories uploads/news uploads/rewards uploads/applications
```

✅ **Zaten oluşturuldu!**

### 5. Firebase Setup (Push Notifications için)

**Opsiyonel ama önerilir:**
1. Firebase Console'dan service account key indirin
2. `.env` dosyasında `FIREBASE_SERVICE_ACCOUNT_KEY` olarak ayarlayın

**Not:** Firebase olmadan da çalışır, sadece push notifications devre dışı kalır.

---

## 🟢 İyileştirmeler (Opsiyonel)

### 6. Redis Setup

Cache için önerilir ama zorunlu değil. Backend Redis olmadan da çalışır.

### 7. SSL/HTTPS

Production için gerekli, development'ta opsiyonel.

---

## ✅ Düzeltilen Sorunlar

1. ✅ API Base URL uyumsuzlukları düzeltildi
   - Mobile app: `localhost:4000` ✅
   - Admin panel: `localhost:4000` ✅

2. ✅ init.sql'e fcm_token eklendi ✅

3. ✅ Migration script oluşturuldu ✅

4. ✅ Uploads klasörleri oluşturuldu ✅

5. ✅ .env.example dosyaları oluşturuldu ✅

---

## 🚀 Hızlı Başlatma

```bash
# 1. Paketleri yükle
cd backend && npm install
cd ../mobile-app && npm install
cd ../admin && npm install

# 2. Environment variables
cd backend && cp .env.example .env && nano .env
cd ../admin && cp .env.example .env.local && nano .env.local

# 3. Database
docker-compose up -d db

# 4. Başlat
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd mobile-app && npm start

# Terminal 3
cd admin && npm run dev
```

---

## 📚 Detaylı Rehberler

- **Kurulum Rehberi:** [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Hızlı Başlangıç:** [QUICK_START.md](./QUICK_START.md)
- **Eksikler Açıklaması:** [EXPLANATION.md](./EXPLANATION.md)

---

## ✅ Kontrol Listesi

Kurulumdan sonra:

- [ ] Backend çalışıyor: http://localhost:4000/health
- [ ] API docs: http://localhost:4000/api-docs
- [ ] Database bağlantısı var
- [ ] Mobile app backend'e bağlanabiliyor
- [ ] Admin panel backend'e bağlanabiliyor
- [ ] Environment variables ayarlanmış
- [ ] Paketler yüklendi

---

**🎯 Sonuç:** Tüm kritik eksikler belirlendi ve çözümleri hazırlandı. Yukarıdaki adımları takip ederek uygulamayı çalıştırabilirsiniz!

