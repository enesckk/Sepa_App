# 🚀 Sistem Başlatma Kılavuzu

## Tek Komutla Tüm Sistemi Başlatma

Tüm sistemi (PostgreSQL, Backend) tek komutla başlatmak için:

```bash
./start-all.sh
```

veya

```bash
npm start
```

## Ne Yapar?

1. ✅ **PostgreSQL Kontrolü**: PostgreSQL'in çalışıp çalışmadığını kontrol eder
2. ✅ **Backend Başlatma**: Backend'i port 4000'de başlatır
3. ✅ **Frontend Hazırlık**: Frontend dizinini kontrol eder

## Sistemi Durdurma

```bash
./stop-all.sh
```

veya

```bash
npm stop
```

## Expo'yu Başlatma

Backend başladıktan sonra, Expo'yu başlatmak için:

```bash
cd mobile-app && npx expo start
```

## Sistem Durumu

Script çalıştıktan sonra:

- ✅ **PostgreSQL**: `localhost:5432`
- ✅ **Backend**: `http://localhost:4000`
- ✅ **API Docs**: `http://localhost:4000/api-docs`
- ✅ **Health Check**: `http://localhost:4000/api/health`

## Loglar

Backend loglarını görmek için:

```bash
tail -f logs/backend.log
```

## Sorun Giderme

### Backend başlamıyorsa:

1. Port 4000'in boş olduğundan emin olun:
   ```bash
   lsof -ti:4000 | xargs kill -9
   ```

2. Backend loglarını kontrol edin:
   ```bash
   tail -f logs/backend.log
   ```

### PostgreSQL çalışmıyorsa:

Docker kullanıyorsanız:
```bash
docker-compose up -d db
```

Manuel olarak başlatmanız gerekebilir.

