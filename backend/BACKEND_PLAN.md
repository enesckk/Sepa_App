# 🚀 Backend Geliştirme Planı - Şehitkamil Belediyesi API

## 📊 Mevcut Durum

✅ **Hazır Olanlar:**
- Express.js temel yapı
- Middleware'ler (CORS, Helmet, Morgan)
- PostgreSQL veritabanı şeması (init.sql)
- Sequelize ORM kurulumu
- Docker yapılandırması
- Temel health check endpoint'leri

❌ **Eksik Olanlar:**
- Route'lar (API endpoint'leri)
- Model'ler (Sequelize)
- Controller'lar (İş mantığı)
- Service'ler (Business logic)
- Middleware'ler (Auth, Validation)
- Error handling
- File upload (Multer)
- Redis cache entegrasyonu

---

## 🎯 Backend Geliştirme Aşamaları

### **AŞAMA 1: Temel Altyapı ve Authentication** (1-2 gün)
**Öncelik: 🔴 Yüksek**

#### 1.1 Proje Yapısı Oluşturma
- [ ] Klasör yapısı (models, routes, controllers, services, middleware, utils)
- [ ] Config dosyaları (database, redis, jwt)
- [ ] Environment variables (.env.example)

#### 1.2 Database Bağlantısı
- [ ] Sequelize config
- [ ] Database connection test
- [ ] Migration sistemi kurulumu

#### 1.3 Authentication Sistemi
- [ ] JWT token generation/verification
- [ ] Password hashing (bcrypt)
- [ ] Auth middleware
- [ ] Login endpoint (POST /api/auth/login)
- [ ] Register endpoint (POST /api/auth/register)
- [ ] SMS verification (mock/real)
- [ ] Token refresh endpoint

#### 1.4 User Model & Routes
- [ ] User model (Sequelize)
- [ ] User controller
- [ ] User routes
  - GET /api/users/profile (kendi profil)
  - PUT /api/users/profile (profil güncelle)
  - GET /api/users/golbucks (puan bakiyesi)

**Çıktı:** Kullanıcı girişi, kayıt, profil yönetimi çalışıyor

---

### **AŞAMA 2: Günlük Ödül ve Gölbucks Sistemi** (1 gün)
**Öncelik: 🔴 Yüksek**

#### 2.1 Günlük Giriş Ödülü
- [ ] Daily reward service
- [ ] POST /api/rewards/daily (günlük ödül al)
- [ ] GET /api/rewards/daily/status (bugün alındı mı?)
- [ ] Gölbucks güncelleme

#### 2.2 Gölbucks Sistemi
- [ ] Gölbucks transaction model
- [ ] Gölbucks service
- [ ] GET /api/users/golbucks/history (işlem geçmişi)
- [ ] POST /api/users/golbucks/add (ödül ekle)
- [ ] POST /api/users/golbucks/deduct (ödül çıkar)

**Çıktı:** Günlük ödül ve puan sistemi çalışıyor

---

### **AŞAMA 3: Story (Hikaye) Sistemi** (1 gün)
**Öncelik: 🟡 Orta**

