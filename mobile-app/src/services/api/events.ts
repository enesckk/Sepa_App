/**
 * Events Service
 * Handles all event-related API calls
 */

import { apiClient, API_ENDPOINTS } from './index';
import { Event, EventRegistration, PaginationParams, PaginatedResponse } from './types';
import { parseApiError } from '../../utils/errorHandler';

/**
 * Get events list parameters
 */
export interface GetEventsParams extends PaginationParams {
  category?: string;
  date_from?: string;
  date_to?: string;
  is_free?: boolean;
  search?: string;
  sort?: 'date' | 'title' | 'created_at' | 'registered';
  order?: 'ASC' | 'DESC';
}

/**
 * Get events list response
 */
export interface GetEventsResponse {
  events: Event[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Register for event response
 */
export interface RegisterEventResponse {
  registration: EventRegistration;
  golbucksReward: number;
  newBalance: number;
}

/**
 * Get events list
 * @param params Query parameters
 * @returns Events list with pagination info
 * @throws ApiError if request fails
 */
export const getEvents = async (params?: GetEventsParams): Promise<GetEventsResponse> => {
  try {
    // Build query string
    const queryParams: Record<string, string> = {};
    
    if (params?.category) {
      queryParams.category = params.category;
    }
    if (params?.date_from) {
      queryParams.date_from = params.date_from;
    }
    if (params?.date_to) {
      queryParams.date_to = params.date_to;
    }
    if (params?.is_free !== undefined) {
      queryParams.is_free = params.is_free.toString();
    }
    if (params?.search) {
      queryParams.search = params.search;
    }
    if (params?.limit) {
      queryParams.limit = params.limit.toString();
    }
    if (params?.offset) {
      queryParams.offset = params.offset.toString();
    }
    if (params?.sort) {
      queryParams.sort = params.sort;
    }
    if (params?.order) {
      queryParams.order = params.order;
    }

    const response = await apiClient.get<GetEventsResponse>(
      API_ENDPOINTS.EVENTS.LIST,
      { params: queryParams }
    );

    return response;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[EventsService] Get events error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Get event by ID response (includes additional fields)
 */
export interface EventDetail extends Event {
  availableSpots?: number | null;
  isRegistered?: boolean;
}

/**
 * Get event by ID
 * @param id Event ID
 * @returns Event details with additional info
 * @throws ApiError if request fails
 */
export const getEventById = async (id: string): Promise<EventDetail> => {
  try {
    const response = await apiClient.get<{ event: EventDetail }>(API_ENDPOINTS.EVENTS.DETAIL(id));
    return response.event;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[EventsService] Get event by ID error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Register for an event
 * @param eventId Event ID
 * @returns Registration data with QR code
 * @throws ApiError if request fails
 */
export const registerForEvent = async (eventId: string): Promise<RegisterEventResponse> => {
  try {
    const response = await apiClient.post<RegisterEventResponse>(
      API_ENDPOINTS.EVENTS.REGISTER(eventId)
    );

    if (__DEV__) {
      console.log('[EventsService] Registered for event:', eventId);
    }

    return response;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[EventsService] Register for event error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Cancel event registration
 * @param eventId Event ID
 * @returns Success message
 * @throws ApiError if request fails
 */
export const cancelEventRegistration = async (eventId: string): Promise<void> => {
  try {
    await apiClient.delete(API_ENDPOINTS.EVENTS.CANCEL_REGISTRATION(eventId));

    if (__DEV__) {
      console.log('[EventsService] Cancelled registration for event:', eventId);
    }
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[EventsService] Cancel registration error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Get my event registrations
 * @param params Query parameters (status, limit, offset)
 * @returns User's event registrations
 * @throws ApiError if request fails
 */
export const getMyRegistrations = async (
  params?: {
    status?: 'registered' | 'cancelled' | 'attended' | 'no_show';
    limit?: number;
    offset?: number;
  }
): Promise<PaginatedResponse<EventRegistration>> => {
  try {
    const queryParams: Record<string, string> = {};
    
    if (params?.status) {
      queryParams.status = params.status;
    }
    if (params?.limit) {
      queryParams.limit = params.limit.toString();
    }
    if (params?.offset) {
      queryParams.offset = params.offset.toString();
    }

    const response = await apiClient.get<PaginatedResponse<EventRegistration>>(
      API_ENDPOINTS.EVENTS.MY_REGISTRATIONS,
      { params: queryParams }
    );

    return response;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[EventsService] Get my registrations error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Events service object with all event functions
 */
export const eventsService = {
  getEvents,
  getEventById,
  registerForEvent,
  cancelEventRegistration,
  getMyRegistrations,
};

export default eventsService;

