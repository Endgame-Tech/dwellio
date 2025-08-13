import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../services/api';
import { User, UserFilters } from '../types';
import { 
  FiUsers, 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiDownload,
  FiEye,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiMoreHorizontal
} from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    search: '',
    role: undefined,
    isVerified: undefined,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('Loading users with filters:', filters);
      const response = await adminApi.getUsers(filters);
      console.log('Users API response:', response);
      
      if (response.success && response.data) {
        console.log('Setting users:', response.data);
        setUsers(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }));
  };

  const handleRoleFilter = (role: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      role: role as 'tenant' | 'landlord' | 'admin' | undefined,
      page: 1,
    }));
  };

  const handleVerificationFilter = (isVerified: boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      isVerified,
      page: 1,
    }));
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      console.log('Attempting to verify user:', userId);
      const response = await adminApi.verifyUser(userId);
      console.log('Verify user response:', response);
      
      // Immediately update the user in the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, isVerified: true } : user
        )
      );
      
      toast.success('User verified successfully');
      
      // Also reload from server to ensure consistency
      setTimeout(() => {
        console.log('Reloading users after verification...');
        loadUsers();
      }, 500);
    } catch (error: any) {
      console.error('Failed to verify user:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to verify user';
      toast.error(errorMessage);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      console.log('Attempting to delete user:', userId);
      const response = await adminApi.deleteUser(userId);
      console.log('Delete user response:', response);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete user';
      toast.error(errorMessage);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await adminApi.exportUsers(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Users exported successfully');
    } catch (error) {
      console.error('Failed to export users:', error);
      toast.error('Failed to export users');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'admin-badge-danger';
      case 'landlord':
        return 'admin-badge-warning';
      case 'tenant':
        return 'admin-badge-info';
      default:
        return 'admin-badge-info';
    }
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="admin-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <FiUsers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage tenants and landlords, verify accounts, and view user details</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="admin-btn-secondary flex items-center"
          >
            <FiDownload className="w-4 h-4 mr-2" />
            Export
          </button>
          <Link to="/admin/users/new" className="admin-btn-primary flex items-center">
            <FiPlus className="w-4 h-4 mr-2" />
            Add User
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="admin-stats-card">
          <h3 className="admin-stats-label">Total Users</h3>
          <p className="admin-stats-number">{pagination.total}</p>
        </div>
        <div className="admin-stats-card">
          <h3 className="admin-stats-label">Tenants</h3>
          <p className="admin-stats-number">
            {users.filter(u => u.role === 'tenant').length}
          </p>
        </div>
        <div className="admin-stats-card">
          <h3 className="admin-stats-label">Landlords</h3>
          <p className="admin-stats-number">
            {users.filter(u => u.role === 'landlord').length}
          </p>
        </div>
        <div className="admin-stats-card">
          <h3 className="admin-stats-label">Verified</h3>
          <p className="admin-stats-number">
            {users.filter(u => u.isVerified).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={filters.search}
              onChange={handleSearch}
              className="admin-input pl-10"
            />
          </div>
          
          {/* Role Filter */}
          <div className="flex items-center space-x-2">
            <FiFilter className="h-4 w-4 text-gray-400" />
            <select
              value={filters.role || ''}
              onChange={(e) => handleRoleFilter(e.target.value || undefined)}
              className="admin-select"
            >
              <option value="">All Roles</option>
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
            </select>
          </div>

          {/* Verification Filter */}
          <select
            value={filters.isVerified === undefined ? '' : filters.isVerified.toString()}
            onChange={(e) => handleVerificationFilter(
              e.target.value === '' ? undefined : e.target.value === 'true'
            )}
            className="admin-select"
          >
            <option value="">All Status</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-table-header">User</th>
                <th className="admin-table-header">Role</th>
                <th className="admin-table-header">Status</th>
                <th className="admin-table-header">Joined</th>
                <th className="admin-table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="admin-table-cell">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold mr-3">
                        {user.firstName?.charAt(0) || 'U'}{user.lastName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.firstName || 'Unknown'} {user.lastName || 'User'}
                        </div>
                        <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="admin-table-cell">
                    <span className={`admin-badge ${getRoleBadgeColor(user.role || 'tenant')}`}>
                      {user.role || 'tenant'}
                    </span>
                  </td>
                  <td className="admin-table-cell">
                    <div className="flex items-center">
                      {user.isVerified ? (
                        <FiCheck className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <FiX className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${user.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                  </td>
                  <td className="admin-table-cell">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </td>
                  <td className="admin-table-cell">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/admin/users/${user._id || 'unknown'}`}
                        className="text-gray-400 hover:text-blue-600 p-1 rounded"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </Link>
                      {!user.isVerified && user._id && (
                        <button
                          onClick={() => handleVerifyUser(user._id)}
                          className="text-gray-400 hover:text-green-600 p-1 rounded"
                          title="Verify User"
                        >
                          <FiCheck className="w-4 h-4" />
                        </button>
                      )}
                      {user._id && (
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded"
                          title="Delete User"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.page - 1) * (filters.limit || 10)) + 1} to{' '}
                {Math.min(pagination.page * (filters.limit || 10), pagination.total)} of{' '}
                {pagination.total} results
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page! - 1 }))}
                  disabled={pagination.page === 1}
                  className="admin-btn-secondary px-3 py-1 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page! + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="admin-btn-secondary px-3 py-1 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}