#### 3.1 Story Model & Routes
- [ ] Story model (id, image, title, description, is_active, expires_at)
- [ ] Story controller
- [ ] Story routes
  - GET /api/stories (aktif story'ler)
  - POST /api/stories (admin - story oluştur)
  - PUT /api/stories/:id (admin - story güncelle)
  - DELETE /api/stories/:id (admin - story sil)
  - POST /api/stories/:id/view (story görüntülendi)

#### 3.2 File Upload
- [ ] Multer config (image upload)
- [ ] Image storage (local/cloud)
- [ ] Image validation

**Çıktı:** Story CRUD işlemleri çalışıyor

---

### **AŞAMA 4: Etkinlikler (Events) Sistemi** (1-2 gün)
**Öncelik: 🔴 Yüksek**

#### 4.1 Event Model & Routes
- [ ] Event model (zaten init.sql'de var)
- [ ] Event controller
- [ ] Event routes
  - GET /api/events (liste, filtreleme, sayfalama)
  - GET /api/events/:id (detay)
  - POST /api/events/:id/register (kayıt ol)
  - DELETE /api/events/:id/register (kayıt iptal)
  - GET /api/events/my-registrations (kullanıcının kayıtları)

#### 4.2 Event Registration
- [ ] Event registration model
- [ ] Kapasite kontrolü
- [ ] QR kod oluşturma
- [ ] Gölbucks ödülü verme

**Çıktı:** Etkinlik listeleme, detay, kayıt sistemi çalışıyor

---

### **AŞAMA 5: Şehir Rehberi (City Guide)** (1 gün)
**Öncelik: 🟡 Orta**

#### 5.1 Place Model & Routes
- [ ] Place model (zaten init.sql'de locations var mı kontrol et)
- [ ] Place controller
- [ ] Place routes
  - GET /api/places (liste, filtreleme, konum bazlı)
  - GET /api/places/:id (detay)
  - GET /api/places/nearby (yakındaki yerler)
  - GET /api/places/categories (kategoriler)

#### 5.2 Location Services
- [ ] Konum bazlı arama
- [ ] Mesafe hesaplama
- [ ] Harita entegrasyonu için koordinatlar

**Çıktı:** Şehir rehberi API'leri çalışıyor

---

### **AŞAMA 6: Başvurular (Applications) Sistemi** (2 gün)
**Öncelik: 🔴 Yüksek**

#### 6.1 Application Model & Routes
- [ ] Application model (şikayet, talep, nikah, muhtar mesajı)
- [ ] Application controller
- [ ] Application routes
  - POST /api/applications (yeni başvuru)
  - GET /api/applications/my (kullanıcının başvuruları)
  - GET /api/applications/:id (detay)
  - PUT /api/applications/:id/status (admin - durum güncelle)
  - POST /api/applications/:id/comment (yorum ekle)

#### 6.2 Application Types
- [ ] Şikayet/Talep (fotoğraf + konum)
- [ ] Nikah başvurusu
- [ ] Muhtara mesaj
- [ ] Askıda fatura

#### 6.3 File Upload
- [ ] Fotoğraf yükleme (Multer)
- [ ] Konum bilgisi kaydetme

**Çıktı:** Başvuru sistemi çalışıyor

---

### **AŞAMA 7: Anketler (Surveys) Sistemi** (1-2 gün)
**Öncelik: 🟡 Orta**

#### 7.1 Survey Model & Routes
- [ ] Survey model
- [ ] Question model
- [ ] Answer model
- [ ] Survey controller
- [ ] Survey routes
  - GET /api/surveys (aktif anketler)
  - GET /api/surveys/:id (anket detay)
  - POST /api/surveys/:id/submit (anket gönder)
  - GET /api/surveys/my (kullanıcının anketleri)

#### 7.2 Survey Logic
- [ ] Anket tamamlama kontrolü
- [ ] Gölbucks ödülü verme
- [ ] Anket sonuçları (admin)

**Çıktı:** Anket sistemi çalışıyor

---

### **AŞAMA 8: Ödüller (Rewards/Market) Sistemi** (1-2 gün)
**Öncelik: 🟡 Orta**

#### 8.1 Reward Model & Routes
- [ ] Reward model (zaten init.sql'de var)
- [ ] Reward controller
- [ ] Reward routes
  - GET /api/rewards (liste, filtreleme)
  - GET /api/rewards/:id (detay)
  - POST /api/rewards/:id/redeem (ödülü kullan)
  - GET /api/rewards/my (kullanıcının ödülleri)

#### 8.2 Reward Redemption
- [ ] Gölbucks kontrolü
- [ ] Stok kontrolü
- [ ] QR kod oluşturma
- [ ] Ödül geçerlilik süresi

**Çıktı:** Ödül/market sistemi çalışıyor

---

### **AŞAMA 9: Haberler ve Duyurular** (1 gün)
**Öncelik: 🟢 Düşük**

#### 9.1 News Model & Routes
- [ ] News model
- [ ] News controller
- [ ] News routes
  - GET /api/news (liste, sayfalama)
  - GET /api/news/:id (detay)
  - POST /api/news (admin - haber oluştur)
  - PUT /api/news/:id (admin - haber güncelle)
  - DELETE /api/news/:id (admin - haber sil)

**Çıktı:** Haber sistemi çalışıyor

---

### **AŞAMA 10: Afet Toplanma Alanları** (1 gün)
**Öncelik: 🟡 Orta**

#### 10.1 Emergency Gathering Model & Routes
- [ ] EmergencyGathering model
- [ ] EmergencyGathering controller
- [ ] EmergencyGathering routes
  - GET /api/emergency-gathering (liste)
  - GET /api/emergency-gathering/nearby (yakındaki alanlar)
  - GET /api/emergency-gathering/:id (detay)

**Çıktı:** Afet toplanma alanları API'si çalışıyor

---

### **AŞAMA 11: Admin Panel API'leri** (2-3 gün)
**Öncelik: 🟡 Orta**

#### 11.1 Admin Authentication
- [ ] Admin login
- [ ] Admin middleware
- [ ] Role-based access control

#### 11.2 Admin Endpoints
- [ ] Dashboard stats
- [ ] User management
- [ ] Application management
- [ ] Event management
- [ ] Survey management
- [ ] Story management
- [ ] News management
- [ ] Analytics endpoints

**Çıktı:** Admin panel API'leri çalışıyor

---

### **AŞAMA 12: Bildirimler ve Cache** (1-2 gün)
**Öncelik: 🟡 Orta**

#### 12.1 Redis Cache
- [ ] Redis connection
- [ ] Cache middleware
- [ ] Cache invalidation

#### 12.2 Notifications
- [ ] Notification model
- [ ] Push notification service (FCM/OneSignal)
- [ ] Notification routes
  - GET /api/notifications (kullanıcının bildirimleri)
  - PUT /api/notifications/:id/read (okundu işaretle)

**Çıktı:** Bildirim ve cache sistemi çalışıyor

---

### **AŞAMA 13: Test ve Dokümantasyon** (1-2 gün)
**Öncelik: 🟢 Düşük**

#### 13.1 Testing
- [ ] Unit testler
- [ ] Integration testler
- [ ] API testleri

#### 13.2 Dokümantasyon
- [ ] API dokümantasyonu (Swagger/Postman)
- [ ] README güncelleme
- [ ] Deployment guide

**Çıktı:** Test edilmiş ve dokümante edilmiş API

---

## 📅 Toplam Süre Tahmini

- **Minimum:** 12-15 gün (hızlı geliştirme)
- **Optimal:** 18-20 gün (test ve optimizasyon ile)
- **Maksimum:** 25-30 gün (detaylı test ve dokümantasyon ile)

---

## 🎯 Öncelik Sırası

1. **AŞAMA 1** - Authentication (Kritik)
2. **AŞAMA 2** - Günlük Ödül (Kritik)
3. **AŞAMA 4** - Etkinlikler (Yüksek)
4. **AŞAMA 6** - Başvurular (Yüksek)
5. **AŞAMA 3** - Story (Orta)
6. **AŞAMA 7** - Anketler (Orta)
7. **AŞAMA 8** - Ödüller (Orta)
8. **AŞAMA 5** - Şehir Rehberi (Orta)
9. **AŞAMA 10** - Afet Toplanma (Orta)
10. **AŞAMA 9** - Haberler (Düşük)
11. **AŞAMA 11** - Admin Panel (Orta)
12. **AŞAMA 12** - Bildirimler (Orta)
13. **AŞAMA 13** - Test (Düşük)

---

## 🛠 Teknik Detaylar

### Klasör Yapısı
```
backend/
├── src/
│   ├── config/          # Database, Redis, JWT config
│   ├── models/          # Sequelize models
│   ├── routes/          # Express routes
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Helper functions
│   ├── validators/      # Request validation
│   └── index.js         # Entry point
├── migrations/          # Sequelize migrations
├── tests/               # Test files
└── uploads/             # Uploaded files
```

### Teknoloji Stack
- **Express.js** - Web framework
- **Sequelize** - ORM
- **PostgreSQL** - Database
- **Redis** - Cache
- **JWT** - Authentication
- **Multer** - File upload
- **Bcrypt** - Password hashing
- **Express Validator** - Request validation

---

## ✅ İlk Adım: AŞAMA 1'i Başlatalım mı?

Hangi aşamadan başlamak istersiniz? Önerim **AŞAMA 1 (Authentication)** ile başlamak.

