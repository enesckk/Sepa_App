# Veritabanı Görüntüleme Kılavuzu

## 📊 Veritabanı Bilgileri

- **Host**: localhost (veya Docker'da `db`)
- **Port**: 5432
- **Database**: superapp
- **User**: admin
- **Password**: secret

---

## 🚀 Yöntem 1: Komut Satırı (psql) - En Hızlı

### Docker Container Çalışıyorsa:
```bash
docker exec -it sehitkamil_db psql -U admin -d superapp
```

### Docker Container Çalışmıyorsa (Doğrudan PostgreSQL):
```bash
PGPASSWORD=secret psql -h localhost -p 5432 -U admin -d superapp
```

### Veya Script Kullanarak:
```bash
./connect-db.sh
```

### Kullanışlı psql Komutları:

```sql
-- Tüm tabloları listele
\dt

-- Tablo yapısını görüntüle
\d bill_supports

-- Tüm verileri görüntüle
SELECT * FROM bill_supports;

-- Desteklenen faturaları görüntüle
SELECT 
    bs.id,
    bs.bill_type,
    bs.amount,
    bs.supported_amount,
    bs.supported_by_count,
    bs.status,
    u.name as user_name,
    bs.created_at
FROM bill_supports bs
JOIN users u ON bs.user_id = u.id
WHERE bs.is_public = true
ORDER BY bs.created_at DESC;

-- Destek işlemlerini görüntüle
SELECT 
    t.id,
    bs.reference_number,
    u1.name as bill_owner,
    u2.name as supporter,
    t.amount,
    t.payment_method,
    t.status,
    t.created_at
FROM bill_support_transactions t
JOIN bill_supports bs ON t.bill_support_id = bs.id
JOIN users u1 ON bs.user_id = u1.id
JOIN users u2 ON t.supporter_id = u2.id
ORDER BY t.created_at DESC;

-- Çıkış
\q
```

---

## 🖥️ Yöntem 2: GUI Araçları

### A) pgAdmin (Ücretsiz, Resmi PostgreSQL Aracı)

1. **Kurulum:**
   ```bash
   brew install --cask pgadmin4
   ```

2. **Bağlantı Ayarları:**
   - Host: `localhost`
   - Port: `5432`
   - Database: `superapp`
   - Username: `admin`
   - Password: `secret`

### B) TablePlus (Mac için Güzel UI)

1. **Kurulum:**
   ```bash
   brew install --cask tableplus
   ```

2. **Bağlantı:**
   - PostgreSQL seçin
   - Host: `localhost`
   - Port: `5432`
   - Database: `superapp`
   - User: `admin`
   - Password: `secret`

### C) DBeaver (Ücretsiz, Çoklu Veritabanı Desteği)

1. **Kurulum:**
   ```bash
   brew install --cask dbeaver-community
   ```

2. **Bağlantı:**
   - PostgreSQL seçin
   - Host: `localhost`
   - Port: `5432`
   - Database: `superapp`
   - Username: `admin`
   - Password: `secret`

### D) VS Code Extension (PostgreSQL)

1. **Extension Kurulumu:**
   - VS Code'da "PostgreSQL" extension'ını kurun
   - Veya "SQLTools" + "SQLTools PostgreSQL" extension'larını kurun

2. **Bağlantı:**
   - Extension panelinden yeni bağlantı oluşturun
   - Aynı bilgileri girin

---

## 📋 Yöntem 3: Hızlı Sorgular (Script)

### Tüm Faturaları Görüntüle:
```bash
docker exec -it sehitkamil_db psql -U admin -d superapp -c "SELECT * FROM bill_supports;"
```

### Destek İşlemlerini Görüntüle:
```bash
docker exec -it sehitkamil_db psql -U admin -d superapp -c "SELECT * FROM bill_support_transactions;"
```

### Kullanıcıları Görüntüle:
```bash
docker exec -it sehitkamil_db psql -U admin -d superapp -c "SELECT id, name, email, golbucks FROM users;"
```

---

## 🔍 Önemli Tablolar

### bill_supports
- Faturaları içerir
- `supported_amount`: Toplam desteklenen tutar
- `supported_by_count`: Kaç kişi destekledi
- `is_public`: Herkese açık mı

### bill_support_transactions
- Her destek işlemini içerir
- `supporter_id`: Destekleyen kullanıcı
- `amount`: Desteklenen tutar
- `payment_method`: Ödeme yöntemi (golbucks/direct)

### users
- Kullanıcı bilgileri
- `golbucks`: Kullanıcının Gölbucks bakiyesi

---

## 🛠️ Sorun Giderme

### Bağlantı Hatası Alıyorsanız:

1. **PostgreSQL çalışıyor mu kontrol edin:**
   ```bash
   # Docker ile
   docker ps | grep sehitkamil_db
   
   # Doğrudan
   pg_isready -h localhost -p 5432
   ```

2. **Port kullanımda mı kontrol edin:**
   ```bash
   lsof -i :5432
   ```

3. **Docker container'ı başlatın:**
   ```bash
   docker-compose up -d db
   ```

---

## 📝 Örnek Sorgular

### En çok desteklenen faturalar:
```sql
SELECT 
    bs.reference_number,
    bs.bill_type,
    bs.amount,
    bs.supported_amount,
    bs.supported_by_count,
    ROUND((bs.supported_amount / bs.amount * 100), 2) as support_percentage
FROM bill_supports bs
WHERE bs.is_public = true
ORDER BY bs.supported_by_count DESC
LIMIT 10;
```

### Kullanıcıların toplam destekleri:
```sql
SELECT 
    u.name,
    COUNT(t.id) as total_supports,
    SUM(t.amount) as total_amount
FROM bill_support_transactions t
JOIN users u ON t.supporter_id = u.id
GROUP BY u.id, u.name
ORDER BY total_amount DESC;
```

### Günlük destek istatistikleri:
```sql
SELECT 
    DATE(created_at) as date,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount
FROM bill_support_transactions
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

