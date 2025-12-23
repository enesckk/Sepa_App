# Applications Service Documentation

## Overview

Applications service handles all application-related API calls including creating applications with file upload, listing applications, and getting application details.

## Functions

### `createApplication(data, photos?, onProgress?): Promise<Application>`

Create a new application with optional photo upload.

**Parameters:**
- `data`: CreateApplicationRequest (required)
  - `type`: string (required) - Application type (complaint, request, marriage, muhtar_message, other)
  - `subject`: string (required) - Application subject
  - `description`: string (required) - Detailed description
  - `location`: string (optional) - Location text
  - `latitude`: number (optional) - Latitude coordinate
  - `longitude`: number (optional) - Longitude coordinate
- `photos`: string[] (optional) - Array of photo URIs (local file paths)
- `onProgress`: (progress: number) => void (optional) - Upload progress callback

**Returns:**
- `Application` object with created application data

**Example:**
```typescript
import { createApplication } from '@/services/api';

// Create application without photo
const application = await createApplication({
  type: 'complaint',
  subject: 'Temizlik Sorunu',
  description: 'Mahallemizde çöp toplama sorunu var',
  location: 'Merkez Mahallesi',
  latitude: 37.0662,
  longitude: 37.3833,
});

// Create application with photo
const applicationWithPhoto = await createApplication(
  {
    type: 'request',
    subject: 'Park İsteği',
    description: 'Yeni bir park yapılmasını istiyoruz',
    location: 'Yeni Mahalle',
  },
  ['file:///path/to/photo.jpg'],
  (progress) => {
    console.log(`Upload progress: ${progress}%`);
  }
);
```

**Note:** Backend currently accepts single image. If multiple photos are provided, only the first one will be sent. Backend can be updated to accept multiple images in the future.

---

### `getApplications(params?): Promise<GetApplicationsResponse>`

Get user's applications list with optional filters and pagination.

**Parameters:**
- `params` (optional): GetApplicationsParams
  - `type`: string (optional) - Filter by application type
  - `status`: 'pending' | 'in_progress' | 'resolved' | 'rejected' (optional) - Filter by status
  - `search`: string (optional) - Search in subject and description
  - `limit`: number (optional) - Number of results per page (default: 50)
  - `offset`: number (optional) - Number of results to skip (default: 0)
  - `sort`: 'created_at' | 'updated_at' | 'status' (optional) - Sort field
  - `order`: 'ASC' | 'DESC' (optional) - Sort order

**Returns:**
- `GetApplicationsResponse` with applications array and pagination info

**Example:**
```typescript
import { getApplications } from '@/services/api';

// Get all applications
const allApplications = await getApplications();

// Get pending applications
const pendingApps = await getApplications({
  status: 'pending',
  limit: 20,
  offset: 0,
  sort: 'created_at',
  order: 'DESC',
});

// Search applications
const searchResults = await getApplications({
  search: 'temizlik',
  type: 'complaint',
});
```

---

### `getApplicationById(id): Promise<Application>`

Get application details by ID.

**Parameters:**
- `id`: string (required) - Application ID

**Returns:**
- `Application` object with full application data

**Example:**
```typescript
import { getApplicationById } from '@/services/api';

const application = await getApplicationById('app-id-123');
console.log('Application:', application.subject);
console.log('Status:', application.status);
console.log('Admin response:', application.admin_response);
```

---

### `getMyApplications(params?): Promise<GetApplicationsResponse>`

Get current user's applications (alias for getApplications).

**Parameters:**
- `params` (optional): Same as getApplications

**Returns:**
- `GetApplicationsResponse` with applications array and pagination info

**Example:**
```typescript
import { getMyApplications } from '@/services/api';

const myApps = await getMyApplications({
  status: 'pending',
});
```

---

## Type Definitions

### GetApplicationsParams
```typescript
interface GetApplicationsParams extends PaginationParams {
  type?: string;
  status?: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  search?: string;
  sort?: 'created_at' | 'updated_at' | 'status';
  order?: 'ASC' | 'DESC';
}
```

