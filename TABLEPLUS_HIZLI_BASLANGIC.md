# 🚀 TablePlus Hızlı Başlangıç

## 📥 Kurulum (2 Yol)

### Yol 1: Homebrew (Terminal'de bekleyin, sonra):
```bash
brew install --cask tableplus
```

### Yol 2: Manuel İndirme (Şimdi yapabilirsiniz)
1. **https://tableplus.com/download** adresine gidin
2. **"Download for Mac"** butonuna tıklayın
3. İndirilen `.dmg` dosyasını açın
4. **TablePlus'ı Applications klasörüne sürükleyin**

---

## 🔌 Veritabanına Bağlanma (5 Adım)

### 1️⃣ TablePlus'ı Açın
Applications klasöründen TablePlus'ı açın.

### 2️⃣ Yeni Bağlantı
Açılan pencerede **"Create a new connection"** butonuna tıklayın.

### 3️⃣ PostgreSQL Seçin
**PostgreSQL** seçeneğini seçin.

### 4️⃣ Bağlantı Bilgilerini Girin

**Aşağıdaki bilgileri girin:**

```
Name:     Şehitkamil DB
Host:     localhost
Port:     5432
User:     admin
Password: secret
Database: superapp
```

### 5️⃣ Bağlanın
- **"Test"** butonuna tıklayın (bağlantıyı test eder)
- Başarılı olursa **"Connect"** butonuna tıklayın

✅ **Artık veritabanınızı görsel olarak görebilirsiniz!**

---

## 📊 Kullanım İpuçları

### Tabloları Görmek:
- Sol tarafta **"Tables"** sekmesine tıklayın
- Tüm 18 tabloyu göreceksiniz

### Veri Görüntülemek:
- Bir tabloya **çift tıklayın**
- Tüm verileri tablo formatında göreceksiniz

### SQL Yazmak:
- Üst menüden **"New Query"** butonuna tıklayın
- SQL sorgularınızı yazın
- **Cmd + Enter** ile çalıştırın

---

## 🎯 Örnek Sorgular

```sql
-- Faturaları görüntüle
SELECT * FROM bill_supports ORDER BY created_at DESC;

-- Destek işlemlerini görüntüle
SELECT * FROM bill_support_transactions ORDER BY created_at DESC;

-- Kullanıcıları görüntüle
SELECT id, name, email, golbucks FROM users;
```

---

## 💡 Hızlı Erişim

TablePlus kurulduktan sonra:
- **Cmd + Space** → "TablePlus" yazın → Enter
- Veya Applications klasöründen açın

