/**
 * Global App Context
 * Provides global state management for the entire application
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage, StorageKeys } from '../utils/storage';
import { getProfile } from '../services/api/users';
import type { User } from '../services/api/types';

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // App settings
  theme: 'light' | 'dark';
  language: 'tr' | 'en';
  notificationsEnabled: boolean;
  
  // Golbucks
  golbucks: number;
  
  // Cache flags
  lastNewsUpdate: number | null;
  lastEventsUpdate: number | null;
}

interface AppContextType extends AppState {
  // User actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => Promise<void>;
  
  // Settings actions
  setTheme: (theme: 'light' | 'dark') => Promise<void>;
  setLanguage: (language: 'tr' | 'en') => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  
  // Golbucks actions
  setGolbucks: (amount: number) => void;
  addGolbucks: (amount: number) => void;
  deductGolbucks: (amount: number) => void;
  
  // Cache actions
  updateCacheTimestamp: (key: 'news' | 'events') => void;
  
  // Refresh actions
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, setState] = useState<AppState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    theme: 'light',
    language: 'tr',
    notificationsEnabled: true,
    golbucks: 0,
    lastNewsUpdate: null,
    lastEventsUpdate: null,
  });

  // Initialize app state from storage
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Load settings from storage
      const [theme, language, notificationsEnabled, userData] = await Promise.all([
        storage.get<'light' | 'dark'>(StorageKeys.THEME) || 'light',
        storage.get<'tr' | 'en'>(StorageKeys.LANGUAGE) || 'tr',
        storage.get<boolean>(StorageKeys.NOTIFICATIONS_ENABLED) ?? true,
        storage.get<User>(StorageKeys.USER_DATA),
      ]);

      setState((prev) => ({
        ...prev,
        theme: theme || 'light',
        language: language || 'tr',
        notificationsEnabled: notificationsEnabled ?? true,
        user: userData,
        isAuthenticated: !!userData,
        isLoading: false,
      }));

      // If user is logged in, refresh user data
      if (userData) {
        try {
          const freshUser = await getProfile();
          setState((prev) => ({
            ...prev,
            user: freshUser,
            golbucks: freshUser.golbucks || 0,
          }));
        } catch (error) {
          // If refresh fails, user might be logged out
          if (__DEV__) {
            console.error('[AppContext] Error refreshing user:', error);
          }
        }
      }
    } catch (error) {
      if (__DEV__) {
        console.error('[AppContext] Error initializing app:', error);
      }
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const setUser = (user: User | null) => {
    setState((prev) => ({
      ...prev,
      user,
      isAuthenticated: !!user,
      golbucks: user?.golbucks || 0,
    }));
    
    if (user) {
      storage.set(StorageKeys.USER_DATA, user);
    } else {
      storage.remove(StorageKeys.USER_DATA);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    setState((prev) => {
      if (!prev.user) return prev;
      
      const updatedUser = { ...prev.user, ...updates };
      storage.set(StorageKeys.USER_DATA, updatedUser);
      
      return {
        ...prev,
        user: updatedUser,
        golbucks: updatedUser.golbucks || prev.golbucks,
      };
    });
  };

  const logout = async () => {
    await storage.multiRemove([
      StorageKeys.ACCESS_TOKEN,
      StorageKeys.REFRESH_TOKEN,
      StorageKeys.USER_DATA,
    ]);
    
    setState((prev) => ({
      ...prev,
      user: null,
      isAuthenticated: false,
      golbucks: 0,
    }));
  };

  const setTheme = async (theme: 'light' | 'dark') => {
    await storage.set(StorageKeys.THEME, theme);
    setState((prev) => ({ ...prev, theme }));
  };

  const setLanguage = async (language: 'tr' | 'en') => {
    await storage.set(StorageKeys.LANGUAGE, language);
    setState((prev) => ({ ...prev, language }));
  };

  const setNotificationsEnabled = async (enabled: boolean) => {
    await storage.set(StorageKeys.NOTIFICATIONS_ENABLED, enabled);
    setState((prev) => ({ ...prev, notificationsEnabled: enabled }));
  };

  const setGolbucks = (amount: number) => {
    setState((prev) => ({ ...prev, golbucks: amount }));
    if (state.user) {
      updateUser({ golbucks: amount });
    }
  };

  const addGolbucks = (amount: number) => {
    setState((prev) => {
      const newAmount = prev.golbucks + amount;
      if (prev.user) {
        updateUser({ golbucks: newAmount });
      }
      return { ...prev, golbucks: newAmount };
    });
  };

  const deductGolbucks = (amount: number) => {
    setState((prev) => {
      const newAmount = Math.max(0, prev.golbucks - amount);
      if (prev.user) {
        updateUser({ golbucks: newAmount });
      }
      return { ...prev, golbucks: newAmount };
    });
  };

  const updateCacheTimestamp = (key: 'news' | 'events') => {
    const timestamp = Date.now();
    setState((prev) => ({
      ...prev,
      [`last${key.charAt(0).toUpperCase() + key.slice(1)}Update`]: timestamp,
    } as AppState));
  };

  const refreshUser = async () => {
    try {
      const user = await getProfile();
      setUser(user);
    } catch (error) {
      if (__DEV__) {
        console.error('[AppContext] Error refreshing user:', error);
      }
      throw error;
    }
  };

  const value: AppContextType = {
    ...state,
    setUser,
    updateUser,
    logout,
    setTheme,
    setLanguage,
    setNotificationsEnabled,
    setGolbucks,
    addGolbucks,
    deductGolbucks,
    updateCacheTimestamp,
    refreshUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook to use app context
 * @throws Error if used outside AppProvider
 */
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

/**
 * Hook to use user state only
 */
export function useUser() {
  const { user, isAuthenticated, isLoading } = useApp();
  return { user, isAuthenticated, isLoading };
}

/**
 * Hook to use golbucks state only
 */
export function useGolbucks() {
  const { golbucks, addGolbucks, deductGolbucks, setGolbucks } = useApp();
  return { golbucks, addGolbucks, deductGolbucks, setGolbucks };
}

/**
 * Hook to use app settings
 */
export function useSettings() {
  const { theme, language, notificationsEnabled, setTheme, setLanguage, setNotificationsEnabled } = useApp();
  return {
    theme,
    language,
    notificationsEnabled,
    setTheme,
    setLanguage,
    setNotificationsEnabled,
  };
}

