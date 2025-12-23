/**
 * Bills Service
 * Handles all bill support-related API calls
 */

import { apiClient, API_ENDPOINTS } from './index';
import { BillSupport, CreateBillSupportRequest, PaginationParams } from './types';
import { parseApiError } from '../../utils/errorHandler';

/**
 * Get bills list parameters
 */
export interface GetBillsParams extends PaginationParams {
  bill_type?: string;
  status?: 'pending' | 'supported' | 'paid';
  search?: string;
  sort?: 'created_at' | 'amount' | 'supported_by';
  order?: 'ASC' | 'DESC';
}

/**
 * Get bills list response
 */
export interface GetBillsResponse {
  billSupports: BillSupport[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Create bill support with optional image upload
 * @param data Bill support data
 * @param imageUri Optional image URI (local file path)
 * @param onProgress Optional progress callback
 * @returns Created bill support
 * @throws ApiError if request fails
 */
export const createBillSupport = async (
  data: CreateBillSupportRequest,
  imageUri?: string,
  onProgress?: (progress: number) => void
): Promise<BillSupport> => {
  try {
    // Create FormData for multipart/form-data
    const formData = new FormData();

    // Add text fields
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('subscriber_number', data.subscriber_number);
    formData.append('amount', data.amount.toString());
    formData.append('type', data.type);

    // Add image if provided
    if (imageUri) {
      const filename = imageUri.split('/').pop() || 'bill.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri: imageUri,
        type: type,
        name: filename,
      } as any);
    }

    const billSupport = await apiClient.upload<BillSupport>(
      API_ENDPOINTS.BILLS.CREATE,
      formData,
      onProgress
    );

    if (__DEV__) {
      console.log('[BillsService] Bill support created:', billSupport.id);
    }

    return billSupport;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[BillsService] Create bill support error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Get bills list (user's bill supports)
 * @param params Query parameters
 * @returns Bills list with pagination info
 * @throws ApiError if request fails
 */
export const getBills = async (params?: GetBillsParams): Promise<GetBillsResponse> => {
  try {
    // Build query string
    const queryParams: Record<string, string> = {};
    
    if (params?.bill_type) {
      queryParams.bill_type = params.bill_type;
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

    const response = await apiClient.get<{
      billSupports: BillSupport[];
      total: number;
      limit: number;
      offset: number;
    }>(API_ENDPOINTS.BILLS.LIST, { params: queryParams });

    return {
      billSupports: response.billSupports,
      total: response.total,
      limit: response.limit,
      offset: response.offset,
    };
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[BillsService] Get bills error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Get bill support by ID
 * @param id Bill support ID
 * @returns Bill support details
 * @throws ApiError if request fails
 */
export const getBillById = async (id: string): Promise<BillSupport> => {
  try {
    const response = await apiClient.get<{ billSupport: BillSupport }>(
      API_ENDPOINTS.BILLS.DETAIL(id)
    );
    return response.billSupport;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[BillsService] Get bill by ID error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Get my bills (alias for getBills)
 * @param params Query parameters
 * @returns Bills list with pagination info
 * @throws ApiError if request fails
 */
export const getMyBills = async (params?: GetBillsParams): Promise<GetBillsResponse> => {
  // Backend uses same endpoint for user's bills
  return getBills(params);
};

/**
 * Bills service object with all bill functions
 */
export const billsService = {
  createBillSupport,
  getBills,
  getBillById,
  getMyBills,
};

export default billsService;

