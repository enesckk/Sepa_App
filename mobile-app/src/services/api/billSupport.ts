/**
 * Bill Support Service
 * Handles all bill support (Askıda Fatura) related API calls
 */

import { apiClient, API_ENDPOINTS } from './index';
import { BillSupport, CreateBillSupportRequest, SupportBillRequest, BillSupportTransaction, PaginationParams } from './types';
import { parseApiError } from '../../utils/errorHandler';

/**
 * Get bill supports list parameters
 */
export interface GetBillSupportsParams extends PaginationParams {
  bill_type?: 'electricity' | 'water' | 'gas' | 'internet' | 'phone' | 'other';
  status?: 'pending' | 'approved' | 'rejected' | 'paid' | 'cancelled';
  search?: string;
  sort?: 'created_at' | 'updated_at' | 'amount' | 'status';
  order?: 'ASC' | 'DESC';
}

/**
 * Get bill supports list response
 */
export interface GetBillSupportsResponse {
  billSupports: BillSupport[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Create bill support with file upload
 * @param data Bill support data
 * @param photo Optional photo URI (local file path)
 * @param onProgress Optional progress callback
 * @returns Created bill support
 * @throws ApiError if request fails
 */
export const createBillSupport = async (
  data: CreateBillSupportRequest,
  photo?: string,
  onProgress?: (progress: number) => void
): Promise<BillSupport> => {
  try {
    // Create FormData for multipart/form-data
    const formData = new FormData();

    // Add text fields
    formData.append('bill_type', data.bill_type);
    formData.append('amount', data.amount.toString());
    
    if (data.description) {
      formData.append('description', data.description);
    }

    // Add photo (if provided)
    if (photo) {
      const filename = photo.split('/').pop() || 'bill.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri: photo,
        type: type,
        name: filename,
      } as any);
    }

    const response = await apiClient.upload<{ billSupport: BillSupport }>(
      API_ENDPOINTS.BILLS.CREATE,
      formData,
      onProgress
    );

    const billSupport = response.billSupport || response as any;

    if (__DEV__) {
      console.log('[BillSupportService] Bill support created:', billSupport.id);
    }

    return billSupport;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[BillSupportService] Create bill support error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Get user's bill supports
 * @param params Query parameters
 * @returns Bill supports list with pagination info
 * @throws ApiError if request fails
 */
export const getBillSupports = async (params?: GetBillSupportsParams): Promise<GetBillSupportsResponse> => {
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

    const response = await apiClient.get<GetBillSupportsResponse>(
      API_ENDPOINTS.BILLS.LIST,
      { params: queryParams }
    );

    return response;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[BillSupportService] Get bill supports error:', apiError);
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
export const getBillSupportById = async (id: string): Promise<BillSupport> => {
  try {
    const response = await apiClient.get<{ billSupport: BillSupport }>(
      API_ENDPOINTS.BILLS.DETAIL(id)
    );
    
    const billSupport = response.billSupport || response as any;
    
    return billSupport;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[BillSupportService] Get bill support by ID error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Get my bill supports (alias for getBillSupports)
 * @param params Query parameters
 * @returns Bill supports list with pagination info
 * @throws ApiError if request fails
 */
export const getMyBillSupports = async (params?: GetBillSupportsParams): Promise<GetBillSupportsResponse> => {
  // Backend uses same endpoint for user's bill supports
  return getBillSupports(params);
};

/**
 * Get public bill supports (for support tab)
 * @param params Query parameters
 * @returns Public bill supports list with pagination info
 * @throws ApiError if request fails
 */
export const getPublicBillSupports = async (params?: GetBillSupportsParams): Promise<GetBillSupportsResponse> => {
  try {
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

    const response = await apiClient.get<GetBillSupportsResponse>(
      API_ENDPOINTS.BILLS.PUBLIC,
      { params: queryParams }
    );

    if (__DEV__) {
      console.log('[BillSupportService] Public bill supports fetched:', response.billSupports?.length || 0);
    }

    return {
      billSupports: response.billSupports || [],
      total: response.total || 0,
      limit: response.limit || 50,
      offset: response.offset || 0,
    };
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[BillSupportService] Get public bill supports error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Support a bill (contribute money)
 * @param billSupportId Bill support ID
 * @param data Support data (amount, payment_method, notes)
 * @returns Created transaction
 * @throws ApiError if request fails
 */
export const supportBill = async (
  billSupportId: string,
  data: SupportBillRequest
): Promise<BillSupportTransaction> => {
  try {
    const response = await apiClient.post<{ transaction: BillSupportTransaction }>(
      API_ENDPOINTS.BILLS.SUPPORT(billSupportId),
      data
    );

    if (__DEV__) {
      console.log('[BillSupportService] Bill supported:', response.transaction?.id);
    }

    return response.transaction;
  } catch (error) {
    const apiError = parseApiError(error);
    if (__DEV__) {
      console.error('[BillSupportService] Support bill error:', apiError);
    }
    throw apiError;
  }
};

/**
 * Bill support service object with all bill support functions
 */
export const billSupportService = {
  createBillSupport,
  getBillSupports,
  getBillSupportById,
  getMyBillSupports,
  getPublicBillSupports,
  supportBill,
};

export default billSupportService;

