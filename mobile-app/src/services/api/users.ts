/**
 * Users Service
 * Handles all user-related API calls
 */

import { apiClient, API_ENDPOINTS } from './index';
import { User, PaginationParams } from './types';
import { parseApiError } from '../../utils/errorHandler';

/**
 * Get user profile
 * @returns User profile
 * @throws ApiError if request fails
 */
export const getProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get<{ user: User }>(
      API_ENDPOINTS.USERS.PROFILE
    );
    return response.user;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[UsersService] Get profile error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Update user profile
 * @param data Profile update data
 * @returns Updated user profile
 * @throws ApiError if request fails
 */
export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  mahalle?: string;
}

export const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
  try {
    const response = await apiClient.put<{ user: User }>(
      API_ENDPOINTS.USERS.UPDATE_PROFILE,
      data
    );
    return response.user;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[UsersService] Update profile error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Get user golbucks balance
 * @returns Golbucks balance
 * @throws ApiError if request fails
 */
export const getGolbucksBalance = async (): Promise<number> => {
  try {
    const response = await apiClient.get<{ golbucks: number }>(
      API_ENDPOINTS.USERS.GOLBUCKS
    );
    return response.golbucks;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[UsersService] Get golbucks balance error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Get golbucks transaction history
 * @param params Query parameters
 * @returns Transaction history
 * @throws ApiError if request fails
 */
export interface GetGolbucksHistoryParams extends PaginationParams {
  type?: 'earned' | 'spent';
}

export interface GetGolbucksHistoryResponse {
  transactions: Array<{
    id: string;
    amount: number;
    type: 'earned' | 'spent';
    source: string;
    description?: string;
    created_at: string;
  }>;
  total: number;
  limit: number;
  offset: number;
}

export const getGolbucksHistory = async (
  params?: GetGolbucksHistoryParams
): Promise<GetGolbucksHistoryResponse> => {
  try {
    const queryParams: Record<string, string> = {};
    
    if (params?.type) {
      queryParams.type = params.type;
    }
    if (params?.limit) {
      queryParams.limit = params.limit.toString();
    }
    if (params?.offset) {
      queryParams.offset = params.offset.toString();
    }

    const response = await apiClient.get<GetGolbucksHistoryResponse>(
      API_ENDPOINTS.USERS.TRANSACTIONS,
      { params: queryParams }
    );

    return response;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[UsersService] Get golbucks history error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Users service object with all user functions
 */
export const usersService = {
  getProfile,
  updateProfile,
  getGolbucksBalance,
  getGolbucksHistory,
};

export default usersService;

