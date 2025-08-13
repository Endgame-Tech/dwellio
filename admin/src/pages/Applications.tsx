import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../services/api';
import { Application, ApplicationFilters, User, Property } from '../types';
import {
  FiFileText,
  FiPlus,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiMoreHorizontal,
  FiGrid,
  FiList,
  FiUser,
  FiHome,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiPhone,
  FiMail,
  FiMapPin,
  FiStar,
  FiAlertCircle,
  FiMessageCircle,
  FiUpload,
  FiPaperclip,
  FiArrowUp,
  FiArrowDown,
  FiTrendingUp,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw
} from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [filters, setFilters] = useState<ApplicationFilters>({
    page: 1,
    limit: 12,
    search: '',
    status: undefined,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
    urgent: 0,
  });

  useEffect(() => {
    loadApplications();
    loadStats();
  }, [filters]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getApplications(filters);
      
      if (response.success && response.data) {
        setApplications(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
      toast.error('Failed to load applications');
      // Mock data for demo
      setApplications([
        {
          _id: '1',
          property: {
            _id: 'prop1',
            title: 'Modern 3BR Apartment',
            city: 'Lagos',
            state: 'Lagos',
          } as Property,
          tenant: {
            _id: 'user1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
          } as User,
          status: 'pending',
          applicationDate: new Date().toISOString(),
          moveInDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          rent: 1500000,
          deposit: 3000000,
          documents: [],
        } as Application,
        {
          _id: '2',
          property: {
            _id: 'prop2',
            title: 'Luxury Duplex',
            city: 'Abuja',
            state: 'FCT',
          } as Property,
          tenant: {
            _id: 'user2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
          } as User,
          status: 'under_review',
          applicationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          moveInDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          rent: 2500000,
          deposit: 5000000,
          documents: [],
        } as Application,
      ]);
      setPagination({ page: 1, pages: 1, total: 2 });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setStats({
        total: 38,
        pending: 12,
        under_review: 8,
        approved: 15,
        rejected: 3,
        urgent: 5,
      });
    } catch (error) {
      console.error('Failed to load application stats:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }));
  };

  const handleStatusFilter = (status: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      status: status as 'pending' | 'under_review' | 'approved' | 'rejected' | undefined,
      page: 1,
    }));
  };

  const handleApproveApplication = async (applicationId: string) => {
    try {
      console.log('Attempting to approve application:', applicationId);
      const response = await adminApi.updateApplicationStatus(applicationId, 'approved');
      console.log('Approve application response:', response);
      toast.success('Application approved successfully');
      loadApplications();
      loadStats();
    } catch (error: any) {
      console.error('Failed to approve application:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to approve application';
      toast.error(errorMessage);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    const reason = window.prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      console.log('Attempting to reject application:', applicationId, 'with reason:', reason);
      const response = await adminApi.updateApplicationStatus(applicationId, 'rejected', reason);
      console.log('Reject application response:', response);
      toast.success('Application rejected successfully');
      loadApplications();
      loadStats();
    } catch (error: any) {
      console.error('Failed to reject application:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to reject application';
      toast.error(errorMessage);
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject' | 'under_review') => {
    if (selectedApplications.length === 0) {
      toast.warning('Please select applications first');
      return;
    }

    const confirmMessage = `Are you sure you want to ${action} ${selectedApplications.length} application(s)?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      await Promise.all(
        selectedApplications.map(id => 
          adminApi.updateApplicationStatus(id, action)
        )
      );
      toast.success(`${selectedApplications.length} application(s) ${action}d successfully`);
      setSelectedApplications([]);
      loadApplications();
      loadStats();
    } catch (error) {
      toast.error(`Failed to ${action} applications`);
    }
  };

  const toggleSelectApplication = (id: string) => {
    setSelectedApplications(prev => 
      prev.includes(id) 
        ? prev.filter(appId => appId !== id)
        : [...prev, id]
    );
  };

  const selectAllApplications = () => {
    if (selectedApplications.length === applications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(applications.map(app => app._id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="admin-badge bg-yellow-100 text-yellow-800">Pending</span>;
      case 'under_review':
        return <span className="admin-badge bg-blue-100 text-blue-800">Under Review</span>;
      case 'approved':
        return <span className="admin-badge-success">Approved</span>;
      case 'rejected':
        return <span className="admin-badge-danger">Rejected</span>;
      default:
        return <span className="admin-badge bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getPriorityBadge = (score: number) => {
    if (score >= 80) return <span className="admin-badge bg-green-100 text-green-800">High Priority</span>;
    if (score >= 60) return <span className="admin-badge bg-yellow-100 text-yellow-800">Medium Priority</span>;
    return <span className="admin-badge bg-red-100 text-red-800">Low Priority</span>;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  // Application Card Component
  const ApplicationCard = ({ application }: { application: Application }) => {
    const tenant = application.tenant as User;
    const property = application.property as Property;
    const priorityScore = 75; // Mock score - would be calculated based on income, documents, etc.

    return (
      <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
        {/* Selection checkbox */}
        <div className="absolute top-4 left-4">
          <input
            type="checkbox"
            checked={selectedApplications.includes(application._id)}
            onChange={() => toggleSelectApplication(application._id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4 pl-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {tenant?.firstName?.charAt(0) || 'U'}{tenant?.lastName?.charAt(0) || 'N'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {tenant?.firstName || 'Unknown'} {tenant?.lastName || 'User'}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <FiMail className="w-3 h-3" />
                {tenant?.email || 'No email'}
              </p>
            </div>
          </div>
          <div className="text-right">
            {getStatusBadge(application.status)}
            <p className="text-xs text-gray-500 mt-1">
              {getTimeAgo(application.applicationDate)}
            </p>
          </div>
        </div>

        {/* Property Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{property?.title || 'Property'}</p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <FiMapPin className="w-3 h-3" />
                {property?.city || 'Unknown'}, {property?.state || 'Unknown'}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-lg text-gray-900">
                {formatCurrency(application.rent)}
              </p>
              <p className="text-xs text-gray-500">per month</p>
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Move-in Date</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(application.moveInDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Deposit</p>
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency(application.deposit)}
            </p>
          </div>
        </div>

        {/* Priority & Documents */}
        <div className="flex items-center justify-between mb-4">
          {getPriorityBadge(priorityScore)}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiPaperclip className="w-4 h-4" />
            {application.documents?.length || 0} docs
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleApproveApplication(application._id)}
              className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
              title="Approve"
            >
              <FiCheck className="w-3 h-3" />
              Approve
            </button>
            <button
              onClick={() => handleRejectApplication(application._id)}
              className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
              title="Reject"
            >
              <FiX className="w-3 h-3" />
              Reject
            </button>
          </div>
          <Link
            to={`/admin/applications/${application._id}`}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <FiEye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="admin-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <FiFileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Application Management</h1>
            <p className="text-gray-600">Review and manage rental applications</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-md transition-colors flex items-center ${
                viewMode === 'cards'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="Card View"
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors flex items-center ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="Table View"
            >
              <FiList className="w-4 h-4" />
            </button>
          </div>

          <button className="admin-btn-secondary flex items-center">
            <FiDownload className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="admin-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Applications</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiFileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="admin-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FiClock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="admin-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.under_review}</p>
              <p className="text-sm text-gray-600">Under Review</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiRefreshCw className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="admin-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="admin-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FiXCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="admin-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-orange-600">{stats.urgent}</p>
              <p className="text-sm text-gray-600">Urgent Review</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiAlertCircle className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters Section */}
      <div className="admin-card">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiFilter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <span className="text-sm text-gray-500">({pagination.total} applications found)</span>
            </div>
            <button
              onClick={() => setFilters({ page: 1, limit: 12, search: '', status: undefined })}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Applications</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by applicant name, property, or email..."
                value={filters.search}
                onChange={handleSearch}
                className="admin-input pl-10 w-full"
              />
            </div>
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleStatusFilter(e.target.value || undefined)}
                className="admin-select w-full"
              >
                <option value="">All Status</option>
                <option value="pending">⏳ Pending</option>
                <option value="under_review">🔍 Under Review</option>
                <option value="approved">✅ Approved</option>
                <option value="rejected">❌ Rejected</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select className="admin-select w-full">
                <option value="">All Types</option>
                <option value="flat">🏠 Flat</option>
                <option value="duplex">🏘️ Duplex</option>
                <option value="bungalow">🏡 Bungalow</option>
                <option value="studio">🏢 Studio</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Date</label>
              <select className="admin-select w-full">
                <option value="">All Dates</option>
                <option value="today">📅 Today</option>
                <option value="week">🗓️ This Week</option>
                <option value="month">📆 This Month</option>
                <option value="custom">🔧 Custom Range</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select className="admin-select w-full">
                <option value="">All Priorities</option>
                <option value="high">🔥 High Priority</option>
                <option value="medium">⚡ Medium Priority</option>
                <option value="low">📋 Low Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Filters & Bulk Actions */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Quick filters:</span>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors">
                  Needs Review
                </button>
                <button className="px-3 py-1 text-xs bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-colors">
                  Missing Documents
                </button>
                <button className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 transition-colors">
                  High Income
                </button>
                <button className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors">
                  Complete Applications
                </button>
              </div>
            </div>
            
            {/* Bulk Actions */}
            {selectedApplications.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{selectedApplications.length} selected:</span>
                <button
                  onClick={() => handleBulkAction('approve')}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Bulk Approve
                </button>
                <button
                  onClick={() => handleBulkAction('reject')}
                  className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Bulk Reject
                </button>
                <button
                  onClick={() => handleBulkAction('under_review')}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Mark for Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Applications Content */}
      {viewMode === 'cards' ? (
        /* Card View */
        <div className="space-y-6">
          {/* Select All */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedApplications.length === applications.length && applications.length > 0}
              onChange={selectAllApplications}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              Select all ({applications.length} applications)
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="admin-card p-12 text-center">
              <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No applications found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((application) => (
                <ApplicationCard key={application._id} application={application} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-table-header">
                    <input
                      type="checkbox"
                      checked={selectedApplications.length === applications.length && applications.length > 0}
                      onChange={selectAllApplications}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="admin-table-header">Applicant</th>
                  <th className="admin-table-header">Property</th>
                  <th className="admin-table-header">Status</th>
                  <th className="admin-table-header">Rent</th>
                  <th className="admin-table-header">Move-in Date</th>
                  <th className="admin-table-header">Applied</th>
                  <th className="admin-table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="admin-table-cell text-center text-gray-500 py-8">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  applications.map((application) => {
                    const tenant = application.tenant as User;
                    const property = application.property as Property;

                    return (
                      <tr key={application._id} className="hover:bg-gray-50">
                        <td className="admin-table-cell">
                          <input
                            type="checkbox"
                            checked={selectedApplications.includes(application._id)}
                            onChange={() => toggleSelectApplication(application._id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="admin-table-cell">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                              {tenant?.firstName?.charAt(0) || 'U'}{tenant?.lastName?.charAt(0) || 'N'}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {tenant?.firstName || 'Unknown'} {tenant?.lastName || 'User'}
                              </div>
                              <div className="text-sm text-gray-500">{tenant?.email || 'No email'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="admin-table-cell">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {property?.title || 'Unknown Property'}
                            </div>
                            <div className="text-gray-500">
                              {property?.city || 'Unknown'}, {property?.state || 'Unknown'}
                            </div>
                          </div>
                        </td>
                        <td className="admin-table-cell">
                          {getStatusBadge(application.status)}
                        </td>
                        <td className="admin-table-cell">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {formatCurrency(application.rent)}
                            </div>
                            <div className="text-gray-500">per month</div>
                          </div>
                        </td>
                        <td className="admin-table-cell">
                          <span className="text-sm text-gray-900">
                            {new Date(application.moveInDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="admin-table-cell">
                          <span className="text-sm text-gray-500">
                            {getTimeAgo(application.applicationDate)}
                          </span>
                        </td>
                        <td className="admin-table-cell">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleApproveApplication(application._id)}
                              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                              title="Approve"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectApplication(application._id)}
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                              title="Reject"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                            <Link
                              to={`/admin/applications/${application._id}`}
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              title="View Details"
                            >
                              <FiEye className="w-4 h-4" />
                            </Link>
                            <button
                              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                              title="More actions"
                            >
                              <FiMoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className={`${viewMode === 'cards' ? 'admin-card' : ''} ${viewMode === 'table' ? 'border-t border-gray-200' : 'p-6'}`}>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(pagination.page - 1) * (filters.limit || 12) + 1} to{' '}
              {Math.min(pagination.page * (filters.limit || 12), pagination.total)} of{' '}
              {pagination.total} applications
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
                disabled={pagination.page === 1}
                className="admin-btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: Math.min(pagination.pages, (prev.page || 1) + 1) }))}
                disabled={pagination.page === pagination.pages}
                className="admin-btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}