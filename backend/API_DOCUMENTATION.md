# Şehitkamil Belediyesi API Dokümantasyonu

## Genel Bilgiler

- **Base URL**: `http://localhost:3000/api`
- **Version**: 1.0.0
- **Authentication**: JWT Bearer Token

## Authentication

Tüm protected endpoint'ler için `Authorization` header'ında Bearer token gönderilmelidir:

```
Authorization: Bearer <access_token>
```

---

## Endpoints

### Authentication

#### POST /api/auth/register
Kullanıcı kaydı

**Request Body:**
```json
{
  "name": "Kullanıcı Adı",
  "email": "user@example.com",
  "password": "password123",
  "phone": "5551234567",
  "mahalle": "Mahalle Adı"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Kullanıcı Adı",
      "email": "user@example.com"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### POST /api/auth/login
Kullanıcı girişi

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### GET /api/auth/me
Mevcut kullanıcı bilgileri (Protected)

---

### Users

#### GET /api/users/profile
Kullanıcı profili (Protected)

#### PUT /api/users/profile
Profil güncelleme (Protected)

**Request Body:**
```json
{
  "name": "Yeni Ad",
  "phone": "5551234567",
  "mahalle": "Yeni Mahalle"
}
```

#### GET /api/users/golbucks
Gölbucks bakiyesi (Protected)

#### GET /api/users/golbucks/history
Gölbucks işlem geçmişi (Protected)

**Query Parameters:**
- `limit` (default: 50)
- `offset` (default: 0)
- `type` (optional)

---

### Events

#### GET /api/events
Etkinlik listesi

**Query Parameters:**
- `category` (optional): kultur, spor, egitim, sosyal, diger
- `search` (optional)
- `limit` (default: 50)
- `offset` (default: 0)
- `sort` (default: date)
- `order` (ASC/DESC)

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [...],
    "total": 100,
    "limit": 50,
    "offset": 0
  }
}
```

#### GET /api/events/:id
Etkinlik detayı

#### POST /api/events/:id/register
Etkinliğe kayıt (Protected)

**Response:**
```json
{
  "success": true,
  "message": "Successfully registered for event",
  "data": {
    "registration": { ... },
    "qrCode": "base64_qr_code"
  }
}
```

#### DELETE /api/events/:id/register
Etkinlik kaydını iptal et (Protected)

#### GET /api/events/my-registrations
Kullanıcının kayıt olduğu etkinlikler (Protected)

---

### Stories

#### GET /api/stories
Aktif story listesi

#### GET /api/stories/:id
Story detayı

#### POST /api/stories/:id/view
Story görüntüleme kaydı (Protected)

---

### News

#### GET /api/news
Haber listesi

**Query Parameters:**
- `category` (optional): haber, duyuru, etkinlik, proje, basin, other
- `search` (optional)
- `limit`, `offset`, `sort`, `order`

#### GET /api/news/categories
Haber kategorileri ve sayıları

#### GET /api/news/:id
Haber detayı

---

### Surveys

#### GET /api/surveys
Aktif anket listesi

#### GET /api/surveys/:id
Anket detayı

#### POST /api/surveys/:id/submit
Anket cevaplarını gönder (Protected)

**Request Body:**
```json
{
  "answers": [
    {
      "question_id": "uuid",
      "answer_text": "Cevap metni",
      "answer_options": ["option1", "option2"]
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Survey submitted successfully",
  "data": {
    "golbucksReward": 50
  }
}
```

#### GET /api/surveys/:id/my-answers
Kullanıcının anket cevapları (Protected)

---

### Rewards

#### GET /api/rewards
Ödül listesi

#### GET /api/rewards/:id
Ödül detayı

#### POST /api/rewards/:id/redeem
Ödülü kullan (Protected)

#### GET /api/rewards/my
Kullanıcının ödülleri (Protected)

#### PUT /api/rewards/my/:id/use
Ödülü kullan (Protected)

---

### Daily Rewards

#### GET /api/rewards/daily/status
Günlük ödül durumu (Protected)

**Response:**
```json
{
  "success": true,
  "data": {
    "canClaim": true,
    "currentStreak": 5,
    "longestStreak": 7,
    "totalRewards": 10
  }
}
```

#### POST /api/rewards/daily
Günlük ödülü al (Protected)

**Response:**
```json
{
  "success": true,
  "data": {
    "rewarded": true,
    "points": 10,
    "streak": 6,
    "bonus": false
  }
}
```

---

### Applications

#### POST /api/applications
Başvuru oluştur (Protected)

**Request Body:**
```json
{
  "type": "complaint",
  "subject": "Başvuru Konusu",
  "description": "Detaylı açıklama",
  "location": {
    "latitude": 37.0662,
    "longitude": 37.3833
  },
  "images": ["base64_image1", "base64_image2"]
}
```

**Types:** complaint, request, marriage, muhtar_message, other

#### GET /api/applications
Kullanıcının başvuruları (Protected)

#### GET /api/applications/:id
Başvuru detayı (Protected)

---

### Bill Support (Askıda Fatura)

#### POST /api/bill-supports
Askıda fatura başvurusu (Protected)

**Request Body:**
```json
{
  "bill_type": "electricity",
  "amount": 500.00,
  "description": "Açıklama",
  "bill_image": "base64_image"
}
```

**Bill Types:** electricity, water, gas, internet, other

#### GET /api/bill-supports
Kullanıcının askıda fatura başvuruları (Protected)

#### GET /api/bill-supports/:id
Askıda fatura detayı (Protected)

---

### Places (Şehir Rehberi)

#### GET /api/places
Yer listesi

**Query Parameters:**
- `type` (optional): mosque, park, hospital, school, restaurant, etc.
- `search` (optional)
- `latitude`, `longitude` (optional, for distance calculation)
- `radius` (optional, in km)

