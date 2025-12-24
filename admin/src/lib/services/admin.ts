import { api } from '@/lib/api';

export interface PaginationParams {
  limit?: number;
  offset?: number;
  search?: string;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface UsersParams extends PaginationParams {
  role?: string;
  is_active?: string | boolean;
}

export interface EventsParams extends PaginationParams {
  category?: string;
  is_active?: boolean;
}

export interface NewsParams extends PaginationParams {
  category?: string;
}

export interface ApplicationsParams extends PaginationParams {
  type?: string;
  status?: string;
}

export interface BillSupportsParams extends PaginationParams {
  bill_type?: string;
  status?: string;
}

export interface PlacesParams extends PaginationParams {
  type?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export interface EmergencyGatheringParams extends PaginationParams {
  type?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

// Response Types
export interface UsersResponse {
  users: any[];
  total: number;
  limit: number;
  offset: number;
}

export interface EventsResponse {
  events: any[];
  total: number;
  limit: number;
  offset: number;
}

export interface StoriesResponse {
  stories: any[];
}

export interface NewsResponse {
  news: any[];
  total: number;
  limit: number;
  offset: number;
}

export interface SurveysResponse {
  surveys: any[];
}

export interface RewardsResponse {
  rewards: any[];
}

export interface ApplicationsResponse {
  applications: any[];
  total: number;
  limit: number;
  offset: number;
}

export interface BillSupportsResponse {
  billSupports: any[];
  total: number;
  limit: number;
  offset: number;
}

export interface PlacesResponse {
  places: any[];
  total: number;
}

export interface EmergencyGatheringResponse {
  areas: any[];
  total: number;
}

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  events: {
    total: number;
    active: number;
    totalRegistrations: number;
    eventsToday: number;
  };
  applications: {
    total: number;
    pending: number;
    resolved: number;
    newToday: number;
  };
  golbucks: {
    totalTransactions: number;
    totalDistributed: number;
    totalRedeemed: number;
  };
}

// Admin Service
export const adminService = {
  // Dashboard
  getDashboardStats: () => api.get<DashboardStats>('/admin/dashboard-stats'),

  // Users
  getUsers: (params?: UsersParams) =>
    api.get<UsersResponse>('/admin/users', { params }),
  updateUser: (id: string, data: any) =>
    api.put(`/admin/users/${id}`, data),
  deleteUser: (id: string) =>
    api.delete(`/admin/users/${id}`),

  // Events
  getEvents: (params?: EventsParams) =>
    api.get<EventsResponse>('/events', { params }),
  getEventById: (id: string) =>
    api.get(`/events/${id}`),
  createEvent: (data: FormData) =>
    api.upload('/admin/events', data),
  updateEvent: (id: string, data: FormData) =>
    api.upload(`/admin/events/${id}`, data, undefined, 'PUT'),
  deleteEvent: (id: string) =>
    api.delete(`/admin/events/${id}`),
  getEventRegistrations: (id: string, params?: PaginationParams) =>
    api.get(`/admin/events/${id}/registrations`, { params }),

  // Stories
  getStories: () =>
    api.get<StoriesResponse>('/stories'),
  getStoryById: (id: string) =>
    api.get(`/stories/${id}`),
  createStory: (data: FormData) =>
    api.upload('/admin/stories', data),
  updateStory: (id: string, data: FormData) =>
    api.upload(`/admin/stories/${id}`, data, undefined, 'PUT'),
  deleteStory: (id: string) =>
    api.delete(`/admin/stories/${id}`),

  // News
  getNews: (params?: NewsParams) =>
    api.get<NewsResponse>('/news', { params }),
  getNewsById: (id: string) =>
    api.get(`/news/${id}`),
  getNewsCategories: () =>
    api.get('/news/categories'),
  createNews: (data: FormData) =>
    api.upload('/admin/news', data),
  updateNews: (id: string, data: FormData) =>
    api.upload(`/admin/news/${id}`, data, undefined, 'PUT'),
  deleteNews: (id: string) =>
    api.delete(`/admin/news/${id}`),

  // Surveys
  getSurveys: (params?: PaginationParams & { status?: string; search?: string }) =>
    api.get<SurveysResponse>('/admin/surveys', { params }),
  getSurveyById: (id: string) =>
    api.get(`/surveys/${id}`),
  createSurvey: (data: {
    title: string;
    description?: string;
    status?: 'draft' | 'active' | 'closed' | 'archived';
    golbucks_reward?: number;
    expires_at?: string;
    questions?: Array<{
      text: string;
      type: 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'rating' | 'yes_no';
      options?: string[];
      is_required?: boolean;
      order?: number;
    }>;
  }) => api.post('/admin/surveys', data),
  updateSurvey: (id: string, data: {
    title?: string;
    description?: string;
    status?: 'draft' | 'active' | 'closed' | 'archived';
    golbucks_reward?: number;
    expires_at?: string;
  }) => api.put(`/admin/surveys/${id}`, data),
  deleteSurvey: (id: string) =>
    api.delete(`/admin/surveys/${id}`),
  addQuestion: (surveyId: string, data: {
    text: string;
    type: 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'rating' | 'yes_no';
    options?: string[];
    is_required?: boolean;
    order?: number;
  }) => api.post(`/admin/surveys/${surveyId}/questions`, data),
  updateQuestion: (questionId: string, data: {
    text?: string;
    type?: 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'rating' | 'yes_no';
    options?: string[];
    is_required?: boolean;
    order?: number;
  }) => api.put(`/admin/questions/${questionId}`, data),
  deleteQuestion: (questionId: string) =>
    api.delete(`/admin/questions/${questionId}`),

  // Rewards
  getRewards: () =>
    api.get<RewardsResponse>('/rewards'),
  getRewardById: (id: string) =>
    api.get(`/rewards/${id}`),
  createReward: (data: FormData) =>
    api.upload('/admin/rewards', data),
  updateReward: (id: string, data: FormData) =>
    api.upload(`/admin/rewards/${id}`, data, undefined, 'PUT'),
  deleteReward: (id: string) =>
    api.delete(`/admin/rewards/${id}`),

  // Applications
  getApplications: (params?: ApplicationsParams) =>
    api.get<ApplicationsResponse>('/admin/applications', { params }),
  getApplicationById: (id: string) =>
    api.get(`/applications/${id}`),
  updateApplicationStatus: (id: string, data: { status: string; admin_response?: string }) =>
    api.put(`/admin/applications/${id}/status`, data),

  // Bill Supports
  getBillSupports: (params?: BillSupportsParams) =>
    api.get<BillSupportsResponse>('/admin/bill-supports', { params }),
  getBillSupportById: (id: string) =>
    api.get(`/bill-supports/${id}`),
  updateBillSupportStatus: (id: string, data: { status: string; admin_response?: string }) =>
    api.put(`/admin/bill-supports/${id}/status`, data),

  // Places
  getPlaces: (params?: PlacesParams) =>
    api.get<PlacesResponse>('/places', { params }),
  getPlaceById: (id: string) =>
    api.get(`/places/${id}`),
  getPlaceCategories: () =>
    api.get('/places/categories'),

  // Emergency Gathering
  getEmergencyGatheringAreas: (params?: EmergencyGatheringParams) =>
    api.get<EmergencyGatheringResponse>('/emergency-gathering', { params }),
  getEmergencyGatheringById: (id: string) =>
    api.get(`/emergency-gathering/${id}`),

  // Notifications
  createNotification: (data: {
    user_id?: string;
    user_ids?: string[];
    title: string;
    message: string;
    type?: string;
    data?: any;
    action_url?: string;
    send_to_all?: boolean;
  }) => {
    return api.post('/admin/notifications', data);
  },
  getNotifications: (params?: PaginationParams) =>
    api.get('/notifications', { params }),
};

export default adminService;
