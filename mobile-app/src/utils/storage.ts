/**
 * Storage Utilities
 * AsyncStorage wrapper for secure and type-safe data storage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage keys - Centralized key management
 */
export const StorageKeys = {
  // Authentication
  ACCESS_TOKEN: '@auth_access_token',
  REFRESH_TOKEN: '@auth_refresh_token',
  TOKEN_METADATA: '@auth_token_metadata',
  USER_DATA: '@auth_user_data',
  
  // App Settings
  LANGUAGE: '@app_language',
  THEME: '@app_theme',
  NOTIFICATIONS_ENABLED: '@app_notifications_enabled',
  
  // Cache
  NEWS_CACHE: '@cache_news',
  EVENTS_CACHE: '@cache_events',
  REWARDS_CACHE: '@cache_rewards',
  
  // Daily Reward
  DAILY_REWARD_LAST_DATE: '@daily_reward_last_date',
} as const;

/**
 * Generic storage operations
 */
export const storage = {
  /**
   * Store a value in AsyncStorage
   * @param key Storage key
   * @param value Value to store (will be JSON stringified)
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      if (__DEV__) {
        console.error(`[Storage] Error setting ${key}:`, error);
      }
      throw error;
    }
  },

  /**
   * Get a value from AsyncStorage
   * @param key Storage key
   * @returns Parsed value or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue === null) {
        return null;
      }
      // Try to parse as JSON, but handle cases where value might be a plain string
      // This handles legacy data or corrupted storage entries
      try {
        return JSON.parse(jsonValue) as T;
      } catch (parseError) {
        // If parsing fails, the value might be stored as plain string (legacy format)
        // Return null to indicate the value is not in expected format
        if (__DEV__) {
          console.warn(`[Storage] Value at ${key} is not valid JSON, returning null`);
        }
        return null;
      }
    } catch (error) {
      if (__DEV__) {
        console.error(`[Storage] Error getting ${key}:`, error);
      }
      return null;
    }
  },

  /**
   * Remove a value from AsyncStorage
   * @param key Storage key
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      if (__DEV__) {
        console.error(`[Storage] Error removing ${key}:`, error);
      }
      throw error;
    }
  },

  /**
   * Clear all storage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      if (__DEV__) {
        console.error('[Storage] Error clearing storage:', error);
      }
      throw error;
    }
  },

  /**
   * Get all keys
   * @returns Array of all storage keys
   */
  async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      if (__DEV__) {
        console.error('[Storage] Error getting all keys:', error);
      }
      return [];
    }
  },

  /**
   * Check if a key exists
   * @param key Storage key
   * @returns True if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      if (__DEV__) {
        console.error(`[Storage] Error checking ${key}:`, error);
      }
      return false;
    }
  },

  /**
   * Store multiple key-value pairs
   * @param items Array of key-value pairs
   */
  async multiSet(items: Array<[string, string]>): Promise<void> {
    try {
      await AsyncStorage.multiSet(items);
    } catch (error) {
      if (__DEV__) {
        console.error('[Storage] Error multi-setting:', error);
      }
      throw error;
    }
  },

  /**
   * Get multiple values
   * @param keys Array of keys
   * @returns Array of values (null if key doesn't exist)
   */
  async multiGet(keys: string[]): Promise<readonly [string, string | null][]> {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      if (__DEV__) {
        console.error('[Storage] Error multi-getting:', error);
      }
      return keys.map((key) => [key, null] as [string, string | null]);
    }
  },

  /**
   * Remove multiple keys
   * @param keys Array of keys to remove
   */
  async multiRemove(keys: string[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      if (__DEV__) {
        console.error('[Storage] Error multi-removing:', error);
      }
      throw error;
    }
  },
};

/**
 * String storage operations (for non-JSON values)
 */
export const stringStorage = {
  /**
   * Store a string value
   */
  async set(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      if (__DEV__) {
        console.error(`[StringStorage] Error setting ${key}:`, error);
      }
      throw error;
    }
  },

  /**
   * Get a string value
   */
  async get(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      if (__DEV__) {
        console.error(`[StringStorage] Error getting ${key}:`, error);
      }
      return null;
    }
  },

  /**
   * Remove a string value
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      if (__DEV__) {
        console.error(`[StringStorage] Error removing ${key}:`, error);
      }
      throw error;
    }
  },
};

