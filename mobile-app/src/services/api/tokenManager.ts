/**
 * Token Manager
 * Handles JWT token storage, retrieval, and validation
 */

import { storage, stringStorage, StorageKeys } from '../../utils/storage';
import { AuthResponse } from './types';

/**
 * Token data structure
 */
interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number; // Timestamp when token expires
}

/**
 * Token Manager class
 */
class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number | null = null;

  /**
   * Initialize token manager - load tokens from storage
   */
  async initialize(): Promise<void> {
    try {
      const accessToken = await stringStorage.get(StorageKeys.ACCESS_TOKEN);
      const refreshToken = await stringStorage.get(StorageKeys.REFRESH_TOKEN);
      
      if (accessToken && refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        
        // Try to get expiration time from storage
        const tokenData = await storage.get<TokenData>(StorageKeys.ACCESS_TOKEN);
        if (tokenData?.expiresAt) {
          this.expiresAt = tokenData.expiresAt;
        }
      }
    } catch (error) {
      if (__DEV__) {
        console.error('[TokenManager] Error initializing:', error);
      }
    }
  }

  /**
   * Set tokens
   * @param tokens Token data
   */
  async setTokens(tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn?: number; // Token expiration time in seconds
  }): Promise<void> {
    try {
      this.accessToken = tokens.accessToken;
      this.refreshToken = tokens.refreshToken;

      // Calculate expiration time if provided
      if (tokens.expiresIn) {
        this.expiresAt = Date.now() + tokens.expiresIn * 1000;
      }

      // Store tokens
      await Promise.all([
        stringStorage.set(StorageKeys.ACCESS_TOKEN, tokens.accessToken),
        stringStorage.set(StorageKeys.REFRESH_TOKEN, tokens.refreshToken),
      ]);

      // Store expiration time if available
      if (this.expiresAt) {
        await storage.set(StorageKeys.ACCESS_TOKEN, {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: this.expiresAt,
        });
      }
    } catch (error) {
      if (__DEV__) {
        console.error('[TokenManager] Error setting tokens:', error);
      }
      throw error;
    }
  }

  /**
   * Get access token
   * @returns Access token or null
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Get refresh token
   * @returns Refresh token or null
   */
  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  /**
   * Check if access token is expired
   * @param thresholdMs Threshold in milliseconds (default: 5 minutes)
   * @returns True if token is expired or will expire soon
   */
  isTokenExpired(thresholdMs: number = 5 * 60 * 1000): boolean {
    if (!this.expiresAt) {
      // If we don't have expiration time, assume token is valid
      // In production, you might want to decode JWT to check expiration
      return false;
    }
    return Date.now() >= (this.expiresAt - thresholdMs);
  }

  /**
   * Check if user is authenticated
   * @returns True if access token exists
   */
  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  /**
   * Clear all tokens
   */
  async clearTokens(): Promise<void> {
    try {
      this.accessToken = null;
      this.refreshToken = null;
      this.expiresAt = null;

      await Promise.all([
        stringStorage.remove(StorageKeys.ACCESS_TOKEN),
        stringStorage.remove(StorageKeys.REFRESH_TOKEN),
      ]);
    } catch (error) {
      if (__DEV__) {
        console.error('[TokenManager] Error clearing tokens:', error);
      }
      throw error;
    }
  }

  /**
   * Update access token (after refresh)
   * @param accessToken New access token
   * @param expiresIn Expiration time in seconds
   */
  async updateAccessToken(accessToken: string, expiresIn?: number): Promise<void> {
    try {
      this.accessToken = accessToken;

      if (expiresIn) {
        this.expiresAt = Date.now() + expiresIn * 1000;
      }

      await stringStorage.set(StorageKeys.ACCESS_TOKEN, accessToken);

      if (this.expiresAt) {
        const tokenData = await storage.get<TokenData>(StorageKeys.ACCESS_TOKEN) || {};
        await storage.set(StorageKeys.ACCESS_TOKEN, {
          ...tokenData,
          accessToken,
          expiresAt: this.expiresAt,
        });
      }
    } catch (error) {
      if (__DEV__) {
        console.error('[TokenManager] Error updating access token:', error);
      }
      throw error;
    }
  }
}

/**
 * Singleton instance
 */
export const tokenManager = new TokenManager();

/**
 * Initialize token manager on app start
 * This should be called in app initialization
 */
export const initializeTokenManager = async (): Promise<void> => {
  await tokenManager.initialize();
};

