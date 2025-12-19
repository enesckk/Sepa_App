# 🌐 Web'de Beyaz Ekran - Hata Ayıklama Kılavuzu

## 🔍 Adım Adım Kontrol

### 1. Browser Console Kontrolü

**Tarayıcıda F12 tuşuna basın ve Console sekmesine bakın:**

Yaygın hatalar:
- `Cannot find module 'react-native-gesture-handler'`
- `GestureHandlerRootView is not a function`
- `NativeWind styles not loading`
- `Expo Router error`

### 2. Network Sekmesi Kontrolü

**F12 → Network sekmesi:**
- JavaScript bundle yükleniyor mu?
- CSS dosyaları yükleniyor mu?
- 404 hatası var mı?

### 3. Expo Web Başlatma

```bash
cd /Users/enescikcik/Desktop/APP/mobile-app

# Process'leri temizle
pkill -f "expo\|metro"
lsof -ti:8081 8082 | xargs kill -9 2>/dev/null

# Web modunda başlat
npx expo start --web --clear
```

### 4. Doğru URL

Web'de şu URL'yi kullanın:
```
http://localhost:8081
```

**NOT**: Port 8082 değil, 8081 olmalı!

### 5. Cache Temizleme

```bash
cd /Users/enescikcik/Desktop/APP/mobile-app

# Browser cache temizle (tarayıcıda Ctrl+Shift+R)
# Expo cache temizle
rm -rf .expo node_modules/.cache

# Yeniden başlat
npx expo start --web --clear
```

## 🐛 Yaygın Sorunlar ve Çözümler

### Sorun 1: GestureHandlerRootView Hatası

**Hata**: `GestureHandlerRootView is not a function`

**Çözüm**: ✅ Düzeltildi (_layout.tsx'de platform kontrolü eklendi)

### Sorun 2: NativeWind Styles Çalışmıyor

**Hata**: Stiller uygulanmıyor

**Çözüm**:
```bash
# PostCSS kontrolü
npm list postcss autoprefixer

# Eğer yoksa
npm install postcss autoprefixer --save-dev
```

### Sorun 3: React Native Reanimated Hatası

**Hata**: Reanimated web'de çalışmıyor

**Çözüm**: Normal, web'de sınırlı destek var. Component'lerde platform kontrolü eklenebilir.

### Sorun 4: Maps Component Hatası

**Hata**: `react-native-maps` web'de çalışmaz

**Çözüm**: Web için platform kontrolü:
```typescript
import { Platform } from 'react-native';

{Platform.OS !== 'web' && <MapView ... />}
```

## ✅ Test Komutları

```bash
# Web'i başlat
cd /Users/enescikcik/Desktop/APP/mobile-app
npx expo start --web

# Veya belirli port ile
npx expo start --web --port 8081

# Cache temizleyerek
npx expo start --web --clear
```

## 📋 Kontrol Listesi

- [ ] Browser console'da hata var mı?
- [ ] JavaScript bundle yüklendi mi?
- [ ] CSS dosyaları yüklendi mi?
- [ ] Doğru port kullanılıyor mu? (8081)
- [ ] Cache temizlendi mi?
- [ ] Node modules güncel mi?

## 💡 İpuçları

1. **Hard Refresh**: Ctrl+Shift+R (Windows) veya Cmd+Shift+R (Mac)
2. **Incognito Mode**: Tarayıcı cache sorunlarını test etmek için
3. **Console Logs**: Component'lerde console.log ekleyerek debug edin
4. **Network Tab**: Hangi dosyaların yüklenemediğini görün

---

**Önemli**: Web desteği ikincil öncelik. Ana hedef mobil uygulama (iOS/Android).

