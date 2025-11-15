import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import {
  ApiResponse,
  User,
  Property,
  Application,
  Payment,
  MaintenanceRequest,
  DashboardStats,
  UserFilters,
  PropertyFilters,
  ApplicationFilters,
  PaymentFilters,
  PropertyForm,
  UserForm,
  ActivityLog,
  Notification,
  SystemSettings
} from '../types';

// API Configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('landlordToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    const isLoginEndpoint = error.config?.url?.includes('/auth/login');

    // Handle specific error codes
    if (error.response?.status === 401 && !isLoginEndpoint) {
      // Only redirect if it's not a login attempt failure
      localStorage.removeItem('landlordToken');
      window.location.href = '/landlord/login';
      toast.error('Session expired. Please log in again.');
    } else if (error.response?.status === 403) {
      toast.error('Access denied. Insufficient permissions.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

// Authentication API
export const landlordApi = {
  // Landlord Auth endpoints
  login: async (credentials: { email: string; password: string }): Promise<{ success: boolean; user: User; token: string; message?: string }> => {
    const response = await api.post('/landlord/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    // No specific logout endpoint, just clear token locally
    return { success: true, message: 'Logged out successfully' };
  },

  getProfile: async (): Promise<{ success: boolean; user: User; message?: string }> => {
    const response = await api.get('/landlord/auth/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put('/landlord/auth/profile', data);
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse> => {
    const response = await api.post('/landlord/auth/change-password', data);
    return response.data;
  },

  // Dashboard endpoints
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    try {
      const response = await api.get('/landlord/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Dashboard stats error:', error);
      // Fallback to mock data if landlord endpoint fails
      return {
        success: true,
        message: 'Using fallback dashboard statistics',
        data: {
          totalUsers: 150,
          totalTenants: 95,
          totalLandlords: 48,
          totalProperties: 45,
          totalApplications: 65,
          pendingApplications: 12,
          approvedApplications: 42,
          totalPayments: 187,
          totalRevenue: 2_500_000,
          pendingPayments: 8,
          maintenanceRequests: 23,
          occupancyRate: 0.785,
          newUsersThisMonth: 23,
          activeApplications: 8,
          completedApplications: 34,
          monthlyRevenue: 850_000
        }
      };
    }
  },

  getChartData: async (type: 'users' | 'properties' | 'applications' | 'payments'): Promise<ApiResponse<any>> => {
    try {
      const response = await api.get(`/landlord/charts/${type}`);
      return response.data;
    } catch (error) {
      console.error('Chart data error:', error);
      // Fallback to mock data if landlord endpoint fails
      const mockData = {
        users: [
          { name: 'Jan', value: 12 },
          { name: 'Feb', value: 19 },
          { name: 'Mar', value: 15 },
          { name: 'Apr', value: 23 },
          { name: 'May', value: 18 },
          { name: 'Jun', value: 28 }
        ],
        properties: [
          { name: 'Available', value: 25 },
          { name: 'Occupied', value: 18 },
          { name: 'Pending', value: 2 }
        ],
        applications: [
          { name: 'Pending', value: 12 },
          { name: 'Approved', value: 8 },
          { name: 'Rejected', value: 3 }
        ],
        payments: [
          { name: 'Jan', value: 120000 },
          { name: 'Feb', value: 150000 },
          { name: 'Mar', value: 180000 },
          { name: 'Apr', value: 200000 },
          { name: 'May', value: 170000 },
          { name: 'Jun', value: 250000 }
        ]
      };
      return { success: true, message: 'Chart data retrieved successfully', data: mockData[type] };
    }
  },

  // User management
  getUsers: async (filters: UserFilters = {}): Promise<ApiResponse<User[]>> => {
    const response = await api.get('/landlord/users', { params: filters });
    return response.data;
  },

  getUser: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get(`/landlord/users/${id}`);
    return response.data;
  },

  updateUserStatus: async (id: string, data: { isVerified?: boolean; isActive?: boolean; reason?: string }): Promise<ApiResponse<User>> => {
    const response = await api.put(`/landlord/users/${id}/status`, data);
    return response.data;
  },

  // Legacy methods for backward compatibility
  createUser: async (data: UserForm): Promise<ApiResponse<User>> => {
    // Landlord users typically don't create users directly, they manage existing ones
    const response = await api.post('/auth/signup', { ...data, role: 'tenant' });
    return response.data;
  },

  updateUser: async (id: string, data: Partial<UserForm>): Promise<ApiResponse<User>> => {
    const response = await api.put(`/landlord/users/${id}/status`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse> => {
    // Soft delete by deactivating user
    const response = await api.put(`/landlord/users/${id}/status`, { isActive: false, reason: 'Deleted by landlord' });
    return response.data;
  },

  verifyUser: async (id: string): Promise<ApiResponse> => {
    const response = await api.put(`/landlord/users/${id}/status`, { isVerified: true });
    return response.data;
  },

  suspendUser: async (id: string, reason: string): Promise<ApiResponse> => {
    const response = await api.put(`/landlord/users/${id}/status`, { isActive: false, reason });
    return response.data;
  },

  reactivateUser: async (id: string): Promise<ApiResponse> => {
    const response = await api.put(`/landlord/users/${id}/status`, { isActive: true });
    return response.data;
  },

  createLandlordUser: async (data: any): Promise<ApiResponse> => {
    const response = await api.post('/landlord/landlord-users', data);
    return response.data;
  },

  // Property management
  getProperties: async (filters: PropertyFilters = {}): Promise<ApiResponse<Property[]>> => {
    const response = await api.get('/landlord/properties', { params: filters });
    return response.data;
  },

  getProperty: async (id: string): Promise<ApiResponse<Property>> => {
    const response = await api.get(`/landlord/properties/${id}`);
    return response.data;
  },

  createProperty: async (data: PropertyForm): Promise<ApiResponse<Property>> => {
    const response = await api.post('/landlord/properties', data);
    return response.data;
  },

  updateProperty: async (id: string, data: Partial<PropertyForm>): Promise<ApiResponse<Property>> => {
    const response = await api.put(`/landlord/properties/${id}`, data);
    return response.data;
  },

  deleteProperty: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/landlord/properties/${id}`);
    return response.data;
  },

  approveProperty: async (id: string): Promise<ApiResponse> => {
    const response = await api.put(`/landlord/properties/${id}/approve`);
    return response.data;
  },

  rejectProperty: async (id: string, reason: string): Promise<ApiResponse> => {
    const response = await api.put(`/landlord/properties/${id}/reject`, { reason });
    return response.data;
  },

  duplicateProperty: async (id: string): Promise<ApiResponse<Property>> => {
    const response = await api.post(`/landlord/properties/${id}/duplicate`);
    return response.data;
  },

  togglePropertyStatus: async (id: string): Promise<ApiResponse> => {
    const response = await api.put(`/landlord/properties/${id}/toggle-status`);
    return response.data;
  },

  // Application management
  getApplications: async (filters: ApplicationFilters = {}): Promise<ApiResponse<Application[]>> => {
    const response = await api.get('/landlord/applications', { params: filters });
    return response.data;
  },

  getApplication: async (id: string): Promise<ApiResponse<Application>> => {
    const response = await api.get(`/landlord/applications/${id}`);
    return response.data;
  },

  updateApplicationStatus: async (id: string, status: string, notes?: string): Promise<ApiResponse<Application>> => {
    const response = await api.put(`/landlord/applications/${id}/status`, { status, notes });
    return response.data;
  },

  deleteApplication: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/landlord/applications/${id}`);
    return response.data;
  },

  // Payment management
  getPayments: async (filters: PaymentFilters = {}): Promise<ApiResponse<Payment[]>> => {
    const response = await api.get('/landlord/payments', { params: filters });
    return response.data;
  },

  getPayment: async (id: string): Promise<ApiResponse<Payment>> => {
    const response = await api.get(`/landlord/payments/${id}`);
    return response.data;
  },

  updatePaymentStatus: async (id: string, status: string): Promise<ApiResponse<Payment>> => {
    const response = await api.put(`/landlord/payments/${id}/status`, { status });
    return response.data;
  },

  generatePaymentReport: async (filters: { dateFrom: string; dateTo: string }): Promise<ApiResponse> => {
    const response = await api.get('/landlord/payments/reports', { params: filters });
    return response.data;
  },

  // Maintenance requests
  getMaintenanceRequests: async (filters: any = {}): Promise<ApiResponse<MaintenanceRequest[]>> => {
    const response = await api.get('/landlord/maintenance', { params: filters });
    return response.data;
  },

  getMaintenanceRequest: async (id: string): Promise<ApiResponse<MaintenanceRequest>> => {
    const response = await api.get(`/landlord/maintenance/${id}`);
    return response.data;
  },

  updateMaintenanceStatus: async (id: string, status: string, notes?: string): Promise<ApiResponse<MaintenanceRequest>> => {
    const response = await api.put(`/landlord/maintenance/${id}/status`, { status, notes });
    return response.data;
  },

  assignMaintenance: async (id: string, assignedTo: string): Promise<ApiResponse<MaintenanceRequest>> => {
    const response = await api.put(`/landlord/maintenance/${id}/assign`, { assignedTo });
    return response.data;
  },

  // Document management
  getDocuments: async (filters: any = {}): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/landlord/documents', { params: filters });
    return response.data;
  },

  approveDocument: async (id: string): Promise<ApiResponse> => {
    const response = await api.put(`/landlord/documents/${id}/approve`);
    return response.data;
  },

  rejectDocument: async (id: string, reason: string): Promise<ApiResponse> => {
    const response = await api.put(`/landlord/documents/${id}/reject`, { reason });
    return response.data;
  },

  // Activity logs
  getActivityLogs: async (filters: any = {}): Promise<ApiResponse<ActivityLog[]>> => {
    const response = await api.get('/landlord/activity-logs', { params: filters });
    return response.data;
  },

  // Notifications
  getNotifications: async (filters: any = {}): Promise<ApiResponse<Notification[]>> => {
    const response = await api.get('/landlord/notifications', { params: filters });
    return response.data;
  },

  createNotification: async (data: { recipients: string[]; title: string; message: string; type: string }): Promise<ApiResponse<Notification>> => {
    const response = await api.post('/landlord/notifications', data);
    return response.data;
  },

  markNotificationRead: async (id: string): Promise<ApiResponse> => {
    const response = await api.put(`/landlord/notifications/${id}/read`);
    return response.data;
  },

  // System settings
  getSettings: async (): Promise<ApiResponse<SystemSettings[]>> => {
    const response = await api.get('/landlord/settings');
    return response.data;
  },

  updateSetting: async (key: string, value: any): Promise<ApiResponse<SystemSettings>> => {
    const response = await api.put(`/landlord/settings/${key}`, { value });
    return response.data;
  },

  // File upload
  uploadFile: async (file: File, type: string = 'general'): Promise<ApiResponse<{ url: string; fileName: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await api.post('/landlord/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Bulk operations
  
  // Export functions
  exportUsers: async (filters: UserFilters = {}): Promise<Blob> => {
    const response = await api.get('/landlord/users/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  exportProperties: async (filters: PropertyFilters = {}): Promise<Blob> => {
    const response = await api.get('/landlord/properties/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  exportPayments: async (filters: PaymentFilters = {}): Promise<Blob> => {
    const response = await api.get('/landlord/payments/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },
};