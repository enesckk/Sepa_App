# Deployment Guide

## 🚀 Production Deployment Rehberi

### Ön Gereksinimler

- Node.js v18+ yüklü olmalı
- PostgreSQL v14+ yüklü ve çalışıyor olmalı
- Redis v6+ yüklü ve çalışıyor olmalı (opsiyonel ama önerilir)
- Firebase service account key (push notifications için)
- SSL sertifikası (HTTPS için)

### 1. Environment Variables Ayarlama

`.env` dosyasını production değerleriyle oluşturun:

```env
# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=sehitkamil_db
DB_USER=your-db-user
DB_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-very-secure-jwt-secret-key-min-32-chars
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-very-secure-refresh-secret-key-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=4000
NODE_ENV=production
API_URL=https://api.sehitkamil.bel.tr

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Firebase (Push Notifications)
FIREBASE_SERVICE_ACCOUNT_KEY=/path/to/serviceAccountKey.json
# OR as JSON string (base64 encoded recommended)
# FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

### 2. Database Setup

#### 2.1 Veritabanı Oluşturma

```bash
psql -U postgres
CREATE DATABASE sehitkamil_db;
\q
```

#### 2.2 Schema Oluşturma

```bash
psql -U postgres -d sehitkamil_db -f db/init.sql
```

#### 2.3 Migration (Eğer varsa)

```bash
npm run migrate
```

### 3. Redis Setup

#### 3.1 Redis Kurulumu

```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS
brew install redis
```

#### 3.2 Redis Yapılandırması

`/etc/redis/redis.conf` dosyasını düzenleyin:
- `bind 127.0.0.1` (sadece localhost)
- `requirepass your-redis-password` (şifre ekleyin)
- `maxmemory 256mb` (memory limit)
- `maxmemory-policy allkeys-lru` (eviction policy)

#### 3.3 Redis Servisini Başlatma

```bash
sudo systemctl start redis
sudo systemctl enable redis
```

### 4. Firebase Setup (Push Notifications)

#### 4.1 Firebase Console'dan Service Account Key İndirme

1. Firebase Console'a gidin: https://console.firebase.google.com
2. Projenizi seçin
3. Project Settings > Service Accounts
4. "Generate new private key" butonuna tıklayın
5. JSON dosyasını indirin

#### 4.2 Service Account Key'i Yerleştirme

```bash
# Güvenli bir yere kopyalayın
cp ~/Downloads/serviceAccountKey.json /opt/sehitkamil-api/config/

# Dosya izinlerini ayarlayın
chmod 600 /opt/sehitkamil-api/config/serviceAccountKey.json
```

#### 4.3 Environment Variable'ı Ayarlama

`.env` dosyasında:
```env
FIREBASE_SERVICE_ACCOUNT_KEY=/opt/sehitkamil-api/config/serviceAccountKey.json
```

### 5. Application Setup

#### 5.1 Kod İndirme

```bash
cd /opt/sehitkamil-api
git clone <repository-url> .
```

#### 5.2 Bağımlılıkları Yükleme

```bash
npm install --production
```

#### 5.3 Uploads Klasörü Oluşturma

```bash
mkdir -p uploads/events uploads/stories uploads/news uploads/rewards uploads/applications
chmod 755 uploads
```

### 6. Process Manager (PM2)

#### 6.1 PM2 Kurulumu

```bash
npm install -g pm2
```

#### 6.2 PM2 Ecosystem Dosyası

`ecosystem.config.js` oluşturun:

```javascript
module.exports = {
  apps: [{
    name: 'sehitkamil-api',
    script: './src/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
};
```

#### 6.3 PM2 ile Başlatma

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 7. Nginx Reverse Proxy

#### 7.1 Nginx Kurulumu

```bash
sudo apt-get install nginx
```

#### 7.2 Nginx Yapılandırması

`/etc/nginx/sites-available/sehitkamil-api`:

```nginx
server {
    listen 80;
    server_name api.sehitkamil.bel.tr;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.sehitkamil.bel.tr;

    ssl_certificate /etc/letsencrypt/live/api.sehitkamil.bel.tr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.sehitkamil.bel.tr/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # File upload size
    client_max_body_size 10M;

    # Proxy to Node.js
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /uploads {
        alias /opt/sehitkamil-api/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 7.3 Nginx'i Aktif Etme

```bash
sudo ln -s /etc/nginx/sites-available/sehitkamil-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. SSL Sertifikası (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.sehitkamil.bel.tr
```

### 9. Monitoring ve Logging

#### 9.1 PM2 Monitoring

```bash
pm2 monit
```

#### 9.2 Log Rotation

`/etc/logrotate.d/sehitkamil-api`:

```
/opt/sehitkamil-api/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 root root
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 10. Backup Strategy

#### 10.1 Database Backup

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U postgres sehitkamil_db > /backups/db_$DATE.sql
find /backups -name "db_*.sql" -mtime +30 -delete
```

#### 10.2 Uploads Backup

```bash
# Daily backup script
tar -czf /backups/uploads_$(date +%Y%m%d).tar.gz /opt/sehitkamil-api/uploads
find /backups -name "uploads_*.tar.gz" -mtime +30 -delete
```

### 11. Health Checks

#### 11.1 Health Check Endpoint

```bash
curl https://api.sehitkamil.bel.tr/health
```

#### 11.2 Monitoring Script

```bash
#!/bin/bash
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://api.sehitkamil.bel.tr/health)
if [ $RESPONSE != "200" ]; then
    # Alert notification
    pm2 restart sehitkamil-api
fi
```

### 12. Security Checklist

- [ ] Environment variables güvenli şekilde saklanıyor
- [ ] Database şifreleri güçlü
- [ ] JWT secret'lar güçlü ve güvenli
- [ ] Redis şifre korumalı
- [ ] Firebase service account key güvenli
- [ ] SSL sertifikası geçerli
- [ ] File upload limitleri ayarlanmış
- [ ] CORS ayarları production için yapılandırılmış
- [ ] Rate limiting aktif (opsiyonel)
- [ ] Firewall kuralları ayarlanmış

### 13. Troubleshooting

#### Database Connection Issues

```bash
# Test connection
psql -U postgres -d sehitkamil_db -c "SELECT 1;"
```

#### Redis Connection Issues

```bash
# Test connection
redis-cli -h localhost -p 6379 -a your-password ping
```

#### Firebase Issues

```bash
# Check service account key
cat $FIREBASE_SERVICE_ACCOUNT_KEY | jq .project_id
```

#### PM2 Issues

```bash
# Check logs
pm2 logs sehitkamil-api

# Restart
pm2 restart sehitkamil-api

# Check status
pm2 status
```

### 14. Rollback Plan

1. PM2'de önceki versiyonu başlat
2. Database migration'ı geri al (eğer varsa)
3. Nginx'i reload et

### 15. Post-Deployment Checklist

- [ ] Health check endpoint çalışıyor
- [ ] API endpoint'leri erişilebilir
- [ ] Database bağlantısı çalışıyor
- [ ] Redis cache çalışıyor
- [ ] Push notifications çalışıyor
- [ ] File upload çalışıyor
- [ ] SSL sertifikası geçerli
- [ ] Loglar yazılıyor
- [ ] Monitoring aktif

## 📞 Support

Sorunlar için: support@sehitkamil.bel.tr

