# Docker Kurulum ve Kullanım Kılavuzu

## 📦 Dockerfile'lar

### Production Dockerfile
- **Dosya**: `Dockerfile`
- **Base Image**: `node:18-alpine` (küçük boyut)
- **Port**: 4000
- **Command**: `npm start`

### Development Dockerfile
- **Dosya**: `Dockerfile.dev`
- **Base Image**: `node:18-alpine`
- **Port**: 4000
- **Command**: `npm run dev` (hot reload)

## 🚀 Kullanım

### Production Build

```bash
# Dockerfile ile build
docker build -t sehitkamil-api:latest ./backend

# Container çalıştır
docker run -d \
  --name epa_api \
  -p 4000:4000 \
  -e NODE_ENV=production \
  -e DB_HOST=postgres \
  -e DB_PORT=5432 \
  -e DB_NAME=epa_db \
  -e DB_USER=epa_user \
  -e DB_PASSWORD=epa_password \
  -e REDIS_HOST=redis \
  -e REDIS_PORT=6379 \
  sehitkamil-api:latest
```

### Development Build

```bash
# Dockerfile.dev ile build
docker build -f ./backend/Dockerfile.dev -t sehitkamil-api:dev ./backend

# Container çalıştır (hot reload ile)
docker run -d \
  --name epa_api_dev \
  -p 4000:4000 \
  -v $(pwd)/backend:/app \
  -v /app/node_modules \
  -e NODE_ENV=development \
  sehitkamil-api:dev
```

### Docker Compose ile Çalıştırma

#### Production
```bash
docker-compose up -d
```

#### Development
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## 🔧 Environment Variables

`.env` dosyası oluşturun veya environment variables kullanın:

```env
NODE_ENV=production
PORT=4000
DB_HOST=postgres
DB_PORT=5432
DB_NAME=epa_db
DB_USER=epa_user
DB_PASSWORD=epa_password
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your_secret_key_here
```

## 📋 Health Check

Container sağlık kontrolü:
```bash
docker ps
# HEALTHY durumunu kontrol edin

# Manuel health check
curl http://localhost:4000/health
```

## 🐛 Debug

### Logları görüntüle
```bash
docker logs epa_api
docker logs -f epa_api  # Follow mode
```

### Container'a bağlan
```bash
docker exec -it epa_api sh
```

### Container'ı durdur
```bash
docker stop epa_api
docker rm epa_api
```

## 🔒 Güvenlik Notları

- Production'da `.env` dosyasını Docker image'e kopyalamayın
- Environment variables kullanın
- Non-root user (nodejs) ile çalışır
- Health check aktif
- Helmet middleware güvenlik başlıkları ekler

## 📊 Multi-stage Build (Opsiyonel)

Daha optimize bir build için multi-stage kullanılabilir:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

