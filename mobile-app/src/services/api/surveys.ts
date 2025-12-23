  /**
 * Surveys Service
 * Handles all survey-related API calls
 */

import { apiClient, API_ENDPOINTS } from './index';
import { Survey, SurveyAnswer, PaginationParams } from './types';
import { parseApiError } from '../../utils/errorHandler';

/**
 * Get surveys list response
 */
export interface GetSurveysResponse {
  surveys: Survey[];
}

/**
 * Submit survey response
 */
export interface SubmitSurveyResponse {
  isCompleted: boolean;
  golbucksReward: number;
  newBalance?: number;
}

/**
 * Survey answer (for submission)
 */
export interface SurveyAnswerSubmission {
  question_id: string;
  answer_text?: string;
  answer_options?: string[];
}

/**
 * Get my answers response
 */
export interface GetMyAnswersResponse {
  answers: Array<{
    question_id: string;
    answer_text?: string;
    answer_options?: string[];
    created_at: string;
  }>;
}

/**
 * Get active surveys list
 * @returns Active surveys list
 * @throws ApiError if request fails
 */
export const getSurveys = async (): Promise<GetSurveysResponse> => {
  try {
    const response = await apiClient.get<{ surveys: Survey[] }>(
      API_ENDPOINTS.SURVEYS.LIST
    );
    // Backend returns { success: true, data: { surveys: [...] } }
    // apiClient.get unwraps to { surveys: [...] }
    return { surveys: response.surveys || [] };
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[SurveysService] Get surveys error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Get survey by ID
 * @param id Survey ID
 * @returns Survey details with questions
 * @throws ApiError if request fails
 */
export const getSurveyById = async (id: string): Promise<Survey> => {
  try {
    const response = await apiClient.get<{ survey: Survey }>(
      API_ENDPOINTS.SURVEYS.DETAIL(id)
    );
    // Backend returns { success: true, data: { survey: {...} } }
    // apiClient.get unwraps to { survey: {...} }
    return response.survey || response as any;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[SurveysService] Get survey by ID error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Submit survey answers
 * @param surveyId Survey ID
 * @param answers Array of survey answers
 * @returns Submission result with golbucks reward
 * @throws ApiError if request fails
 */
export const submitSurvey = async (
  surveyId: string,
  answers: SurveyAnswerSubmission[]
): Promise<SubmitSurveyResponse> => {
  try {
    const response = await apiClient.post<SubmitSurveyResponse>(
      API_ENDPOINTS.SURVEYS.SUBMIT(surveyId),
      { answers }
    );

    if (__DEV__) {
      console.log('[SurveysService] Survey submitted:', surveyId, response.golbucksReward);
    }

    return response;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[SurveysService] Submit survey error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Get my answers for a survey
 * @param surveyId Survey ID
 * @returns User's answers for the survey
 * @throws ApiError if request fails
 */
export const getMyAnswers = async (surveyId: string): Promise<GetMyAnswersResponse> => {
  try {
    const response = await apiClient.get<{ answers: GetMyAnswersResponse['answers'] }>(
      `${API_ENDPOINTS.SURVEYS.DETAIL(surveyId)}/my-answers`
    );
    return { answers: response.answers };
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[SurveysService] Get my answers error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Surveys service object with all survey functions
 */
export const surveysService = {
  getSurveys,
  getSurveyById,
  submitSurvey,
  getMyAnswers,
};

export default surveysService;

