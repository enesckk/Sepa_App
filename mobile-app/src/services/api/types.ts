/**
 * API Types and Interfaces
 * Type definitions for API requests and responses
 */

/**
 * Standard API Response Wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

/**
 * User types
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  mahalle?: string;
  golbucks: number;
  role: 'user' | 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

/**
 * Auth types
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  mahalle?: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Event types
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  date: string;
  time?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  category: string;
  is_free: boolean;
  price?: number;
  capacity: number;
  registered: number;
  golbucks_reward: number;
  is_active: boolean;
  created_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  status: 'registered' | 'cancelled' | 'attended' | 'no_show';
  registration_date: string;
}

/**
 * Application types
 */
export interface Application {
  id: string;
  user_id: string;
  type: string;
  subject: string;
  description: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  image_url?: string; // Backend returns single image URL
  photos?: string[]; // For mobile app compatibility (can be populated from image_url)
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected' | 'closed';
  admin_response?: string;
  admin_response_date?: string;
  user_comment?: string;
  user_comment_date?: string;
  reference_number?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateApplicationRequest {
  type: string;
  subject: string;
  description: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  photos?: string[];
}

/**
 * Reward types
 */
export interface Reward {
  id: string;
  title: string;
  description?: string;
  category: string;
  points: number;
  stock?: number;
  validity_days?: number;
  partner_name?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface BuyRewardRequest {
  reward_id: string;
}

/**
 * Survey types
 */
export interface Survey {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'closed' | 'archived';
  golbucks_reward: number;
  expires_at?: string;
  questions: Question[];
  isCompleted?: boolean; // Added by backend if userId provided
  created_at: string;
}

export interface Question {
  id: string;
  survey_id: string;
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'rating' | 'yes_no';
  options?: string[];
  is_required: boolean;
  order: number;
}

export interface SubmitSurveyRequest {
  survey_id: string;
  answers: SurveyAnswer[];
}

export interface SurveyAnswer {
  question_id: string;
  answer: string | string[] | number;
}

/**
 * Bill Support types
 */
export interface BillSupport {
  id: string;
  user_id: string;
  bill_type: 'electricity' | 'water' | 'gas' | 'internet' | 'phone' | 'other';
  amount: number;
  description?: string;
  image_url?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid' | 'cancelled';
  admin_response?: string;
  admin_response_date?: string;
  reference_number?: string;
  created_at: string;
  updated_at?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    mahalle?: string;
  };
}

export interface CreateBillSupportRequest {
  bill_type: 'electricity' | 'water' | 'gas' | 'internet' | 'phone' | 'other';
  amount: number;
  description?: string;
}

/**
 * News types
 */
export interface News {
  id: string;
  title: string;
  content: string;
  summary?: string;
  image_url?: string;
  category: string;
  published_at?: string;
  view_count: number;
  is_active: boolean;
  created_at: string;
}

/**
 * Story types
 */
export interface Story {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  expires_at?: string;
  is_active: boolean;
  view_count: number;
  order: number;
  created_at: string;
}

/**
 * Place types
 */
export interface Place {
  id: string;
  name: string;
  description?: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  image_url?: string;
  rating?: number;
  is_active: boolean;
  created_at: string;
}

/**
 * Emergency Gathering types
 */
export interface EmergencyGatheringArea {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  address: string;
  capacity?: number;
  features?: string[];
  status: 'active' | 'inactive';
  contact_phone?: string;
  image_url?: string;
  created_at: string;
}

/**
 * Notification types
 */
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  data?: Record<string, any>;
  is_read: boolean;
  read_at?: string;
  action_url?: string;
  created_at: string;
}

/**
 * Daily Reward types
 */
export interface DailyRewardStatus {
  has_claimed: boolean;
  last_claim_date?: string;
  streak: number;
  next_claim_date: string;
  reward_amount: number;
}

/**
 * Golbucks Transaction types
 */
export interface GolbucksTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'earned' | 'spent';
  source: string;
  description?: string;
  created_at: string;
}

/**
 * Request options
 */
export interface RequestOptions {
  timeout?: number;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  signal?: AbortSignal;
}

/**
 * Upload progress callback
 */
export type UploadProgressCallback = (progress: number) => void;

