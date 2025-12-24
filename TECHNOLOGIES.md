# 🛠️ Kullanılan Teknolojiler - Şehitkamil Belediyesi Süper Uygulama

## 📱 Mobile App (React Native)

### Core Framework
- **React Native** v0.81.5 - Mobil uygulama framework'ü
- **React** v19.1.0 - UI kütüphanesi
- **Expo** SDK 54.0.30 - React Native geliştirme platformu
- **TypeScript** v5.9.2 - Tip güvenliği

### Navigation & Routing
- **Expo Router** v6.0.21 - File-based routing sistemi
- **React Navigation** (Expo Router içinde) - Navigasyon

### Styling & UI
- **NativeWind** v2.0.11 - Tailwind CSS for React Native
- **Tailwind CSS** v3.3.0 - Utility-first CSS framework
- **React Native Reanimated** v4.1.1 - Performanslı animasyonlar
- **React Native Gesture Handler** v2.28.0 - Dokunma hareketleri

### Maps & Location
- **React Native Maps** v1.20.1 - Harita görünümü
- **Expo Location** v19.0.8 - Konum servisleri

### Icons & Graphics
- **Lucide React Native** v0.562.0 - Icon kütüphanesi
- **React Native SVG** v15.12.1 - SVG desteği

### HTTP & API
- **Axios** v1.6.2 - HTTP istekleri
- **AsyncStorage** v2.2.0 - Yerel veri saklama

### Image & Media
- **Expo Image** v3.0.11 - Optimize edilmiş görsel yükleme
- **Expo Blur** v15.0.8 - Blur efektleri
- **Expo Linear Gradient** v15.0.8 - Gradient efektleri

### Other
- **React Native Safe Area Context** v5.6.0 - Güvenli alan yönetimi
- **React Native Screens** v4.16.0 - Ekran optimizasyonu
- **React Native Worklets** v0.5.1 - Performans optimizasyonu

---

## 🔧 Backend (Node.js)

### Core Runtime & Framework
- **Node.js** v18+ - JavaScript runtime
- **Express.js** v4.18.2 - Web framework
- **JavaScript (ES6+)** - Programlama dili

### Database & ORM
- **PostgreSQL** v15 - İlişkisel veritabanı
- **Sequelize** v6.35.2 - ORM (Object-Relational Mapping)
- **pg** v8.11.3 - PostgreSQL client

### Cache
- **Redis** v7 - Cache ve session yönetimi
- **redis** v4.6.12 - Redis client (Node.js)

### Authentication & Security
- **JWT (jsonwebtoken)** v9.0.2 - Token tabanlı kimlik doğrulama
- **bcryptjs** v2.4.3 - Şifre hashleme
- **Helmet** v7.1.0 - Güvenlik headers
- **CORS** v2.8.5 - Cross-Origin Resource Sharing

### File Upload
- **Multer** v1.4.5-lts.1 - Dosya yükleme middleware'i

### Validation
- **express-validator** v7.0.1 - Request validation

### Push Notifications
- **Firebase Admin SDK** v12.0.0 - Push notification servisi

### API Documentation
- **Swagger JSDoc** v6.2.8 - API dokümantasyonu
- **Swagger UI Express** v5.0.0 - API dokümantasyon arayüzü

### Utilities
- **Morgan** v1.10.0 - HTTP request logger
- **dotenv** v16.3.1 - Environment variables
- **UUID** v13.0.0 - Unique ID oluşturma
- **Axios** v1.6.2 - HTTP istekleri

### Testing
- **Jest** v29.7.0 - Test framework
- **Supertest** v6.3.4 - API testleri

---

## 🖥️ Admin Panel (Next.js)

### Core Framework
- **Next.js** v16.1.1 - React framework (SSR/SSG)
- **React** v19.2.3 - UI kütüphanesi
- **TypeScript** v5 - Tip güvenliği

### State Management
- **TanStack React Query** v5.90.12 - Server state management