### GetApplicationsResponse
```typescript
interface GetApplicationsResponse {
  applications: Application[];
  total: number;
  limit: number;
  offset: number;
}
```

### CreateApplicationRequest
```typescript
interface CreateApplicationRequest {
  type: string;
  subject: string;
  description: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  photos?: string[];
}
```

### Application
```typescript
interface Application {
  id: string;
  user_id: string;
  type: string;
  subject: string;
  description: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  photos?: string[];
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  admin_response?: string;
  created_at: string;
  updated_at?: string;
}
```

---

## Applications Service Object

All functions are also available as methods of the `applicationsService` object:

```typescript
import { applicationsService } from '@/services/api';

await applicationsService.createApplication({ ... });
await applicationsService.getApplications({ ... });
await applicationsService.getApplicationById('id');
await applicationsService.getMyApplications({ ... });
```

---

## File Upload

### Photo Upload Format

Photos should be provided as local file URIs (from ImagePicker or similar):

```typescript
import * as ImagePicker from 'expo-image-picker';

// Pick image
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 0.8,
});

if (!result.canceled) {
  const photoUri = result.assets[0].uri;
  
  // Create application with photo
  await createApplication(
    {
      type: 'complaint',
      subject: 'Sorun',
      description: 'Açıklama',
    },
    [photoUri]
  );
}
```

### Upload Progress

Monitor upload progress with the `onProgress` callback:

```typescript
await createApplication(
  data,
  photos,
  (progress) => {
    console.log(`Upload: ${progress}%`);
    setUploadProgress(progress);
  }
);
```

---

## Error Handling

All functions throw `ApiError` on failure. Use try-catch blocks:

```typescript
import { createApplication, parseApiError } from '@/services/api';

try {
  const application = await createApplication({
    type: 'complaint',
    subject: 'Sorun',
    description: 'Açıklama',
  });
} catch (error) {
  const apiError = parseApiError(error);
  Alert.alert('Hata', apiError.message);
}
```

---

## Backend Endpoints

- `POST /api/applications` - Create application (Protected, multipart/form-data)
- `GET /api/applications` - Get user's applications (Protected)
- `GET /api/applications/:id` - Get application detail (Protected)

---

## Usage Examples

### Create Application with Form Data
```typescript
import { createApplication } from '@/services/api';

const handleSubmit = async (formData, photos) => {
  try {
    setLoading(true);
    
    const application = await createApplication(
      {
        type: formData.type,
        subject: formData.subject,
        description: formData.description,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
      photos,
      (progress) => {
        setUploadProgress(progress);
      }
    );
    
    Alert.alert('Başarılı', 'Başvurunuz oluşturuldu');
    setLoading(false);
  } catch (error) {
    Alert.alert('Hata', error.message);
    setLoading(false);
  }
};
```

### Get Applications with Filters
```typescript
import { getApplications } from '@/services/api';

const loadApplications = async (status?: string) => {
  try {
    const response = await getApplications({
      status: status as any,
      limit: 20,
      offset: 0,
      sort: 'created_at',
      order: 'DESC',
    });
    
    setApplications(response.applications);
    setTotal(response.total);
  } catch (error) {
    console.error('Failed to load applications:', error);
  }
};
```

### Get Application Detail
```typescript
import { getApplicationById } from '@/services/api';

const loadApplicationDetail = async (id: string) => {
  try {
    const application = await getApplicationById(id);
    setApplication(application);
  } catch (error) {
    Alert.alert('Hata', 'Başvuru detayı yüklenemedi');
  }
};
```

---

## Application Types

Backend accepts the following application types:
- `complaint` - Şikayet
- `request` - Talep
- `marriage` - Evlilik
- `muhtar_message` - Muhtar Mesajı
- `other` - Diğer

---

## Notes

- ✅ File upload with progress tracking
- ✅ Multiple photo support (currently sends first photo, backend can be updated)
- ✅ Location support (text and coordinates)
- ✅ Comprehensive filtering and pagination
- ✅ Type-safe API calls
- ✅ Error handling

