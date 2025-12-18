# 🏗️ Şehitkamil Belediyesi Süper Uygulama - Detaylı Mimari Dokümantasyon

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Proje Yapısı](#proje-yapısı)
3. [Mobil Uygulama Mimarisi](#mobil-uygulama-mimarisi)
4. [Backend Mimarisi](#backend-mimarisi)
5. [Veritabanı Yapısı](#veritabanı-yapısı)
6. [Docker Yapılandırması](#docker-yapılandırması)
7. [Bağımlılıklar ve Versiyonlar](#bağımlılıklar-ve-versiyonlar)
8. [Routing ve Navigasyon](#routing-ve-navigasyon)
9. [State Management](#state-management)
10. [API Entegrasyonu](#api-entegrasyonu)
11. [Hata Ayıklama ve Sorun Giderme](#hata-ayıklama-ve-sorun-giderme)

---

## 🎯 Genel Bakış

### Proje Tipi
- **Mobil Uygulama**: React Native + Expo (TypeScript)
- **Backend API**: Node.js + Express
- **Veritabanı**: PostgreSQL
- **Cache**: Redis
- **Containerization**: Docker + Docker Compose

### Teknoloji Stack

#### Frontend (Mobile)
- **Framework**: React Native 0.74.5
- **Expo**: ~51.0.0
- **Router**: Expo Router ~3.5.0
- **Styling**: NativeWind (Tailwind CSS) 2.0.11
- **Animations**: React Native Reanimated ~3.10.1
- **Maps**: React Native Maps 1.18.0
- **Icons**: Lucide React Native 0.344.0

#### Backend
- **Runtime**: Node.js >=18.0.0
- **Framework**: Express 4.18.2
- **ORM**: Sequelize 6.35.2
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Authentication**: JWT (jsonwebtoken 9.0.2)

---

## 📁 Proje Yapısı

```
APP/
├── backend/                    # Backend API
│   ├── db/                     # Veritabanı dosyaları
│   │   ├── init.sql           # İlk kurulum SQL scripti
│   │   └── README.md
│   ├── src/                    # Kaynak kodlar
│   │   ├── __tests__/         # Test dosyaları
│   │   │   └── index.test.js
│   │   └── index.js           # Ana Express uygulaması
│   ├── Dockerfile              # Production Docker image
│   ├── Dockerfile.dev          # Development Docker image
│   ├── jest.config.js          # Jest test konfigürasyonu
│   ├── package.json
│   └── README_DOCKER.md
│
├── mobile-app/                 # React Native Mobil Uygulama
│   ├── app/                    # Expo Router dosyaları (file-based routing)
│   │   ├── _layout.tsx        # Root layout (Stack navigator)
│   │   ├── (tabs)/            # Tab navigator grubu
│   │   │   ├── _layout.tsx    # Tab layout
│   │   │   ├── index.tsx      # Ana Sayfa (Home)
│   │   │   ├── events.tsx     # Etkinlikler
│   │   │   ├── applications.tsx # Başvurular
│   │   │   ├── rewards.tsx    # Ödüller
│   │   │   └── menu.tsx       # Menü
│   │   ├── city-guide.tsx     # Şehir Rehberi (modal/stack)
│   │   ├── surveys.tsx         # Anketler (modal/stack)
│   │   └── bill-support.tsx   # Askıda Fatura (modal/stack)
│   │
│   ├── src/                    # Kaynak kodlar
│   │   ├── components/        # React bileşenleri (40+ component)
│   │   │   ├── TopBar.tsx
│   │   │   ├── StoryCarousel.tsx
│   │   │   ├── WeatherCard.tsx
│   │   │   ├── QuickAccessCards.tsx
│   │   │   ├── NoticeBanner.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── RewardItemCard.tsx
│   │   │   └── ... (40+ component)
│   │   ├── screens/           # Ekran bileşenleri (legacy, şu an kullanılmıyor)
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── EventsScreen.tsx
│   │   │   └── ...
│   │   ├── services/          # Mock data ve API servisleri
│   │   │   ├── mockData.ts
│   │   │   ├── mockEventsData.ts
│   │   │   ├── mockRewardsData.ts
│   │   │   ├── mockSurveysData.ts
│   │   │   ├── mockLocationsData.ts
│   │   │   ├── mockBillsData.ts
│   │   │   └── mockApplicationsData.ts
│   │   └── constants/         # Sabitler
│   │       └── colors.ts      # Renk paleti
│   │
│   ├── assets/                # Statik dosyalar (resimler, fontlar)
│   ├── index.js               # Entry point (expo-router/entry)
│   ├── app.json               # Expo konfigürasyonu
│   ├── babel.config.js        # Babel konfigürasyonu
│   ├── metro.config.js        # Metro bundler konfigürasyonu
│   ├── tsconfig.json          # TypeScript konfigürasyonu
│   ├── tailwind.config.js     # Tailwind CSS konfigürasyonu
│   ├── postcss.config.js      # PostCSS konfigürasyonu
│   ├── global.css             # Global CSS (Tailwind directives)
│   └── package.json
│
├── docker-compose.yml         # Production Docker Compose
├── docker-compose.dev.yml     # Development Docker Compose
├── test-system.sh             # Sistem test scripti
└── README_DOCKER.md           # Docker dokümantasyonu
```

---

## 📱 Mobil Uygulama Mimarisi

### Entry Point ve Başlatma Akışı

```
index.js
  └── import 'expo-router/entry'
      └── Expo Router başlatılır
          └── app/_layout.tsx yüklenir
              └── RootLayout render edilir
                  └── Stack Navigator oluşturulur
                      └── app/(tabs)/_layout.tsx yüklenir
                          └── Tab Navigator oluşturulur
                              └── Tab ekranları render edilir
```

### Routing Yapısı (Expo Router)

#### File-Based Routing

Expo Router, dosya sistemini kullanarak routing yapar:

```
app/
├── _layout.tsx          → Root Stack Navigator
│
├── (tabs)/              → Tab Navigator Grubu (parantez = route group)
│   ├── _layout.tsx      → Tab Navigator Layout
│   ├── index.tsx        → / (Ana Sayfa)
│   ├── events.tsx        → /events
│   ├── applications.tsx → /applications
│   ├── rewards.tsx      → /rewards
│   └── menu.tsx         → /menu
│
├── city-guide.tsx       → /city-guide (Stack screen)
├── surveys.tsx          → /surveys (Stack screen)
└── bill-support.tsx     → /bill-support (Stack screen)
```

### Layout Hiyerarşisi

```
RootLayout (_layout.tsx)
├── GestureHandlerRootView
│   └── SafeAreaProvider
│       └── StatusBar
│           └── Stack Navigator
│               ├── (tabs) Group
│               │   └── TabsLayout
│               │       ├── Tab: index (Ana Sayfa)
│               │       ├── Tab: events
│               │       ├── Tab: applications
│               │       ├── Tab: rewards
│               │       └── Tab: menu
│               │
│               ├── city-guide (Stack Screen)
│               ├── surveys (Stack Screen)
│               └── bill-support (Stack Screen)
```

### Component Yapısı

#### Component Kategorileri

1. **Layout Components**
   - `TopBar.tsx` - Üst bar (logo, konum)
   - `BottomNavBar.tsx` - Alt navigasyon (legacy, şu an kullanılmıyor)
   - `TabBar.tsx` - Tab bar (Askıda Fatura için)
   - `TopTabBar.tsx` - Üst tab bar (Şehir Rehberi için)

2. **Feature Components**
   - `StoryCarousel.tsx` - Başkan hikayeleri carousel
   - `WeatherCard.tsx` - Hava durumu kartı
   - `QuickAccessCards.tsx` - Hızlı erişim kartları
   - `NoticeBanner.tsx` - Duyuru banner'ı
   - `EventCard.tsx` - Etkinlik kartı
   - `RewardItemCard.tsx` - Ödül kartı
   - `SurveyCard.tsx` - Anket kartı

3. **Form Components**
   - `BillForm.tsx` - Fatura formu
   - `DescriptionInput.tsx` - Açıklama input
   - `LocationPicker.tsx` - Konum seçici
   - `PhotoUpload.tsx` - Fotoğraf yükleme
   - `IssueTypeSelector.tsx` - Sorun tipi seçici
   - `AnswerOptions.tsx` - Cevap seçenekleri

4. **Modal Components**
   - `EventDetailModal.tsx` - Etkinlik detay modal
   - `RewardDetailModal.tsx` - Ödül detay modal
   - `PlaceDetailModal.tsx` - Mekan detay modal

5. **Animation Components**
   - `GolbucksRewardAnimation.tsx` - Gölbucks kazanma animasyonu
   - `GolbucksDeductionAnimation.tsx` - Gölbucks harcama animasyonu
   - `SuccessConfetti.tsx` - Başarı konfeti animasyonu

6. **UI Feedback Components**
   - `SuccessSnackbar.tsx` - Başarı mesajı
   - `ProgressBar.tsx` - İlerleme çubuğu
   - `RewardBadge.tsx` - Ödül rozeti
   - `GolbucksEarned.tsx` - Kazanılan puan gösterimi

7. **Map Components**
   - `GuideMap.tsx` - Harita görünümü
   - `GuideList.tsx` - Mekan listesi
   - `GuideListItem.tsx` - Mekan list item

8. **Filter/Selection Components**
   - `FilterBar.tsx` - Filtre çubuğu
   - `CategoryChipBar.tsx` - Kategori chip'leri
   - `RewardCategoryTabs.tsx` - Ödül kategori sekmeleri

### State Management

**Şu anki Durum**: Local state (useState, useMemo)

- Her ekran kendi state'ini yönetiyor
- Props drilling kullanılıyor
- Global state yok

**Önerilen İyileştirme**: Context API veya Zustand

### Styling Yaklaşımı

1. **NativeWind (Tailwind CSS)**
   - Utility-first CSS
   - `tailwind.config.js` ile özelleştirilmiş
   - `global.css` ile import ediliyor

2. **StyleSheet API**
   - Bazı component'lerde React Native StyleSheet kullanılıyor
   - Dinamik stiller için

3. **Renk Sistemi**
   - `src/constants/colors.ts` - Merkezi renk tanımları
   - Primary: #2E7D32 (Yeşil)
   - Background: #F5F5F5
   - Surface: #FFFFFF

### Animasyon Sistemi

**React Native Reanimated 3.10.1**

- `useSharedValue` - Paylaşılan değerler
- `useAnimatedStyle` - Animasyonlu stiller
- `withSpring` - Spring animasyonları
- `interpolate` - Değer interpolasyonu

**Kullanım Örnekleri**:
- `StoryCarousel.tsx` - Story seçim animasyonu
- `NoticeBanner.tsx` - Banner kaydırma animasyonu

---

## 🔧 Backend Mimarisi

### Express Uygulama Yapısı

```
src/index.js
├── Express App Oluşturulur
├── Middleware'ler
│   ├── helmet() - Güvenlik headers
│   ├── cors() - CORS ayarları
│   ├── morgan() - HTTP request logging
│   ├── express.json() - JSON parser
│   └── express.urlencoded() - URL encoded parser
│
├── Routes
│   ├── GET / - API bilgisi
│   ├── GET /health - Health check
│   └── GET /api - API endpoint bilgisi
│
├── Error Handlers
│   ├── 404 Handler
│   └── Global Error Handler
│
└── Server Start (Port 4000)
```

### API Endpoints (Mevcut)

```
GET  /              → API bilgisi
GET  /health        → Health check (uptime, timestamp, environment)
GET  /api           → API endpoint listesi
*    /*             → 404 Not Found
```

### Veritabanı Bağlantısı

**Hazırlanmış ama Henüz Kullanılmıyor**:
- Sequelize ORM yapılandırılmış
- PostgreSQL bağlantı bilgileri environment variables'da
- Redis cache yapılandırılmış

**Kullanılacak Tablolar** (init.sql'de tanımlı):
- `users` - Kullanıcılar
- `events` - Etkinlikler
- `rewards` - Ödüller

---

## 🗄️ Veritabanı Yapısı

### PostgreSQL Tabloları

#### 1. users Tablosu
```sql
- id (UUID, PRIMARY KEY)
- name (VARCHAR 255)
- email (VARCHAR 255, UNIQUE)
- password (VARCHAR 255)
- phone (VARCHAR 20)
- mahalle (VARCHAR 100)
- golbucks (INTEGER, DEFAULT 0)
- is_active (BOOLEAN, DEFAULT true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Index'ler**:
- `idx_users_email` - Email aramaları için
- `idx_users_phone` - Telefon aramaları için
- `idx_users_active` - Aktif kullanıcılar için

#### 2. events Tablosu
```sql
- id (UUID, PRIMARY KEY)
- title (VARCHAR 255)
- description (TEXT)
- date (DATE)
- time (TIME)
- location (VARCHAR 255)
- latitude (DECIMAL 10,8)
- longitude (DECIMAL 11,8)
- category (VARCHAR 50)
- is_free (BOOLEAN, DEFAULT false)
- price (DECIMAL 10,2)
- capacity (INTEGER)
- registered (INTEGER, DEFAULT 0)
- golbucks_reward (INTEGER, DEFAULT 0)
- is_active (BOOLEAN, DEFAULT true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Index'ler**:
- `idx_events_date` - Tarih sıralaması için
- `idx_events_category` - Kategori filtreleme için
- `idx_events_active` - Aktif etkinlikler için
- `idx_events_location` - Konum aramaları için

#### 3. rewards Tablosu
```sql
- id (UUID, PRIMARY KEY)
- title (VARCHAR 255)
- description (TEXT)
- category (VARCHAR 50)
- points (INTEGER)
- stock (INTEGER)
- validity_days (INTEGER)
- partner_name (VARCHAR 255)
- qr_code (VARCHAR 255)
- reference_code (VARCHAR 255)
- is_active (BOOLEAN, DEFAULT true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Index'ler**:
- `idx_rewards_category` - Kategori filtreleme için
- `idx_rewards_points` - Puan sıralaması için
- `idx_rewards_active` - Aktif ödüller için

### Trigger'lar

**updated_at Auto-Update Trigger**:
- `update_users_updated_at` - Users tablosu için
- `update_events_updated_at` - Events tablosu için
- `update_rewards_updated_at` - Rewards tablosu için

---

## 🐳 Docker Yapılandırması

### Servisler

#### 1. Backend Service
```yaml
Container: sehitkamil_backend
Port: 4000:4000
Image: Build from ./backend/Dockerfile
Environment:
  - NODE_ENV=production
  - PORT=4000
  - DB_HOST=db
  - DB_PORT=5432
  - DB_NAME=superapp
  - DB_USER=admin
  - DB_PASSWORD=secret
  - REDIS_HOST=redis
  - REDIS_PORT=6379
Depends On: db, redis
Health Check: /health endpoint
```

#### 2. PostgreSQL Database
```yaml
Container: sehitkamil_db
Image: postgres:15
Port: 5432:5432
Environment:
  - POSTGRES_DB=superapp
  - POSTGRES_USER=admin
  - POSTGRES_PASSWORD=secret
Volumes:
  - pgdata:/var/lib/postgresql/data
  - ./backend/db/init.sql:/docker-entrypoint-initdb.d/init.sql
Health Check: pg_isready
```

#### 3. Redis Cache
```yaml
Container: sehitkamil_redis
Image: redis:7
Port: 6379:6379
Health Check: redis-cli ping
```

### Network

```
superapp_network (bridge)
├── backend
├── db
└── redis
```

---

## 📦 Bağımlılıklar ve Versiyonlar

### Mobile App Dependencies

#### Core
- `react`: 18.2.0
- `react-native`: 0.74.5
- `expo`: ~51.0.0
- `expo-router`: ~3.5.0

#### UI & Styling
- `nativewind`: ^2.0.11
- `tailwindcss`: ^3.3.0
- `react-native-svg`: 15.2.0

#### Navigation & Gestures
- `react-native-gesture-handler`: ~2.16.1
- `react-native-screens`: ~3.31.1
- `react-native-safe-area-context`: 4.10.5

#### Animations
- `react-native-reanimated`: ~3.10.1

#### Maps & Location
- `react-native-maps`: 1.18.0
- `expo-location`: ~17.0.1

#### Icons
- `lucide-react-native`: ^0.344.0

#### HTTP
- `axios`: ^1.6.2

### Backend Dependencies

#### Core
- `express`: ^4.18.2
- `node`: >=18.0.0

#### Database
- `pg`: ^8.11.3 (PostgreSQL client)
- `sequelize`: ^6.35.2 (ORM)

#### Cache
- `redis`: ^4.6.12

#### Security
- `helmet`: ^7.1.0
- `cors`: ^2.8.5
- `jsonwebtoken`: ^9.0.2
- `bcryptjs`: ^2.4.3

#### Validation
- `express-validator`: ^7.0.1

#### File Upload
- `multer`: ^1.4.5-lts.1

#### Utilities
- `morgan`: ^1.10.0 (HTTP logger)
- `dotenv`: ^16.3.1
- `axios`: ^1.6.2

---

## 🧭 Routing ve Navigasyon

### Expo Router Routing

#### Tab Navigation (Bottom Tabs)
```
/(tabs)/
├── index.tsx        → / (Ana Sayfa)
├── events.tsx       → /events
├── applications.tsx → /applications
├── rewards.tsx      → /rewards
└── menu.tsx         → /menu
```

#### Stack Navigation
```
/city-guide    → Şehir Rehberi
/surveys       → Anketler
/bill-support  → Askıda Fatura
```

### Navigation Kullanımı

**Expo Router Hook**:
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/city-guide');
router.back();
```

**Tab Navigation**:
- Otomatik tab bar gösterilir
- `_layout.tsx` içinde yapılandırılır

---

## 🔄 State Management

### Mevcut Durum

**Local State (useState)**:
- Her component kendi state'ini yönetiyor
- Props drilling kullanılıyor
- Global state yok

**Örnek Kullanım**:
```typescript
const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
const [modalVisible, setModalVisible] = useState(false);
```

### Önerilen İyileştirmeler

1. **Context API** - Basit global state için
2. **Zustand** - Daha kompleks state için
3. **React Query** - Server state için (API cache)

---

## 🌐 API Entegrasyonu

### Mevcut Durum

**Mock Data Kullanılıyor**:
- `src/services/mock*.ts` dosyaları
- Gerçek API entegrasyonu yok
- Axios hazır ama kullanılmıyor

### API Servis Yapısı (Hazırlanmış)

**Backend Endpoints** (Henüz implement edilmemiş):
```
POST /api/auth/login
POST /api/auth/register
GET  /api/events
GET  /api/events/:id
POST /api/events/:id/register
GET  /api/rewards
GET  /api/rewards/:id
POST /api/rewards/:id/buy
GET  /api/surveys
POST /api/surveys/:id/submit
GET  /api/locations
POST /api/applications
GET  /api/bills
POST /api/bills
POST /api/bills/:id/support
```

### Entegrasyon Planı

1. **API Service Layer** oluşturulmalı
2. **Axios instance** yapılandırılmalı
3. **Error handling** eklenmeli
4. **Loading states** yönetilmeli
5. **Cache strategy** belirlenmeli

---

## 🐛 Hata Ayıklama ve Sorun Giderme

### Potansiyel Hata Noktaları

#### 1. Expo Router Hataları

**Hata**: "There was a problem running the requested app"

**Olası Nedenler**:
- Syntax hatası
- Import hatası
- Eksik dependency
- Metro bundler hatası

**Çözüm**:
```bash
# Cache temizle
rm -rf .expo node_modules/.cache .metro

# TypeScript kontrolü
npx tsc --noEmit

# Debug modda başlat
EXPO_DEBUG=true npx expo start --clear
```

#### 2. SafeAreaView Hataları

**Hata**: iOS'ta içerik görünmüyor

**Çözüm**: `react-native-safe-area-context` kullanılmalı
```typescript
import { SafeAreaView } from 'react-native-safe-area-context';
<SafeAreaView edges={['top']}>
```

#### 3. Import Hataları

**Hata**: "Cannot find module"

**Kontrol Edilecekler**:
- Dosya yolu doğru mu?
- Export/import syntax doğru mu?
- TypeScript path mapping doğru mu?

#### 4. Metro Bundler Hataları

**Hata**: Bundle oluşturulamıyor

**Çözüm**:
```bash
# Metro cache temizle
rm -rf .metro node_modules/.cache

# Watchman cache temizle
watchman watch-del-all

# Yeniden başlat
npx expo start --clear
```

#### 5. Port Çakışması

**Hata**: Port 8081 kullanımda

**Çözüm**:
```bash
# Process'leri durdur
pkill -f "expo\|metro"
lsof -ti:8081 | xargs kill -9

# Farklı port kullan
npx expo start --port 8083
```

### Debug Araçları

1. **React Native Debugger**
2. **Expo Dev Tools**
3. **Metro Bundler Logs**
4. **TypeScript Compiler** (`npx tsc --noEmit`)

### Test Komutları

```bash
# Backend test
cd backend && npm test

# Mobile app type check
cd mobile-app && npx tsc --noEmit

# System test
./test-system.sh
```

---

## 📊 Performans Optimizasyonları

### Mevcut Optimizasyonlar

1. **React.memo** - Component memoization (bazı component'lerde)
2. **useMemo** - Expensive calculations için
3. **Lazy Loading** - Expo Router otomatik yapar

### Önerilen İyileştirmeler

1. **Image Optimization** - Expo Image kullanılmalı
2. **Code Splitting** - Route-based splitting
3. **List Virtualization** - FlatList kullanımı
4. **Memoization** - Daha fazla useMemo/useCallback

---

## 🔒 Güvenlik

### Mevcut Güvenlik Önlemleri

**Backend**:
- Helmet.js (security headers)
- CORS yapılandırması
- JWT hazır (henüz kullanılmıyor)

**Mobile**:
- Expo Go güvenlik sınırlamaları
- Development build önerilir

### Önerilen İyileştirmeler

1. **Environment Variables** - Sensitive data için
2. **API Key Management** - Secure storage
3. **Certificate Pinning** - API güvenliği için
4. **Biometric Auth** - Kullanıcı girişi için

---

## 📈 Monitoring ve Logging

### Mevcut Durum

**Backend**:
- Morgan HTTP logger
- Console logging

**Mobile**:
- Console logging
- Expo Dev Tools

### Önerilen İyileştirmeler

1. **Sentry** - Error tracking
2. **Analytics** - Kullanıcı davranışı
3. **Performance Monitoring** - React Native Performance
4. **Crash Reporting** - Firebase Crashlytics

---

## 🚀 Deployment

### Development

```bash
# Mobile
cd mobile-app
npx expo start

# Backend
cd backend
npm run dev
```

### Production

```bash
# Docker Compose
docker-compose up --build -d

# Mobile (EAS Build)
eas build --platform ios
eas build --platform android
```

---

## 📝 Notlar

1. **Screens Klasörü**: Legacy kod, şu an kullanılmıyor (app/ klasörü kullanılıyor)
2. **Mock Data**: Gerçek API entegrasyonu yapılmalı
3. **State Management**: Global state yönetimi eklenmeli
4. **Error Handling**: Daha kapsamlı error handling gerekli
5. **Testing**: Unit test ve integration test eklenmeli

---

## 🔗 İlgili Dosyalar

- `mobile-app/ADIM_ADIM_COZUM.md` - Adım adım sorun giderme
- `mobile-app/SORUN_COZUM.md` - Hata çözümleri
- `mobile-app/IOS_FIX_README.md` - iOS düzeltmeleri
- `backend/README_DOCKER.md` - Backend Docker dokümantasyonu
- `README_DOCKER.md` - Genel Docker dokümantasyonu

---

**Son Güncelleme**: 2024-12-18
**Versiyon**: 1.0.0

