# 🚀 Expo Hızlı Başlatma

## ✅ Expo Kontrolü Tamamlandı

Expo yapılandırması doğru ve hazır:
- ✅ Expo-doctor: 17/17 kontroller geçti
- ✅ package.json: Doğru yapılandırılmış
- ✅ app.json: Doğru yapılandırılmış
- ✅ Dependencies: Yüklü

## 🚀 Expo'yu Başlatmak İçin

### Terminal'de şu komutu çalıştırın:

```bash
cd mobile-app
npx expo start
```

veya

```bash
cd mobile-app
./start-expo.sh
```

## 📱 Ne Göreceksiniz?

Expo başladığında terminal'de şunları göreceksiniz:

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press j │ open debugger
```

## 🔍 Sorun: Expo Açılmıyor mu?

### 1. Terminal Çıktısını Kontrol Edin

Expo başladığında terminal'de QR kod ve bağlantı bilgileri görünmeli.

### 2. Port Kontrolü

```bash
# Port 8081 kullanımda mı?
lsof -ti:8081

# Eğer kullanımdaysa temizle:
lsof -ti:8081 | xargs kill -9
```

### 3. Cache Temizleme

```bash
cd mobile-app
npx expo start --clear
```

### 4. Metro Bundler Kontrolü

Tarayıcıda şu adresi açın:
```
http://localhost:8081
```

Eğer sayfa açılıyorsa Metro bundler çalışıyor demektir.

## 📱 Telefonda Test Etme

1. **Expo Go** uygulamasını telefonunuza indirin
2. Terminal'deki **QR kodu** tarayın
3. Veya **"Enter URL manually"** ile: `exp://localhost:8081`

## 🖥️ Simulator'da Test Etme

### iOS:
```bash
cd mobile-app
npx expo start --ios
```

### Android:
```bash
cd mobile-app
npx expo start --android
```

## ⚠️ Önemli Notlar

1. **Backend çalışıyor olmalı**: `http://localhost:4000`
2. **Telefon ve bilgisayar aynı WiFi'de olmalı** (Expo Go için)
3. **İlk başlatmada yavaş olabilir** - Metro bundler cache oluşturuyor

## 🆘 Hala Açılmıyorsa

1. Terminal çıktısını kontrol edin - hata mesajı var mı?
2. Backend çalışıyor mu? `curl http://localhost:4000/api/health`
3. Node modules yüklü mü? `cd mobile-app && ls node_modules`

## 📞 Hata Mesajı Varsa

Terminal'deki hata mesajını paylaşın, birlikte çözelim!