#### GET /api/places/nearby
Yakındaki yerler

**Query Parameters:**
- `latitude` (required)
- `longitude` (required)
- `radius` (default: 10 km)
- `type` (optional)

#### GET /api/places/categories
Yer kategorileri

#### GET /api/places/:id
Yer detayı

---

### Emergency Gathering Areas

#### GET /api/emergency-gathering
Afet toplanma alanları

**Query Parameters:**
- `type` (optional): open_area, building, stadium, park, school, other
- `search` (optional)
- `latitude`, `longitude` (optional)
- `radius` (optional, in km)

#### GET /api/emergency-gathering/nearby
Yakındaki toplanma alanları

**Query Parameters:**
- `latitude` (required)
- `longitude` (required)
- `radius` (default: 10 km)

#### GET /api/emergency-gathering/:id
Toplanma alanı detayı

---

### Notifications

#### GET /api/notifications
Kullanıcı bildirimleri (Protected)

**Query Parameters:**
- `is_read` (optional): true/false
- `type` (optional)
- `limit`, `offset`, `sort`, `order`

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [...],
    "total": 50,
    "unreadCount": 10,
    "limit": 50,
    "offset": 0
  }
}
```

#### PUT /api/notifications/:id/read
Bildirimi okundu işaretle (Protected)

#### PUT /api/notifications/read-all
Tüm bildirimleri okundu işaretle (Protected)

#### DELETE /api/notifications/:id
Bildirimi sil (Protected)

#### DELETE /api/notifications/read-all
Okunmuş bildirimleri sil (Protected)

---

## Admin Endpoints

Tüm admin endpoint'leri `/api/admin/*` altında toplanmıştır ve admin yetkisi gerektirir.

### Dashboard

#### GET /api/admin/dashboard-stats
Dashboard istatistikleri (Admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1000,
      "active": 950,
      "newToday": 10,
      "newThisWeek": 50,
      "newThisMonth": 200
    },
    "events": { ... },
    "applications": { ... },
    "surveys": { ... },
    "golbucks": { ... }
  }
}
```

### Users Management

#### GET /api/admin/users
Kullanıcı listesi (Admin)

#### PUT /api/admin/users/:id
Kullanıcı güncelle (Admin)

#### DELETE /api/admin/users/:id
Kullanıcı sil (Admin)

### Events Management

#### POST /api/admin/events
Etkinlik oluştur (Admin)

#### PUT /api/admin/events/:id
Etkinlik güncelle (Admin)

#### DELETE /api/admin/events/:id
Etkinlik sil (Admin)

#### GET /api/admin/events/:id/registrations
Etkinlik kayıtları (Admin)

### Stories Management

#### POST /api/admin/stories
Story oluştur (Admin)

#### PUT /api/admin/stories/:id
Story güncelle (Admin)

#### DELETE /api/admin/stories/:id
Story sil (Admin)

### News Management

#### POST /api/admin/news
Haber oluştur (Admin)

#### PUT /api/admin/news/:id
Haber güncelle (Admin)

#### DELETE /api/admin/news/:id
Haber sil (Admin)

### Applications Management

#### GET /api/admin/applications
Başvuru listesi (Admin)

#### PUT /api/admin/applications/:id/status
Başvuru durumu güncelle (Admin)

**Request Body:**
```json
{
  "status": "resolved",
  "admin_response": "Çözüldü"
}
```

### Surveys Management

#### POST /api/admin/surveys
Anket oluştur (Admin)

#### PUT /api/admin/surveys/:id
Anket güncelle (Admin)

#### DELETE /api/admin/surveys/:id
Anket sil (Admin)

#### POST /api/admin/surveys/:id/questions
Ankete soru ekle (Admin)

#### PUT /api/admin/questions/:id
Soru güncelle (Admin)

#### DELETE /api/admin/questions/:id
Soru sil (Admin)

### Rewards Management

#### POST /api/admin/rewards
Ödül oluştur (Admin)

#### PUT /api/admin/rewards/:id
Ödül güncelle (Admin)

#### DELETE /api/admin/rewards/:id
Ödül sil (Admin)

### Bill Supports Management

#### GET /api/admin/bill-supports
Askıda fatura listesi (Admin)

#### PUT /api/admin/bill-supports/:id/status
Askıda fatura durumu güncelle (Admin)

---

## Error Responses

Tüm hatalar aşağıdaki formatta döner:

```json
{
  "success": false,
  "error": "ErrorType",
  "message": "Error message"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation Error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

API rate limiting uygulanmaktadır:
- **Public endpoints**: 100 requests/minute
- **Authenticated endpoints**: 200 requests/minute
- **Admin endpoints**: 500 requests/minute

---

## Pagination

Liste endpoint'leri pagination destekler:

**Query Parameters:**
- `limit` - Sayfa başına kayıt sayısı (default: 50, max: 100)
- `offset` - Atlanacak kayıt sayısı (default: 0)

**Response:**
```json
{
  "data": [...],
  "total": 1000,
  "limit": 50,
  "offset": 0
}
```

---

## File Uploads

Resim yükleme için `multipart/form-data` formatı kullanılır:

- **Max file size**: 5MB
- **Allowed types**: JPEG, PNG, GIF, WebP
- **Field name**: `image` (veya endpoint'e göre değişebilir)

---

## Cache

Bazı endpoint'ler Redis cache kullanır:
- Cache TTL: 1 saat (varsayılan)
- Cache invalidation: Otomatik (veri güncellendiğinde)

---

## WebSocket (Future)

Gerçek zamanlı bildirimler için WebSocket desteği planlanmaktadır.

---

## Support

Sorularınız için: support@sehitkamil.bel.tr

