import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { adminApi } from '../services/api';
import { User, AdminUser } from '../types';
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


export default function AdminManagement() {
  const { user, hasPermission } = useAdmin();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    adminRole: 'admin' as 'admin' | 'super_admin' | 'moderator' | 'analyst',
    department: 'Operations'
  });

  // Check if user has admin management permissions
  const canManageAdmins = user?.adminRole === 'alpha_admin' || hasPermission('admin_management.read');
  const canCreateAdmins = user?.adminRole === 'alpha_admin' || user?.adminRole === 'super_admin';

  useEffect(() => {
    if (canManageAdmins) {
      loadAdminUsers();
    }
  }, [canManageAdmins]);

  const loadAdminUsers = async () => {
    try {
      setLoading(true);
      // This endpoint would need to be implemented in the backend
      // For now, we'll show a placeholder implementation
      setAdminUsers([]);
    } catch (error) {
      console.error('Failed to load admin users:', error);
      toast.error('Failed to load admin users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canCreateAdmins) {
      toast.error('Access denied. Insufficient permissions.');
      return;
    }

    try {
      const response = await adminApi.createAdminUser({
        ...newAdmin,
        role: newAdmin.adminRole // Map adminRole to role for API compatibility
      });

      if (response.success) {
        toast.success('Admin user created successfully');
        setShowCreateModal(false);
        setNewAdmin({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          password: '',
          adminRole: 'admin',
          department: 'Operations'
        });
        loadAdminUsers();
      }
    } catch (error: any) {
      console.error('Failed to create admin user:', error);
      const message = error.response?.data?.message || 'Failed to create admin user';
      toast.error(message);
    }
  };

  const getRoleBadge = (adminRole: string) => {
    const roleStyles: Record<string, string> = {
      alpha_admin: 'bg-red-100 text-red-800',
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      moderator: 'bg-green-100 text-green-800',
      analyst: 'bg-yellow-100 text-yellow-800',
    };

    const roleLabels: Record<string, string> = {
      alpha_admin: 'Alpha Admin',
      super_admin: 'Super Admin',
      admin: 'Admin',
      moderator: 'Moderator',
      analyst: 'Analyst',
    };

    return (
      <span className={`admin-badge ${roleStyles[adminRole] || 'bg-gray-100 text-gray-800'}`}>
        {roleLabels[adminRole] || adminRole}
      </span>
    );
  };

  const getStatusBadge = (security: AdminUser['security']) => {
    if (!security?.isActive) {
      return <span className="admin-badge-danger">Inactive</span>;
    }
    if (!security?.isVerified) {
      return <span className="admin-badge-warning">Unverified</span>;
    }
    return <span className="admin-badge-success">Active</span>;
  };

  if (!canManageAdmins) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
          <p className="text-gray-500 mt-2">
            You don't have permission to access admin management.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="admin-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin users...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
            <p className="text-gray-600">Manage administrator accounts and permissions</p>
          </div>
        </div>

        {canCreateAdmins && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="admin-btn-primary flex items-center"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Create Admin
          </button>
        )}
      </div>

      {/* Admin Users Table */}
      <div className="admin-card overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Administrator Accounts</h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search admins..."
                  className="admin-input pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-table-header">Administrator</th>
                <th className="admin-table-header">Role</th>
                <th className="admin-table-header">Department</th>
                <th className="admin-table-header">Status</th>
                <th className="admin-table-header">Last Login</th>
                <th className="admin-table-header">Created</th>
                <th className="admin-table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {adminUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-table-cell text-center text-gray-500 py-8">
                    <div className="text-center">
                      <FiUsers className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p>No administrator accounts found</p>
                      {canCreateAdmins && (
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                        >
                          Create the first admin account
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                adminUsers.map((admin) => (
                  <tr key={admin._id} className="hover:bg-gray-50">
                    <td className="admin-table-cell">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-semibold mr-3">
                          {admin.firstName?.charAt(0) || 'A'}{admin.lastName?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {admin.firstName || 'Unknown'} {admin.lastName || 'Admin'}
                          </div>
                          <div className="text-sm text-gray-500">{admin.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="admin-table-cell">
                      {getRoleBadge(admin.adminRole || 'admin')}
                    </td>
                    <td className="admin-table-cell">
                      <span className="text-sm text-gray-900">
                        {admin.profile?.department || 'N/A'}
                      </span>
                    </td>
                    <td className="admin-table-cell">
                      {getStatusBadge(admin.security)}
                    </td>
                    <td className="admin-table-cell">
                      <span className="text-sm text-gray-500">
                        {admin.security?.lastLogin 
                          ? new Date(admin.security.lastLogin).toLocaleDateString()
                          : 'Never'
                        }
                      </span>
                    </td>
                    <td className="admin-table-cell">
                      <span className="text-sm text-gray-500">
                        {admin.audit?.createdAt 
                          ? new Date(admin.audit.createdAt).toLocaleDateString()
                          : 'Unknown'
                        }
                      </span>
                    </td>
                    <td className="admin-table-cell">
                      <div className="flex items-center space-x-2">
                        {admin.adminRole !== 'alpha_admin' && (
                          <>
                            <button
                              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit Admin"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Deactivate Admin"
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
      <div className="admin-card border-l-4 border-yellow-400 bg-yellow-50">
        <div className="p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiShield className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Security Notice:</strong> Administrator accounts have elevated privileges. 
                Only create admin accounts for trusted personnel and regularly review access.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="admin-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="text-lg font-semibold text-gray-900">Create Administrator Account</h3>
            </div>
            
            <form onSubmit={handleCreateAdmin}>
              <div className="admin-modal-body space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={newAdmin.firstName}
                      onChange={(e) => setNewAdmin(prev => ({ ...prev, firstName: e.target.value }))}
                      className="admin-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={newAdmin.lastName}
                      onChange={(e) => setNewAdmin(prev => ({ ...prev, lastName: e.target.value }))}
                      className="admin-input"
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
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                    className="admin-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newAdmin.phoneNumber}
                    onChange={(e) => setNewAdmin(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                    className="admin-input"
                    minLength={8}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Role
                    </label>
                    <select
                      value={newAdmin.adminRole}
                      onChange={(e) => setNewAdmin(prev => ({ ...prev, adminRole: e.target.value as any }))}
                      className="admin-select"
                    >
                      {user?.adminRole === 'alpha_admin' && (
                        <option value="super_admin">Super Admin</option>
                      )}
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="analyst">Analyst</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={newAdmin.department}
                      onChange={(e) => setNewAdmin(prev => ({ ...prev, department: e.target.value }))}
                      className="admin-select"
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

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                >
                  Create Admin Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}