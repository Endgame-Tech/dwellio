// API service for Dwellio tenant application
import type { 
  User, 
  Property, 
  Application, 
  LoginCredentials, 
  SignupData,
  ApiResponse,
  PaginatedResponse,
  MoveOutIntentData,
  ApplicationFormData,
  // PropertySearchFilters,
  TenantStats,
  Document
} from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  
  return data;
};

// Authentication API
export const authApi = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  async signup(userData: SignupData): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Tenant API
export const tenantApi = {
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/tenant/profile`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async updateProfile(profileData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/tenant/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(response);
  },

  async uploadDocument(file: File, documentType: string): Promise<ApiResponse<Document>> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tenant/documents`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    return handleResponse(response);
  },

  async uploadProfilePhoto(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tenant/profile/photo`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    return handleResponse(response);
  },

  async submitMoveOutIntent(intentData: MoveOutIntentData): Promise<ApiResponse<MoveOutIntentData>> {
    const response = await fetch(`${API_BASE_URL}/tenant/move-out-intent`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(intentData)
    });
    return handleResponse(response);
  },

  async getDashboardStats(): Promise<ApiResponse<TenantStats>> {
    const response = await fetch(`${API_BASE_URL}/tenant/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async updateCreditHistory(creditData: {
    paymentHistory?: number;
    creditUtilization?: number;
    creditLength?: number;
    creditMix?: number;
    newCredit?: number;
  }): Promise<ApiResponse<{ message: string }>> {
    const response = await fetch(`${API_BASE_URL}/tenant/credit-history`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(creditData)
    });
    return handleResponse(response);
  },

  // Define a type for the scores response
  async getScores(): Promise<ApiResponse<{ creditScore: number; rentalScore: number }>> {
    const response = await fetch(`${API_BASE_URL}/tenant/scores`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async requestMoveOutFacilitation(): Promise<ApiResponse<{ message: string }>> {
    const response = await fetch(`${API_BASE_URL}/tenant/move-out-facilitation`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse<ApiResponse<{ message: string }>>(response);
  },

  async uploadHouseImage(formData: FormData): Promise<ApiResponse<{ id: string; url: string; publicId: string }>> {
    const response = await fetch(`${API_BASE_URL}/tenant/house-images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    return handleResponse(response);
  },

  async deleteHouseImage(imageId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await fetch(`${API_BASE_URL}/tenant/house-images/${imageId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async getRecentActivities(limit?: number): Promise<ApiResponse<import('../types').Activity[]>> {
    const queryParams = limit ? `?limit=${limit}` : '';
    const response = await fetch(`${API_BASE_URL}/tenant/dashboard/activities${queryParams}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<ApiResponse<import('../types').Activity[]>>(response);
  },

  async getDashboardSummary(): Promise<ApiResponse<import('../types').DashboardSummary>> {
    const response = await fetch(`${API_BASE_URL}/tenant/dashboard/summary`, {
      headers: getAuthHeaders()
    });
    return handleResponse<ApiResponse<import('../types').DashboardSummary>>(response);
  }
};

// Properties API
export const propertiesApi = {
  async checkMoveOutEligibility(): Promise<ApiResponse<import('../types').MoveOutEligibility>> {
    const response = await fetch(`${API_BASE_URL}/properties/eligibility`, {
      headers: getAuthHeaders()
    });
    return handleResponse<ApiResponse<import('../types').MoveOutEligibility>>(response);
  },

  async getPropertyAreas(): Promise<ApiResponse<{ areas: string[] }>> {
    const response = await fetch(`${API_BASE_URL}/properties/areas`);
    return handleResponse<ApiResponse<{ areas: string[] }>>(response);
  },

  async getCuratedProperties(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Property>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/properties?${queryParams}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async getPropertyById(id: string): Promise<ApiResponse<Property>> {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async submitApplication(propertyId: string, applicationData: ApplicationFormData): Promise<ApiResponse<Application>> {
    const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/apply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(applicationData)
    });
    return handleResponse(response);
  },

  async getMyApplications(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Application>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/properties/applications/my?${queryParams}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async withdrawApplication(applicationId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await fetch(`${API_BASE_URL}/properties/applications/${applicationId}/withdraw`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Payment API
export const paymentApi = {
  async initializeFacilitationPayment(propertyId?: string): Promise<ApiResponse<{
    authorization_url: string;
    access_code: string;
    reference: string;
    amount: number;
  }>> {
    const response = await fetch(`${API_BASE_URL}/payments/facilitation/initialize`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ propertyId })
    });
    return handleResponse(response);
  },

  async verifyPayment(reference: string): Promise<ApiResponse<{
    reference: string;
    amount: number;
    status: string;
    paymentType: string;
  }>> {
    const response = await fetch(`${API_BASE_URL}/payments/verify/${reference}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async getPaymentHistory(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{
    payments: import('../types').Payment[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/payments/history?${queryParams}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async getPaymentStatus(): Promise<ApiResponse<{
    facilitationFee: {
      paid: boolean;
      amount: number | null;
      paidAt: string | null;
      reference: string | null;
    };
    canApplyToProperties: boolean;
  }>> {
    const response = await fetch(`${API_BASE_URL}/payments/status`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Export all APIs
export default {
  auth: authApi,
  tenant: tenantApi,
  properties: propertiesApi,
  payments: paymentApi
};
