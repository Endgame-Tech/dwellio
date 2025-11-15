import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { landlordApi } from '../services/api';
import { MaintenanceRequest, User, Property } from '../types';
import {
  FiTool,
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
  FiRefreshCw,
  FiDroplet,
  FiZap,
  FiWind,
  FiSettings,
  FiActivity,
  FiPlay,
  FiPause,
  FiUserCheck,
  FiImage,
  FiFlag,
  FiTarget,
  FiCpu
} from 'react-icons/fi';
import { toast } from 'react-toastify';

// Maintenance Filters interface
interface MaintenanceFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'submitted' | 'acknowledged' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'other';
  dateFrom?: string;
  dateTo?: string;
}

export default function Maintenance() {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [filters, setFilters] = useState<MaintenanceFilters>({
    page: 1,
    limit: 12,
    search: '',
    status: undefined,
    priority: undefined,
    category: undefined,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    acknowledged: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
    urgent: 0,
    overdue: 0,
    avgCompletionTime: 0,
    totalCost: 0,
  });

  useEffect(() => {
    loadMaintenanceRequests();
    loadStats();
  }, [filters]);

  const loadMaintenanceRequests = async () => {
    try {
      setLoading(true);
      const response = await landlordApi.getMaintenanceRequests(filters);

      if (response.success && response.data) {
        setMaintenanceRequests(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to load maintenance requests:', error);
      toast.error('Failed to load maintenance requests');
      // Mock data for demo
      setMaintenanceRequests([
        {
          _id: '1',
          tenant: {
            _id: 'user1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
          } as User,
          property: {
            _id: 'prop1',
            title: 'Modern 3BR Apartment',
            city: 'Lagos',
            state: 'Lagos',
            address: '123 Victoria Island, Lagos'
          } as Property,
          title: 'Leaking Kitchen Faucet',
          description: 'The kitchen faucet has been leaking continuously for the past 3 days. Water is dripping even when fully closed.',
          category: 'plumbing',
          priority: 'medium',
          status: 'submitted',
          images: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=300'],
          estimatedCost: 15000,
          actualCost: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as MaintenanceRequest,
        {
          _id: '2',
          tenant: {
            _id: 'user2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
          } as User,
          property: {
            _id: 'prop2',
            title: 'Luxury Duplex',
            city: 'Abuja',
            state: 'FCT',
            address: '456 Maitama District, Abuja'
          } as Property,
          title: 'Air Conditioning Not Working',
          description: 'The main AC unit stopped working yesterday. Room is getting very hot and humid.',
          category: 'hvac',
          priority: 'high',
          status: 'in_progress',
          assignedTo: 'tech-001',
          images: [],
          estimatedCost: 75000,
          actualCost: 0,
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        } as MaintenanceRequest,
        {
          _id: '3',
          tenant: {
            _id: 'user3',
            firstName: 'Mike',
            lastName: 'Johnson',
            email: 'mike.johnson@example.com',
          } as User,
          property: {
            _id: 'prop3',
            title: 'Studio Apartment',
            city: 'Lagos',
            state: 'Lagos',
            address: '789 Ikeja GRA, Lagos'
          } as Property,
          title: 'Electrical Outlet Sparking',
          description: 'One of the electrical outlets in the bedroom is sparking when plugging in devices. Safety concern.',
          category: 'electrical',
          priority: 'urgent',
          status: 'acknowledged',
          images: [],
          estimatedCost: 25000,
          actualCost: 0,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        } as MaintenanceRequest,
      ]);
      setPagination({ page: 1, pages: 1, total: 3 });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setStats({
        total: 47,
        submitted: 12,
        acknowledged: 8,
        in_progress: 15,
        completed: 9,
        cancelled: 3,
        urgent: 5,
        overdue: 7,
        avgCompletionTime: 3.2,
        totalCost: 2150000,
      });
    } catch (error) {
      console.error('Failed to load maintenance stats:', error);
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
      status: status as 'submitted' | 'acknowledged' | 'in_progress' | 'completed' | 'cancelled' | undefined,
      page: 1,
    }));
  };

  const handlePriorityFilter = (priority: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      priority: priority as 'low' | 'medium' | 'high' | 'urgent' | undefined,
      page: 1,
    }));
  };

  const handleCategoryFilter = (category: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      category: category as 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'other' | undefined,
      page: 1,
    }));
  };

  const handleUpdateStatus = async (requestId: string, status: string, notes?: string) => {
    try {
      console.log('Updating maintenance status:', requestId, status);
      const response = await landlordApi.updateMaintenanceStatus(requestId, status, notes);
      console.log('Update maintenance response:', response);
      toast.success(`Request ${status} successfully`);
      loadMaintenanceRequests();
      loadStats();
    } catch (error: any) {
      console.error('Failed to update maintenance status:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update status';
      toast.error(errorMessage);
    }
  };

  const handleAssignTechnician = async (requestId: string) => {
    const technicianId = window.prompt('Enter technician ID:');
    if (!technicianId) return;

    try {
      console.log('Assigning technician:', requestId, technicianId);
      const response = await landlordApi.assignMaintenance(requestId, technicianId);
      console.log('Assign technician response:', response);
      toast.success('Technician assigned successfully');
      loadMaintenanceRequests();
      loadStats();
    } catch (error: any) {
      console.error('Failed to assign technician:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to assign technician';
      toast.error(errorMessage);
    }
  };

  const handleBulkAction = async (action: 'acknowledge' | 'in_progress' | 'completed' | 'cancel') => {
    if (selectedRequests.length === 0) {
      toast.warning('Please select requests first');
      return;
    }

    const confirmMessage = `Are you sure you want to ${action} ${selectedRequests.length} request(s)?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      await Promise.all(
        selectedRequests.map(id =>
          landlordApi.updateMaintenanceStatus(id, action)
        )
      );
      toast.success(`${selectedRequests.length} request(s) ${action}d successfully`);
      setSelectedRequests([]);
      loadMaintenanceRequests();
      loadStats();
    } catch (error) {
      toast.error(`Failed to ${action} requests`);
    }
  };

  const toggleSelectRequest = (id: string) => {
    setSelectedRequests(prev =>
      prev.includes(id)
        ? prev.filter(reqId => reqId !== id)
        : [...prev, id]
    );
  };

  const selectAllRequests = () => {
    if (selectedRequests.length === maintenanceRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(maintenanceRequests.map(req => req._id));
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
      case 'submitted':
        return <span className="landlord-badge bg-gray-100 text-gray-800">Submitted</span>;
      case 'acknowledged':
        return <span className="landlord-badge bg-blue-100 text-blue-800">Acknowledged</span>;
      case 'in_progress':
        return <span className="landlord-badge bg-yellow-100 text-yellow-800">In Progress</span>;
      case 'completed':
        return <span className="landlord-badge-success">Completed</span>;
      case 'cancelled':
        return <span className="landlord-badge-danger">Cancelled</span>;
      default:
        return <span className="landlord-badge bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <span className="landlord-badge bg-green-100 text-green-800">Low</span>;
      case 'medium':
        return <span className="landlord-badge bg-yellow-100 text-yellow-800">Medium</span>;
      case 'high':
        return <span className="landlord-badge bg-orange-100 text-orange-800">High</span>;
      case 'urgent':
        return <span className="landlord-badge bg-red-100 text-red-800">🚨 Urgent</span>;
      default:
        return <span className="landlord-badge bg-gray-100 text-gray-800">{priority}</span>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'plumbing':
        return <FiDroplet className="w-4 h-4 text-blue-600" />;
      case 'electrical':
        return <FiZap className="w-4 h-4 text-yellow-600" />;
      case 'hvac':
        return <FiWind className="w-4 h-4 text-green-600" />;
      case 'appliance':
        return <FiCpu className="w-4 h-4 text-purple-600" />;
      case 'structural':
        return <FiHome className="w-4 h-4 text-gray-600" />;
      default:
        return <FiTool className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  // Maintenance Request Card Component
  const MaintenanceCard = ({ request }: { request: MaintenanceRequest }) => {
    const tenant = request.tenant as User;
    const property = request.property as Property;
    const isOverdue = request.scheduledDate && new Date(request.scheduledDate) < new Date() && request.status !== 'completed';

    return (
      <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
        {/* Selection checkbox */}
        <div className="absolute top-4 left-4">
          <input
            type="checkbox"
            checked={selectedRequests.includes(request._id)}
            onChange={() => toggleSelectRequest(request._id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4 pl-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white">
              {getCategoryIcon(request.category)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {request.title}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <FiUser className="w-3 h-3" />
                {tenant?.firstName || 'Unknown'} {tenant?.lastName || 'User'}
              </p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            {getPriorityBadge(request.priority)}
            {isOverdue && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                Overdue
              </span>
            )}
          </div>
        </div>

        {/* Property Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{property?.title || 'Property'}</p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <FiMapPin className="w-3 h-3" />
                {property?.address || `${property?.city}, ${property?.state}`}
              </p>
            </div>
            <div className="text-right">
              {getStatusBadge(request.status)}
              <p className="text-xs text-gray-500 mt-1">
                {getTimeAgo(request.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Request Description */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">
            {request.description}
          </p>
        </div>

        {/* Request Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Category</p>
            <p className="text-sm font-medium text-gray-900 capitalize flex items-center gap-1">
              {getCategoryIcon(request.category)}
              {request.category}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Estimated Cost</p>
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency(request.estimatedCost || 0)}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiPaperclip className="w-4 h-4" />
            {request.images?.length || 0} photos
          </div>
          {request.assignedTo && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <FiUserCheck className="w-4 h-4" />
              Assigned
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {request.status === 'submitted' && (
              <button
                onClick={() => handleUpdateStatus(request._id, 'acknowledged')}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
                title="Acknowledge"
              >
                <FiCheck className="w-3 h-3" />
                Acknowledge
              </button>
            )}
            {request.status === 'acknowledged' && (
              <button
                onClick={() => handleUpdateStatus(request._id, 'in_progress')}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-lg hover:bg-yellow-200 transition-colors flex items-center gap-1"
                title="Start Work"
              >
                <FiPlay className="w-3 h-3" />
                Start
              </button>
            )}
            {request.status === 'in_progress' && (
              <button
                onClick={() => handleUpdateStatus(request._id, 'completed')}
                className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
                title="Complete"
              >
                <FiCheckCircle className="w-3 h-3" />
                Complete
              </button>
            )}
            {!request.assignedTo && request.status !== 'completed' && (
              <button
                onClick={() => handleAssignTechnician(request._id)}
                className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-1"
                title="Assign Technician"
              >
                <FiUserCheck className="w-3 h-3" />
                Assign
              </button>
            )}
          </div>
          <Link
            to={`/landlord/maintenance/${request._id}`}
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
          <div className="landlord-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading maintenance requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
            <FiTool className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Maintenance Management</h1>
            <p className="text-gray-600">Handle maintenance requests and track repairs</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-md transition-colors flex items-center ${viewMode === 'cards'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
              title="Card View"
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors flex items-center ${viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
              title="Table View"
            >
              <FiList className="w-4 h-4" />
            </button>
          </div>

          <button className="landlord-btn-secondary flex items-center">
            <FiDownload className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="landlord-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Requests</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiTool className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="landlord-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.in_progress}</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FiRefreshCw className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="landlord-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
              <p className="text-sm text-gray-600">Urgent</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FiAlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="landlord-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="landlord-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalCost)}</p>
              <p className="text-sm text-gray-600">Total Cost</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters Section */}
      <div className="landlord-card">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiFilter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <span className="text-sm text-gray-500">({pagination.total} requests found)</span>
            </div>
            <button
              onClick={() => setFilters({ page: 1, limit: 12, search: '', status: undefined, priority: undefined, category: undefined })}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Maintenance Requests</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by title, description, tenant name, or property..."
                value={filters.search}
                onChange={handleSearch}
                className="landlord-input pl-10 w-full"
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
                className="landlord-select w-full"
              >
                <option value="">All Status</option>
                <option value="submitted">📋 Submitted</option>
                <option value="acknowledged">👁️ Acknowledged</option>
                <option value="in_progress">🔄 In Progress</option>
                <option value="completed">✅ Completed</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={filters.priority || ''}
                onChange={(e) => handlePriorityFilter(e.target.value || undefined)}
                className="landlord-select w-full"
              >
                <option value="">All Priorities</option>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleCategoryFilter(e.target.value || undefined)}
                className="landlord-select w-full"
              >
                <option value="">All Categories</option>
                <option value="plumbing">🚿 Plumbing</option>
                <option value="electrical">⚡ Electrical</option>
                <option value="hvac">❄️ HVAC</option>
                <option value="appliance">📱 Appliance</option>
                <option value="structural">🏗️ Structural</option>
                <option value="other">🔧 Other</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select className="landlord-select w-full">
                <option value="">All Dates</option>
                <option value="today">📅 Today</option>
                <option value="week">🗓️ This Week</option>
                <option value="month">📆 This Month</option>
                <option value="overdue">⏰ Overdue</option>
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
                <button className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors">
                  Urgent Requests
                </button>
                <button className="px-3 py-1 text-xs bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-colors">
                  Overdue
                </button>
                <button className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors">
                  Unassigned
                </button>
                <button className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors">
                  High Cost
                </button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedRequests.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{selectedRequests.length} selected:</span>
                <button
                  onClick={() => handleBulkAction('acknowledge')}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Bulk Acknowledge
                </button>
                <button
                  onClick={() => handleBulkAction('in_progress')}
                  className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  Start Work
                </button>
                <button
                  onClick={() => handleBulkAction('completed')}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Mark Complete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Maintenance Requests Content */}
      {viewMode === 'cards' ? (
        /* Card View */
        <div className="space-y-6">
          {/* Select All */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedRequests.length === maintenanceRequests.length && maintenanceRequests.length > 0}
              onChange={selectAllRequests}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              Select all ({maintenanceRequests.length} requests)
            </span>
          </div>

          {maintenanceRequests.length === 0 ? (
            <div className="landlord-card p-12 text-center">
              <FiTool className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No maintenance requests found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {maintenanceRequests.map((request) => (
                <MaintenanceCard key={request._id} request={request} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <div className="landlord-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="landlord-table">
              <thead>
                <tr>
                  <th className="landlord-table-header">
                    <input
                      type="checkbox"
                      checked={selectedRequests.length === maintenanceRequests.length && maintenanceRequests.length > 0}
                      onChange={selectAllRequests}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="landlord-table-header">Request</th>
                  <th className="landlord-table-header">Tenant</th>
                  <th className="landlord-table-header">Property</th>
                  <th className="landlord-table-header">Category</th>
                  <th className="landlord-table-header">Priority</th>
                  <th className="landlord-table-header">Status</th>
                  <th className="landlord-table-header">Cost</th>
                  <th className="landlord-table-header">Created</th>
                  <th className="landlord-table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {maintenanceRequests.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="landlord-table-cell text-center text-gray-500 py-8">
                      No maintenance requests found
                    </td>
                  </tr>
                ) : (
                  maintenanceRequests.map((request) => {
                    const tenant = request.tenant as User;
                    const property = request.property as Property;

                    return (
                      <tr key={request._id} className="hover:bg-gray-50">
                        <td className="landlord-table-cell">
                          <input
                            type="checkbox"
                            checked={selectedRequests.includes(request._id)}
                            onChange={() => toggleSelectRequest(request._id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="landlord-table-cell">
                          <div>
                            <div className="font-medium text-gray-900 line-clamp-1">
                              {request.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {request.description}
                            </div>
                          </div>
                        </td>
                        <td className="landlord-table-cell">
                          <div>
                            <div className="font-medium text-gray-900">
                              {tenant?.firstName || 'Unknown'} {tenant?.lastName || 'User'}
                            </div>
                            <div className="text-sm text-gray-500">{tenant?.email || 'No email'}</div>
                          </div>
                        </td>
                        <td className="landlord-table-cell">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {property?.title || 'Unknown Property'}
                            </div>
                            <div className="text-gray-500">
                              {property?.city || 'Unknown'}, {property?.state || 'Unknown'}
                            </div>
                          </div>
                        </td>
                        <td className="landlord-table-cell">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(request.category)}
                            <span className="text-sm font-medium capitalize">{request.category}</span>
                          </div>
                        </td>
                        <td className="landlord-table-cell">
                          {getPriorityBadge(request.priority)}
                        </td>
                        <td className="landlord-table-cell">
                          {getStatusBadge(request.status)}
                        </td>
                        <td className="landlord-table-cell">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {formatCurrency(request.estimatedCost || 0)}
                            </div>
                            <div className="text-gray-500">estimated</div>
                          </div>
                        </td>
                        <td className="landlord-table-cell">
                          <span className="text-sm text-gray-500">
                            {getTimeAgo(request.createdAt)}
                          </span>
                        </td>
                        <td className="landlord-table-cell">
                          <div className="flex items-center space-x-1">
                            {request.status === 'submitted' && (
                              <button
                                onClick={() => handleUpdateStatus(request._id, 'acknowledged')}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                title="Acknowledge"
                              >
                                <FiCheck className="w-4 h-4" />
                              </button>
                            )}
                            {request.status === 'acknowledged' && (
                              <button
                                onClick={() => handleUpdateStatus(request._id, 'in_progress')}
                                className="p-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded"
                                title="Start"
                              >
                                <FiPlay className="w-4 h-4" />
                              </button>
                            )}
                            {request.status === 'in_progress' && (
                              <button
                                onClick={() => handleUpdateStatus(request._id, 'completed')}
                                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                                title="Complete"
                              >
                                <FiCheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <Link
                              to={`/landlord/maintenance/${request._id}`}
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
        <div className={`${viewMode === 'cards' ? 'landlord-card' : ''} ${viewMode === 'table' ? 'border-t border-gray-200' : 'p-6'}`}>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(pagination.page - 1) * (filters.limit || 12) + 1} to{' '}
              {Math.min(pagination.page * (filters.limit || 12), pagination.total)} of{' '}
              {pagination.total} requests
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
                disabled={pagination.page === 1}
                className="landlord-btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: Math.min(pagination.pages, (prev.page || 1) + 1) }))}
                disabled={pagination.page === pagination.pages}
                className="landlord-btn-secondary disabled:opacity-50"
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