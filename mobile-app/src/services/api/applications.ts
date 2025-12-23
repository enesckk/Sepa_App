/**
 * Applications Service
 * Handles all application-related API calls
 */

import { apiClient, API_ENDPOINTS } from './index';
import { Application, CreateApplicationRequest, PaginationParams, PaginatedResponse } from './types';
import { parseApiError } from '../../utils/errorHandler';

/**
 * Get applications list parameters
 */
export interface GetApplicationsParams extends PaginationParams {
  type?: string;
  status?: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  search?: string;
  sort?: 'created_at' | 'updated_at' | 'status';
  order?: 'ASC' | 'DESC';
}

/**
 * Get applications list response
 */
export interface GetApplicationsResponse {
  applications: Application[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Create application with file upload
 * @param data Application data
 * @param photos Array of photo URIs (local file paths)
 * @param onProgress Optional progress callback
 * @returns Created application
 * @throws ApiError if request fails
 */
export const createApplication = async (
  data: CreateApplicationRequest,
  photos?: string[],
  onProgress?: (progress: number) => void
): Promise<Application> => {
  try {
    // Create FormData for multipart/form-data
    const formData = new FormData();

    // Add text fields
    formData.append('type', data.type);
    formData.append('subject', data.subject);
    formData.append('description', data.description);

    if (data.location) {
      formData.append('location', data.location);
    }
    if (data.latitude !== undefined) {
      formData.append('latitude', data.latitude.toString());
    }
    if (data.longitude !== undefined) {
      formData.append('longitude', data.longitude.toString());
    }

    // Add photos (if provided)
    // Note: Backend currently accepts single image via multer uploadSingle
    // We'll send the first photo, or backend can be updated to accept multiple
    if (photos && photos.length > 0) {
      // Convert photo URI to file format for React Native
      const photoUri = photos[0]; // Backend accepts single image
      const filename = photoUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri: photoUri,
        type: type,
        name: filename,
      } as any);
    }

    const application = await apiClient.upload<Application>(
      API_ENDPOINTS.APPLICATIONS.CREATE,
      formData,
      onProgress
    );

    // Convert image_url to photos array for mobile app compatibility
    if (application.image_url && !application.photos) {
      application.photos = [application.image_url];
    }

    if (__DEV__) {
      console.log('[ApplicationsService] Application created:', application.id);
    }

    return application;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[ApplicationsService] Create application error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Get user's applications
 * @param params Query parameters
 * @returns Applications list with pagination info
 * @throws ApiError if request fails
 */
export const getApplications = async (params?: GetApplicationsParams): Promise<GetApplicationsResponse> => {
  try {
    // Build query string
    const queryParams: Record<string, string> = {};
    
    if (params?.type) {
      queryParams.type = params.type;
    }
    if (params?.status) {
      queryParams.status = params.status;
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

    const response = await apiClient.get<GetApplicationsResponse>(
      API_ENDPOINTS.APPLICATIONS.LIST,
      { params: queryParams }
    );

    // Convert image_url to photos array for mobile app compatibility
    response.applications = response.applications.map((app) => {
      if (app.image_url && !app.photos) {
        app.photos = [app.image_url];
      }
      return app;
    });

    return response;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[ApplicationsService] Get applications error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Get application by ID
 * @param id Application ID
 * @returns Application details
 * @throws ApiError if request fails
 */
export const getApplicationById = async (id: string): Promise<Application> => {
  try {
    const response = await apiClient.get<{ application: Application }>(
      API_ENDPOINTS.APPLICATIONS.DETAIL(id)
    );
    
    const application = response.application;
    
    // Convert image_url to photos array for mobile app compatibility
    if (application.image_url && !application.photos) {
      application.photos = [application.image_url];
    }
    
    return application;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[ApplicationsService] Get application by ID error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Get my applications (alias for getApplications)
 * @param params Query parameters
 * @returns Applications list with pagination info
 * @throws ApiError if request fails
 */
export const getMyApplications = async (params?: GetApplicationsParams): Promise<GetApplicationsResponse> => {
  // Backend uses same endpoint for user's applications
  return getApplications(params);
};

/**
 * Add comment to application
 * @param id Application ID
 * @param comment Comment text
 * @returns Updated application
 * @throws ApiError if request fails
 */
export const addApplicationComment = async (id: string, comment: string): Promise<Application> => {
  try {
    const response = await apiClient.post<{ application: Application }>(
      API_ENDPOINTS.APPLICATIONS.COMMENT(id),
      { comment }
    );
    
    const application = response.application || response as any;
    
    // Convert image_url to photos array for mobile app compatibility
    if (application.image_url && !application.photos) {
      application.photos = [application.image_url];
    }
    
    if (__DEV__) {
      console.log('[ApplicationsService] Comment added to application:', id);
    }
    
    return application;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[ApplicationsService] Add comment error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Applications service object with all application functions
 */
export const applicationsService = {
  createApplication,
  getApplications,
  getApplicationById,
  getMyApplications,
  addComment: addApplicationComment,
};

export default applicationsService;

