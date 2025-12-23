/**
 * Error Handler Utilities
 * Centralized error handling and user-friendly error messages
 */

import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../services/api/types';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  statusCode: number;
  error: string;
  errors?: Record<string, string[]>;
  originalError?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    error?: string,
    errors?: Record<string, string[]>,
    originalError?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.error = error || 'Unknown Error';
    this.errors = errors;
    this.originalError = originalError;
  }
}

/**
 * Network error messages (Turkish)
 */
const ERROR_MESSAGES = {
  NETWORK_ERROR: 'İnternet bağlantınızı kontrol edin',
  TIMEOUT: 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin',
  UNAUTHORIZED: 'Oturumunuz sona ermiş. Lütfen tekrar giriş yapın',
  FORBIDDEN: 'Bu işlem için yetkiniz bulunmamaktadır',
  NOT_FOUND: 'İstenen kaynak bulunamadı',
  SERVER_ERROR: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin',
  VALIDATION_ERROR: 'Lütfen girdiğiniz bilgileri kontrol edin',
  UNKNOWN_ERROR: 'Beklenmeyen bir hata oluştu',
} as const;

/**
 * Parse API error from Axios error
 * @param error Axios error or any error
 * @returns ApiError instance with user-friendly message
 */
export function parseApiError(error: any): ApiError {
  // If already an ApiError, return it
  if (error instanceof ApiError) {
    return error;
  }

  // Handle Axios errors
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status || 500;
    const responseData = error.response?.data as ApiErrorResponse | undefined;

    // Network error (no response)
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return new ApiError(
          ERROR_MESSAGES.TIMEOUT,
          408,
          'Timeout',
          undefined,
          error
        );
      }
      return new ApiError(
        ERROR_MESSAGES.NETWORK_ERROR,
        0,
        'NetworkError',
        undefined,
        error
      );
    }

    // Get error message from response
    const message = 
      responseData?.message || 
      responseData?.error || 
      error.message || 
      ERROR_MESSAGES.UNKNOWN_ERROR;

    // Handle specific status codes
    let userMessage = message;
    if (statusCode === 401) {
      userMessage = ERROR_MESSAGES.UNAUTHORIZED;
    } else if (statusCode === 403) {
      userMessage = ERROR_MESSAGES.FORBIDDEN;
    } else if (statusCode === 404) {
      userMessage = ERROR_MESSAGES.NOT_FOUND;
    } else if (statusCode === 422 || statusCode === 400) {
      userMessage = responseData?.message || ERROR_MESSAGES.VALIDATION_ERROR;
    } else if (statusCode >= 500) {
      userMessage = ERROR_MESSAGES.SERVER_ERROR;
    }

    return new ApiError(
      userMessage,
      statusCode,
      responseData?.error || 'ApiError',
      responseData?.errors,
      error
    );
  }

  // Handle generic errors
  if (error instanceof Error) {
    return new ApiError(
      error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      500,
      'UnknownError',
      undefined,
      error
    );
  }

  // Handle string errors
  if (typeof error === 'string') {
    return new ApiError(error, 500, 'StringError');
  }

  // Fallback
  return new ApiError(
    ERROR_MESSAGES.UNKNOWN_ERROR,
    500,
    'UnknownError',
    undefined,
    error
  );
}

/**
 * Get user-friendly error message
 * @param error Error object
 * @returns User-friendly error message
 */
export function getErrorMessage(error: any): string {
  const apiError = parseApiError(error);
  return apiError.message;
}

/**
 * Check if error is a network error
 * @param error Error object
 * @returns True if network error
 */
export function isNetworkError(error: any): boolean {
  if (error instanceof ApiError) {
    return error.statusCode === 0 || error.error === 'NetworkError';
  }
  if (error instanceof AxiosError) {
    return !error.response;
  }
  return false;
}

/**
 * Check if error is a timeout error
 * @param error Error object
 * @returns True if timeout error
 */
export function isTimeoutError(error: any): boolean {
  if (error instanceof ApiError) {
    return error.statusCode === 408 || error.error === 'Timeout';
  }
  if (error instanceof AxiosError) {
    return error.code === 'ECONNABORTED' || error.message.includes('timeout');
  }
  return false;
}

/**
 * Check if error is an authentication error
 * @param error Error object
 * @returns True if authentication error
 */
export function isAuthError(error: any): boolean {
  if (error instanceof ApiError) {
    return error.statusCode === 401 || error.statusCode === 403;
  }
  if (error instanceof AxiosError) {
    return error.response?.status === 401 || error.response?.status === 403;
  }
  return false;
}

/**
 * Log error for debugging
 * @param error Error object
 * @param context Additional context
 */
export function logError(error: any, context?: string): void {
  if (__DEV__) {
    const apiError = parseApiError(error);
    console.error(`[ErrorHandler]${context ? ` [${context}]` : ''}:`, {
      message: apiError.message,
      statusCode: apiError.statusCode,
      error: apiError.error,
      errors: apiError.errors,
      originalError: apiError.originalError,
    });
  }
}

