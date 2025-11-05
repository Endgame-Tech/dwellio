import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../services/api';
import { Property, PropertyFilters, PropertyImage } from '../types';
import PropertyCard from '../components/PropertyCard';
import {
  FiMapPin,
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
  FiHome
} from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards'); // Default to cards
  const [filters, setFilters] = useState<PropertyFilters>({
    page: 1,
    limit: 12, // Increased for better card grid layout
    search: '',
    type: undefined,
    status: undefined,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  useEffect(() => {
    loadProperties();
  }, [filters]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getProperties(filters);

      if (response.success && response.data) {
        setProperties(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to load properties:', error);
      toast.error('Failed to load properties');
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

  const handleTypeFilter = (type: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      type: type as 'flat' | 'duplex' | 'bungalow' | 'studio' | 'shop' | 'office' | undefined,
      page: 1,
    }));
  };

  const handleStatusFilter = (status: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      status: status as 'available' | 'occupied' | 'pending' | undefined,
      page: 1,
    }));
  };

  const handleApproveProperty = async (propertyId: string) => {
    try {
      console.log('Attempting to approve property:', propertyId);
      const response = await adminApi.approveProperty(propertyId);
      console.log('Approve property response:', response);
      toast.success('Property approved successfully');
      loadProperties();
    } catch (error: any) {
      console.error('Failed to approve property:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to approve property';
      toast.error(errorMessage);
    }
  };

  const handleRejectProperty = async (propertyId: string) => {
    const reason = window.prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      console.log('Attempting to reject property:', propertyId, 'with reason:', reason);
      const response = await adminApi.rejectProperty(propertyId, reason);
      console.log('Reject property response:', response);
      toast.success('Property rejected successfully');
      loadProperties();
    } catch (error: any) {
      console.error('Failed to reject property:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to reject property';
      toast.error(errorMessage);
    }
  };

  const handleToggleApproval = async (propertyId: string, newStatus: 'approved' | 'not_approved') => {
    try {
      console.log('Toggling approval for property:', propertyId, 'to:', newStatus);

      if (newStatus === 'approved') {
        const response = await adminApi.approveProperty(propertyId);
        console.log('Approve property response:', response);
        toast.success('Property approved successfully');
      } else {
        const reason = window.prompt('Enter rejection reason (optional):');
        const response = await adminApi.rejectProperty(propertyId, reason || 'Not approved by admin');
        console.log('Reject property response:', response);
        toast.success('Property marked as not approved');
      }

      loadProperties();
    } catch (error: any) {
      console.error('Failed to toggle approval:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update approval status';
      toast.error(errorMessage);
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
      case 'available':
        return <span className="admin-badge-success">Available</span>;
      case 'occupied':
        return <span className="admin-badge-warning">Occupied</span>;
      case 'pending':
        return <span className="admin-badge-info">Pending</span>;
      default:
        return <span className="admin-badge-info">{status}</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeColors: Record<string, string> = {
      flat: 'bg-blue-100 text-blue-800',
      duplex: 'bg-green-100 text-green-800',
      bungalow: 'bg-purple-100 text-purple-800',
      studio: 'bg-orange-100 text-orange-800',
      shop: 'bg-yellow-100 text-yellow-800',
      office: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`admin-badge ${typeColors[type] || 'bg-gray-100 text-gray-800'}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  // Helper to shorten currency (e.g., N7.5M)
  const formatShortCurrency = (amount: number) => {
    if (amount >= 1_000_000_000) return `N${(amount / 1_000_000_000).toFixed(1)}B`;
    if (amount >= 1_000_000) return `N${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `N${(amount / 1_000).toFixed(1)}K`;
    return `N${amount}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="admin-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
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
            <FiMapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
            <p className="text-gray-600">Manage properties, approvals, and listings</p>
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

          <button className="admin-btn-secondary flex items-center">
            <FiDownload className="w-4 h-4 mr-2" />
            Export
          </button>
          <Link to="/admin/properties/new" className="admin-btn-primary flex items-center">
            <FiPlus className="w-4 h-4 mr-2" />
            Add Property
          </Link>
        </div>
      </div>

      {/* Enhanced Filters Section */}
      <div className="admin-card">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiFilter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <span className="text-sm text-gray-500">({pagination.total} properties found)</span>
            </div>
            <button
              onClick={() => setFilters({ page: 1, limit: 12, search: '', type: undefined, status: undefined })}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all
            </button>
          </div>

          {/* Search Bar - Full Width */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Properties</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by title, location, landlord..."
                value={filters.search}
                onChange={handleSearch}
                className="admin-input pl-10 w-full"
              />
            </div>
          </div>

          {/* Filter Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                value={filters.type || ''}
                onChange={(e) => handleTypeFilter(e.target.value || undefined)}
                className="admin-select w-full"
              >
                <option value="">All Types</option>
                <option value="flat">🏠 Flat</option>
                <option value="duplex">🏘️ Duplex</option>
                <option value="bungalow">🏡 Bungalow</option>
                <option value="studio">🏢 Studio</option>
                <option value="shop">🏬 Shop</option>
                <option value="office">🏢 Office</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleStatusFilter(e.target.value || undefined)}
                className="admin-select w-full"
              >
                <option value="">All Status</option>
                <option value="available">✅ Available</option>
                <option value="occupied">🏠 Occupied</option>
                <option value="pending">⏳ Pending</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select className="admin-select w-full">
                <option value="">All Prices</option>
                <option value="0-1000000">Under ₦1M</option>
                <option value="1000000-5000000">₦1M - ₦5M</option>
                <option value="5000000-10000000">₦5M - ₦10M</option>
                <option value="10000000+">Above ₦10M</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select className="admin-select w-full">
                <option value="">All Locations</option>
                <option value="lagos">🌴 Lagos</option>
                <option value="abuja">🏛️ Abuja</option>
                <option value="port-harcourt">🛢️ Port Harcourt</option>
                <option value="kano">🕌 Kano</option>
                <option value="ibadan">🌾 Ibadan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Quick filters:</span>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors">
                  Recently Added
                </button>
                <button className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors">
                  High Value
                </button>
                <button className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 transition-colors">
                  Pending Approval
                </button>
                <button className="px-3 py-1 text-xs bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-colors">
                  Furnished
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="text-xs border-gray-300 rounded-md px-2 py-1">
                <option value="created_desc">Newest First</option>
                <option value="created_asc">Oldest First</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="title_asc">Title: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Content */}
      {viewMode === 'cards' ? (
        /* Card View */
        <div className="space-y-6">
          {properties.length === 0 ? (
            <div className="admin-card p-12 text-center">
              <FiHome className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No properties found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters or add new properties</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  onToggleApproval={handleToggleApproval}
                />
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
                  <th className="admin-table-header">Property</th>
                  <th className="admin-table-header">Type</th>
                  <th className="admin-table-header">Location</th>
                  <th className="admin-table-header">Rent</th>
                  <th className="admin-table-header">Landlord</th>
                  <th className="admin-table-header">Status</th>
                  <th className="admin-table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {properties.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="admin-table-cell text-center text-gray-500 py-8">
                      No properties found
                    </td>
                  </tr>
                ) : (
                  properties.map((property) => (
                    <tr key={property._id} className="hover:bg-gray-50">
                      <td className="admin-table-cell">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                            {property.images && property.images.length > 0 ? (
                              <img
                                src={Array.isArray(property.images) && typeof property.images[0] === 'string' ? property.images[0] : (property.images[0] as PropertyImage)?.url}
                                alt={property.title || 'Property'}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            ) : (
                              <FiMapPin className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {property.title || 'Untitled Property'}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {property._id?.slice(-6) || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="admin-table-cell">
                        {getTypeBadge(property.type)}
                      </td>
                      <td className="admin-table-cell">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {property.location?.city || 'Unknown City'}
                          </div>
                          <div className="text-gray-500">
                            {property.location?.state || 'Unknown State'}
                          </div>
                        </div>
                      </td>
                      <td className="admin-table-cell">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {formatCurrency(property.rent?.amount || 0)}
                          </div>
                          <div className="text-gray-500">
                            per {property.rent?.period || 'year'}
                          </div>
                        </div>
                      </td>
                      <td className="admin-table-cell">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {property.landlordContact?.name || 'Unknown'}
                          </div>
                          <div className="text-gray-500">
                            {property.landlordContact?.email || ''}
                          </div>
                        </div>
                      </td>
                      <td className="admin-table-cell">
                        {getStatusBadge(property.status)}
                      </td>
                      <td className="admin-table-cell">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleApproveProperty(property._id)}
                            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                            title="Approve"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectProperty(property._id)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            title="Reject"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                          <Link
                            to={`/admin/properties/${property._id}`}
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
                  ))
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
              {pagination.total} properties
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