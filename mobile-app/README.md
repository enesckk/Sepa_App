# Şehitkamil Belediyesi Mobil Uygulama

React Native + Expo ile geliştirilmiş belediye süper uygulaması.

## 🚀 Hızlı Başlangıç

```bash
# Bağımlılıkları yükle
npm install

# Expo'yu başlat
npm start
```

## 📱 Test Etme

### Expo Go ile (Fiziksel Cihaz)
1. Expo Go uygulamasını indirin (App Store / Play Store)
2. `npm start` komutunu çalıştırın
3. QR kodu tarayın

### iOS Simulator
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

## 🛠️ Geliştirme

- **Framework**: React Native 0.74.5 + Expo 51
- **Router**: Expo Router 3.5.0
- **Styling**: NativeWind (Tailwind CSS)
- **Animations**: React Native Reanimated

## 📁 Proje Yapısı

```
app/              # Expo Router dosyaları (file-based routing)
src/
  components/     # React bileşenleri
  screens/        # Ekran bileşenleri (legacy)
  services/       # Mock data ve API servisleri
  constants/      # Sabitler
```

## ⚠️ Sorun Giderme

### Port Çakışması
```bash
pkill -f "expo\|metro"
lsof -ti:8081 | xargs kill -9
npm start
```

### Cache Temizleme
```bash
rm -rf .expo node_modules/.cache
npm start -- --clear
```
