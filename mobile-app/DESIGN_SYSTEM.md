# 🎨 Şehitkamil Belediyesi Süper Uygulama - Tasarım Sistemi

## 📋 İçindekiler

1. [Renk Paleti](#renk-paleti)
2. [Tipografi](#tipografi)
3. [Spacing ve Layout](#spacing-ve-layout)
4. [Border Radius](#border-radius)
5. [Shadow ve Elevation](#shadow-ve-elevation)
6. [Animasyonlar](#animasyonlar)
7. [Icon Sistemi](#icon-sistemi)
8. [Component Stilleri](#component-stilleri)
9. [Tasarım Prensipleri](#tasarım-prensipleri)

---

## 🎨 Renk Paleti

### Ana Renkler (Primary Colors)

#### Yeşil Tema (Belediye Teması)

```typescript
primary: '#2E7D32'        // Ana yeşil (Material Design Green 800)
primaryLight: '#4CAF50'   // Açık yeşil (Material Design Green 500)
primaryDark: '#1B5E20'    // Koyu yeşil (Material Design Green 900)
```

**Kullanım Alanları:**
- Ana butonlar
- Tab bar aktif rengi
- Logo arka planı
- Vurgu elementleri
- Kategori badge'leri
- Link'ler ve aktif durumlar

**Renk Özellikleri:**
- **Primary (#2E7D32)**: 
  - RGB: rgb(46, 125, 50)
  - HSL: hsl(123, 46%, 34%)
  - Güven, doğa, büyüme hissi verir
  - Belediye kimliğini yansıtır

- **Primary Light (#4CAF50)**:
  - RGB: rgb(76, 175, 80)
  - HSL: hsl(122, 39%, 49%)
  - Daha yumuşak, ikincil vurgular için
  - Badge ve kategori göstergeleri

- **Primary Dark (#1B5E20)**:
  - RGB: rgb(27, 94, 32)
  - HSL: hsl(125, 55%, 24%)
  - Derinlik ve kontrast için
  - Hover durumları ve aktif elementler

### Arka Plan Renkleri

```typescript
background: '#F5F5F5'     // Ana arka plan (Material Design Grey 100)
surface: '#FFFFFF'        // Kart ve yüzey rengi (Beyaz)
```

**Kullanım:**
- **Background (#F5F5F5)**: 
  - Tüm ekranların ana arka planı
  - ScrollView arka planları
  - İkincil container'lar
  
- **Surface (#FFFFFF)**:
  - Kartlar (Card)
  - Modal'lar
  - Input alanları
  - TopBar, BottomBar

### Metin Renkleri

```typescript
text: '#212121'           // Ana metin (Material Design Grey 900)
textSecondary: '#757575'  // İkincil metin (Material Design Grey 600)
```

**Kullanım:**
- **Text (#212121)**:
  - Başlıklar
  - Ana içerik metinleri
  - Önemli bilgiler
  - Font weight: 600-700

- **Text Secondary (#757575)**:
  - Açıklamalar
  - Alt bilgiler
  - Tarih/saat bilgileri
  - İkincil içerik
  - Font weight: 400-500

### Border ve Ayırıcılar

```typescript
border: '#E0E0E0'         // Kenarlık rengi (Material Design Grey 300)
```

**Kullanım:**
- Kart kenarlıkları
- Bölüm ayırıcıları
- Input border'ları
- Tab bar üst çizgisi

### Durum Renkleri (Status Colors)

```typescript
error: '#D32F2F'          // Hata (Material Design Red 700)
success: '#388E3C'        // Başarı (Material Design Green 700)
warning: '#F57C00'        // Uyarı (Material Design Orange 700)
info: '#1976D2'           // Bilgi (Material Design Blue 700)
```

**Kullanım Alanları:**

#### Error (#D32F2F)
- Hata mesajları
- Silme butonları
- Kritik uyarılar
- Form validasyon hataları

#### Success (#388E3C)
- Başarı mesajları
- Onay butonları
- "Ücretsiz" badge'leri
- Tamamlanmış durumlar
- Kayıt olundu butonları

#### Warning (#F57C00)
- Uyarı mesajları
- Dikkat gerektiren durumlar
- Başvurular kartı (QuickAccess)

#### Info (#1976D2)
- Bilgilendirme mesajları
- Link'ler
- Askıda Fatura kartı (QuickAccess)
- Aile dostu badge'leri

### Özel Renkler

#### Gölbucks Sistemi
```typescript
// Ödül fiyat badge'leri için
gold: '#FFD700'           // Altın sarısı (Gold)
```

#### Overlay Renkleri
```typescript
backdrop: 'rgba(0, 0, 0, 0.5)'        // Modal backdrop
outOfStock: 'rgba(0, 0, 0, 0.7)'      // Stokta yok overlay
insufficient: 'rgba(211, 47, 47, 0.7)' // Yetersiz puan overlay
```

#### Accent Renkler (QuickAccess Cards)
- **Etkinlikler**: Primary (#2E7D32) - Yeşil
- **Askıda Fatura**: Info (#1976D2) - Mavi
- **Başvurular**: Warning (#F57C00) - Turuncu
- **Gölbucks Market**: Success (#388E3C) - Yeşil

---

## 📝 Tipografi

### Font Aileleri

**Varsayılan**: React Native System Font
- iOS: San Francisco
- Android: Roboto

### Font Boyutları

```typescript
// Başlıklar
h1: 24px      // Ekran başlıkları, modal başlıkları
h2: 18px      // Bölüm başlıkları, kart başlıkları
h3: 16px      // Alt başlıklar

// Metin
body: 15px     // Ana içerik metinleri
bodySmall: 13px // İkincil metinler, açıklamalar
caption: 11px   // Badge'ler, küçük etiketler
```

### Font Ağırlıkları

```typescript
bold: '700'      // Ana başlıklar, önemli vurgular
semiBold: '600'  // Alt başlıklar, buton metinleri
medium: '500'     // Normal metin, etiketler
regular: '400'   // Varsayılan (nadiren kullanılır)
```

### Line Height

```typescript
h1: 32px      // 24px font için
h2: 24px      // 18px font için
body: 22px    // 15px font için
bodySmall: 18px // 13px font için
```

### Kullanım Örnekleri

#### Başlıklar
```typescript
// Ekran Başlıkları
fontSize: 24
fontWeight: '700'
color: Colors.text
lineHeight: 32

// Bölüm Başlıkları
fontSize: 18
fontWeight: '700'
color: Colors.text
marginBottom: 16

// Kart Başlıkları
fontSize: 18
fontWeight: '700'
color: Colors.text
lineHeight: 24
```

#### Metin
```typescript
// Ana Metin
fontSize: 15
fontWeight: '400'
color: Colors.text
lineHeight: 22

// İkincil Metin
fontSize: 13
fontWeight: '500'
color: Colors.textSecondary

// Açıklama Metinleri
fontSize: 15
fontWeight: '400'
color: Colors.textSecondary
lineHeight: 24
```

#### Badge ve Etiketler
```typescript
// Kategori Badge
fontSize: 11
fontWeight: '600'
color: Colors.primaryDark

// Ücretsiz Badge
fontSize: 11
fontWeight: '700'
color: Colors.surface
```

---

## 📐 Spacing ve Layout

### Spacing Sistemi

**8px Grid Sistemi** kullanılıyor (Material Design standardı)

```typescript
// Padding ve Margin Değerleri
xs: 4px      // Çok küçük boşluklar
sm: 8px      // Küçük boşluklar
md: 12px     // Orta boşluklar
lg: 16px     // Büyük boşluklar (en çok kullanılan)
xl: 20px     // Çok büyük boşluklar
xxl: 24px    // Ekstra büyük boşluklar
```

### Kullanım Örnekleri

#### Container Padding
```typescript
// Ekran Container
paddingHorizontal: 20
paddingVertical: 16

// Kart İçi Padding
padding: 16

// Modal İçi Padding
padding: 20
```

#### Component Spacing
```typescript
// Component'ler Arası
marginVertical: 8      // Kartlar arası
marginBottom: 16       // Bölümler arası
gap: 12                // Flexbox gap (icon + text)
gap: 8                 // Badge'ler arası
```

#### Grid Sistemi

**QuickAccess Cards:**
```typescript
CARD_WIDTH = (SCREEN_WIDTH - 60) / 2
// 2 sütun, her biri için 20px margin (sol/sağ)
// Aralarında 12px gap
```

**Event Cards:**
```typescript
CARD_WIDTH = SCREEN_WIDTH - 40
// Tam genişlik, 20px yan margin
marginVertical: 8
```

---

## 🔲 Border Radius

### Radius Değerleri

```typescript
xs: 8px       // Küçük elementler (input'lar)
sm: 12px      // Badge'ler, küçük butonlar
md: 16px      // Kartlar (en çok kullanılan)
lg: 20px      // Büyük butonlar, pill şeklinde elementler
xl: 24px      // Modal'lar (üst köşeler)
full: 50%     // Tam yuvarlak (logo, avatar)
```

### Kullanım Örnekleri

```typescript
// Kartlar
borderRadius: 16

// Butonlar
borderRadius: 20        // Ana butonlar
borderRadius: 12        // Küçük butonlar

// Badge'ler
borderRadius: 12

// Modal'lar
borderTopLeftRadius: 24
borderTopRightRadius: 24

// Logo/Avatar
borderRadius: 20        // 40x40 için
borderRadius: 18        // 36x36 için

// Input'lar
borderRadius: 8
```

---

## 🌑 Shadow ve Elevation

### Shadow Sistemi

**Material Design Elevation** prensiplerine uygun

#### Kart Shadow'ları
```typescript
// Standart Kart
shadowColor: '#000'
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.1
shadowRadius: 8
elevation: 6

// Yüksek Elevation (Modal)
shadowColor: '#000'
shadowOffset: { width: 0, height: -4 }
shadowOpacity: 0.25
shadowRadius: 12
elevation: 16
```

#### QuickAccess Cards
```typescript
shadowColor: '#000'
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.15
shadowRadius: 8
elevation: 6
```

### Elevation Seviyeleri

- **Elevation 2**: Hafif yükseltilmiş (input'lar)
- **Elevation 4**: Orta yükseltilmiş (butonlar)
- **Elevation 6**: Kartlar (en çok kullanılan)
- **Elevation 8**: Floating butonlar
- **Elevation 16**: Modal'lar, dropdown'lar

---

## ✨ Animasyonlar

### React Native Reanimated Kullanımı

#### Spring Animasyonları

```typescript
// Varsayılan Spring
withSpring(value, {
  damping: 15,
  stiffness: 150
})

// Hızlı Spring (Butonlar)
withSpring(value, {
  damping: 10,
  stiffness: 200
})
```

### Animasyon Türleri

#### 1. Press Animasyonları

**Kart Press:**
```typescript
scale: 0.98  // Basıldığında küçülme
damping: 15
stiffness: 150
```

**Buton Press:**
```typescript
scale: 0.95  // Daha belirgin küçülme
damping: 10
stiffness: 200
```

#### 2. Story Carousel Animasyonu

```typescript
// Story Seçimi
scale: 1 → 1.21  // 70px → 85px
interpolate([0, 1], [1, STORY_ACTIVE_SIZE / STORY_SIZE])
```

#### 3. Notice Banner Animasyonu

```typescript
// Kaydırma Animasyonu
Animated.timing(scrollX, {
  toValue: currentIndex,
  duration: 500,
  useNativeDriver: true
})
```

#### 4. Modal Animasyonları

```typescript
// Modal Açılma/Kapanma
slideInUp / slideOutDown
fadeIn / fadeOut
```

### Animasyon Süreleri

```typescript
fast: 100ms      // Buton feedback
normal: 500ms    // Geçişler
slow: 1000ms      // Özel animasyonlar
```

---

## 🎯 Icon Sistemi

### Icon Kütüphanesi

**Lucide React Native** kullanılıyor

### Icon Boyutları

```typescript
xs: 16px    // Küçük icon'lar (info row'larda)
sm: 18px    // Orta icon'lar (TopBar'da)
md: 24px    // Standart icon'lar (Tab bar, menü)
lg: 28px    // Büyük icon'lar (QuickAccess cards)
xl: 32px    // Çok büyük icon'lar (Place detail)
```

### Kullanılan Icon'lar

#### Navigation
- `Home` - Ana sayfa
- `Calendar` - Etkinlikler
- `FileText` - Başvurular
- `Gift` - Ödüller
- `Menu` - Menü

#### Actions
- `MapPin` - Konum
- `Clock` - Zaman
- `Users` - Kapasite
- `Sun` - Hava durumu
- `Droplet` - Nem
- `Wind` - Rüzgar

#### Features
- `Receipt` - Fatura
- `ClipboardList` - Anketler
- `Settings` - Ayarlar
- `HelpCircle` - Yardım
- `Info` - Bilgi

### Icon Renkleri

```typescript
// Aktif Icon
color: Colors.primary

// Pasif Icon
color: Colors.textSecondary

// Surface üzerinde
color: Colors.surface  // Renkli arka planlarda
```

---

## 🧩 Component Stilleri

### Kart Tasarımı (Card Design)

#### Standart Kart
```typescript
backgroundColor: Colors.surface
borderRadius: 16
padding: 16
shadowColor: '#000'
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.1
shadowRadius: 8
elevation: 6
```

#### Event Card Özellikleri
- **Görsel**: 200px yükseklik, cover mode
- **İçerik Padding**: 16px
- **Badge'ler**: Üst kısımda, flexDirection: row
- **Footer**: Border top ile ayrılmış
- **Bottom Bar**: 4px yükseklik, açık yeşil (#A5D6A7)

#### Reward Card Özellikleri
- **Görsel**: 140px yükseklik
- **Overlay**: Stokta yok / yetersiz puan durumları
- **Fiyat Badge**: Altın sarısı (#FFD700)
- **Grid Layout**: 2 sütun

### Buton Tasarımı

#### Primary Button
```typescript
backgroundColor: Colors.primary
paddingHorizontal: 24
paddingVertical: 10
borderRadius: 20
fontSize: 14
fontWeight: '600'
color: Colors.surface
```

#### Disabled Button
```typescript
backgroundColor: Colors.success  // Kayıt olundu durumu
// veya
backgroundColor: Colors.textSecondary  // Genel disabled
```

#### Submit Button
```typescript
backgroundColor: Colors.primary
paddingVertical: 16
borderRadius: 12
fontSize: 16
fontWeight: '700'
```

### Input Tasarımı

```typescript
backgroundColor: Colors.surface
borderWidth: 1
borderColor: Colors.border
borderRadius: 8
paddingHorizontal: 16
paddingVertical: 12
fontSize: 15
color: Colors.text
```

### Badge Tasarımı

#### Kategori Badge
```typescript
backgroundColor: Colors.primaryLight
paddingHorizontal: 10
paddingVertical: 4
borderRadius: 12
fontSize: 11
fontWeight: '600'
color: Colors.primaryDark
```

#### Ücretsiz Badge
```typescript
backgroundColor: Colors.success
paddingHorizontal: 10
paddingVertical: 4
borderRadius: 12
fontSize: 11
fontWeight: '700'
color: Colors.surface
```

### Modal Tasarımı

```typescript
// Backdrop
backgroundColor: 'rgba(0, 0, 0, 0.5)'

// Modal Container
backgroundColor: Colors.surface
borderTopLeftRadius: 24
borderTopRightRadius: 24
height: '80%'  // Ekranın %80'i
shadowOpacity: 0.25
elevation: 16

// Handle (Üst çubuk)
width: 40
height: 4
backgroundColor: Colors.border
borderRadius: 2
```

### Tab Bar Tasarımı

```typescript
backgroundColor: Colors.surface
borderTopWidth: 1
borderTopColor: Colors.border
paddingVertical: 8
height: 70

// Aktif Tab
tabBarActiveTintColor: Colors.primary

// Pasif Tab
tabBarInactiveTintColor: Colors.textSecondary

// Label
fontSize: 11
fontWeight: '500'
marginTop: 4
```

### TopBar Tasarımı

```typescript
backgroundColor: Colors.surface
borderBottomWidth: 1
borderBottomColor: Colors.border
paddingHorizontal: 20
paddingVertical: 16

// Logo
width: 40
height: 40
borderRadius: 20
backgroundColor: Colors.primary

// Location Badge
backgroundColor: Colors.background
borderRadius: 20
paddingHorizontal: 12
paddingVertical: 6
```

---

## 🎭 Tasarım Prensipleri

### 1. Material Design İlkeleri

- **Elevation**: Derinlik hissi için shadow kullanımı
- **Motion**: Anlamlı animasyonlar
- **Color**: Tutarlı renk paleti
- **Typography**: Hiyerarşik tipografi

### 2. Accessibility (Erişilebilirlik)

- **Kontrast Oranları**:
  - Metin/Arka plan: 4.5:1 minimum
  - Büyük metin: 3:1 minimum
  
- **Touch Target**: Minimum 44x44px
- **Font Size**: Minimum 11px (badge'ler için)

### 3. Responsive Design

- **Screen Width**: `Dimensions.get('window').width` kullanımı
- **Flexible Layout**: Flexbox ile responsive grid
- **Safe Area**: iOS notch ve status bar için

### 4. Visual Hierarchy

- **Önem Sırası**:
  1. Primary actions (yeşil butonlar)
  2. Başlıklar (bold, büyük font)
  3. İçerik (normal font)
  4. İkincil bilgiler (küçük, gri font)

### 5. Consistency (Tutarlılık)

- **Spacing**: 8px grid sistemi
- **Colors**: Merkezi renk tanımları
- **Components**: Reusable component'ler
- **Animations**: Standart spring değerleri

### 6. User Experience

- **Feedback**: Tüm etkileşimlerde görsel feedback
- **Loading States**: Yükleme durumları
- **Error States**: Hata mesajları ve durumları
- **Empty States**: Boş durum tasarımları

---

## 📊 Renk Kullanım Matrisi

| Element | Primary | Success | Warning | Info | Error |
|---------|---------|---------|---------|------|-------|
| Butonlar | ✅ | ✅ | ❌ | ❌ | ❌ |
| Badge'ler | ✅ | ✅ | ❌ | ✅ | ❌ |
| QuickAccess | ✅ | ✅ | ✅ | ✅ | ❌ |
| Durumlar | ❌ | ✅ | ✅ | ✅ | ✅ |
| Link'ler | ✅ | ❌ | ❌ | ✅ | ❌ |

---

## 🎨 Tema Özeti

### Ana Tema: Yeşil (Belediye Teması)

**Neden Yeşil?**
- Doğa ve çevre vurgusu
- Güven ve istikrar hissi
- Belediye kimliği ile uyum
- Modern ve profesyonel görünüm

### Renk Psikolojisi

- **Yeşil (#2E7D32)**: Güven, büyüme, doğa, huzur
- **Beyaz (#FFFFFF)**: Temizlik, sadelik, modernlik
- **Gri (#F5F5F5)**: Nötr, profesyonel, minimal
- **Mavi (#1976D2)**: Güvenilirlik, bilgi, teknoloji
- **Turuncu (#F57C00)**: Enerji, dikkat, aktivite

---

## 📱 Platform Özel Stiller

### iOS

- **Safe Area**: Üst ve alt boşluklar
- **Status Bar**: Dark content
- **Tab Bar**: 70px yükseklik
- **Modal**: Bottom sheet stili

### Android

- **Status Bar**: Dark content
- **Elevation**: Shadow yerine elevation
- **Ripple Effect**: Buton press'lerde
- **Back Button**: Sistem geri butonu

---

## 🔄 Dark Mode (Gelecek)

Şu an sadece **Light Mode** aktif. Dark mode için:

```typescript
// Gelecek için hazırlanacak
dark: {
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  // ...
}
```

---

## 📐 Responsive Breakpoints

```typescript
// Ekran Genişlikleri
small: < 375px    // iPhone SE
medium: 375-414px // iPhone standart
large: > 414px    // iPhone Plus, tablet
```

### Adaptif Tasarım

- **Kart Genişlikleri**: Ekran genişliğine göre
- **Grid**: 2 sütun (küçük ekranlar), 3 sütun (tablet)
- **Font Size**: Ekran boyutuna göre ölçeklenebilir

---

## 🎯 Best Practices

### 1. Renk Kullanımı
- ✅ Primary renkleri tutarlı kullan
- ✅ Durum renklerini doğru yerlerde kullan
- ❌ Rastgele renk kombinasyonları yapma

### 2. Typography
- ✅ Hiyerarşiyi koru (h1 > h2 > body)
- ✅ Font weight'leri doğru kullan
- ❌ Çok fazla farklı font size kullanma

### 3. Spacing
- ✅ 8px grid sistemine uy
- ✅ Tutarlı padding/margin değerleri
- ❌ Rastgele spacing değerleri

### 4. Animasyonlar
- ✅ Anlamlı animasyonlar kullan
- ✅ Performansı göz önünde bulundur
- ❌ Aşırı animasyon kullanma

---

**Son Güncelleme**: 2024-12-18  
**Tasarım Sistemi Versiyonu**: 1.0.0

