# Environment Variables

## 📋 Tüm Environment Variables Listesi

### Database Configuration

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `DB_HOST` | PostgreSQL host | ✅ | `localhost` | `localhost` |
| `DB_PORT` | PostgreSQL port | ❌ | `5432` | `5432` |
| `DB_NAME` | Database name | ✅ | - | `sehitkamil_db` |
| `DB_USER` | Database user | ✅ | `postgres` | `postgres` |
| `DB_PASSWORD` | Database password | ✅ | - | `your-password` |

### JWT Configuration

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `JWT_SECRET` | JWT secret key (min 32 chars) | ✅ | - | `your-very-secure-secret-key` |
| `JWT_EXPIRES_IN` | Access token expiration | ❌ | `24h` | `24h`, `7d` |
| `JWT_REFRESH_SECRET` | Refresh token secret (min 32 chars) | ✅ | - | `your-refresh-secret-key` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | ❌ | `7d` | `7d`, `30d` |

### Server Configuration

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `PORT` | Server port | ❌ | `4000` | `4000` |
| `NODE_ENV` | Environment | ❌ | `development` | `production`, `development` |
| `API_URL` | API base URL | ❌ | `http://localhost:4000/api` | `https://api.sehitkamil.bel.tr/api` |

### Redis Configuration (Optional)

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `REDIS_HOST` | Redis host | ❌ | `localhost` | `localhost` |
| `REDIS_PORT` | Redis port | ❌ | `6379` | `6379` |
| `REDIS_PASSWORD` | Redis password | ❌ | - | `your-redis-password` |

### Firebase Configuration (Optional - Push Notifications)

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Firebase service account key (file path or JSON string) | ❌ | - | `/path/to/key.json` veya JSON string |

**Not:** Firebase service account key'i iki şekilde sağlanabilir:
1. **File Path**: `/path/to/serviceAccountKey.json`
2. **JSON String**: `{"type":"service_account","project_id":"..."}`

### File Upload Configuration

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `MAX_FILE_SIZE` | Max file size in bytes | ❌ | `5242880` (5MB) | `10485760` (10MB) |
| `UPLOAD_DIR` | Upload directory | ❌ | `./uploads` | `./uploads` |

## 📝 Örnek .env Dosyası

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sehitkamil_db
DB_USER=postgres
DB_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-very-secure-jwt-secret-key-minimum-32-characters-long
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-very-secure-refresh-secret-key-minimum-32-characters-long
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=4000
NODE_ENV=development
API_URL=http://localhost:4000/api

# Redis (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Firebase (Optional - Push Notifications)
FIREBASE_SERVICE_ACCOUNT_KEY=/path/to/serviceAccountKey.json
# OR as JSON string:
# FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

## 🔒 Güvenlik Notları

1. **JWT Secrets**: En az 32 karakter uzunluğunda, rastgele ve güvenli olmalı
2. **Database Password**: Güçlü bir şifre kullanın
3. **Redis Password**: Production'da mutlaka şifre kullanın
4. **Firebase Key**: Service account key dosyasını güvenli bir yerde saklayın ve dosya izinlerini `600` yapın
5. **Environment Variables**: Production'da `.env` dosyasını git'e commit etmeyin

## 🚀 Production Checklist

- [ ] Tüm required environment variables ayarlanmış
- [ ] JWT secret'lar güçlü ve güvenli
- [ ] Database şifreleri güçlü
- [ ] Redis şifresi ayarlanmış (production)
- [ ] Firebase service account key güvenli bir yerde
- [ ] `NODE_ENV=production` ayarlanmış
- [ ] `API_URL` production URL'i ile ayarlanmış
- [ ] `.env` dosyası git'e commit edilmemiş

