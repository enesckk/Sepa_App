/**
 * API Configuration
 * Centralized API configuration and environment management
 */

import Constants from 'expo-constants';

/**
 * Environment configuration
 */
export const API_CONFIG = {
  /**
   * Base URL for API requests
   * Development: http://localhost:3000/api
   * Production: https://api.sehitkamil.bel.tr/api
   */
  BASE_URL: 
    __DEV__ 
      ? Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api'
      : Constants.expoConfig?.extra?.apiUrl || 'https://api.sehitkamil.bel.tr/api',

  /**
   * Request timeout in milliseconds
   */
  TIMEOUT: 30000, // 30 seconds

  /**
   * Default headers for all requests
   */
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  /**
   * Retry configuration
   */
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
    RETRYABLE_STATUS_CODES: [408, 429, 500, 502, 503, 504],
  },

  /**
   * Token refresh configuration
   */
  TOKEN_REFRESH: {
    REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
    MAX_REFRESH_ATTEMPTS: 2,
  },
} as const;

/**
 * API endpoints - Centralized endpoint definitions
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Users
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    GOLBUCKS: '/users/golbucks',
    TRANSACTIONS: '/users/golbucks/transactions',
  },

  // Events
  EVENTS: {
    LIST: '/events',
    DETAIL: (id: string) => `/events/${id}`,
    REGISTER: (id: string) => `/events/${id}/register`,
    CANCEL_REGISTRATION: (id: string) => `/events/${id}/register`,
    MY_REGISTRATIONS: '/events/my-registrations',
  },

  // Applications
  APPLICATIONS: {
    CREATE: '/applications',
    LIST: '/applications',
    DETAIL: (id: string) => `/applications/${id}`,
    MY_APPLICATIONS: '/applications/my',
    COMMENT: (id: string) => `/applications/${id}/comment`,
  },

  // Rewards
  REWARDS: {
    LIST: '/rewards',
    DETAIL: (id: string) => `/rewards/${id}`,
    REDEEM: (id: string) => `/rewards/${id}/redeem`,
    MY_REWARDS: '/rewards/my',
    USE: (id: string) => `/rewards/my/${id}/use`,
  },

  // Surveys
  SURVEYS: {
    LIST: '/surveys',
    DETAIL: (id: string) => `/surveys/${id}`,
    SUBMIT: (id: string) => `/surveys/${id}/submit`,
    MY_SURVEYS: '/surveys/my',
  },

  // Bills
  BILLS: {
    LIST: '/bill-supports',
    CREATE: '/bill-supports',
    DETAIL: (id: string) => `/bill-supports/${id}`,
    SUPPORT: (id: string) => `/bill-supports/${id}/support`,
    MY_BILLS: '/bill-supports/my',
  },

  // News
  NEWS: {
    LIST: '/news',
    DETAIL: (id: string) => `/news/${id}`,
    CATEGORIES: '/news/categories',
  },

  // Stories
  STORIES: {
    LIST: '/stories',
    DETAIL: (id: string) => `/stories/${id}`,
    VIEW: (id: string) => `/stories/${id}/view`,
  },

  // Places
  PLACES: {
    LIST: '/places',
    DETAIL: (id: string) => `/places/${id}`,
    CATEGORIES: '/places/categories',
    NEARBY: '/places/nearby',
  },

  // Emergency Gathering
  EMERGENCY: {
    LIST: '/emergency-gathering',
    DETAIL: (id: string) => `/emergency-gathering/${id}`,
    NEARBY: '/emergency-gathering/nearby',
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (id: string) => `/notifications/${id}`,
    DELETE_ALL_READ: '/notifications/delete-read',
  },

  // Daily Reward
  DAILY_REWARD: {
    CLAIM: '/daily-reward/claim',
    STATUS: '/daily-reward/status',
  },
} as const;

/**
 * Get full API URL
 * @param endpoint API endpoint
 * @returns Full URL
 */
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  // Remove trailing slash from base URL
  const cleanBaseUrl = API_CONFIG.BASE_URL.endsWith('/') 
    ? API_CONFIG.BASE_URL.slice(0, -1) 
    : API_CONFIG.BASE_URL;
  
  return `${cleanBaseUrl}/${cleanEndpoint}`;
};

/**
 * Check if running in development mode
 */
export const isDevelopment = __DEV__;

/**
 * Check if running in production mode
 */
export const isProduction = !__DEV__;

