/**
 * News Service
 * Handles all news-related API calls
 */

import { apiClient, API_ENDPOINTS } from './index';
import { News, PaginationParams } from './types';
import { parseApiError } from '../../utils/errorHandler';

/**
 * Get news list parameters
 */
export interface GetNewsParams extends PaginationParams {
  category?: string;
  search?: string;
  sort?: 'created_at' | 'published_at' | 'view_count' | 'title';
  order?: 'ASC' | 'DESC';
}

/**
 * Get news list response
 */
export interface GetNewsResponse {
  news: News[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * News category with count
 */
export interface NewsCategory {
  category: string;
  count: number;
}

/**
 * Get news categories response
 */
export interface GetNewsCategoriesResponse {
  categories: NewsCategory[];
}

/**
 * Get news list
 * @param params Query parameters
 * @returns News list with pagination info
 * @throws ApiError if request fails
 */
export const getNews = async (params?: GetNewsParams): Promise<GetNewsResponse> => {
  try {
    // Build query string
    const queryParams: Record<string, string> = {};
    
    if (params?.category) {
      queryParams.category = params.category;
    }
    if (params?.search) {
      queryParams.search = params.search;
    }
    if (params?.limit) {
      queryParams.limit = params.limit.toString();
    }
    if (params?.offset) {
      queryParams.offset = params.offset.toString();
    }
    if (params?.sort) {
      queryParams.sort = params.sort;
    }
    if (params?.order) {
      queryParams.order = params.order;
    }

    const response = await apiClient.get<GetNewsResponse>(
      API_ENDPOINTS.NEWS.LIST,
      { params: queryParams }
    );

    return response;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[NewsService] Get news error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Get news by ID
 * @param id News ID
 * @returns News details
 * @throws ApiError if request fails
 */
export const getNewsById = async (id: string): Promise<News> => {
  try {
    const response = await apiClient.get<{ news: News }>(
      API_ENDPOINTS.NEWS.DETAIL(id)
    );
    return response.news;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[NewsService] Get news by ID error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Get news categories with counts
 * @returns News categories with counts
 * @throws ApiError if request fails
 */
export const getNewsCategories = async (): Promise<GetNewsCategoriesResponse> => {
  try {
    const response = await apiClient.get<{ categories: NewsCategory[] }>(
      API_ENDPOINTS.NEWS.CATEGORIES
    );
    return { categories: response.categories };
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[NewsService] Get news categories error:', apiError);
    }
    throw apiError;
  }
};

/**
 * News service object with all news functions
 */
export const newsService = {
  getNews,
  getNewsById,
  getNewsCategories,
};

export default newsService;

