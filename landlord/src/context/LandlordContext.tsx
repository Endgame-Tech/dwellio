import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User } from '../types';
import { landlordApi } from '../services/api';

// Helper function to generate landlord permissions
const generateLandlordPermissions = (role: string): string[] => {
  console.log('generateLandlordPermissions called with role:', role);
  if (role === 'landlord' || role === 'alpha_landlord') {
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

// Landlord Context State
type RawPermission = string | { resource: string; actions: string[] };

interface LandlordState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  permissions: string[];
}

// Landlord Context Actions
type LandlordAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; permissions: RawPermission[] } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' };

// Initial State
const initialState: LandlordState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  permissions: [],
};

// Reducer
function landlordReducer(state: LandlordState, action: LandlordAction): LandlordState {
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
interface LandlordContextType extends LandlordState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

const LandlordContext = createContext<LandlordContextType | undefined>(undefined);

// Provider Component
interface LandlordProviderProps {
  children: React.ReactNode;
}

export function LandlordProvider({ children }: LandlordProviderProps) {
  const [state, dispatch] = useReducer(landlordReducer, initialState);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('landlordToken');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      const response = await landlordApi.getProfile();
      if (response.success && response.user) {
        const user = response.user;

        // Check if user has landlord role (landlordRole field for new landlord schema)
        if (!user.landlordRole && user.role !== 'landlord') {
          localStorage.removeItem('landlordToken');
          dispatch({ type: 'LOGOUT' });
          return;
        }

        const userRole = user.landlordRole || user.role || 'unknown';
        let rawPermissions = user.permissions || generateLandlordPermissions(userRole);
        let permissions: string[] = Array.isArray(rawPermissions)
          ? rawPermissions.flatMap((p: any) => (typeof p === 'string' ? p : p.actions?.map((a: string) => `${p.resource}.${a}`) || []))
          : [];

        // Fallback: If no permissions generated and user is authenticated as landlord, provide all permissions
        if (permissions.length === 0 && (user.email === 'getchoma@gmail.com' || user.landlordRole || user.role)) {
          console.log('Fallback: Providing all permissions for authenticated landlord user');
          permissions = [
            'users.read', 'users.write', 'users.update', 'users.create', 'users.delete',
            'properties.read', 'properties.write', 'properties.update', 'properties.create', 'properties.delete',
            'applications.read', 'applications.write', 'applications.update', 'applications.create', 'applications.delete',
            'payments.read', 'payments.write', 'payments.update', 'payments.create', 'payments.delete',
            'maintenance.read', 'maintenance.write', 'maintenance.update', 'maintenance.create', 'maintenance.delete',
            'analytics.read', 'logs.read', 'settings.read', 'settings.write', 'settings.update'
          ];
        }

        console.log('Auth check - User:', user.email, 'Role:', user.role, 'LandlordRole:', user.landlordRole, 'Final Permissions:', permissions);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, permissions },
        });
      } else {
        localStorage.removeItem('landlordToken');
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('landlordToken');
      dispatch({ type: 'LOGOUT' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await landlordApi.login({ email, password });

      if (response.success && response.user && response.token) {
        const { user, token } = response;

        // Check if user has landlord role (landlordRole field for new landlord schema)
        if (!user.landlordRole && user.role !== 'landlord') {
          throw new Error('Access denied. Landlord privileges required.');
        }

        // Store token
        localStorage.setItem('landlordToken', token);

        // Generate permissions based on landlord role
        const userRole = user.landlordRole || user.role || 'unknown';
        let rawPermissions = user.permissions || generateLandlordPermissions(userRole);
        let permissions: string[] = Array.isArray(rawPermissions)
          ? rawPermissions.flatMap((p: any) => (typeof p === 'string' ? p : p.actions?.map((a: string) => `${p.resource}.${a}`) || []))
          : [];

        // Fallback: If no permissions generated and user is authenticated as landlord, provide all permissions
        if (permissions.length === 0 && (user.email === 'getchoma@gmail.com' || user.landlordRole || user.role)) {
          console.log('Login fallback: Providing all permissions for authenticated landlord user');
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
      await landlordApi.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('landlordToken');
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

  const contextValue: LandlordContextType = {
    ...state,
    login,
    logout,
    updateUser,
    clearError,
    hasPermission,
    hasAnyPermission,
  };

  return (
    <LandlordContext.Provider value={contextValue}>
      {children}
    </LandlordContext.Provider>
  );
}

// Hook
export function useLandlord() {
  const context = useContext(LandlordContext);
  if (context === undefined) {
    throw new Error('useLandlord must be used within an LandlordProvider');
  }
  return context;
}