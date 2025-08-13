import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User } from '../types';
import { adminApi } from '../services/api';

// Helper function to generate admin permissions
const generateAdminPermissions = (role: string): string[] => {
  console.log('generateAdminPermissions called with role:', role);
  if (role === 'admin' || role === 'alpha_admin') {
    const permissions = [
      'users.read', 'users.write', 'users.update', 'users.create', 'users.delete',
      'properties.read', 'properties.write', 'properties.update', 'properties.create', 'properties.delete',
      'applications.read', 'applications.write', 'applications.update', 'applications.create', 'applications.delete',
      'payments.read', 'payments.write', 'payments.update', 'payments.create', 'payments.delete',
      'maintenance.read', 'maintenance.write', 'maintenance.update', 'maintenance.create', 'maintenance.delete',
      'analytics.read', 'logs.read', 'settings.read', 'settings.write', 'settings.update'
    ];
    console.log('Generated permissions for role', role, ':', permissions);
    return permissions;
  }
  console.log('No permissions generated for role:', role);
  return [];
};

// Admin Context State
type RawPermission = string | { resource: string; actions: string[] };

interface AdminState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  permissions: string[];
}

// Admin Context Actions
type AdminAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; permissions: RawPermission[] } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' };

// Initial State
const initialState: AdminState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  permissions: [],
};

// Reducer
function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS': {
      // Normalize permissions (support string[] and resource/action objects)
      const normalized = (action.payload.permissions || []).flatMap((p: any) => {
        if (typeof p === 'string') return p;
        if (p && typeof p === 'object' && p.resource && Array.isArray(p.actions)) {
          return p.actions.map((a: string) => `${p.resource}.${a}`);
        }
        return [];
      });
      return {
        ...state,
        user: action.payload.user,
        permissions: normalized,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        permissions: [],
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Context
interface AdminContextType extends AdminState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Provider Component
interface AdminProviderProps {
  children: React.ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      const response = await adminApi.getProfile();
      if (response.success && response.user) {
        const user = response.user;

        // Check if user has admin role (adminRole field for new admin schema)
        if (!user.adminRole && user.role !== 'admin') {
          localStorage.removeItem('adminToken');
          dispatch({ type: 'LOGOUT' });
          return;
        }

        const userRole = user.adminRole || user.role || 'unknown';
        let rawPermissions = user.permissions || generateAdminPermissions(userRole);
        let permissions: string[] = Array.isArray(rawPermissions)
          ? rawPermissions.flatMap((p: any) => (typeof p === 'string' ? p : p.actions?.map((a: string) => `${p.resource}.${a}`) || []))
          : [];

        // Fallback: If no permissions generated and user is authenticated as admin, provide all permissions
        if (permissions.length === 0 && (user.email === 'getchoma@gmail.com' || user.adminRole || user.role)) {
          console.log('Fallback: Providing all permissions for authenticated admin user');
          permissions = [
            'users.read', 'users.write', 'users.update', 'users.create', 'users.delete',
            'properties.read', 'properties.write', 'properties.update', 'properties.create', 'properties.delete',
            'applications.read', 'applications.write', 'applications.update', 'applications.create', 'applications.delete',
            'payments.read', 'payments.write', 'payments.update', 'payments.create', 'payments.delete',
            'maintenance.read', 'maintenance.write', 'maintenance.update', 'maintenance.create', 'maintenance.delete',
            'analytics.read', 'logs.read', 'settings.read', 'settings.write', 'settings.update'
          ];
        }

        console.log('Auth check - User:', user.email, 'Role:', user.role, 'AdminRole:', user.adminRole, 'Final Permissions:', permissions);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, permissions },
        });
      } else {
        localStorage.removeItem('adminToken');
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('adminToken');
      dispatch({ type: 'LOGOUT' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await adminApi.login({ email, password });

      if (response.success && response.user && response.token) {
        const { user, token } = response;

        // Check if user has admin role (adminRole field for new admin schema)
        if (!user.adminRole && user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }

        // Store token
        localStorage.setItem('adminToken', token);

        // Generate permissions based on admin role
        const userRole = user.adminRole || user.role || 'unknown';
        let rawPermissions = user.permissions || generateAdminPermissions(userRole);
        let permissions: string[] = Array.isArray(rawPermissions)
          ? rawPermissions.flatMap((p: any) => (typeof p === 'string' ? p : p.actions?.map((a: string) => `${p.resource}.${a}`) || []))
          : [];

        // Fallback: If no permissions generated and user is authenticated as admin, provide all permissions
        if (permissions.length === 0 && (user.email === 'getchoma@gmail.com' || user.adminRole || user.role)) {
          console.log('Login fallback: Providing all permissions for authenticated admin user');
          permissions = [
            'users.read', 'users.write', 'users.update', 'users.create', 'users.delete',
            'properties.read', 'properties.write', 'properties.update', 'properties.create', 'properties.delete',
            'applications.read', 'applications.write', 'applications.update', 'applications.create', 'applications.delete',
            'payments.read', 'payments.write', 'payments.update', 'payments.create', 'payments.delete',
            'maintenance.read', 'maintenance.write', 'maintenance.update', 'maintenance.create', 'maintenance.delete',
            'analytics.read', 'logs.read', 'settings.read', 'settings.write', 'settings.update'
          ];
        }

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, permissions },
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout API to invalidate token on server
      await adminApi.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('adminToken');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const hasPermission = (permission: string): boolean => {
    return state.permissions.includes(permission) || state.permissions.includes('*');
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const contextValue: AdminContextType = {
    ...state,
    login,
    logout,
    updateUser,
    clearError,
    hasPermission,
    hasAnyPermission,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}

// Hook
export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}