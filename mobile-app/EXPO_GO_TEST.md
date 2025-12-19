# 🧪 Expo Go Test Rehberi

## ✅ Yapılan Düzeltmeler

1. ✅ **SDK Versiyonu Eklendi**: `app.json`'a `sdkVersion: "51.0.0"` eklendi
2. ✅ **Eksik Dependencies**: `expo-constants` ve `expo-linking` eklendi
3. ✅ **Gereksiz Paket**: `@types/react-native` kaldırıldı
4. ✅ **.gitignore**: `.expo/` ve `.expo-shared/` eklendi

## 🚀 Test Adımları

### 1. Cache Temizleme ve Yeniden Başlatma

```bash
cd /Users/enescikcik/Desktop/APP/mobile-app

# Tüm cache'leri temizle
rm -rf node_modules .expo .metro node_modules/.cache

# Bağımlılıkları yeniden yükle
npm install

# Expo'yu temiz başlat
npx expo start --clear
```

### 2. Expo Go Uygulamasını Güncelleyin

**iOS:**
- App Store → Expo Go → Güncelle

**Android:**
- Play Store → Expo Go → Güncelle

### 3. Bağlantı Modları

#### A) LAN Modu (Aynı WiFi)
```bash
npx expo start --lan
```

#### B) Tunnel Modu (Farklı Ağlar İçin)
```bash
npx expo start --tunnel
```

#### C) Temiz Başlatma
```bash
npx expo start --clear
```

### 4. QR Kod Tarama

1. Terminal'de QR kodu görün
2. Expo Go uygulamasını açın
3. "Scan QR Code" seçeneğini kullanın
4. QR kodu tarayın

### 5. Hata Kontrolü

**Terminal'de kontrol edin:**
- Metro bundler çalışıyor mu?
- Hangi port kullanılıyor? (8081 olmalı)
- Hangi mod aktif? (LAN/Tunnel)

**Expo Go'da kontrol edin:**
- Hata mesajı var mı?
- Beyaz ekran mi görünüyor?
- "Loading..." takılı kalıyor mu?

## 🔍 Sorun Giderme

### Sorun 1: "Incompatible SDK version"

**Çözüm:**
```bash
# Expo Go'yu güncelleyin
# app.json'da sdkVersion kontrol edin (✅ Yapıldı)
```

### Sorun 2: "The request timed out"

**Çözüm:**
```bash
# Tunnel modu kullanın
npx expo start --tunnel --clear

# Veya port belirtin
npx expo start --port 8081 --lan
```

### Sorun 3: "Cannot find module"

**Çözüm:**
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### Sorun 4: Beyaz Ekran

**Çözüm:**
- Terminal'deki hata mesajlarını kontrol edin
- Expo Go'yu yeniden başlatın
- QR kodu tekrar tarayın

## 📱 Native Modül Uyarıları

⚠️ **react-native-maps** Expo Go'da çalışmaz!

**Çözüm:**
- Development Build kullanın: `npx expo run:ios`
- Veya Maps component'ini platform kontrolü ile sarın

## ✅ Başarı Kriterleri

- [ ] Expo Go uygulaması açılıyor
- [ ] Ana ekran görünüyor
- [ ] Navigasyon çalışıyor
- [ ] Hata mesajı yok
- [ ] Beyaz ekran yok

## 🆘 Hala Sorun Varsa

1. **Expo Doctor Çalıştırın:**
   ```bash
   npx expo-doctor
   ```

2. **Logları Kontrol Edin:**
   ```bash
   npx expo start --clear --verbose
   ```

3. **Development Build Deneyin:**
   ```bash
   npx expo prebuild
   npx expo run:ios
   ```

---

**Son Güncelleme**: 2024-12-18

