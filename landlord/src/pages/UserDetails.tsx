import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { landlordApi } from '../services/api';
import { User } from '../types';
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiCheck,
  FiX,
  FiMapPin,
  FiCreditCard
} from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await landlordApi.getUser(id!);

      if (response.success && response.data) {
        setUser(response.data);
      } else {
        toast.error('Failed to load user details');
        navigate('/landlord/users');
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      toast.error('Failed to load user details');
      navigate('/landlord/users');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async () => {
    if (!user?._id) return;

    try {
      console.log('Attempting to verify user:', user._id);
      const response = await landlordApi.verifyUser(user._id);
      console.log('Verify user response:', response);
      toast.success('User verified successfully');
      loadUser(); // Reload user data
    } catch (error: any) {
      console.error('Failed to verify user:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to verify user';
      toast.error(errorMessage);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'landlord-badge-danger';
      case 'landlord':
        return 'landlord-badge-warning';
      case 'tenant':
        return 'landlord-badge-info';
      default:
        return 'landlord-badge-info';
    }
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="landlord-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">User not found</p>
        <Link to="/landlord/users" className="landlord-btn-primary mt-4 inline-flex items-center">
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/landlord/users"
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
              {user.firstName?.charAt(0) || 'U'}{user.lastName?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName || 'Unknown'} {user.lastName || 'User'}
              </h1>
              <p className="text-gray-600">{user.email || 'No email'}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {!user.isVerified && (
            <button
              onClick={handleVerifyUser}
              className="landlord-btn-primary flex items-center"
            >
              <FiCheck className="w-4 h-4 mr-2" />
              Verify User
            </button>
          )}
        </div>
      </div>

      {/* User Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="landlord-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiUser className="w-5 h-5 mr-2 text-blue-600" />
            Basic Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Full Name</span>
              <span className="font-medium">{user.firstName || 'Unknown'} {user.lastName || 'User'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Email</span>
              <div className="flex items-center space-x-2">
                <FiMail className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{user.email || 'No email'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Phone</span>
              <div className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{user.phoneNumber || 'Not provided'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Role</span>
              <span className={`landlord-badge ${getRoleBadgeColor(user.role || 'tenant')}`}>
                {user.role || 'tenant'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Joined</span>
              <div className="flex items-center space-x-2">
                <FiCalendar className="w-4 h-4 text-gray-400" />
                <span className="font-medium">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="landlord-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiCreditCard className="w-5 h-5 mr-2 text-blue-600" />
            Account Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Verification Status</span>
              <div className="flex items-center space-x-2">
                {user.isVerified ? (
                  <>
                    <FiCheck className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-medium">Verified</span>
                  </>
                ) : (
                  <>
                    <FiX className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 font-medium">Unverified</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Account Status</span>
              <div className="flex items-center space-x-2">
                {user.isActive !== false ? (
                  <>
                    <FiCheck className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-medium">Active</span>
                  </>
                ) : (
                  <>
                    <FiX className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 font-medium">Inactive</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Last Login</span>
              <span className="font-medium">
                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      {user.address && (
        <div className="landlord-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiMapPin className="w-5 h-5 mr-2 text-blue-600" />
            Address Information
          </h2>
          <div className="text-gray-700">
            {typeof user.address === 'string' ? user.address :
              (user.address as any)?.street ? `${(user.address as any).street}, ${(user.address as any).city}, ${(user.address as any).state}` : 'Address not available'}
          </div>
        </div>
      )}
    </div>
  );
}