### HTTP & API
- **Axios** v1.13.2 - HTTP istekleri

### UI Components
- **Lucide React** v0.562.0 - Icon kütüphanesi

### Styling
- **Tailwind CSS** v4 - Utility-first CSS framework
- **PostCSS** - CSS işleme

### File Processing
- **XLSX** v0.18.5 - Excel dosya işleme

---

## 🐳 Infrastructure & DevOps

### Containerization
- **Docker** - Container platformu
- **Docker Compose** - Multi-container yönetimi

### Services
- **PostgreSQL** v15 (Docker image) - Veritabanı
- **Redis** v7 (Docker image) - Cache

---

## 📊 Teknoloji Özeti

### Programlama Dilleri
- **JavaScript** (Backend)
- **TypeScript** (Mobile App, Admin Panel)

### Veritabanı
- **PostgreSQL** v15 (Ana veritabanı)
- **Redis** v7 (Cache)

### Frontend Framework'ler
- **React Native** (Mobile App)
- **Next.js** (Admin Panel)

### Backend Framework
- **Express.js** (Node.js)

### ORM
- **Sequelize**

### Authentication
- **JWT** (JSON Web Tokens)
- **bcryptjs** (Password hashing)

### Push Notifications
- **Firebase Cloud Messaging (FCM)**

### API Documentation
- **Swagger/OpenAPI**

### Containerization
- **Docker**
- **Docker Compose**

---

## 🎯 Teknoloji Stack Özeti

```
┌─────────────────────────────────────────┐
│         MOBILE APP (React Native)       │
│  - React Native 0.81.5                  │
│  - Expo SDK 54                          │
│  - TypeScript                            │
│  - NativeWind (Tailwind)                 │
│  - Expo Router                           │
└─────────────────────────────────────────┘
                    ↕ API
┌─────────────────────────────────────────┐
│         BACKEND (Node.js/Express)        │
│  - Node.js 18+                          │
│  - Express.js 4.18                      │
│  - Sequelize ORM                        │
│  - JWT Authentication                   │
│  - Swagger Documentation                │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│         DATABASE (PostgreSQL)            │
│  - PostgreSQL 15                         │
│  - Redis 7 (Cache)                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      ADMIN PANEL (Next.js)               │
│  - Next.js 16                           │
│  - React 19                             │
│  - TypeScript                            │
│  - Tailwind CSS                          │
└─────────────────────────────────────────┘
```

---

## 📦 Paket Yöneticileri

- **npm** - Node Package Manager
- **yarn** (opsiyonel)

---

## 🔐 Güvenlik Teknolojileri

- **JWT** - Token authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin protection

---

## 📱 Platform Desteği

### Mobile App
- **iOS** - Apple cihazlar
- **Android** - Google cihazlar
- **Web** - Tarayıcı desteği (Expo)

### Admin Panel
- **Web** - Tüm modern tarayıcılar

---

## 🚀 Deployment Teknolojileri

- **Docker** - Containerization
- **Docker Compose** - Multi-service orchestration
- **PostgreSQL** - Production database
- **Redis** - Production cache

---

## 📚 Dokümantasyon Araçları

- **Swagger/OpenAPI** - API dokümantasyonu
- **JSDoc** - Kod dokümantasyonu
- **Markdown** - Proje dokümantasyonu

---

## ✅ Özet

**Toplam Teknoloji Sayısı:** ~40+ paket/kütüphane

**Ana Teknolojiler:**
1. **React Native** - Mobile App
2. **Node.js + Express** - Backend
3. **PostgreSQL** - Database
4. **Next.js** - Admin Panel
5. **Docker** - Deployment
6. **TypeScript** - Type Safety
7. **Sequelize** - ORM
8. **JWT** - Authentication
9. **Firebase** - Push Notifications
10. **Swagger** - API Documentation

**Modern, güncel ve production-ready teknolojiler kullanıldı!** 🚀

