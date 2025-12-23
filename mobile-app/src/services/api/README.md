# API Services Documentation

## Overview

Bu klasör, mobil uygulamanın backend API'si ile iletişimini sağlayan servis katmanını içerir.

## Yapı

```
src/services/api/
├── index.ts           # Ana export dosyası
├── config.ts          # API yapılandırması (base URL, endpoints)
├── types.ts           # TypeScript type tanımları
├── client.ts          # Axios instance ve interceptors
├── tokenManager.ts    # JWT token yönetimi
└── README.md          # Bu dosya
```

## Kullanım

### Temel API İstekleri

```typescript
import { apiClient } from '@/services/api';

// GET request
const events = await apiClient.get('/events');

// POST request
const newEvent = await apiClient.post('/events', {
  title: 'Yeni Etkinlik',
  date: '2024-12-20',
});

// PUT request
const updatedEvent = await apiClient.put(`/events/${id}`, {
  title: 'Güncellenmiş Etkinlik',
});

// DELETE request
await apiClient.delete(`/events/${id}`);

// File upload
const formData = new FormData();
formData.append('image', {
  uri: imageUri,
  type: 'image/jpeg',
  name: 'photo.jpg',
});
const result = await apiClient.upload('/events', formData, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});
```

### Error Handling

```typescript
import { apiClient, parseApiError, getErrorMessage } from '@/services/api';

try {
  const data = await apiClient.get('/events');
} catch (error) {
  const apiError = parseApiError(error);
  const userMessage = getErrorMessage(error);
  console.error('API Error:', userMessage);
}
```

### Token Management

```typescript
import { tokenManager } from '@/services/api';

// Check if user is authenticated
if (tokenManager.isAuthenticated()) {
  // User is logged in
}

// Check if token is expired
if (tokenManager.isTokenExpired()) {
  // Token needs refresh
}

// Get access token
const token = tokenManager.getAccessToken();

// Clear tokens (logout)
await tokenManager.clearTokens();
```

### API Endpoints

```typescript
import { API_ENDPOINTS, getApiUrl } from '@/services/api';

// Use predefined endpoints
const eventsUrl = getApiUrl(API_ENDPOINTS.EVENTS.LIST);
const eventDetailUrl = getApiUrl(API_ENDPOINTS.EVENTS.DETAIL('123'));

// Make request
const events = await apiClient.get(API_ENDPOINTS.EVENTS.LIST);
```

## Özellikler

### ✅ Otomatik Token Yönetimi
- Access token otomatik olarak request header'larına eklenir
- Token expire olduğunda otomatik refresh
- Refresh token ile otomatik yenileme

### ✅ Error Handling
- Network hataları için kullanıcı dostu mesajlar
- Validation hataları için detaylı bilgi
- Timeout hataları için özel handling

### ✅ Request/Response Interceptors
- Tüm request'lere otomatik token ekleme
- 401 hatalarında otomatik token refresh
- Development modunda request/response logging

### ✅ Type Safety
- Tüm API response'ları için TypeScript type'ları
- Request/Response interface'leri
- Type-safe API calls

## Yapılandırma

API base URL'i `src/services/api/config.ts` dosyasında yapılandırılır:

```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000/api'
    : 'https://api.sehitkamil.bel.tr/api',
  TIMEOUT: 30000,
  // ...
};
```

Production için environment variable kullanılabilir:

```typescript
BASE_URL: Constants.expoConfig?.extra?.apiUrl || 'https://api.sehitkamil.bel.tr/api'
```

## Storage

Token'lar AsyncStorage'da güvenli şekilde saklanır:
- `@auth_access_token` - Access token
- `@auth_refresh_token` - Refresh token

Storage utilities `src/utils/storage.ts` dosyasında tanımlıdır.

