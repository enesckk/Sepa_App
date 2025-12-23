import { api } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  is_active: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    api.setToken(response.accessToken);
    return response;
  },

  async logout() {
    api.setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
  },

  async getCurrentUser(): Promise<User> {
    return api.get<User>('/auth/me');
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('admin_token');
  },
};

