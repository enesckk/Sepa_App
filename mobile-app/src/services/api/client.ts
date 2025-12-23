/**
 * API Client
 * Axios instance with interceptors and error handling
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './tokenManager';
import { parseApiError, isAuthError } from '../../utils/errorHandler';
import { ApiResponse } from './types';

/**
 * Create axios instance
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

/**
 * Request interceptor
 * - Add authentication token to requests
 * - Add request logging in development
 */
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add access token to request headers if available
    const accessToken = tokenManager.getAccessToken();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Log request in development
    if (__DEV__) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    if (__DEV__) {
      console.error('[API] Request error:', error);
    }
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * - Handle token refresh on 401 errors
 * - Parse API responses
 * - Handle errors
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Log response in development
    if (__DEV__) {
      console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    // Return data directly (unwrap ApiResponse)
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) {
          // No refresh token, clear tokens and reject
          await tokenManager.clearTokens();
          processQueue(new Error('No refresh token'), null);
          return Promise.reject(parseApiError(error));
        }

        // Attempt to refresh token
        // Backend only returns new accessToken, not refreshToken
        const refreshResponse = await axios.post<ApiResponse<{ accessToken: string }>>(
          getApiUrl('/auth/refresh'),
          { refreshToken },
          {
            // Don't use interceptors for refresh request to avoid infinite loop
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const { accessToken } = refreshResponse.data.data || {};

        if (accessToken) {
          // Update only access token, keep the same refresh token
          await tokenManager.updateAccessToken(accessToken);

          // Update authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          // Process queued requests
          processQueue(null, accessToken);

          // Retry original request
          return axiosInstance(originalRequest);
        } else {
          throw new Error('Invalid refresh response');
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and reject
        await tokenManager.clearTokens();
        processQueue(refreshError, null);
        return Promise.reject(parseApiError(refreshError || error));
      } finally {
        isRefreshing = false;
      }
    }

    // Parse and reject error
    return Promise.reject(parseApiError(error));
  }
);

/**
 * API Client wrapper with convenience methods
 */
export const apiClient = {
  /**
   * GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.get<ApiResponse<T>>(url, config);
    return response.data.data as T;
  },

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.post<ApiResponse<T>>(url, data, config);
    return response.data.data as T;
  },

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.put<ApiResponse<T>>(url, data, config);
    return response.data.data as T;
  },

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.patch<ApiResponse<T>>(url, data, config);
    return response.data.data as T;
  },

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.delete<ApiResponse<T>>(url, config);
    return response.data.data as T;
  },

  /**
   * Upload file with progress tracking
   */
  async upload<T = any>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axiosInstance.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data.data as T;
  },
};

/**
 * Export axios instance for advanced usage
 */
export { axiosInstance };

/**
 * Export default apiClient
 */
export default apiClient;

