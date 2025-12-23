# Şehitkamil Belediyesi Backend API

Node.js, Express.js ve PostgreSQL kullanılarak geliştirilmiş RESTful API.

## Özellikler

- ✅ JWT Authentication & Authorization
- ✅ Role-based Access Control (User, Admin, Super Admin)
- ✅ Günlük Ödül & Gölbucks Sistemi
- ✅ Etkinlik Yönetimi
- ✅ Story Modülü (Instagram-like)
- ✅ Haberler & Duyurular
- ✅ Anketler Modülü
- ✅ Başvurular Modülü
- ✅ Askıda Fatura
- ✅ Şehir Rehberi
- ✅ Afet Toplanma Alanları
- ✅ Bildirimler Sistemi (In-app + Push Notifications)
- ✅ Push Notifications (Firebase Cloud Messaging)
- ✅ Redis Cache
- ✅ File Upload (Multer)
- ✅ Admin Panel API'leri
- ✅ Swagger API Dokümantasyonu
- ✅ Comprehensive Testing

## Teknolojiler

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Cache**: Redis
- **Authentication**: JWT
- **File Upload**: Multer
- **Testing**: Jest, Supertest
- **Validation**: express-validator
- **Push Notifications**: Firebase Admin SDK
- **API Docs**: Swagger/OpenAPI

## Kurulum

### Gereksinimler

- Node.js (v18+)
- PostgreSQL (v14+)
- Redis (v6+) (optional, cache için)

### Adımlar

1. **Repository'yi klonlayın:**
```bash
git clone <repository-url>
cd backend
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Environment değişkenlerini ayarlayın:**
`.env` dosyası oluşturun:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sehitkamil_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Firebase (optional, for push notifications)
FIREBASE_SERVICE_ACCOUNT_KEY=path/to/serviceAccountKey.json
# OR as JSON string:
# FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

4. **Veritabanını oluşturun:**
```bash
# PostgreSQL'de veritabanı oluştur
createdb sehitkamil_db

# Veya psql ile:
psql -U postgres
CREATE DATABASE sehitkamil_db;
```

5. **Veritabanı tablolarını oluşturun:**
```bash
psql -U postgres -d sehitkamil_db -f db/init.sql
```

6. **Sunucuyu başlatın:**
```bash
# Development
npm run dev

# Production
npm start
```

## API Dokümantasyonu

### Swagger UI
API dokümantasyonunu görüntülemek için:
- Development: http://localhost:4000/api-docs
- Production: https://api.sehitkamil.bel.tr/api-docs

### Postman Collection
Postman collection dosyası: `docs/postman/collection.json`

Detaylı dokümantasyon için: [docs/README.md](./docs/README.md)

## Proje Yapısı

```
backend/
├── src/
│   ├── config/          # Konfigürasyon dosyaları
│   │   ├── database.js   # Sequelize config
│   │   ├── redis.js      # Redis config
│   │   ├── jwt.js        # JWT config
│   │   └── multer.js     # File upload config
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Express middleware
│   │   ├── auth.js      # Authentication
│   │   ├── adminAuth.js # Admin authorization
│   │   ├── cacheMiddleware.js # Cache middleware
│   │   └── errorHandler.js   # Error handling
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   │   ├── jwt.js       # JWT utilities
│   │   ├── errors.js    # Custom errors
│   │   └── distance.js # Distance calculations
│   └── __tests__/       # Tests
│       ├── integration/ # Integration tests
│       └── services/    # Service tests
├── db/
│   └── init.sql         # Database schema
├── uploads/              # Uploaded files
├── .env                  # Environment variables
├── jest.config.js       # Jest configuration
├── package.json
└── README.md
```

## API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/events` - Etkinlik listesi
- `GET /api/stories` - Story listesi
- `GET /api/news` - Haber listesi
- `GET /api/places` - Yer listesi
- `GET /api/surveys` - Anket listesi
- `GET /api/rewards` - Ödül listesi

### Protected Endpoints
Tüm kullanıcı endpoint'leri JWT token gerektirir:
- `GET /api/users/profile` - Kullanıcı profili
- `POST /api/events/:id/register` - Etkinlik kaydı
- `POST /api/surveys/:id/submit` - Anket gönderimi
- `GET /api/notifications` - Bildirimler

### Admin Endpoints
Admin yetkisi gerektirir:
- `GET /api/admin/dashboard-stats` - Dashboard istatistikleri
- `POST /api/admin/events` - Etkinlik oluştur
- `POST /api/admin/stories` - Story oluştur
- `GET /api/admin/users` - Kullanıcı listesi

## Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Coverage
```bash
npm run test:coverage
```

## Database Migrations

Sequelize `alter: true` modunda çalışır (development). Production'da migration dosyaları kullanılmalıdır.

## Cache Strategy

Redis cache aşağıdaki veriler için kullanılır:
- Event listesi
- Story listesi
- News listesi
- Place listesi
- Survey listesi
- Dashboard stats

Cache TTL: 1 saat (varsayılan)

## File Uploads

- **Max file size**: 5MB
- **Allowed types**: JPEG, PNG, GIF, WebP
- **Storage**: `./uploads/` klasörü altında kategorize edilir

## Error Handling

Tüm hatalar merkezi error handler middleware tarafından yönetilir:
- `ValidationError` - 400
- `UnauthorizedError` - 401
- `ForbiddenError` - 403
- `NotFoundError` - 404
- `AppError` - 500

## Security

- JWT token authentication
- Password hashing (bcrypt)
- Input validation (express-validator)
- SQL injection protection (Sequelize)
- File upload validation
- Rate limiting (planned)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | - |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | Token expiration | 24h |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |

## Development

### Code Style
- ESLint kullanılır
- Prettier formatı (optional)

### Git Workflow
- Feature branches
- Commit messages: `feat:`, `fix:`, `docs:`, `test:`

## Production Deployment

Detaylı deployment rehberi için: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

Kısa özet:
1. Environment variables'ı production değerleriyle ayarlayın
2. `NODE_ENV=production` olarak ayarlayın
3. Database migration'ları çalıştırın
4. Redis'i yapılandırın
5. Firebase service account key'i ayarlayın (push notifications için)
6. PM2 veya benzeri process manager kullanın

## License

Proprietary - Şehitkamil Belediyesi

## Support

Sorularınız için: support@sehitkamil.bel.tr

