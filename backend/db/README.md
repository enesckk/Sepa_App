# Veritabanı İlk Kurulum

## 📋 init.sql Dosyası

Bu dosya PostgreSQL container'ı ilk başlatıldığında otomatik olarak çalıştırılır.

### Çalışma Prensibi

PostgreSQL Docker image'i `/docker-entrypoint-initdb.d/` klasöründeki tüm `.sql`, `.sh` ve `.sql.gz` dosyalarını alfabetik sırayla otomatik olarak çalıştırır.

### Oluşturulan Tablolar

1. **users** - Kullanıcı bilgileri
   - id (UUID)
   - name, email, password
   - phone, mahalle
   - golbucks (puan sistemi)
   - created_at, updated_at

2. **events** - Etkinlik bilgileri
   - id (UUID)
   - title, description
   - date, time, location
   - latitude, longitude
   - category, is_free, price
   - capacity, registered
   - golbucks_reward
   - created_at, updated_at

3. **rewards** - Ödül bilgileri
   - id (UUID)
   - title, description
   - category, points
   - stock, validity_days
   - partner_name, qr_code, reference_code
   - created_at, updated_at

### Özellikler

- ✅ UUID primary key'ler
- ✅ Otomatik updated_at trigger'ları
- ✅ Index'ler (performans için)
- ✅ Extension'lar (uuid-ossp, pgcrypto)
- ✅ Örnek veriler (development için)

### Kullanım

#### İlk Kurulum
```bash
# Volume'u sil ve yeniden başlat (init.sql çalışır)
docker-compose down -v
docker-compose up -d db
```

#### Mevcut Veritabanına Uygulama
```bash
# Container'a bağlan
docker-compose exec db psql -U admin -d superapp

# SQL dosyasını çalıştır
\i /docker-entrypoint-initdb.d/init.sql
```

### Önemli Notlar

⚠️ **init.sql sadece boş veritabanında çalışır!**

- Container ilk kez başlatıldığında çalışır
- Volume zaten varsa (pgdata) çalışmaz
- Yeni tablolar eklemek için migration kullanın

### Örnek Veriler

Development için örnek veriler eklenmiştir:
- 1 test kullanıcı
- 2 örnek etkinlik
- 3 örnek ödül

Production'da bu kısmı kaldırın veya yorum satırı yapın.

### Migration ile Güncelleme

Yeni tablolar veya değişiklikler için Sequelize migration kullanın:

```bash
# Migration oluştur
npx sequelize-cli migration:generate --name add_complaints_table

# Migration çalıştır
npm run migrate
```

