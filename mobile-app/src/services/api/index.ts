/**
 * API Services Index
 * Central export point for all API services
 */

// Export API client
export { apiClient, axiosInstance } from './client';

// Export API config
export { API_CONFIG, API_ENDPOINTS, getApiUrl, isDevelopment, isProduction } from './config';

// Export API types
export * from './types';

// Export token manager
export { tokenManager, initializeTokenManager } from './tokenManager';

// Export error handler
export {
  ApiError,
  parseApiError,
  getErrorMessage,
  isNetworkError,
  isTimeoutError,
  isAuthError,
  logError,
} from '../../utils/errorHandler';

// Export auth service
export {
  register,
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
  isAuthenticated as isUserAuthenticated,
  getAuthErrorMessage,
  authService,
} from './auth';

// Export events service
export {
  getEvents,
  getEventById,
  registerForEvent,
  cancelEventRegistration,
  getMyRegistrations,
  eventsService,
  type GetEventsParams,
  type GetEventsResponse,
  type RegisterEventResponse,
  type EventDetail,
} from './events';

// Export applications service
export {
  createApplication,
  getApplications,
  getApplicationById,
  getMyApplications,
  addApplicationComment,
  applicationsService,
  type GetApplicationsParams,
  type GetApplicationsResponse,
} from './applications';

// Export rewards service
export {
  getRewards,
  getRewardById,
  redeemReward,
  getMyRewards,
  useReward,
  rewardsService,
  type GetRewardsParams,
  type GetRewardsResponse,
  type UserReward,
  type RedeemRewardResponse,
} from './rewards';

// Export news service
export {
  getNews,
  getNewsById,
  getNewsCategories,
  newsService,
  type GetNewsParams,
  type GetNewsResponse,
  type NewsCategory,
  type GetNewsCategoriesResponse,
} from './news';

// Export daily reward service
export {
  claimDailyReward,
  getDailyRewardStatus,
  dailyRewardService,
  type ClaimDailyRewardResponse,
} from './dailyReward';

// Export bill support service
export {
  createBillSupport,
  getBillSupports,
  getBillSupportById,
  getMyBillSupports,
  getPublicBillSupports,
  supportBill,
  billSupportService,
  type GetBillSupportsParams,
  type GetBillSupportsResponse,
} from './billSupport';

// Export users service
export {
  getProfile,
  updateProfile,
  updatePassword,
  getGolbucksBalance,
  getGolbucksHistory,
  usersService,
  type UpdateProfileRequest,
  type UpdatePasswordRequest,
  type GetGolbucksHistoryParams,
  type GetGolbucksHistoryResponse,
} from './users';

// Export surveys service
export {
  getSurveys,
  getSurveyById,
  submitSurvey,
  getMyAnswers,
  surveysService,
  type GetSurveysResponse,
  type SubmitSurveyResponse,
  type SurveyAnswerSubmission,
  type GetMyAnswersResponse,
} from './surveys';

