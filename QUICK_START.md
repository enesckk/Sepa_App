# ⚡ Hızlı Başlangıç Rehberi

## 🎯 5 Dakikada Başlatma

### 1. Paketleri Yükle (3 dk)

```bash
# Backend
cd backend && npm install

# Mobile App  
cd ../mobile-app && npm install

# Admin
cd ../admin && npm install
```

### 2. Environment Variables (1 dk)

```bash
# Backend
cd backend
cp .env.example .env
# .env dosyasını düzenleyin (en azından DB ve JWT secret'ları)

# Admin
cd ../admin
cp .env.example .env.local
# .env.local dosyasını düzenleyin
```

### 3. Database Başlat (1 dk)

```bash
# Docker ile (en kolay)
docker-compose up -d db

# VEYA Manuel PostgreSQL
createdb sehitkamil_db
psql -U postgres -d sehitkamil_db -f backend/db/init.sql
```

### 4. Servisleri Başlat

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Mobile App
cd mobile-app
npm start

# Terminal 3: Admin
cd admin
npm run dev
```

## ✅ Kontrol

- Backend: http://localhost:4000/health
- API Docs: http://localhost:4000/api-docs
- Admin: http://localhost:3000

## 📚 Detaylı Rehber

Tam kurulum için: [SETUP_GUIDE.md](./SETUP_GUIDE.md)

