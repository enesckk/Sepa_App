# Node.js 18 Alpine image kullan (daha küçük boyut)
FROM node:18-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# Sistem bağımlılıklarını yükle (gerekirse)
RUN apk add --no-cache \
    python3 \
    make \
    g++

# package.json ve package-lock.json'ı kopyala
# Bu katman cache'lenebilir, sadece package dosyaları değiştiğinde yeniden çalışır
COPY package*.json ./

# Production bağımlılıklarını yükle
# npm ci kullanarak daha hızlı ve güvenilir kurulum
RUN npm ci --only=production && npm cache clean --force

# Tüm kaynak kodunu kopyala
COPY . .

# Development bağımlılıklarını yükle (dev ortamı için)
# Bu satır production'da kullanılmayacak, docker-compose override ile kontrol edilebilir
RUN npm install --only=development || true

# .env dosyası için destek (opsiyonel, production'da environment variables kullanılmalı)
# COPY .env .env

# Port'u expose et
EXPOSE 4000

# Health check ekle
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Non-root user oluştur ve kullan (güvenlik için)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Varsayılan olarak production modunda çalıştır
# Development için docker-compose override kullanılabilir
CMD ["npm", "start"]

