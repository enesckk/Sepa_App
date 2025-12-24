# 📱 Expo Başlatma Kılavuzu

## 🚀 Expo'yu Başlatma

### Yöntem 1: Script ile (Önerilen)

```bash
cd mobile-app
./start-expo.sh
```

### Yöntem 2: Manuel

```bash
cd mobile-app
npx expo start --clear
```

### Yöntem 3: npm script ile

```bash
cd mobile-app
npm start
```

## 📋 Ön Gereksinimler

1. ✅ **Backend çalışıyor olmalı**: `http://localhost:4000`
2. ✅ **Node modules yüklü olmalı**: `npm install` (ilk kez çalıştırıyorsanız)

## 🔍 Kontroller

### Expo-doctor ile kontrol:

```bash
cd mobile-app
npx expo-doctor
```

Tüm kontroller geçmeli: ✅ **17/17 checks passed**

## 📱 Expo Go ile Test Etme

1. **Telefonda Expo Go uygulamasını açın**
2. **QR kodu tarayın** (terminal'de görünecek)
3. Veya **"Enter URL manually"** ile: `exp://localhost:8081`

## 🖥️ Simulator ile Test Etme

### iOS Simulator:
```bash
cd mobile-app
npx expo start --ios
```

### Android Emulator:
```bash
cd mobile-app
npx expo start --android
```

## 🌐 Web'de Test Etme

```bash
cd mobile-app
npx expo start --web
```

## ⚠️ Sorun Giderme

### Port 8081 kullanımda:

```bash
# Port'u temizle
lsof -ti:8081 | xargs kill -9
```

### Cache temizleme:

```bash
cd mobile-app
npx expo start --clear
```

### Node modules yeniden yükleme:

```bash
cd mobile-app
rm -rf node_modules
npm install
```

### Metro bundler'ı sıfırlama:

```bash
cd mobile-app
npx expo start --clear
# veya
watchman watch-del-all
rm -rf node_modules
npm install
```

## 📊 Expo Durumu

Expo başladığında şunları göreceksiniz:

- ✅ **Metro bundler**: `http://localhost:8081`
- ✅ **QR kod**: Terminal'de görünecek
- ✅ **Bağlantı bilgileri**: Terminal'de görünecek

## 🔗 Önemli URL'ler

- **Metro Bundler**: `http://localhost:8081`
- **Expo Dev Tools**: Terminal'de görünecek
- **Backend API**: `http://localhost:4000/api`

## 💡 İpuçları

1. **İlk başlatmada yavaş olabilir** - Metro bundler cache oluşturuyor
2. **QR kod görünmüyorsa** - Terminal'i tam ekran yapın
3. **Bağlantı sorunu varsa** - Telefon ve bilgisayar aynı WiFi'de olmalı
4. **Hot reload çalışmıyorsa** - `r` tuşuna basarak reload edin

## 🛑 Expo'yu Durdurma

Terminal'de `Ctrl + C` tuşlarına basın.

