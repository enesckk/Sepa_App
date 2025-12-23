# Authentication Service Documentation

## Overview

Authentication service handles all authentication-related API calls including user registration, login, logout, token refresh, and getting current user information.

## Functions

### `register(data: RegisterRequest): Promise<AuthResponse>`

Register a new user account.

**Parameters:**
- `data`: Registration data
  - `name`: string (required)
  - `email`: string (required)
  - `password`: string (required)
  - `phone`: string (optional)
  - `mahalle`: string (optional)

**Returns:**
- `AuthResponse` with user data and tokens

**Example:**
```typescript
import { register } from '@/services/api';

try {
  const response = await register({
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    password: 'password123',
    phone: '5551234567',
    mahalle: 'Merkez Mahallesi',
  });
  
  console.log('User registered:', response.user);
  console.log('Tokens stored automatically');
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

**Throws:**
- `ApiError` if registration fails (e.g., email already exists, validation errors)

---

### `login(data: LoginRequest): Promise<AuthResponse>`

Login with email and password.

**Parameters:**
- `data`: Login credentials
  - `email`: string (required)
  - `password`: string (required)

**Returns:**
- `AuthResponse` with user data and tokens

**Example:**
```typescript
import { login } from '@/services/api';

try {
  const response = await login({
    email: 'ahmet@example.com',
    password: 'password123',
  });
  
  console.log('User logged in:', response.user);
  console.log('Tokens stored automatically');
} catch (error) {
  console.error('Login failed:', error.message);
}
```

**Throws:**
- `ApiError` if login fails (e.g., invalid credentials, inactive account)

---

### `logout(): Promise<void>`

Logout user by clearing tokens from storage and memory.

**Note:** Backend doesn't have a logout endpoint, so this only clears client-side tokens.

**Example:**
```typescript
import { logout } from '@/services/api';

await logout();
console.log('User logged out');
```

**Throws:**
- Never throws (errors are logged but don't prevent logout)

---

### `refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }>`

Refresh the access token using a refresh token.

**Parameters:**
- `refreshToken`: string (required)

**Returns:**
- Object with new `accessToken`

**Example:**
```typescript
import { refreshAccessToken, tokenManager } from '@/services/api';

const refreshToken = tokenManager.getRefreshToken();
if (refreshToken) {
  try {
    const response = await refreshAccessToken(refreshToken);
    console.log('Token refreshed:', response.accessToken);
  } catch (error) {
    console.error('Token refresh failed:', error.message);
    // User needs to login again
  }
}
```

**Throws:**
- `ApiError` if refresh fails (e.g., invalid/expired refresh token)
- Automatically clears tokens if refresh fails

---

### `getCurrentUser(): Promise<User>`

Get current authenticated user's profile.

**Returns:**
- `User` object with user data

**Example:**
```typescript
import { getCurrentUser } from '@/services/api';

try {
  const user = await getCurrentUser();
  console.log('Current user:', user);
} catch (error) {
  console.error('Failed to get user:', error.message);
}
```

**Throws:**
- `ApiError` if request fails or user is not authenticated

---

### `isAuthenticated(): boolean`

Check if user is currently authenticated (has valid tokens).

**Returns:**
- `boolean` - true if user has valid tokens

**Example:**
```typescript
import { isAuthenticated } from '@/services/api';

if (isAuthenticated()) {
  console.log('User is logged in');
} else {
  console.log('User is not logged in');
}
```

---

### `getAuthErrorMessage(error: any): string`

Get user-friendly error message in Turkish for authentication errors.

**Parameters:**
- `error`: Any error object

**Returns:**
- `string` - User-friendly error message in Turkish

**Example:**
```typescript
import { login, getAuthErrorMessage } from '@/services/api';

try {
  await login({ email: 'test@example.com', password: 'wrong' });
} catch (error) {
  const message = getAuthErrorMessage(error);
  Alert.alert('Hata', message);
  // Shows: "E-posta veya şifre hatalı"
}
```

**Error Mappings:**
- `Invalid email or password` → `E-posta veya şifre hatalı`
- `User with this email already exists` → `Bu e-posta adresi zaten kullanılıyor`
- `User account is inactive` → `Hesabınız aktif değil. Lütfen yönetici ile iletişime geçin`
- `Invalid or expired refresh token` → `Oturumunuz sona ermiş. Lütfen tekrar giriş yapın`
- `User not found or inactive` → `Kullanıcı bulunamadı veya hesap aktif değil`
- `Refresh token is required` → `Oturum bilgisi eksik. Lütfen tekrar giriş yapın`

---

## Auth Service Object

All functions are also available as methods of the `authService` object:

```typescript
import { authService } from '@/services/api';

await authService.register({ ... });
await authService.login({ ... });
await authService.logout();
await authService.refreshAccessToken(refreshToken);
const user = await authService.getCurrentUser();
const isAuth = authService.isAuthenticated();
const message = authService.getAuthErrorMessage(error);
```

---

## Token Management

Tokens are automatically managed by the service:

- **After login/register:** Tokens are automatically stored
- **After refresh:** Access token is automatically updated
- **After logout:** Tokens are automatically cleared
- **On refresh failure:** Tokens are automatically cleared (user needs to login again)

You can also manually manage tokens using `tokenManager`:

```typescript
import { tokenManager } from '@/services/api';

// Check if authenticated
if (tokenManager.isAuthenticated()) {
  const token = tokenManager.getAccessToken();
}

// Clear tokens manually
await tokenManager.clearTokens();
```

---

## Error Handling

All functions throw `ApiError` on failure. Use try-catch blocks:

```typescript
import { login, getAuthErrorMessage } from '@/services/api';

try {
  const response = await login({ email: '...', password: '...' });
  // Success
} catch (error) {
  // Handle error
  const message = getAuthErrorMessage(error);
  Alert.alert('Hata', message);
}
```

---

## Backend Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user (Protected)

---

## Type Definitions

```typescript
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  mahalle?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  mahalle?: string;
  golbucks: number;
  role: 'user' | 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}
```

