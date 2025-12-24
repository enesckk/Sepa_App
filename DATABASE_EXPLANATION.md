# 🗄️ Veritabanı Nasıl Hazırlandı? - Basit Açıklama

## 📚 Basit Özet

Veritabanını hazırlamak için **3 yöntem** kullandık:

1. **SQL Dosyası** (`init.sql`) - İlk kurulum için
2. **Sequelize Modelleri** (JavaScript) - Otomatik tablo oluşturma
3. **Docker** - Otomatik kurulum

---

## 🎯 1. SQL Dosyası ile Başlangıç (init.sql)

### Ne Yaptık?

Bir SQL dosyası oluşturduk (`backend/db/init.sql`) ve içine şunları yazdık:

```sql
-- Kullanıcılar tablosu
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    golbucks INTEGER DEFAULT 0,
    ...
);

-- Etkinlikler tablosu
CREATE TABLE events (
    id UUID PRIMARY KEY,
    title VARCHAR(255),
    date DATE,
    ...
);

-- Ödüller tablosu
CREATE TABLE rewards (
    id UUID PRIMARY KEY,
    title VARCHAR(255),
    points INTEGER,
    ...
);
```

### Bu Dosya Ne Zaman Çalışır?

**Docker ile başlatınca otomatik çalışır:**
```bash
docker-compose up -d db
```

PostgreSQL container başladığında, `init.sql` dosyasını otomatik okur ve tabloları oluşturur.

---

## 🔧 2. Sequelize Modelleri (JavaScript ile)

### Ne Yaptık?

Her tablo için bir JavaScript dosyası oluşturduk:

```
backend/src/models/
├── User.js          → users tablosu
├── Event.js         → events tablosu
├── Reward.js        → rewards tablosu
├── Application.js   → applications tablosu
├── Survey.js        → surveys tablosu
├── Question.js      → questions tablosu
├── Answer.js        → answers tablosu
└── ... (19 model)
```

### Örnek: User.js Modeli

```javascript
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
  },
  golbucks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // ... diğer alanlar
});
```

### Bu Modeller Ne İşe Yarar?

1. **Otomatik Tablo Oluşturma**: Backend başladığında Sequelize modelleri kontrol eder
2. **Eksik Tabloları Ekler**: Eğer bir tablo yoksa otomatik oluşturur
3. **İlişkileri Kurar**: Tablolar arası bağlantıları (foreign key) otomatik yapar

### Nasıl Çalışır?

Backend başladığında (`npm run dev`):
```javascript
// backend/src/index.js içinde
await sequelize.sync({ alter: true });
```

Bu kod:
- ✅ Tüm modelleri kontrol eder
- ✅ Eksik tabloları oluşturur
- ✅ Yeni kolonları ekler (alter: true)
- ✅ İlişkileri kurar

---

## 🐳 3. Docker ile Otomatik Kurulum

### Ne Yaptık?

`docker-compose.yml` dosyasında PostgreSQL'i yapılandırdık:

```yaml
db:
  image: postgres:15
  environment:
    POSTGRES_DB: superapp
    POSTGRES_USER: admin
    POSTGRES_PASSWORD: secret
  volumes:
    - ./backend/db/init.sql:/docker-entrypoint-initdb.d/init.sql
```

### Bu Ne Demek?

1. **PostgreSQL 15** image'ini kullan
2. **superapp** adında veritabanı oluştur
3. **admin** kullanıcısı ile **secret** şifresi kullan
4. `init.sql` dosyasını otomatik çalıştır

### Nasıl Çalışır?

```bash
docker-compose up -d db
```

Bu komut:
1. PostgreSQL container'ını başlatır
2. Veritabanını oluşturur
3. `init.sql` dosyasını otomatik çalıştırır
4. Tabloları oluşturur

---

## 🔗 Tablolar Arası İlişkiler

### Nasıl Bağladık?

**Örnek: Kullanıcı ve Başvurular**

```javascript
// Application.js içinde
Application.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// User.js içinde
User.hasMany(Application, {
  foreignKey: 'user_id',
  as: 'applications',
});
```

**Bu Ne Demek?**
- Bir kullanıcının **birden fazla başvurusu** olabilir
- Her başvuru **bir kullanıcıya** aittir
- `user_id` ile bağlanırlar

**Diğer İlişkiler:**
- User ↔ Applications (1-N)
- User ↔ EventRegistrations (1-N)
- User ↔ Answers (1-N)
- User ↔ UserRewards (1-N)
- Event ↔ EventRegistrations (1-N)
- Survey ↔ Questions (1-N)
- Question ↔ Answers (1-N)
- Reward ↔ UserRewards (1-N)

---

## 📊 Toplam Tablolar

### 19 Tablo Oluşturduk:

