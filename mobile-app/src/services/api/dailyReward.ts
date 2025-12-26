/**
 * Daily Reward Service
 * Handles daily reward API calls
 */

import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import { DailyRewardStatus } from './types';
import { parseApiError } from '../../utils/errorHandler';

/**
 * Claim daily reward response
 */
export interface ClaimDailyRewardResponse {
  dailyReward: number;
  streakBonus: number;
  totalReward: number;
  newStreak: number;
  newBalance: number;
}

/**
 * Claim daily reward
 * @returns Reward amount and new balance
 * @throws ApiError if request fails
 */
export const claimDailyReward = async (): Promise<ClaimDailyRewardResponse> => {
  try {
    const response = await apiClient.post<ClaimDailyRewardResponse>(
      API_ENDPOINTS.DAILY_REWARD.CLAIM
    );

    if (__DEV__) {
      console.log('[DailyRewardService] Daily reward claimed:', response);
    }

    return response;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[DailyRewardService] Claim daily reward error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Get daily reward status
 * @returns Daily reward status
 * @throws ApiError if request fails
 */
export const getDailyRewardStatus = async (): Promise<DailyRewardStatus> => {
  try {
    // apiClient.get already unwraps the ApiResponse, so we get the data directly
    const response = await apiClient.get<DailyRewardStatus>(
      API_ENDPOINTS.DAILY_REWARD.STATUS
    );
    return response;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[DailyRewardService] Get daily reward status error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Daily reward service object
 */
export const dailyRewardService = {
  claimDailyReward,
  getDailyRewardStatus,
};

export default dailyRewardService;

