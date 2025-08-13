// User Types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: 'tenant' | 'landlord' | 'admin';
  isVerified: boolean;
  isActive?: boolean;
  lastLoginAt?: string;
  address?: string;
  adminRole?: 'admin' | 'alpha_admin' | 'super_admin' | 'moderator' | 'analyst';
  // Permissions can be a flat list of permission strings or structured by resource/action for admins
  permissions?: string[] | Array<{ resource: string; actions: string[] }>;
  createdAt: string;
  updatedAt: string;
  tenantProfile?: TenantProfile;
  landlordProfile?: LandlordProfile;
}

// Admin User Type (extends User for admin-specific fields)
export interface AdminUser extends User {
  adminRole: 'admin' | 'alpha_admin' | 'super_admin' | 'moderator' | 'analyst';
  permissions?: Array<{
    resource: string;
    actions: string[];
  }> | string[];
  profile?: {
    department?: string;
    phoneNumber?: string;
    timezone?: string;
    language?: string;
    bio?: string;
  };
  security?: {
    isActive: boolean;
    isVerified: boolean;
    twoFactorEnabled?: boolean;
    lastLogin?: string;
  };
  audit?: {
    createdAt: string;
    createdBy?: string;
    lastLoginAt?: string;
  };
}

export interface TenantProfile {
  occupation?: string;
  monthlyIncome?: number;
  employerName?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  documents?: Document[];
  currentResidence?: CurrentResidence;
}

export interface LandlordProfile {
  companyName?: string;
  businessRegistrationNumber?: string;
  taxIdentificationNumber?: string;
  bankAccountDetails?: BankDetails;
  documents?: Document[];
}

export interface CurrentResidence {
  address: string;
  landlordName?: string;
  landlordPhone?: string;
  moveInDate?: string;
  leaseEndDate?: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  sortCode?: string;
}

// Document Types
export interface Document {
  _id: string;
  type: 'id_card' | 'bank_statement' | 'employment_letter' | 'utility_bill' | 'cac_certificate' | 'tax_certificate';
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
}

// Property Types
export interface Property {
  _id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  price: number;
  propertyType: 'apartment' | 'house' | 'studio' | 'duplex';
  type: 'flat' | 'duplex' | 'bungalow' | 'studio' | 'shop' | 'office';
  status: 'available' | 'occupied' | 'pending';
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  images: string[] | PropertyImage[];
  landlord: string | User;
  landlordContact?: {
    name: string;
    email?: string;
    phone?: string;
  };
  location?: {
    city: string;
    state: string;
    country?: string;
  };
  rent?: {
    amount: number;
    period: 'month' | 'year';
  };
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  units?: Unit[];
}

export interface Unit {
  _id: string;
  unitNumber: string;
  property: string | Property;
  rent: number;
  deposit: number;
  isOccupied: boolean;
  tenant?: string | User;
  leaseStart?: string;
  leaseEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyImage {
  _id: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
  order: number;
}

// Application Types
export interface Application {
  _id: string;
  property: string | Property;
  tenant: string | User;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  applicationDate: string;
  moveInDate: string;
  rent: number;
  deposit: number;
  notes?: string;
  documents: Document[];
  reviewedBy?: string | User;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Payment Types
export interface Payment {
  _id: string;
  tenant: string | User;
  property: string | Property;
  unit?: string | Unit;
  amount: number;
  type: 'rent' | 'deposit' | 'fee' | 'maintenance';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: 'bank_transfer' | 'card' | 'cash' | 'cheque';
  reference: string;
  dueDate: string;
  paidDate?: string;
  description?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Contract Types
export interface Contract {
  _id: string;
  tenant: string | User;
  landlord: string | User;
  property: string | Property;
  unit?: string | Unit;
  startDate: string;
  endDate: string;
  rent: number;
  deposit: number;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  terms: string[];
  contractUrl?: string;
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Maintenance Types
export interface MaintenanceRequest {
  _id: string;
  tenant: string | User;
  property: string | Property;
  unit?: string | Unit;
  title: string;
  description: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'submitted' | 'acknowledged' | 'in_progress' | 'completed' | 'cancelled';
  images?: string[];
  estimatedCost?: number;
  actualCost?: number;
  assignedTo?: string;
  scheduledDate?: string;
  completedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalUsers: number;
  totalTenants: number;
  totalLandlords: number;
  totalProperties: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  totalPayments: number;
  totalRevenue: number;
  pendingPayments: number;
  maintenanceRequests: number;
  occupancyRate: number;
  newUsersThisMonth: number;
  activeApplications: number;
  completedApplications: number;
  monthlyRevenue: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
}

// Filter and Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserFilters extends PaginationParams {
  role?: 'tenant' | 'landlord' | 'admin';
  isVerified?: boolean;
  search?: string;
  createdFrom?: string;
  createdTo?: string;
}

export interface PropertyFilters extends PaginationParams {
  propertyType?: string;
  type?: 'flat' | 'duplex' | 'bungalow' | 'studio' | 'shop' | 'office';
  status?: 'available' | 'occupied' | 'pending';
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  search?: string;
}

export interface ApplicationFilters extends PaginationParams {
  status?: 'pending' | 'under_review' | 'approved' | 'rejected';
  property?: string;
  tenant?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaymentFilters extends PaginationParams {
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
  type?: 'rent' | 'deposit' | 'fee' | 'maintenance';
  tenant?: string;
  property?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Form Types
export interface PropertyForm {
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  price: number;
  propertyType: 'apartment' | 'house' | 'studio' | 'duplex';
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  isActive: boolean;
  isFeatured: boolean;
}

export interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: 'tenant' | 'landlord' | 'admin';
}

// Activity Log Types
export interface ActivityLog {
  _id: string;
  user: string | User;
  action: string;
  resource: string;
  resourceId: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Notification Types
export interface Notification {
  _id: string;
  recipient: string | User;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: string;
  readAt?: string;
}

// System Settings Types
export interface SystemSettings {
  _id: string;
  key: string;
  value: any;
  description?: string;
  category: 'general' | 'payment' | 'notification' | 'security';
  updatedBy: string | User;
  updatedAt: string;
}