# 🗄️ Veritabanı Görüntüleme - Hızlı Kılavuz

## ⚡ En Kolay Yol (Script)

```bash
./db-view.sh
```

Bu script otomatik olarak:
- Tüm tabloları listeler
- Faturaları gösterir
- Destek işlemlerini gösterir
- Kullanıcıları gösterir
- İstatistikleri gösterir

---

## 📋 Manuel Yöntemler

### 1. Komut Satırı (psql)

```bash
PGPASSWORD=secret psql -h localhost -p 5432 -U admin -d superapp
```

Sonra SQL komutları:
```sql
\dt                    -- Tabloları listele
SELECT * FROM bill_supports;  -- Faturaları görüntüle
SELECT * FROM bill_support_transactions;  -- Destek işlemlerini görüntüle
\q                     -- Çıkış
```

### 2. GUI Araçları

#### TablePlus (Önerilen - Mac için)
```bash
brew install --cask tableplus
```

**Bağlantı Bilgileri:**
- Host: `localhost`
- Port: `5432`
- Database: `superapp`
- User: `admin`
- Password: `secret`

#### pgAdmin (Resmi PostgreSQL Aracı)
```bash
brew install --cask pgadmin4
```

#### DBeaver (Ücretsiz, Çoklu Veritabanı)
```bash
brew install --cask dbeaver-community
```

---

## 🔍 Önemli Sorgular

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

### İstatistikler:
```sql
SELECT 
    (SELECT COUNT(*) FROM bill_supports) as faturalar,
    (SELECT COUNT(*) FROM bill_support_transactions) as destekler,
    (SELECT COUNT(*) FROM users) as kullanicilar;
```

---

## 📊 Veritabanı Bilgileri

- **Host**: localhost
- **Port**: 5432
- **Database**: superapp
- **User**: admin
- **Password**: secret

---

## 🎯 Hızlı Başlangıç

1. **Script ile (En Kolay):**
   ```bash
   ./db-view.sh
   ```

2. **Manuel psql ile:**
   ```bash
   PGPASSWORD=secret psql -h localhost -p 5432 -U admin -d superapp
   ```

3. **GUI ile:**
   - TablePlus kurun ve bağlanın

