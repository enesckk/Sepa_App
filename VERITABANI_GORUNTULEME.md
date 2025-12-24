# 🗄️ Veritabanını Görüntüleme - En Kolay Yol

## ⚡ Hızlı Başlangıç

### 1. Script ile (En Kolay):
```bash
./view-db.sh
```

### 2. Manuel psql ile:
```bash
PGPASSWORD=secret psql -h localhost -p 5432 -U admin -d superapp
```

Sonra:
```sql
\dt                    -- Tabloları listele
SELECT * FROM bill_supports;  -- Faturaları görüntüle
\q                     -- Çıkış
```

---

## 📋 Veritabanı Bilgileri

- **Host**: localhost
- **Port**: 5432
- **Database**: superapp
- **User**: admin
- **Password**: secret

---

## 🔧 Tablolar Yoksa

Backend'i başlatın, tablolar otomatik oluşturulacak:

```bash
cd backend
npm start
```

Backend başladığında Sequelize otomatik olarak tüm tabloları oluşturur.

---

## 📊 Önemli Sorgular

### Tüm tabloları listele:
```sql
\dt
```

### Faturaları görüntüle:
```sql
SELECT * FROM bill_supports ORDER BY created_at DESC LIMIT 10;
```

### Destek işlemlerini görüntüle:
```sql
SELECT * FROM bill_support_transactions ORDER BY created_at DESC LIMIT 10;
```

### Kullanıcıları görüntüle:
```sql
SELECT id, name, email, golbucks FROM users LIMIT 10;
```

---

## 🖥️ GUI Araçları (Opsiyonel)

### TablePlus (Önerilen):
```bash
brew install --cask tableplus
```

Sonra bağlantı bilgilerini girin:
- Host: localhost
- Port: 5432
- Database: superapp
- User: admin
- Password: secret

