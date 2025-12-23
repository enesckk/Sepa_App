import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public error?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // Return data directly if wrapped in data property
    return response.data?.data !== undefined ? response.data : response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      try {
        const refreshToken = localStorage.getItem('admin_refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data || response.data;
          
          if (accessToken) {
            localStorage.setItem('admin_token', accessToken);
            if (newRefreshToken) {
              localStorage.setItem('admin_refresh_token', newRefreshToken);
            }

            // Retry original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return axiosInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_refresh_token');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const apiError = new ApiError(
      error.response?.status || 500,
      (error.response?.data as any)?.message || error.message || 'An error occurred',
      (error.response?.data as any)?.error
    );

    return Promise.reject(apiError);
  }
);

// API Client wrapper
export const api = {
  get: <T>(url: string, config?: any): Promise<T> => {
    return axiosInstance.get<T>(url, config).then((res) => res as T);
  },

  post: <T>(url: string, data?: any, config?: any): Promise<T> => {
    return axiosInstance.post<T>(url, data, config).then((res) => res as T);
  },

  put: <T>(url: string, data?: any, config?: any): Promise<T> => {
    return axiosInstance.put<T>(url, data, config).then((res) => res as T);
  },

  patch: <T>(url: string, data?: any, config?: any): Promise<T> => {
    return axiosInstance.patch<T>(url, data, config).then((res) => res as T);
  },

  delete: <T>(url: string, config?: any): Promise<T> => {
    return axiosInstance.delete<T>(url, config).then((res) => res as T);
  },

  upload: <T>(url: string, formData: FormData, onUploadProgress?: (progress: number) => void): Promise<T> => {
    return axiosInstance
      .post<T>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onUploadProgress(progress);
          }
        },
      })
      .then((res) => res as T);
  },
};

export default axiosInstance;
