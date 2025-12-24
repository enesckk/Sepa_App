# 🗄️ Veritabanı Görüntüleme - Adım Adım

## 🚀 YÖNTEM 1: Script ile (En Hızlı)

Terminal'de şu komutu çalıştırın:

```bash
./db-view.sh
```

Bu komut otomatik olarak:
- ✅ Tüm tabloları listeler
- ✅ Faturaları gösterir
- ✅ Destek işlemlerini gösterir
- ✅ Kullanıcıları gösterir
- ✅ İstatistikleri gösterir

---

## 🖥️ YÖNTEM 2: GUI Aracı ile (En Görsel)

### TablePlus Kurulumu (Mac için en iyi seçenek):

```bash
brew install --cask tableplus
```

Kurulumdan sonra:

1. **TablePlus'ı açın**
2. **"Create a new connection"** tıklayın
3. **PostgreSQL** seçin
4. **Bağlantı bilgilerini girin:**
   - **Name**: Şehitkamil DB (istediğiniz isim)
   - **Host**: `localhost`
   - **Port**: `5432`
   - **User**: `admin`
   - **Password**: `secret`
   - **Database**: `superapp`
5. **"Test"** butonuna tıklayın
6. **"Connect"** butonuna tıklayın

Artık tüm tabloları görsel olarak görebilir, sorgular yazabilirsiniz!

---

## 📋 YÖNTEM 3: Komut Satırı (psql)

Terminal'de:

```bash
PGPASSWORD=secret psql -h localhost -p 5432 -U admin -d superapp
```

Sonra SQL komutları:

```sql
-- Tabloları listele
\dt

-- Faturaları görüntüle
SELECT * FROM bill_supports;

-- Destek işlemlerini görüntüle
SELECT * FROM bill_support_transactions;

-- Kullanıcıları görüntüle
SELECT * FROM users;

-- Çıkış
\q
```

---

## 🎯 Hangi Yöntemi Seçmeliyim?

- **Hızlı bakış için**: `./db-view.sh` (Yöntem 1)
- **Görsel ve kolay için**: TablePlus (Yöntem 2) ⭐ ÖNERİLEN
- **SQL yazmak için**: psql (Yöntem 3)

---

## 📊 Önemli Tablolar

- `bill_supports` - Faturalar
- `bill_support_transactions` - Destek işlemleri
- `users` - Kullanıcılar
- `rewards` - Ödüller
- `surveys` - Anketler
- `events` - Etkinlikler

---

## 💡 İpucu

TablePlus kurmak istemiyorsanız, `./db-view.sh` script'ini kullanabilirsiniz. Bu script her şeyi otomatik gösterir.

