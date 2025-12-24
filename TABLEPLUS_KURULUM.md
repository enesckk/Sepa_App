# TablePlus Kurulum ve Bağlantı Kılavuzu

## 📦 Kurulum

### Yöntem 1: Homebrew ile (Terminal)
```bash
brew install --cask tableplus
```

### Yöntem 2: Manuel Kurulum
1. https://tableplus.com adresine gidin
2. "Download for Mac" butonuna tıklayın
3. İndirilen .dmg dosyasını açın
4. TablePlus'ı Applications klasörüne sürükleyin

---

## 🔌 Veritabanına Bağlanma

### Adım 1: TablePlus'ı Açın
Applications klasöründen TablePlus'ı açın.

### Adım 2: Yeni Bağlantı Oluşturun
1. Açılan pencerede **"Create a new connection"** butonuna tıklayın
2. **PostgreSQL** seçin

### Adım 3: Bağlantı Bilgilerini Girin

**Bağlantı Ayarları:**
- **Name**: `Şehitkamil DB` (istediğiniz isim)
- **Host**: `localhost`
- **Port**: `5432`
- **User**: `admin`
- **Password**: `secret`
- **Database**: `superapp`

### Adım 4: Bağlanın
1. **"Test"** butonuna tıklayın (bağlantıyı test eder)
2. Başarılı olursa **"Connect"** butonuna tıklayın

---

## 📊 Kullanım

### Tabloları Görüntüleme
- Sol tarafta **"Tables"** sekmesine tıklayın
- Tüm tabloları göreceksiniz:
  - `bill_supports` - Faturalar
  - `bill_support_transactions` - Destek işlemleri
  - `users` - Kullanıcılar
  - `rewards` - Ödüller
  - vb.

### Veri Görüntüleme
- Bir tabloya çift tıklayın
- Tüm verileri tablo formatında göreceksiniz
- Filtreleme, sıralama yapabilirsiniz

### SQL Sorguları Yazma
- Üst menüden **"New Query"** butonuna tıklayın
- SQL sorgularınızı yazın
- **Cmd + Enter** ile çalıştırın

---

## 💡 Örnek Sorgular

### Faturaları görüntüle:
```sql
SELECT * FROM bill_supports ORDER BY created_at DESC;
```

### Destek işlemlerini görüntüle:
```sql
SELECT * FROM bill_support_transactions ORDER BY created_at DESC;
```

### Kullanıcıları görüntüle:
```sql
SELECT id, name, email, golbucks FROM users;
```

---

## 🎯 İpuçları

- **Tablo yapısını görmek için**: Tabloya sağ tıklayın → "Structure"
- **Veri düzenlemek için**: Tabloyu açın, hücrelere çift tıklayın
- **Sorgu geçmişi**: Üst menüden "History" sekmesine bakın

