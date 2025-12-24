import { api } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  mahalle?: string;
  role: 'user' | 'admin' | 'super_admin';
  is_active: boolean;
  golbucks?: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  private currentUser: User | null = null;

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<any>('/auth/login', credentials);
      
      // API interceptor returns: { user: {...}, tokens: { accessToken, refreshToken } }
      const user = response.user;
      const accessToken = response.tokens?.accessToken;
      const refreshToken = response.tokens?.refreshToken;
      
      if (!user || !accessToken || !refreshToken) {
        console.error('API Response:', response);
        throw new Error('Geçersiz API yanıtı. Lütfen backend bağlantısını kontrol edin.');
      }
      
      // Check if user is admin
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        throw new Error('Admin yetkisi gerekli');
      }

      // Store tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_token', accessToken);
        localStorage.setItem('admin_refresh_token', refreshToken);
        localStorage.setItem('admin_user', JSON.stringify(user));
      }

      this.currentUser = user;
      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error: any) {
      // Network error veya bağlantı hatası
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || error.message?.includes('fetch')) {
        throw new Error('Backend sunucusuna bağlanılamıyor. Lütfen backend\'in çalıştığından emin olun.');
      }
      
      // API error
      if (error.response) {
        const message = error.response.data?.message || error.message || 'Giriş başarısız';
        throw new Error(message);
      }
      
      throw new Error(error.message || 'Giriş başarısız. Lütfen tekrar deneyin.');
    }
  }

  async logout() {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh_token');
      localStorage.removeItem('admin_user');
    }
  }

  async getCurrentUser(): Promise<User> {
    // Return cached user if available
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to get from localStorage
    if (typeof window !== 'undefined') {
      const cachedUser = localStorage.getItem('admin_user');
      if (cachedUser) {
        try {
          this.currentUser = JSON.parse(cachedUser);
          return this.currentUser!;
        } catch (e) {
          // Invalid cache, continue to fetch
        }
      }
    }

    // Fetch from API
    try {
      const user = await api.get<User>('/auth/me');
      this.currentUser = user;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_user', JSON.stringify(user));
      }

      // Check if user is admin
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        await this.logout();
        throw new Error('Admin yetkisi gerekli');
      }

      return user;
    } catch (error: any) {
      await this.logout();
      throw error;
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('admin_token');
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_token');
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_refresh_token');
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin' || this.currentUser?.role === 'super_admin';
  }

  isSuperAdmin(): boolean {
    return this.currentUser?.role === 'super_admin';
  }

  getCurrentUserSync(): User | null {
    return this.currentUser;
  }
}

export const authService = new AuthService();
