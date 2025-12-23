import { api } from '@/lib/api';

export interface PaginationParams {
  limit?: number;
  offset?: number;
  search?: string;
  role?: string;
  is_active?: string | boolean;
}

export interface UsersResponse {
  users: any[];
  total: number;
  limit: number;
  offset: number;
}

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard-stats'),

  getUsers: (params?: PaginationParams) =>
    api.get<UsersResponse>('/admin/users', { params }),
};

export default adminService;

