import React, { useState, useEffect } from 'react';
import { useLandlord } from '../context/LandlordContext';
import { landlordApi } from '../services/api';
import { User, LandlordUser } from '../types';
import {
  FiShield,
  FiPlus,
  FiSearch,
  FiMoreHorizontal,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiUsers,
  FiLock,
  FiUnlock
} from 'react-icons/fi';
import { toast } from 'react-toastify';


export default function LandlordManagement() {
  const { user, hasPermission } = useLandlord();
  const [landlordUsers, setLandlordUsers] = useState<LandlordUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLandlord, setNewLandlord] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    landlordRole: 'landlord' as 'landlord' | 'super_landlord' | 'moderator' | 'analyst',
    department: 'Operations'
  });

  // Check if user has landlord management permissions
  const canManageLandlords = user?.landlordRole === 'alpha_landlord' || hasPermission('landlord_management.read');
  const canCreateLandlords = user?.landlordRole === 'alpha_landlord' || user?.landlordRole === 'super_landlord';

  useEffect(() => {
    if (canManageLandlords) {
      loadLandlordUsers();
    }
  }, [canManageLandlords]);

  const loadLandlordUsers = async () => {
    try {
      setLoading(true);
      // This endpoint would need to be implemented in the backend
      // For now, we'll show a placeholder implementation
      setLandlordUsers([]);
    } catch (error) {
      console.error('Failed to load landlord users:', error);
      toast.error('Failed to load landlord users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLandlord = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canCreateLandlords) {
      toast.error('Access denied. Insufficient permissions.');
      return;
    }

    try {
      const response = await landlordApi.createLandlordUser({
        ...newLandlord,
        role: newLandlord.landlordRole // Map landlordRole to role for API compatibility
      });

      if (response.success) {
        toast.success('Landlord user created successfully');
        setShowCreateModal(false);
        setNewLandlord({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          password: '',
          landlordRole: 'landlord',
          department: 'Operations'
        });
        loadLandlordUsers();
      }
    } catch (error: any) {
      console.error('Failed to create landlord user:', error);
      const message = error.response?.data?.message || 'Failed to create landlord user';
      toast.error(message);
    }
  };

  const getRoleBadge = (landlordRole: string) => {
    const roleStyles: Record<string, string> = {
      alpha_landlord: 'bg-red-100 text-red-800',
      super_landlord: 'bg-purple-100 text-purple-800',
      landlord: 'bg-blue-100 text-blue-800',
      moderator: 'bg-green-100 text-green-800',
      analyst: 'bg-yellow-100 text-yellow-800',
    };

    const roleLabels: Record<string, string> = {
      alpha_landlord: 'Alpha Landlord',
      super_landlord: 'Super Landlord',
      landlord: 'Landlord',
      moderator: 'Moderator',
      analyst: 'Analyst',
    };

    return (
      <span className={`landlord-badge ${roleStyles[landlordRole] || 'bg-gray-100 text-gray-800'}`}>
        {roleLabels[landlordRole] || landlordRole}
      </span>
    );
  };

  const getStatusBadge = (security: LandlordUser['security']) => {
    if (!security?.isActive) {
      return <span className="landlord-badge-danger">Inactive</span>;
    }
    if (!security?.isVerified) {
      return <span className="landlord-badge-warning">Unverified</span>;
    }
    return <span className="landlord-badge-success">Active</span>;
  };

  if (!canManageLandlords) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
          <p className="text-gray-500 mt-2">
            You don't have permission to access landlord management.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="landlord-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading landlord users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <FiShield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Landlord Management</h1>
            <p className="text-gray-600">Manage landlordistrator accounts and permissions</p>
          </div>
        </div>

        {canCreateLandlords && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="landlord-btn-primary flex items-center"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Create Landlord
          </button>
        )}
      </div>

      {/* Landlord Users Table */}
      <div className="landlord-card overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Landlordistrator Accounts</h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search landlords..."
                  className="landlord-input pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="landlord-table">
            <thead>
              <tr>
                <th className="landlord-table-header">Landlordistrator</th>
                <th className="landlord-table-header">Role</th>
                <th className="landlord-table-header">Department</th>
                <th className="landlord-table-header">Status</th>
                <th className="landlord-table-header">Last Login</th>
                <th className="landlord-table-header">Created</th>
                <th className="landlord-table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {landlordUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="landlord-table-cell text-center text-gray-500 py-8">
                    <div className="text-center">
                      <FiUsers className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p>No landlordistrator accounts found</p>
                      {canCreateLandlords && (
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                        >
                          Create the first landlord account
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                landlordUsers.map((landlord) => (
                  <tr key={landlord._id} className="hover:bg-gray-50">
                    <td className="landlord-table-cell">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-semibold mr-3">
                          {landlord.firstName?.charAt(0) || 'A'}{landlord.lastName?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {landlord.firstName || 'Unknown'} {landlord.lastName || 'Landlord'}
                          </div>
                          <div className="text-sm text-gray-500">{landlord.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="landlord-table-cell">
                      {getRoleBadge(landlord.landlordRole || 'landlord')}
                    </td>
                    <td className="landlord-table-cell">
                      <span className="text-sm text-gray-900">
                        {landlord.profile?.department || 'N/A'}
                      </span>
                    </td>
                    <td className="landlord-table-cell">
                      {getStatusBadge(landlord.security)}
                    </td>
                    <td className="landlord-table-cell">
                      <span className="text-sm text-gray-500">
                        {landlord.security?.lastLogin
                          ? new Date(landlord.security.lastLogin).toLocaleDateString()
                          : 'Never'
                        }
                      </span>
                    </td>
                    <td className="landlord-table-cell">
                      <span className="text-sm text-gray-500">
                        {landlord.audit?.createdAt
                          ? new Date(landlord.audit.createdAt).toLocaleDateString()
                          : 'Unknown'
                        }
                      </span>
                    </td>
                    <td className="landlord-table-cell">
                      <div className="flex items-center space-x-2">
                        {landlord.landlordRole !== 'alpha_landlord' && (
                          <>
                            <button
                              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit Landlord"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Deactivate Landlord"
                            >
                              <FiLock className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded"
                          title="More actions"
                        >
                          <FiMoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Notice */}
      <div className="landlord-card border-l-4 border-yellow-400 bg-yellow-50">
        <div className="p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiShield className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Security Notice:</strong> Landlordistrator accounts have elevated privileges.
                Only create landlord accounts for trusted personnel and regularly review access.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Landlord Modal */}
      {showCreateModal && (
        <div className="landlord-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="landlord-modal" onClick={(e) => e.stopPropagation()}>
            <div className="landlord-modal-header">
              <h3 className="text-lg font-semibold text-gray-900">Create Landlordistrator Account</h3>
            </div>

            <form onSubmit={handleCreateLandlord}>
              <div className="landlord-modal-body space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={newLandlord.firstName}
                      onChange={(e) => setNewLandlord(prev => ({ ...prev, firstName: e.target.value }))}
                      className="landlord-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={newLandlord.lastName}
                      onChange={(e) => setNewLandlord(prev => ({ ...prev, lastName: e.target.value }))}
                      className="landlord-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newLandlord.email}
                    onChange={(e) => setNewLandlord(prev => ({ ...prev, email: e.target.value }))}
                    className="landlord-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newLandlord.phoneNumber}
                    onChange={(e) => setNewLandlord(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="landlord-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newLandlord.password}
                    onChange={(e) => setNewLandlord(prev => ({ ...prev, password: e.target.value }))}
                    className="landlord-input"
                    minLength={8}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Landlord Role
                    </label>
                    <select
                      value={newLandlord.landlordRole}
                      onChange={(e) => setNewLandlord(prev => ({ ...prev, landlordRole: e.target.value as any }))}
                      className="landlord-select"
                    >
                      {user?.landlordRole === 'alpha_landlord' && (
                        <option value="super_landlord">Super Landlord</option>
                      )}
                      <option value="landlord">Landlord</option>
                      <option value="moderator">Moderator</option>
                      <option value="analyst">Analyst</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={newLandlord.department}
                      onChange={(e) => setNewLandlord(prev => ({ ...prev, department: e.target.value }))}
                      className="landlord-select"
                    >
                      <option value="Operations">Operations</option>
                      <option value="Customer Support">Customer Support</option>
                      <option value="Analytics">Analytics</option>
                      <option value="Security">Security</option>
                      <option value="Management">Management</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="landlord-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="landlord-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="landlord-btn-primary"
                >
                  Create Landlord Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}