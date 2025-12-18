# 🏢 Belediye Mobil Süper Uygulama

## ✅ Proje Amacı

Bu proje, bir ilçe belediyesinin vatandaş odaklı, etkileşimli ve modern bir mobil süper uygulaması sunmasını hedefler. Amaç, belediyenin dijital dönüşümüne katkı sağlayacak bir altyapı ile vatandaş şikayetleri, etkinlikler, ödül sistemi, harita ve sosyal yardım gibi servisleri tek uygulamada toplamaktır.

## 💡 Teknoloji Yığını (Tech Stack)

### Mobil Uygulama (Frontend)

- **React Native**: iOS ve Android tek kod tabanı
- **React Navigation**: Sekme ve ekran yönetimi
- **Axios**: API istekleri
- **Redux Toolkit** (isteğe bağlı): Durum yönetimi

### Backend (API Servisi)

- **Node.js + Express.js**: RESTful API
- **JWT**: Oturum yönetimi ve doğrulama
- **PostgreSQL**: İlişkisel veri tabanı
- **Redis**: Günlük giriş, şifre, bildirim gibi hızlı veriler için cache
- **Sequelize veya Prisma**: ORM katmanı

### Konteynerizasyon & Altyapı

- **Docker**: Tüm servisleri izole çalıştırma
- **Docker Compose**: PostgreSQL, Redis ve API için ortam tanımı

### Bildirim Servisi

- **OneSignal** veya **Firebase Cloud Messaging (FCM)**

### SMS Doğrulama

- **NetGSM** / **Twilio** / **İleti Merkezi**

### Admin Panel (Yönetici Kontrol Merkezi)

- **React.js** veya **Next.js**: Web tabanlı
- **Tailwind CSS**: Tasarım
- **Chart.js** / **Recharts**: Kullanıcı ve puan analitiği

## 🔍 Fonksiyonel Modüller (Kullanıcı Tarafı)

### 1. 🏠 Ana Sayfa

- Günlük hikâyeler (Instagram Story mantığı)
- Son haberler, mahalle duyuruları
- Gölbucks bakiyesi görüntüleme
- Yaklaşan etkinlikler kutucuğu

### 2. 🎭 Etkinlikler

- Etkinlik listesi (kültür, sanat, konser)
- Etkinlik detayları
- Kayıt ol / QR bilet üretimi
- Gölbucks ile indirimli kayıt

### 3. 📍 Şehir Rehberi

- Harita tabanlı tesis ve hizmet listesi:
  - Tesisler, cenazeevleri, camiler, parklar
- Yol tarifi (Maps entegrasyonu)

### 4. 📄 Başvurular

- Şikayet / talep bildirimi (fotoğraf + konum)
- Şikayet takibi
- Nikah başvurusu formu
- Muhtara mesaj
- Askıda fatura ekleme ve takip

### 5. 🤔 Söz Senin

- Haftalık anketler
- Vatandaş görüş bildirme
- Katılıma göre puan kazanma

### 6. 🎁 Göl Market (Sadakat Sistemi)

- Günlük giriş puanı (check-in)
- Görev sistemi (anket, davet, şikayet)
- Gölbucks puan takibi
- Market (ödül: kahve, tiyatro, hediye, spor salonu)
- Kazanılan kuponlar (QR destekli)
- Arkadaş davet et - kazan

### 7. 👤 Profil / Ayarlar

- SMS ile giriş / oturum
- Bilgi güncelleme (isim, mahalle)
- Bildirim tercihleri
- Geçmiş hareketler ve Gölbucks logu

## 📆 Admin Panel Fonksiyonları

- Story yükleme (foto/video, yayın zamanlama)
- Anket oluşturma ve analiz
- Bildirim gönderme (konuma göre)
- Etkinlik oluşturma ve kayıt takibi
- Şikayet yönetimi (durum değişikliği)
- Askıda fatura kontrolü
- Nikah başvuru listesi
- Ödül/kupon stoğu yönetimi
- Kullanıcı istatistikleri ve Gölbucks hareket analizi

## 🚀 Deployment ve Ortamlar

- Tüm servisler Docker container olarak yönetilir
- Docker Compose ile PostgreSQL, Redis, API ve Panel birlikte çalıştırılabilir
- Hosting için Render / Railway / Vercel / Sunucu seçenekleri değerlendirilir

## ✏️ Lisans

Bu uygulama özel belediye projesi olarak tescillidir. Kodlar belediyeye ait altyapıda barındırılacak ve açık kaynak değildir (opsiyonel).

## 📅 Takvim ve Yol Haritası

Versiyon 1 için hedeflenen temel modüller ve teknolojiler bu dokümanda tanımlanmıştır. Bir sonraki adımda:

- UI/UX tasarımlar
- Veritabanı ER diyagramları
- API endpoint listesi
- Test planı ve QA süreci

dokümanları hazırlanacaktır.

