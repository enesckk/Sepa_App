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
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      // Check if user is admin
      if (response.user.role !== 'admin' && response.user.role !== 'super_admin') {
        throw new Error('Admin yetkisi gerekli');
      }

      // Store tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_token', response.accessToken);
        localStorage.setItem('admin_refresh_token', response.refreshToken);
        localStorage.setItem('admin_user', JSON.stringify(response.user));
      }

      this.currentUser = response.user;
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Giriş başarısız');
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
