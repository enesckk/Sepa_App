/**
 * Rewards Service
 * Handles all reward-related API calls
 */

import { apiClient, API_ENDPOINTS } from './index';
import { Reward, PaginationParams } from './types';
import { parseApiError } from '../../utils/errorHandler';

/**
 * Get rewards list parameters
 */
export interface GetRewardsParams extends PaginationParams {
  category?: string;
  minPoints?: number;
  maxPoints?: number;
}

/**
 * Get rewards list response
 */
export interface GetRewardsResponse {
  rewards: Reward[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * User Reward (redeemed reward)
 */
export interface UserReward {
  id: string;
  user_id: string;
  reward_id: string;
  qr_code: string;
  reference_code: string;
  expires_at?: string;
  is_used: boolean;
  redeemed_at?: string;
  created_at: string;
  reward?: Reward;
}

/**
 * Redeem reward response
 */
export interface RedeemRewardResponse {
  userReward: UserReward;
  newBalance: number;
}

/**
 * Get rewards list
 * @param params Query parameters
 * @returns Rewards list with pagination info
 * @throws ApiError if request fails
 */
export const getRewards = async (params?: GetRewardsParams): Promise<GetRewardsResponse> => {
  try {
    // Build query string
    const queryParams: Record<string, string> = {};
    
    if (params?.category) {
      queryParams.category = params.category;
    }
    if (params?.minPoints !== undefined) {
      queryParams.minPoints = params.minPoints.toString();
    }
    if (params?.maxPoints !== undefined) {
      queryParams.maxPoints = params.maxPoints.toString();
    }
    if (params?.limit) {
      queryParams.limit = params.limit.toString();
    }
    if (params?.offset) {
      queryParams.offset = params.offset.toString();
    }

    const response = await apiClient.get<GetRewardsResponse>(
      API_ENDPOINTS.REWARDS.LIST,
      { params: queryParams }
    );

    return response;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[RewardsService] Get rewards error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Get reward by ID
 * @param id Reward ID
 * @returns Reward details
 * @throws ApiError if request fails
 */
export const getRewardById = async (id: string): Promise<Reward> => {
  try {
    const response = await apiClient.get<{ reward: Reward }>(
      API_ENDPOINTS.REWARDS.DETAIL(id)
    );
    return response.reward;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[RewardsService] Get reward by ID error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Redeem reward (purchase with golbucks)
 * @param rewardId Reward ID
 * @returns Redeemed reward data with new balance
 * @throws ApiError if request fails
 */
export const redeemReward = async (rewardId: string): Promise<RedeemRewardResponse> => {
  try {
    const response = await apiClient.post<RedeemRewardResponse>(
      API_ENDPOINTS.REWARDS.REDEEM(rewardId)
    );

    if (__DEV__) {
      console.log('[RewardsService] Reward redeemed:', rewardId);
    }

    return response;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[RewardsService] Redeem reward error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Get my rewards (user's redeemed rewards)
 * @param params Query parameters (limit, offset)
 * @returns User's rewards list
 * @throws ApiError if request fails
 */
export const getMyRewards = async (params?: PaginationParams): Promise<{
  rewards: UserReward[];
  total: number;
  limit: number;
  offset: number;
  page?: number;
  totalPages?: number;
}> => {
  try {
    const queryParams: Record<string, string> = {};
    
    if (params?.limit) {
      queryParams.limit = params.limit.toString();
    }
    if (params?.offset) {
      queryParams.offset = params.offset.toString();
    }

    // Backend returns { rewards, total, limit, offset, page, totalPages }
    const response = await apiClient.get<{
      rewards: UserReward[];
      total: number;
      limit: number;
      offset: number;
      page?: number;
      totalPages?: number;
    }>(API_ENDPOINTS.REWARDS.MY_REWARDS, { params: queryParams });

    return response;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[RewardsService] Get my rewards error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Mark reward as used
 * @param userRewardId User reward ID
 * @returns Success message
 * @throws ApiError if request fails
 */
export const useReward = async (userRewardId: string): Promise<void> => {
  try {
    await apiClient.put(API_ENDPOINTS.REWARDS.USE(userRewardId));

    if (__DEV__) {
      console.log('[RewardsService] Reward marked as used:', userRewardId);
    }
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[RewardsService] Use reward error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Rewards service object with all reward functions
 */
export const rewardsService = {
  getRewards,
  getRewardById,
  redeemReward,
  getMyRewards,
  useReward,
};

export default rewardsService;

