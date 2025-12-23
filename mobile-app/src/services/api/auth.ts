/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { apiClient, API_ENDPOINTS, tokenManager } from './index';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  RefreshTokenRequest,
  User 
} from './types';
import { parseApiError, getErrorMessage } from '../../utils/errorHandler';

/**
 * Register a new user
 * @param data Registration data
 * @returns Auth response with user and tokens
 * @throws ApiError if registration fails
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );

    // Store tokens after successful registration
    if (response.tokens) {
      await tokenManager.setTokens({
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
      });
    }

    return response;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[AuthService] Register error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Login user
 * @param data Login credentials
 * @returns Auth response with user and tokens
 * @throws ApiError if login fails
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );

    // Store tokens after successful login
    if (response.tokens) {
      await tokenManager.setTokens({
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
      });
    }

    return response;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[AuthService] Login error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Logout user
 * Clears tokens from storage and memory
 * Note: Backend doesn't have a logout endpoint, so we only clear client-side tokens
 */
export const logout = async (): Promise<void> => {
  try {
    // Clear tokens from storage and memory
    await tokenManager.clearTokens();

    if (__DEV__) {
      console.log('[AuthService] User logged out successfully');
    }
  } catch (error) {
    if (__DEV__) {
      console.error('[AuthService] Logout error:', error);
    }
    // Even if clearing fails, we should still proceed with logout
    // Try to clear tokens again
    try {
      await tokenManager.clearTokens();
    } catch (retryError) {
      if (__DEV__) {
        console.error('[AuthService] Retry logout error:', retryError);
      }
    }
  }
};

/**
 * Refresh access token
 * @param refreshToken Refresh token
 * @returns New access token
 * @throws ApiError if refresh fails
 */
export const refreshAccessToken = async (
  refreshToken: string
): Promise<{ accessToken: string }> => {
  try {
    const response = await apiClient.post<{ accessToken: string }>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );

    // Update access token in storage
    if (response.accessToken) {
      await tokenManager.updateAccessToken(response.accessToken);
    }

    return response;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[AuthService] Refresh token error:', apiError);
    }
    
    // If refresh fails, clear tokens (user needs to login again)
    try {
      await tokenManager.clearTokens();
    } catch (clearError) {
      if (__DEV__) {
        console.error('[AuthService] Error clearing tokens after refresh failure:', clearError);
      }
    }
    
    throw apiError;
  }
};

/**
 * Get current authenticated user
 * @returns Current user data
 * @throws ApiError if request fails or user is not authenticated
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const user = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
    return user;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[AuthService] Get current user error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Check if user is authenticated
 * @returns True if user has valid tokens
 */
export const isAuthenticated = (): boolean => {
  return tokenManager.isAuthenticated();
};

/**
 * Get user-friendly error message for auth errors
 * @param error Error object
 * @returns User-friendly error message in Turkish
 */
export const getAuthErrorMessage = (error: any): string => {
  const message = getErrorMessage(error);
  
  // Map common auth errors to user-friendly messages
  const errorMappings: Record<string, string> = {
    'Invalid email or password': 'E-posta veya şifre hatalı',
    'User with this email already exists': 'Bu e-posta adresi zaten kullanılıyor',
    'User account is inactive': 'Hesabınız aktif değil. Lütfen yönetici ile iletişime geçin',
    'Invalid or expired refresh token': 'Oturumunuz sona ermiş. Lütfen tekrar giriş yapın',
    'User not found or inactive': 'Kullanıcı bulunamadı veya hesap aktif değil',
    'Refresh token is required': 'Oturum bilgisi eksik. Lütfen tekrar giriş yapın',
  };

  // Check if we have a specific mapping for this error
  for (const [key, value] of Object.entries(errorMappings)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Return generic error message
  return message;
};

/**
 * Auth service object with all authentication functions
 */
export const authService = {
  register,
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
  isAuthenticated,
  getAuthErrorMessage,
};

export default authService;

