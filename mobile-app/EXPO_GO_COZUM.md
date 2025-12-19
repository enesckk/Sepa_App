# 🔧 Expo Go Sorunları - Araştırma ve Çözümler

## 🔍 Araştırma Sonuçları

### Ana Sorunlar

1. **SDK Sürüm Uyumsuzluğu** ⚠️ EN ÖNEMLİ
   - Expo Go belirli SDK sürümlerini destekler
   - Projede SDK versiyonu belirtilmemiş olabilir
   - Expo 51 kullanılıyor ama Expo Go'nun desteklediği versiyon farklı olabilir

2. **Expo Router Uyumsuzluğu**
   - Expo Router 3.5.0 bazı Expo Go versiyonlarında sorun çıkarabilir
   - `expo-router/entry` web'de sorun çıkarabilir

3. **Native Modül Sorunları**
   - `react-native-maps` Expo Go'da çalışmaz
   - `react-native-reanimated` bazı versiyonlarda sorun çıkarabilir

4. **Cache ve Bağımlılık Sorunları**
   - Eski cache dosyaları
   - Uyumsuz bağımlılıklar

## ✅ Yapılan Düzeltmeler

### 1. SDK Versiyonu Eklendi ✅

`app.json`'a `sdkVersion` eklendi:
```json
"sdkVersion": "51.0.0"
```

### 2. Eksik Peer Dependencies Eklendi ✅

Expo Router için gerekli paketler eklendi:
```bash
npx expo install expo-constants expo-linking
```

**Eklenen paketler:**
- `expo-constants@~16.0.2`
- `expo-linking@~6.3.1`

### 3. Gereksiz Paket Kaldırıldı ✅

`@types/react-native` kaldırıldı (react-native zaten types içeriyor)

### 4. .gitignore Güncellendi ✅

`.expo/` ve `.expo-shared/` gitignore'a eklendi

### 5. Babel Yapılandırması Kontrol Edildi ✅

Mevcut yapılandırma doğru görünüyor:
```javascript
presets: ['babel-preset-expo']
plugins: ['nativewind/babel', 'react-native-reanimated/plugin']
```

## 🚀 Çözüm Adımları

### Adım 1: Expo Go Uygulamasını Güncelleyin

**iOS:**
- App Store'dan Expo Go'yu güncelleyin
- En son versiyonu kullanın

**Android:**
- Play Store'dan Expo Go'yu güncelleyin
- En son versiyonu kullanın

### Adım 2: SDK Uyumluluğunu Kontrol Edin

Expo Go'nun desteklediği SDK versiyonları:
- Expo Go genellikle en son 2-3 SDK versiyonunu destekler
- Expo 51 (SDK 51) yeni olabilir, Expo Go güncel olmalı

**Kontrol:**
```bash
# Expo Go uygulamasında
# Ayarlar → SDK Versiyonu kontrol edin
```

### Adım 3: Cache ve Bağımlılıkları Temizleyin

```bash
cd /Users/enescikcik/Desktop/APP/mobile-app

# Tüm cache'leri temizle
rm -rf node_modules package-lock.json .expo node_modules/.cache .metro

# Bağımlılıkları yeniden yükle
npm install

# Expo'yu temiz başlat
npx expo start --clear
```

### Adım 4: Native Modül Sorunlarını Kontrol Edin

**react-native-maps** Expo Go'da çalışmaz! 

**Çözüm:**
- Şehir Rehberi ekranında platform kontrolü ekleyin
- Web'de alternatif harita kullanın
- Veya Development Build kullanın

### Adım 5: Expo Router Versiyonunu Kontrol Edin

```bash
# Mevcut versiyon
npm list expo-router

# Gerekirse güncelle
npx expo install expo-router@latest
```

## 🐛 Yaygın Hatalar ve Çözümleri

### Hata 1: "Incompatible SDK version"

**Çözüm:**
```bash
# app.json'a sdkVersion ekleyin (✅ Yapıldı)
# Expo Go'yu güncelleyin
# Projeyi yeniden başlatın
```

### Hata 2: "Cannot find module expo-router"

**Çözüm:**
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### Hata 3: "react-native-maps is not supported"

**Çözüm:**
- Development Build kullanın
- Veya Maps component'ini platform kontrolü ile sarın

### Hata 4: "The request timed out"

**Çözüm:**
- Tunnel modu kullanın: `npx expo start --tunnel`
- Aynı WiFi ağında olduğunuzdan emin olun
- Firewall ayarlarını kontrol edin

## 📋 Kontrol Listesi

- [ ] Expo Go uygulaması güncel mi?
- [ ] SDK versiyonu app.json'da belirtildi mi? (✅ Yapıldı)
- [ ] Cache temizlendi mi?
- [ ] Bağımlılıklar güncel mi?
- [ ] Aynı WiFi ağında mısınız?
- [ ] Tunnel modu denendi mi?

## 🔄 Alternatif Çözüm: Development Build

Expo Go sınırlamaları varsa, Development Build kullanın:

```bash
# Prebuild
npx expo prebuild

# iOS için
npx expo run:ios

# Android için
npx expo run:android
```

Bu şekilde tüm native modüller çalışır.

## 💡 Öneriler

1. **Expo Go Güncel Olmalı**: En son versiyonu kullanın
2. **SDK Versiyonu Belirtin**: app.json'da sdkVersion ekleyin (✅ Yapıldı)
3. **Tunnel Modu**: Ağ sorunları için tunnel kullanın
4. **Development Build**: Native modüller için gerekli

---

**Son Güncelleme**: 2024-12-18