1. **users** - Kullanıcılar
2. **events** - Etkinlikler
3. **event_registrations** - Etkinlik kayıtları
4. **rewards** - Ödüller
5. **user_rewards** - Kullanıcı ödülleri
6. **applications** - Başvurular
7. **bill_supports** - Askıda fatura
8. **surveys** - Anketler
9. **questions** - Sorular
10. **answers** - Cevaplar
11. **stories** - Hikayeler
12. **story_views** - Hikaye görüntülemeleri
13. **news** - Haberler
14. **notifications** - Bildirimler
15. **places** - Mekanlar
16. **emergency_gathering** - Afet toplanma alanları
17. **golbucks_transactions** - Gölbucks işlemleri
18. **daily_rewards** - Günlük ödüller
19. **fcm_tokens** - Push notification token'ları (users tablosunda)

---

## 🚀 Veritabanı Nasıl Oluşuyor?

### Senaryo 1: Docker ile (Önerilen)

```bash
# 1. Docker container'ı başlat
docker-compose up -d db

# 2. init.sql otomatik çalışır
# 3. Temel tablolar oluşur (users, events, rewards)

# 4. Backend'i başlat
cd backend
npm run dev

# 5. Sequelize modelleri kontrol eder
# 6. Eksik tabloları otomatik oluşturur
# 7. İlişkileri kurar
```

### Senaryo 2: Manuel Kurulum

```bash
# 1. PostgreSQL'de veritabanı oluştur
createdb superapp

# 2. init.sql'i çalıştır
psql -U postgres -d superapp -f backend/db/init.sql

# 3. Backend'i başlat
cd backend
npm run dev

# 4. Sequelize eksik tabloları ekler
```

---

## 🔄 Sequelize Sync Nasıl Çalışır?

### `sequelize.sync({ alter: true })` Ne Yapar?

1. **Mevcut Tabloları Kontrol Eder**
   - Database'de hangi tablolar var?
   - Model'lerde hangi tablolar tanımlı?

2. **Eksik Tabloları Oluşturur**
   - Model var ama tablo yok → Tablo oluştur

3. **Eksik Kolonları Ekler**
   - Tablo var ama kolon eksik → Kolon ekle (alter: true)
   - Örnek: `fcm_token` kolonu eklendi

4. **İlişkileri Kurar**
   - Foreign key'leri oluşturur
   - Index'leri ekler

---

## 📝 Örnek: Bir Tablo Nasıl Oluşuyor?

### Adım 1: Model Oluştur

```javascript
// backend/src/models/Application.js
const Application = sequelize.define('Application', {
  id: { type: DataTypes.UUID, primaryKey: true },
  user_id: { type: DataTypes.UUID },
  type: { type: DataTypes.STRING },
  subject: { type: DataTypes.STRING },
  // ...
});
```

### Adım 2: İlişki Kur

```javascript
Application.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});
```

### Adım 3: Backend Başlat

```bash
npm run dev
```

### Adım 4: Sequelize Otomatik Yapar

```sql
-- Sequelize otomatik olarak şunu yapar:
CREATE TABLE applications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    type VARCHAR(255),
    subject VARCHAR(255),
    ...
);

CREATE INDEX idx_applications_user_id ON applications(user_id);
```

---

## 🎯 Sonuç

### Veritabanı Hazırlama Süreci:

1. ✅ **init.sql** - Temel tablolar (users, events, rewards)
2. ✅ **Sequelize Modelleri** - Tüm tablolar (19 model)
3. ✅ **Docker** - Otomatik kurulum
4. ✅ **İlişkiler** - Tablolar arası bağlantılar
5. ✅ **Index'ler** - Hızlı arama için
6. ✅ **Trigger'lar** - Otomatik güncellemeler (updated_at)

### Veritabanı Durumu:

- ✅ **19 tablo** oluşturuldu
- ✅ **İlişkiler** kuruldu
- ✅ **Index'ler** eklendi
- ✅ **Trigger'lar** çalışıyor
- ✅ **Otomatik sync** aktif

**Veritabanı tamamen hazır ve çalışıyor!** 🎉

---

## 💡 Basit Açıklama

**Veritabanı = Excel Tablosu Gibi**

- Her tablo = Bir Excel sayfası
- Her satır = Bir kayıt (kullanıcı, etkinlik, vb.)
- Her kolon = Bir bilgi (isim, email, tarih, vb.)
- İlişkiler = Tablolar arası bağlantılar

**Örnek:**
- `users` tablosu = Tüm kullanıcıların listesi
- `events` tablosu = Tüm etkinliklerin listesi
- `applications` tablosu = Tüm başvuruların listesi
- `user_id` ile bağlanırlar = Hangi başvuru hangi kullanıcıya ait?

**Sequelize = Otomatik Excel Oluşturucu**

- Model yazarsın (JavaScript)
- Sequelize otomatik tablo oluşturur
- İlişkileri otomatik kurar
- Her şey otomatik! 🚀

