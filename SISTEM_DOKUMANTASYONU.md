# 📱 Şehitkamil Belediyesi Mobil Uygulama - Detaylı Sistem Dokümantasyonu

## 📋 İçindekiler

1. [Teknoloji Stack](#teknoloji-stack)
2. [Mimari Yapı](#mimari-yapı)
3. [Tasarım Sistemi](#tasarım-sistemi)
4. [Component Yapısı](#component-yapısı)
5. [Stil Sistemi](#stil-sistemi)
6. [Animasyon Sistemi](#animasyon-sistemi)
7. [Navigasyon Yapısı](#navigasyon-yapısı)
8. [State Management](#state-management)
9. [Veri Yönetimi](#veri-yönetimi)
10. [Platform Özellikleri](#platform-özellikleri)

---

## 🛠 Teknoloji Stack

### Core Framework
- **React Native**: Cross-platform mobil uygulama geliştirme framework'ü
- **Expo**: React Native geliştirme platformu ve toolchain
- **TypeScript**: Tip güvenliği için JavaScript superset

### UI & Styling
- **React Native StyleSheet API**: Native stil yönetimi
- **Expo Linear Gradient**: Gradient arka planlar için
- **Lucide React Native**: Modern icon kütüphanesi
- **React Native Safe Area Context**: iOS notch ve Android navigation bar desteği

### Animasyon & Gesture
- **React Native Reanimated**: Yüksek performanslı animasyon kütüphanesi
- **React Native Gesture Handler**: Gelişmiş gesture yönetimi
- **React Native Worklets**: Animasyon performans optimizasyonu

### Navigation
- **Expo Router**: File-based routing sistemi
- **React Navigation**: Tab ve stack navigasyon desteği

### Maps & Location
- **React Native Maps**: Harita görüntüleme (Development Build gerekli)
- **Expo Location**: Konum servisleri

### Development Tools
- **Babel**: JavaScript transpiler
- **Metro Bundler**: React Native bundler
- **TypeScript Compiler**: Tip kontrolü

### Build & Deploy
- **Expo CLI**: Development ve build araçları
- **EAS Build**: Cloud build servisi (opsiyonel)

---

## 🏗 Mimari Yapı

### Proje Klasör Yapısı

```
mobile-app/
├── app/                    # Expo Router dosya tabanlı routing
│   ├── _layout.tsx        # Root layout (GestureHandler, SafeAreaProvider)
│   └── (tabs)/            # Tab navigation grubu
│       ├── _layout.tsx    # Tab bar yapılandırması
│       ├── index.tsx      # Ana sayfa (HomeScreen)
│       ├── events.tsx     # Etkinlikler ekranı
│       ├── applications.tsx # Başvurular ekranı
│       ├── rewards.tsx    # Ödüller ekranı
│       └── menu.tsx       # Menü ekranı
│   ├── city-guide.tsx     # Şehir rehberi ekranı
│   ├── surveys.tsx        # Anketler ekranı
│   └── bill-support.tsx   # Askıda fatura ekranı
│
├── src/
│   ├── components/        # Reusable UI component'leri
│   │   ├── Header.tsx
│   │   ├── AutoPlayCarousel.tsx
│   │   ├── QuickAccessCards.tsx
│   │   ├── NewsSection.tsx
│   │   └── ... (40+ component)
│   │
│   ├── constants/         # Sabit değerler
│   │   └── colors.ts      # Renk paleti
│   │
│   ├── services/          # Mock data ve API servisleri
│   │   ├── mockData.ts
│   │   ├── mockEventsData.ts
│   │   ├── mockRewardsData.ts
│   │   └── ...
│   │
│   └── screens/           # Ekran component'leri (legacy)
│
├── assets/                # Görseller, fontlar
├── babel.config.js        # Babel yapılandırması
├── metro.config.js        # Metro bundler yapılandırması
├── tsconfig.json          # TypeScript yapılandırması
├── app.json               # Expo uygulama yapılandırması
└── package.json           # Bağımlılıklar
```

### Mimari Prensipler

1. **Component-Based Architecture**: Her UI elementi ayrı, yeniden kullanılabilir component
2. **File-Based Routing**: Expo Router ile dosya sistemi tabanlı routing
3. **Separation of Concerns**: Component, service, constant ayrımı
4. **Type Safety**: TypeScript ile tip güvenliği
5. **Platform Agnostic**: iOS ve Android için tek kod tabanı

---

## 🎨 Tasarım Sistemi

### Renk Paleti

#### Primary Colors (Ana Renkler)
```typescript
primary: '#2E7D32'        // Ana yeşil - Belediye teması
primaryLight: '#4CAF50'   // Açık yeşil - Vurgu elementleri
primaryDark: '#1B5E20'    // Koyu yeşil - Derinlik ve kontrast
```

**Kullanım Alanları:**
- Ana butonlar ve CTA'lar
- Tab bar aktif rengi
- Logo ve marka elementleri
- Kategori badge'leri
- Link'ler ve aktif durumlar
- Vurgu elementleri

#### Secondary Colors (İkincil Renkler)
```typescript
secondary: '#F57C00'       // Turuncu - Ödül ve puan sistemi
secondaryLight: '#FF9800' // Açık turuncu
```

**Kullanım Alanları:**
- Gölbucks (puan) gösterimi
- Ödül sistemi vurguları
- Dikkat çekici elementler

#### Quick Access Card Colors (Hızlı Erişim Kart Renkleri)
```typescript
purple: '#8B5CF6'         // Mor - Anketler kartı
purpleDark: '#7C3AED'     // Koyu mor

orange: '#F59E0B'         // Turuncu - Oyna Kazan kartı
orangeDark: '#D97706'     // Koyu turuncu

blue: '#3B82F6'           // Mavi - Başvur kartı
blueDark: '#2563EB'       // Koyu mavi

green: '#10B981'          // Yeşil - Gölmarket kartı
greenDark: '#059669'      // Koyu yeşil
```

**Kullanım:**
- Hızlı erişim kartlarında gradient arka planlar
- Her kart için benzersiz renk kimliği

#### Neutral Colors (Nötr Renkler)
```typescript
background: '#F8F9FA'     // Ana arka plan - Açık gri
cardBg: '#FFFFFF'         // Kart arka planı - Beyaz
surface: '#FFFFFF'        // Yüzey rengi - Beyaz
text: '#1F2937'           // Ana metin - Koyu gri
textPrimary: '#1F2937'    // Birincil metin
textSecondary: '#6B7280'  // İkincil metin - Orta gri
border: '#E5E7EB'         // Kenarlık rengi - Açık gri
```

**Kullanım:**
- Arka planlar: `background` tüm ekranlar için
- Kartlar: `surface` veya `cardBg` kart ve modal'lar için
- Metin: `textPrimary` başlıklar, `textSecondary` açıklamalar
- Kenarlıklar: `border` ayırıcı çizgiler

#### Status Colors (Durum Renkleri)
```typescript
error: '#D32F2F'          // Kırmızı - Hata durumları
success: '#388E3C'        // Yeşil - Başarı durumları
warning: '#F57C00'        // Turuncu - Uyarı durumları
info: '#1976D2'           // Mavi - Bilgi durumları
```

**Kullanım:**
- Hata mesajları ve uyarılar
- Başarı bildirimleri
- Bilgilendirme badge'leri
- Form validasyon durumları

### Tipografi (Typography)

#### Font Aileleri
- **iOS**: San Francisco (System Font)
- **Android**: Roboto (System Font)
- React Native varsayılan sistem fontları kullanılır

#### Font Boyutları

**Başlıklar:**
```typescript
h1: 24px      // Ekran başlıkları, modal başlıkları
h2: 18px      // Bölüm başlıkları, kart başlıkları
h3: 16px      // Alt başlıklar
```

**Metin:**
```typescript
body: 15px     // Ana içerik metinleri
bodySmall: 13px // İkincil metinler, açıklamalar
caption: 11px   // Badge'ler, küçük etiketler
```

#### Font Ağırlıkları
```typescript
bold: '700'      // Ana başlıklar, önemli vurgular
semiBold: '600'  // Alt başlıklar, buton metinleri
medium: '500'    // Normal metin, etiketler
regular: '400'  // Varsayılan (nadiren kullanılır)
```

#### Line Height (Satır Yüksekliği)
```typescript
h1: 32px      // 24px font için (1.33x)
h2: 24px      // 18px font için (1.33x)
body: 22px    // 15px font için (1.47x)
bodySmall: 18px // 13px font için (1.38x)
```

#### Letter Spacing (Harf Aralığı)
```typescript
tight: -0.5px   // Başlıklar için (örn: "Şehitkamil")
normal: 0px     // Varsayılan
wide: 0.5px     // Büyük başlıklar için
```

### Spacing Sistemi

**8px Grid Sistemi** kullanılıyor (Material Design standardı)

```typescript
xs: 4px      // Çok küçük boşluklar (icon padding)
sm: 8px      // Küçük boşluklar (compact spacing)
md: 12px     // Orta boşluklar (card içi spacing)
lg: 16px     // Büyük boşluklar (en çok kullanılan)
xl: 20px     // Çok büyük boşluklar (section spacing)
xxl: 24px    // Ekstra büyük boşluklar (page padding)
```

**Kullanım Örnekleri:**
- Container padding: `16px` (lg)
- Card padding: `20px` (xl)
- Section margin: `24px` (xxl)
- Element gap: `12px` (md)
- Icon padding: `4px` (xs)

### Border Radius

```typescript
small: 8px      // Küçük elementler (badge, chip)
medium: 12px   // Orta elementler (button, input)
large: 16px     // Büyük elementler (card)
xlarge: 20px    // Çok büyük elementler (modal)
round: 24px     // Yuvarlak elementler (quick access cards)
circle: 50%     // Tam yuvarlak (avatar, icon container)
```

**Kullanım:**
- Badge'ler: `12px`
- Butonlar: `12px` veya `20px`
- Kartlar: `16px` veya `24px`
- Quick Access Cards: `24px`
- Avatar'lar: `50%` (circle)

### Shadow & Elevation

#### iOS Shadow
```typescript
shadowColor: '#000'
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.05-0.3 (element önemine göre)
shadowRadius: 4-12 (derinlik hissine göre)
```

#### Android Elevation
```typescript
elevation: 2-10 (iOS shadowOpacity'a göre)
```

**Kullanım Seviyeleri:**
- **Seviye 1** (Hafif): `shadowOpacity: 0.05, elevation: 2` - Header, border
- **Seviye 2** (Orta): `shadowOpacity: 0.1, elevation: 3` - Kartlar
- **Seviye 3** (Yüksek): `shadowOpacity: 0.15, elevation: 6` - Search bar, floating button
- **Seviye 4** (Çok Yüksek): `shadowOpacity: 0.3, elevation: 10` - Modal, dropdown

---

## 🧩 Component Yapısı

### Ana Sayfa Component'leri

#### 1. Header Component
**Dosya:** `src/components/Header.tsx`

**Yapı:**
- Sol: Profil ikonu (40x40px, yuvarlak, yeşil border) + Ayarlar ikonu
- Orta: Logo (32x32px, yeşil arka plan, "Ş" harfi) + "Şehitkamil" yazısı
- Sağ: Gölbucks ikonu + puan sayısı

**Stil Özellikleri:**
- Yükseklik: `60px`
- Arka plan: `white`
- Alt border: `1px solid #E5E7EB`
- Shadow: iOS `0.05 opacity`, Android `elevation: 2`
- Padding: `16px` horizontal

**Props:**
```typescript
interface HeaderProps {
  points: number;              // Kullanıcı puanı
  onProfilePress?: () => void; // Profil butonu handler
  onSettingsPress?: () => void; // Ayarlar butonu handler
}
```

#### 2. AutoPlayCarousel Component
**Dosya:** `src/components/AutoPlayCarousel.tsx`

**Yapı:**
- Horizontal ScrollView ile otomatik kaydırma
- Her slide: ImageBackground + dark overlay (30% opacity)
- Üstte: Search bar overlay (beyaz, yarı saydam, yuvarlak)
- Altta: Pagination dots (aktif: 8x8px, pasif: 6x6px)

**Stil Özellikleri:**
- Yükseklik: `200px`
- Slide genişliği: Ekran genişliği (`SCREEN_WIDTH`)
- Overlay: `rgba(0, 0, 0, 0.3)`
- Search bar: `48px` yükseklik, `24px` border radius, `rgba(255, 255, 255, 0.95)` arka plan
- Shadow: iOS `0.15 opacity, 12px radius`, Android `elevation: 6`

**Props:**
```typescript
interface AutoPlayCarouselProps {
  items: CarouselItem[];        // Carousel item'ları
  autoPlayInterval?: number;    // Otomatik geçiş süresi (ms) - default: 3000
  onSearchPress?: () => void;   // Search bar tıklama handler
}
```

**Animasyon:**
- Otomatik geçiş: `setInterval` ile 3 saniyede bir
- Scroll animasyonu: Native `animated: true`
- Pagination: Aktif dot büyüme animasyonu

#### 3. QuickAccessCards Component
**Dosya:** `src/components/QuickAccessCards.tsx`

**Yapı:**
- 2x2 grid layout (flexWrap ile responsive)
- Her kart: LinearGradient arka plan + Icon container + Başlık
- Icon container: Yarı saydam beyaz arka plan (`rgba(255, 255, 255, 0.2)`)

**Kartlar:**
1. **Anketler**: Mor gradient (`#8B5CF6` → `#7C3AED`)
2. **Oyna Kazan**: Turuncu gradient (`#F59E0B` → `#D97706`)
3. **Başvur**: Mavi gradient (`#3B82F6` → `#2563EB`)
4. **Gölmarket**: Yeşil gradient (`#10B981` → `#059669`)

**Stil Özellikleri:**
- Kart boyutu: `47%` genişlik, `1:1` aspect ratio
- Border radius: `24px`
- Padding: `20px`
- Icon container: `18px` padding, `20px` border radius
- Shadow: iOS `0.3 opacity, 12px radius`, Android `elevation: 6`
- Press animasyonu: `scale: 0.95`

**Gradient Yönü:**
- `start: { x: 0, y: 0 }` (üst sol)
- `end: { x: 0, y: 1 }` (alt sol) - Dikey gradient

#### 4. NewsSection Component
**Dosya:** `src/components/NewsSection.tsx`

**Yapı:**
- Header: "Haberler" başlığı + "Tümünü Gör →" linki
- Horizontal ScrollView ile yatay kaydırma
- Her kart: Image (140px yükseklik) + Content (başlık + tarih)

**Stil Özellikleri:**
- Kart genişliği: `280px`
- Kart yüksekliği: `200px`
- Border radius: `16px`
- Image yüksekliği: `140px`
- Content padding: `12px`
- Content yüksekliği: `60px`
- Shadow: iOS `0.1 opacity, 8px radius`, Android `elevation: 3`
- Snap interval: `292px` (280px card + 12px gap)

**Props:**
```typescript
interface NewsSectionProps {
  items: NewsItem[];            // Haber listesi
  onViewAll?: () => void;       // "Tümünü Gör" handler
  onNewsPress?: (id: string) => void; // Haber kartı tıklama handler
}
```

### Tab Navigation

**Dosya:** `app/(tabs)/_layout.tsx`

**Tab'lar:**
1. **Ana Sayfa** - Home icon
2. **Etkinlikler** - Calendar icon
3. **Başvur** - FileText icon
4. **Ödüller** - Gift icon
5. **Menü** - Menu icon

**Stil Özellikleri:**
- Yükseklik: `64px`
- Arka plan: `white`
- Üst border: `1px solid #E5E7EB`
- Padding: `8px` vertical
- Aktif renk: `#2E7D32` (primary)
- Pasif renk: `#6B7280` (textSecondary)
- Label font: `11px`, `500` weight
- Icon size: `24px`

---

## 🎭 Animasyon Sistemi

### React Native Reanimated Kullanımı

**Temel Hook'lar:**
- `useSharedValue`: Animasyon değerleri için shared value
- `useAnimatedStyle`: Animated style oluşturma
- `withSpring`: Spring animasyonu
- `withTiming`: Timing animasyonu
- `withSequence`: Sıralı animasyonlar

### Animasyon Parametreleri

#### Spring Animasyonu
```typescript
withSpring(value, {
  damping: 18,      // Sönümleme (daha yüksek = daha az sallanma)
  stiffness: 180,   // Sertlik (daha yüksek = daha hızlı)
  mass: 0.8,        // Kütle (daha düşük = daha hafif his)
})
```

**Kullanım Alanları:**
- Buton press animasyonları
- Chip/tab seçim animasyonları
- Scale transform'ları

#### Timing Animasyonu
```typescript
withTiming(value, {
  duration: 300,    // Süre (ms)
  easing: Easing.inOut(Easing.ease), // Easing fonksiyonu
})
```

**Kullanım Alanları:**
- Opacity geçişleri
- Fade in/out animasyonları
- Modal açılma/kapanma

### Animasyon Örnekleri

#### 1. Scale Animasyonu (Chip/Tab Seçimi)
```typescript
const scale = useSharedValue(isSelected ? 1 : 0.95);

useEffect(() => {
  scale.value = withSpring(isSelected ? 1 : 0.95, {
    damping: 18,
    stiffness: 180,
    mass: 0.8,
  });
}, [isSelected]);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));
```

#### 2. Modal Animasyonu
```typescript
const translateY = useSharedValue(MODAL_HEIGHT);
const opacity = useSharedValue(0);

useEffect(() => {
  if (visible) {
    translateY.value = withSpring(0, { damping: 20, stiffness: 100 });
    opacity.value = withTiming(1, { duration: 300 });
  } else {
    translateY.value = withSpring(MODAL_HEIGHT, { damping: 20, stiffness: 100 });
    opacity.value = withTiming(0, { duration: 300 });
  }
}, [visible]);
```

#### 3. Reward Animation
```typescript
const scale = useSharedValue(0);
const opacity = useSharedValue(0);
const translateY = useSharedValue(0);

useEffect(() => {
  if (visible) {
    scale.value = withSequence(
      withSpring(1.2, { damping: 10, stiffness: 200 }),
      withSpring(1, { damping: 15, stiffness: 150 })
    );
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withSequence(
      withTiming(-50, { duration: 500 }),
      withTiming(-100, { duration: 500 })
    );
  }
}, [visible]);
```

### Animasyon Best Practices

1. **Performance**: Worklet'ler UI thread'de çalışır, 60fps garantisi
2. **Cleanup**: `useEffect` cleanup'larında animasyon değerlerini sıfırla
3. **Hook Rules**: Hook'ları `map()` içinde kullanma, ayrı component oluştur
4. **Easing**: Doğal his için spring animasyonları tercih et
5. **Duration**: Kısa animasyonlar (200-400ms) daha responsive hissettirir

---

## 🧭 Navigasyon Yapısı

### Expo Router File-Based Routing

**Routing Yapısı:**
```
app/
├── _layout.tsx           # Root layout
├── (tabs)/               # Tab navigation group
│   ├── _layout.tsx       # Tab bar config
│   ├── index.tsx         # / (Ana sayfa)
│   ├── events.tsx        # /events
│   ├── applications.tsx  # /applications
│   ├── rewards.tsx       # /rewards
│   └── menu.tsx          # /menu
├── city-guide.tsx        # /city-guide
├── surveys.tsx           # /surveys
└── bill-support.tsx      # /bill-support
```

### Navigation Hook'ları

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate
router.push('/city-guide');
router.replace('/surveys');
router.back();
```

### Tab Navigation

**Yapılandırma:**
- 5 tab: Ana Sayfa, Etkinlikler, Başvur, Ödüller, Menü
- Her tab: Icon + Label
- Aktif tab: Primary renk
- Pasif tab: TextSecondary renk

---

## 📊 State Management

### Mevcut Durum

**Local State (useState):**
- Her component kendi state'ini yönetiyor
- Props drilling ile state paylaşımı
- Global state yok

**Örnek Kullanım:**
```typescript
const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
const [modalVisible, setModalVisible] = useState(false);
const [userPoints, setUserPoints] = useState(320);
```

### Önerilen İyileştirmeler

1. **Context API**: Basit global state için (user, theme)
2. **Zustand**: Daha kompleks state için (events, rewards)
3. **React Query**: Server state için (API cache, sync)

---

## 💾 Veri Yönetimi

### Mock Data Yapısı

**Dosyalar:**
- `src/services/mockData.ts` - Genel mock data
- `src/services/mockEventsData.ts` - Etkinlik verileri
- `src/services/mockRewardsData.ts` - Ödül verileri
- `src/services/mockSurveysData.ts` - Anket verileri
- `src/services/mockLocationsData.ts` - Konum verileri
- `src/services/mockApplicationsData.ts` - Başvuru verileri
- `src/services/mockBillsData.ts` - Fatura verileri

### Veri Yapıları

**Event (Etkinlik):**
```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  image: string;
  isFree: boolean;
  isFamilyFriendly: boolean;
  registeredCount: number;
}
```

**Reward (Ödül):**
```typescript
interface Reward {
  id: string;
  title: string;
  description: string;
  price: number; // Gölbucks cinsinden
  category: 'physical' | 'digital' | 'partner';
  image: string;
  stock?: number;
}
```

**News (Haber):**
```typescript
interface NewsItem {
  id: string;
  image: string;
  title: string;
  date: string;
}
```

---

## 📱 Platform Özellikleri

### iOS Özellikleri

- **Safe Area**: Notch ve home indicator için
- **Status Bar**: Dark content
- **Tab Bar**: 64px yükseklik
- **Modal**: Bottom sheet stili
- **Shadow**: Native shadow API

### Android Özellikleri

- **Status Bar**: Dark content
- **Elevation**: Shadow yerine elevation
- **Ripple Effect**: Buton press'lerde
- **Back Button**: Sistem geri butonu

### Platform-Specific Styling

```typescript
...Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  android: {
    elevation: 3,
  },
})
```

---

## 🎯 Tasarım Prensipleri

### 1. Material Design İlkeleri

- **Elevation**: Derinlik hissi için shadow kullanımı
- **Motion**: Anlamlı animasyonlar
- **Color**: Tutarlı renk paleti
- **Typography**: Hiyerarşik tipografi

### 2. Accessibility (Erişilebilirlik)

- **Kontrast Oranları**: Metin/Arka plan 4.5:1 minimum
- **Touch Target**: Minimum 44x44px
- **Font Size**: Minimum 11px

### 3. Responsive Design

- **Screen Width**: `Dimensions.get('window').width` kullanımı
- **Flexible Layout**: Flexbox ile responsive grid
- **Safe Area**: iOS notch ve status bar için

### 4. Visual Hierarchy

1. Primary actions (yeşil butonlar)
2. Başlıklar (bold, büyük font)
3. İçerik (normal font)
4. İkincil bilgiler (küçük, gri font)

### 5. Consistency (Tutarlılık)

- **Spacing**: 8px grid sistemi
- **Colors**: Merkezi renk tanımları
- **Components**: Reusable component'ler
- **Animations**: Standart spring değerleri

---

## 🔧 Build & Development

### Development Commands

```bash
# Expo development server başlat
npm start
# veya
npx expo start

# iOS simulator'da çalıştır
npm run ios

# Android emulator'da çalıştır
npm run android

# Web'de çalıştır
npm run web
```

### Build Configuration

**Babel Config:**
- `babel-preset-expo`: Expo preset
- `react-native-reanimated/plugin`: Reanimated plugin (en sonda olmalı)

**Metro Config:**
- Default Expo Metro config
- Module resolution için özel ayar yok

**TypeScript Config:**
- `expo/tsconfig.base` extend ediliyor
- `moduleResolution: "bundler"`
- `jsx: "react-native"`

---

## 📝 Notlar

### Sürüm Bilgisi

Bu dokümantasyon **sürüm numaraları içermez** çünkü:
- Sürümler zamanla değişir
- Teknoloji stack'i anlamak için sürüm gerekmez
- Tasarım sistemi sürümden bağımsızdır

### Güncelleme Tarihi

**Son Güncelleme**: 2024-12-18  
**Dokümantasyon Versiyonu**: 1.0.0

---

## 🎨 Tasarım Özeti

### Ana Tema: Yeşil (Belediye Teması)

**Renk Psikolojisi:**
- **Yeşil**: Güven, büyüme, doğa, huzur
- **Beyaz**: Temizlik, sadelik, modernlik
- **Gri**: Nötr, profesyonel, minimal
- **Mavi**: Güvenilirlik, bilgi, teknoloji
- **Turuncu**: Enerji, dikkat, aktivite

### Tasarım Felsefesi

1. **Minimal**: Gereksiz elementler yok
2. **Modern**: Güncel tasarım trendleri
3. **Kullanıcı Dostu**: Sezgisel navigasyon
4. **Performanslı**: Optimize edilmiş animasyonlar
5. **Tutarlı**: Tüm ekranlarda aynı tasarım dili

---

**Bu dokümantasyon, Şehitkamil Belediyesi mobil uygulamasının teknik ve tasarım detaylarını içerir. Sürüm numaraları olmadan teknoloji stack'i ve tasarım sistemini açıklar.**

