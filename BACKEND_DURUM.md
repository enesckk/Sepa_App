# Backend Durumu

## ⚠️ Mevcut Durum

Backend başlatılamadı - **model association sorunları** var.

## 🔧 Sorun

Model dosyalarında circular dependency sorunları var. Association'lar modeller yüklenmeden önce çağrılıyor.

## ✅ Çözüm

Backend'i başlatmak için:

1. **Tüm model association'larını `models/index.js`'e taşıyın**
2. **Veya backend'i başlatmadan tabloları manuel oluşturun**

## 🚀 Hızlı Çözüm (Tabloları Manuel Oluştur)

```bash
cd backend
node -e "const {sequelize} = require('./src/config/database'); sequelize.sync({alter: true}).then(() => { console.log('✅ Tablolar oluşturuldu!'); process.exit(0); });"
```

## 📊 Veritabanını Görüntüleme

Tablolar oluşturulduktan sonra:

```bash
./view-db.sh
```

veya

```bash
PGPASSWORD=secret psql -h localhost -p 5432 -U admin -d superapp
```

