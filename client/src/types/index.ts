// Type definitions for Dwellio tenant application

// User and Authentication Types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  phoneNumber: string;
  role: 'tenant';
  profilePhoto?: string;
  trustScore: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  tenantProfile: TenantProfile;
  createdAt: string;
  updatedAt: string;
}



export interface TenantProfile {
  occupation?: string;
  employerName?: string;
  monthlyIncome?: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  guarantorName?: string;
  guarantorPhone?: string;
  guarantorEmail?: string;
  currentResidence?: {
    address?: string;
    landlordName?: string;
    landlordPhone?: string;
    moveInDate?: string;
    monthlyRent?: number;
    leaseEndDate?: string;
  };
  moveOutIntent?: {
    intendedDate: string;
    reason: string;
    preferredAreas: string[];
    budgetRange: {
      min: number;
      max: number;
    };
    propertyType: string;
    facilitationRequested: boolean;
    status: 'pending' | 'processing' | 'completed';
  };
  documents: Document[];
  preferences?: {
    propertyTypes: string[];
    maxBudget: number;
    preferredAreas: string[];
    amenities: string[];
  };
}

export interface Document {
  type: 'id_card' | 'utility_bill' | 'bank_statement' | 'employment_letter' | 'passport';
  url: string;
  filename: string;
  uploadDate: string;
  verified: boolean;
  status?: 'pending' | 'verified' | 'rejected';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'tenant';
}

// Property Types
export interface Property {
  _id: string;
  title: string;
  description: string;
  type: 'apartment' | 'house' | 'room' | 'studio' | 'duplex';
  status: 'available' | 'occupied' | 'maintenance';
  isActive: boolean;
  location: {
    address: string;
    city: string;
    lga: string;
    state: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  rent: {
    amount: number;
    period: 'monthly' | 'yearly';
    currency: 'NGN';
  };
  deposit: {
    amount: number;
    currency: 'NGN';
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    toilets: number;
    parkingSpaces: number;
    floorArea?: number;
  };
  amenities: string[];
  media: {
    images: string[];
    videos?: string[];
    virtualTour?: string;
  };
  landlordId: string | {
    _id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Application Types
export interface Application {
  _id: string;
  tenantId: string | User;
  propertyId: string | Property;
  landlordId: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'withdrawn';
  message?: string;
  applicationData: {
    moveInDate: string;
    monthlyBudget: number;
    occupancy: number;
    tenantMessage?: string;
    urgency: 'low' | 'medium' | 'high';
  };
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: User;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    totalPages: number;
    currentPage: number;
    total: number;
    limit: number;
  };
  query?: Record<string, unknown>;
}

// Dashboard and Stats Types
export interface TenantStats {
  user: User;
  profileCompletion: {
    percentage: number;
    completed: number;
    total: number;
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
  trustworthinessScore: number;
  applications: number;
  currentResidence: {
    address: string;
    leaseExpiry: string;
  } | null;
  applicationStats: Array<{
    _id: string;
    count: number;
  }>;
  recentApplications: Application[];
}

// DashboardStats type for ModernTenantDashboard
export interface DashboardStats {
  activeApplications: number;
  pendingPayments: number;
  monthlyRent: number;
  maintenanceRequests: number;
}

// Activity type for ModernTenantDashboard
export interface DashboardActivity {
  id: string;
  title: string;
  type: string;
  status: string;
  timestamp: string;
}

// Form Types
export interface MoveOutIntentData {
  intendedDate: string;
  reason: string;
  preferredAreas: string[];
  budgetRange: {
    min: number;
    max: number;
  };
  propertyType: string;
  facilitationRequested: boolean;
}

export interface ApplicationFormData {
  moveInDate: string;
  monthlyBudget: number;
  occupancy: number;
  tenantMessage?: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface PropertySearchFilters {
  type?: string;
  city?: string;
  lga?: string;
  minRent?: number;
  maxRent?: number;
  bedrooms?: number;
  amenities?: string[];
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Payment Types
export interface Payment {
  _id: string;
  amount: number;
  status: string;
  paymentType: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
}

// Activity type for getRecentActivities
export interface Activity {
  _id: string;
  type: 'payment' | 'application' | 'maintenance' | 'notice';
  description: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'urgent';
}

// Dashboard summary type for getDashboardSummary
export interface DashboardSummary {
  totalApplications: number;
  totalProperties: number;
  totalPayments: number;
  monthlyRent: number;
  maintenanceRequests: number;
}
export interface MoveOutEligibility {
  eligible: boolean;
  reason?: string;
}
