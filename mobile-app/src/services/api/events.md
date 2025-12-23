# Events Service Documentation

## Overview

Events service handles all event-related API calls including listing events, getting event details, registering for events, canceling registrations, and getting user's event registrations.

## Functions

### `getEvents(params?: GetEventsParams): Promise<GetEventsResponse>`

Get list of events with optional filters and pagination.

**Parameters:**
- `params` (optional): Query parameters
  - `category`: string (optional) - Event category filter
  - `date_from`: string (optional) - Start date filter (YYYY-MM-DD)
  - `date_to`: string (optional) - End date filter (YYYY-MM-DD)
  - `is_free`: boolean (optional) - Filter free events
  - `search`: string (optional) - Search in title, description, location
  - `limit`: number (optional) - Number of results per page (default: 50)
  - `offset`: number (optional) - Number of results to skip (default: 0)
  - `sort`: 'date' | 'title' | 'created_at' | 'registered' (optional) - Sort field (default: 'date')
  - `order`: 'ASC' | 'DESC' (optional) - Sort order (default: 'ASC')

**Returns:**
- `GetEventsResponse` with events array and pagination info

**Example:**
```typescript
import { getEvents } from '@/services/api';

// Get all events
const allEvents = await getEvents();

// Get events by category
const concerts = await getEvents({ category: 'konser' });

// Get free events with pagination
const freeEvents = await getEvents({
  is_free: true,
  limit: 20,
  offset: 0,
  sort: 'date',
  order: 'ASC',
});

// Search events
const searchResults = await getEvents({
  search: 'konser',
  limit: 10,
});
```

---

### `getEventById(id: string): Promise<EventDetail>`

Get event details by ID.

**Parameters:**
- `id`: string (required) - Event ID

**Returns:**
- `EventDetail` with event data and additional fields:
  - `availableSpots`: number | null - Available spots remaining
  - `isRegistered`: boolean - Whether current user is registered

**Example:**
```typescript
import { getEventById } from '@/services/api';

const event = await getEventById('event-id-123');
console.log('Event:', event.title);
console.log('Available spots:', event.availableSpots);
console.log('Is registered:', event.isRegistered);
```

---

### `registerForEvent(eventId: string): Promise<RegisterEventResponse>`

Register for an event (Protected - requires authentication).

**Parameters:**
- `eventId`: string (required) - Event ID

**Returns:**
- `RegisterEventResponse` with:
  - `registration`: EventRegistration - Registration data
  - `golbucksReward`: number - Gölbucks earned
  - `newBalance`: number - New Gölbucks balance

**Example:**
```typescript
import { registerForEvent } from '@/services/api';

try {
  const response = await registerForEvent('event-id-123');
  console.log('Registered!');
  console.log('Gölbucks earned:', response.golbucksReward);
  console.log('New balance:', response.newBalance);
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

**Throws:**
- `ApiError` if registration fails (e.g., event full, already registered, event not found)

---

### `cancelEventRegistration(eventId: string): Promise<void>`

Cancel event registration (Protected - requires authentication).

**Parameters:**
- `eventId`: string (required) - Event ID

**Returns:**
- `void`

**Example:**
```typescript
import { cancelEventRegistration } from '@/services/api';

try {
  await cancelEventRegistration('event-id-123');
  console.log('Registration cancelled');
} catch (error) {
  console.error('Cancellation failed:', error.message);
}
```

**Throws:**
- `ApiError` if cancellation fails (e.g., not registered, event not found)

---

### `getMyRegistrations(params?: { status?, limit?, offset? }): Promise<PaginatedResponse<EventRegistration>>`

Get current user's event registrations (Protected - requires authentication).

**Parameters:**
- `params` (optional): Query parameters
  - `status`: 'registered' | 'cancelled' | 'attended' | 'no_show' (optional) - Filter by status
  - `limit`: number (optional) - Number of results per page (default: 50)
  - `offset`: number (optional) - Number of results to skip (default: 0)

**Returns:**
- `PaginatedResponse<EventRegistration>` with registrations array and pagination info

**Example:**
```typescript
import { getMyRegistrations } from '@/services/api';

// Get all registrations
const allRegistrations = await getMyRegistrations();

// Get only active registrations
const activeRegistrations = await getMyRegistrations({
  status: 'registered',
  limit: 20,
});
```

---

## Type Definitions

### GetEventsParams
```typescript
interface GetEventsParams extends PaginationParams {
  category?: string;
  date_from?: string;
  date_to?: string;
  is_free?: boolean;
  search?: string;
  sort?: 'date' | 'title' | 'created_at' | 'registered';
  order?: 'ASC' | 'DESC';
}
```

### GetEventsResponse
```typescript
interface GetEventsResponse {
  events: Event[];
  total: number;
  limit: number;
  offset: number;
}
```

### EventDetail
```typescript
interface EventDetail extends Event {
  availableSpots?: number | null;
  isRegistered?: boolean;
}
```

### RegisterEventResponse
```typescript
interface RegisterEventResponse {
  registration: EventRegistration;
  golbucksReward: number;
  newBalance: number;
}
```

### Event
```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  date: string;
  time?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  category: string;
  is_free: boolean;
  price?: number;
  capacity: number;
  registered: number;
  golbucks_reward: number;
  is_active: boolean;
  created_at: string;
}
```

### EventRegistration
```typescript
interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  status: 'registered' | 'cancelled' | 'attended' | 'no_show';
  registration_date: string;
}
```

---

## Events Service Object

All functions are also available as methods of the `eventsService` object:

```typescript
import { eventsService } from '@/services/api';

await eventsService.getEvents({ category: 'konser' });
await eventsService.getEventById('event-id');
await eventsService.registerForEvent('event-id');
await eventsService.cancelEventRegistration('event-id');
await eventsService.getMyRegistrations();
```

---

## Error Handling

All functions throw `ApiError` on failure. Use try-catch blocks:

```typescript
import { getEvents, parseApiError } from '@/services/api';

try {
  const events = await getEvents();
} catch (error) {
  const apiError = parseApiError(error);
  console.error('Error:', apiError.message);
}
```

---

## Backend Endpoints

- `GET /api/events` - Get events list (Public)
- `GET /api/events/:id` - Get event detail (Public)
- `POST /api/events/:id/register` - Register for event (Protected)
- `DELETE /api/events/:id/register` - Cancel registration (Protected)
- `GET /api/events/my-registrations` - Get my registrations (Protected)

---

## Usage Examples

### Get Events with Filters
```typescript
import { getEvents } from '@/services/api';

// Get today's events
const today = new Date().toISOString().split('T')[0];
const todayEvents = await getEvents({
  date_from: today,
  date_to: today,
});

// Get free events in a category
const freeConcerts = await getEvents({
  category: 'konser',
  is_free: true,
});
```

### Register and Handle Response
```typescript
import { registerForEvent } from '@/services/api';

const handleRegister = async (eventId: string) => {
  try {
    const response = await registerForEvent(eventId);
    
    // Show success message
    Alert.alert(
      'Başarılı',
      `${response.golbucksReward} Gölbucks kazandınız!`
    );
    
    // Update UI
    setRegistered(true);
    setGolbucksBalance(response.newBalance);
  } catch (error) {
    Alert.alert('Hata', error.message);
  }
};
```

### Get My Registrations
```typescript
import { getMyRegistrations } from '@/services/api';

const loadMyRegistrations = async () => {
  try {
    const response = await getMyRegistrations({
      status: 'registered',
      limit: 50,
    });
    
    setRegistrations(response.items);
    setTotal(response.total);
  } catch (error) {
    console.error('Failed to load registrations:', error);
  }
};
```

