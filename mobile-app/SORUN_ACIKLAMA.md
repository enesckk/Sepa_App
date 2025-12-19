# 🚨 Expo Go Neden Çalışmıyor - Detaylı Açıklama

## ❌ Ana Sorunlar

### 1. ⚠️ **react-native-maps Expo Go'da ÇALIŞMAZ!** (EN BÜYÜK SORUN)

**Durum:**
- Projenizde `react-native-maps` kullanılıyor
- Bu paket **native modül** gerektirir
- Expo Go **sadece Expo SDK paketlerini** destekler
- `react-native-maps` Expo SDK paketi değil, native modül

**Nerede Kullanılıyor:**
- `app/city-guide.tsx` → Şehir Rehberi ekranı
- `src/components/GuideMap.tsx` → Harita component'i

**Ne Oluyor:**
1. Expo Go uygulaması açılmaya çalışıyor
2. Metro bundler kodu yüklüyor
3. `react-native-maps` import ediliyor
4. Expo Go bu native modülü bulamıyor
5. Uygulama **crash** oluyor veya **beyaz ekran** gösteriyor

**Hata Mesajı (Muhtemelen):**
```
Error: requireNativeComponent: "AIRMap" was not found in the UIManager
```
veya
```
Unable to resolve module react-native-maps
```

---

### 2. ⚠️ **Expo SDK 51 Çok Yeni Olabilir**

**Durum:**
- Projeniz Expo SDK 51 kullanıyor
- Expo Go uygulaması henüz SDK 51'i desteklemeyebilir
- Expo Go genellikle en son 2-3 SDK versiyonunu destekler

**Kontrol:**
- Expo Go uygulamanızı açın
- Ayarlar → SDK Versiyonu kontrol edin
- SDK 51 listede yoksa, Expo Go güncel değil demektir

**Çözüm:**
- Expo Go'yu App Store/Play Store'dan güncelleyin
- Veya SDK versiyonunu düşürün (SDK 50 veya 49)

---

### 3. ⚠️ **react-native-reanimated Versiyon Sorunu**

**Durum:**
- `react-native-reanimated@~3.10.1` kullanılıyor
- Bazı Expo Go versiyonlarında sorun çıkarabilir
- Babel plugin doğru yapılandırılmış ama yine de sorun olabilir

**Ne Oluyor:**
- Animasyonlar çalışmayabilir
- Uygulama crash olabilir

---

### 4. ⚠️ **Expo Router 3.5.0 Uyumsuzluğu**

**Durum:**
- Expo Router 3.5.0 kullanılıyor
- Bazı Expo Go versiyonlarında routing sorunları olabilir

**Ne Oluyor:**
- Navigasyon çalışmayabilir
- Ekranlar yüklenmeyebilir

---

## 🔍 Hangi Hata Mesajını Alıyorsunuz?

### Senaryo 1: "There was a problem running the requested app"
**Neden:**
- Metro bundler'a bağlanamıyor
- Ağ sorunu
- Port çakışması

**Çözüm:**
```bash
npx expo start --tunnel --clear
```

---

### Senaryo 2: "Incompatible SDK version"
**Neden:**
- Expo Go SDK 51'i desteklemiyor
- Expo Go güncel değil

**Çözüm:**
- Expo Go'yu güncelleyin
- Veya SDK versiyonunu düşürün

---

### Senaryo 3: Beyaz Ekran / Crash
**Neden:**
- `react-native-maps` native modülü bulunamıyor
- Expo Go bu modülü desteklemiyor

**Çözüm:**
- Development Build kullanın
- Veya Maps component'ini kaldırın/alternatif kullanın

---

### Senaryo 4: "Unable to resolve module react-native-maps"
**Neden:**
- `react-native-maps` Expo Go'da çalışmaz
- Native modül gerektirir

**Çözüm:**
- Development Build kullanın
- Veya Maps'i kaldırın

---

## ✅ Çözümler (Öncelik Sırasına Göre)

### Çözüm 1: Development Build Kullanın (ÖNERİLEN)

**Neden:**
- Tüm native modüller çalışır
- `react-native-maps` çalışır
- `react-native-reanimated` çalışır
- Expo Go sınırlamaları yok

**Adımlar:**
```bash
cd /Users/enescikcik/Desktop/APP/mobile-app

# Prebuild (native kodları oluştur)
npx expo prebuild

# iOS için
npx expo run:ios

# Android için
npx expo run:android
```

**Not:** Xcode ve Android Studio gerekli

---

### Çözüm 2: Maps Component'ini Kaldırın/Alternatif Kullanın

**Adımlar:**
1. `city-guide.tsx`'de Maps kullanımını kaldırın
2. Web için alternatif harita kullanın
3. Expo Go'da çalışır

**Kod Değişikliği:**
```typescript
// city-guide.tsx içinde
import { Platform } from 'react-native';

// Maps sadece Development Build'de çalışsın
{Platform.OS !== 'web' && Platform.OS !== 'expo' ? (
  <MapView ... />
) : (
  <Text>Harita Expo Go'da desteklenmiyor</Text>
)}
```

---

### Çözüm 3: SDK Versiyonunu Düşürün

**Adımlar:**
```bash
cd /Users/enescikcik/Desktop/APP/mobile-app

# SDK 50'ye düşür
npx expo install expo@~50.0.0

# Tüm paketleri güncelle
npx expo install --fix

# app.json'da sdkVersion'ı güncelle
# "sdkVersion": "50.0.0"
```

---

### Çözüm 4: Expo Go'yu Güncelleyin

**iOS:**
- App Store → Expo Go → Güncelle

**Android:**
- Play Store → Expo Go → Güncelle

---

## 🎯 Hızlı Test

Hangi hatayı aldığınızı öğrenmek için:

```bash
cd /Users/enescikcik/Desktop/APP/mobile-app

# Terminal'de çalıştırın
npx expo start --clear

# QR kodu tarayın
# Expo Go'da ne görüyorsunuz?
```

**Olası Sonuçlar:**
1. ✅ Çalışıyor → Sorun yok!
2. ❌ "Incompatible SDK" → Expo Go güncelleyin veya SDK düşürün
3. ❌ Beyaz ekran → `react-native-maps` sorunu, Development Build gerekli
4. ❌ "Timeout" → Ağ sorunu, tunnel modu kullanın
5. ❌ "Module not found" → Bağımlılık sorunu, `npm install` yapın

---

## 📊 Sorun Özeti

| Sorun | Şiddet | Çözüm |
|-------|--------|-------|
| react-native-maps | 🔴 YÜKSEK | Development Build |
| SDK 51 | 🟡 ORTA | Expo Go güncelle veya SDK düşür |
| react-native-reanimated | 🟡 ORTA | Development Build |
| Expo Router | 🟢 DÜŞÜK | Genelde çalışır |

---

## 💡 Öneri

**En İyi Çözüm:** Development Build kullanın!

**Neden:**
- Tüm özellikler çalışır
- Native modüller desteklenir
- Production'a daha yakın
- Expo Go sınırlamaları yok

**Alternatif:** Maps'i kaldırın, sadece Expo Go için geliştirin.

---

**Son Güncelleme**: 2024-12-18

