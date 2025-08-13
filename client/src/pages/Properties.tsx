import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertiesApi } from '../services/api';
import { toast } from 'react-toastify';
import type { Property } from '../types';
import Navbar from '../components/Navbar';
import {
  FiMapPin,
  FiSearch,
  FiFilter,
  FiHome,
  FiDroplet,
  FiSquare,
  FiDollarSign,
  FiArrowRight,
  FiHeart,
  FiStar,
  FiGrid,
  FiList
} from 'react-icons/fi';

interface PropertyListItem extends Property {
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  images: string[];
}

export default function Properties() {
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'rented'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [propertyType, setPropertyType] = useState<string>('all');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await propertiesApi.getCuratedProperties();

        if (response.success && response.data) {
          const transformedProperties: PropertyListItem[] = response.data.map((prop: Property) => ({
            ...prop,
            propertyType: prop.type,
            bedrooms: prop.features.bedrooms,
            bathrooms: prop.features.bathrooms,
            images: prop.media.images
          }));
          setProperties(transformedProperties);
        } else {
          toast.error('Failed to load properties');
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
        toast.error('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Helper functions
  const formatShortCurrency = (amount: number) => {
    if (amount >= 1_000_000_000) return `₦${(amount / 1_000_000_000).toFixed(1)}B`;
    if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(1)}K`;
    return `₦${amount}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Available</span>;
      case 'occupied':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Occupied</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesFilter = filter === 'all' || property.status === filter;
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriceRange = priceRange === 'all' || (() => {
      const amount = property.rent.amount;
      switch (priceRange) {
        case 'under-1m': return amount < 1000000;
        case '1m-5m': return amount >= 1000000 && amount <= 5000000;
        case '5m-10m': return amount >= 5000000 && amount <= 10000000;
        case 'above-10m': return amount > 10000000;
        default: return true;
      }
    })();
    const matchesType = propertyType === 'all' || property.propertyType === propertyType;
    return matchesFilter && matchesSearch && matchesPriceRange && matchesType;
  });

  // Property Card Component
  const PropertyCard = ({ property }: { property: PropertyListItem }) => {
    const imageUrl = property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=80';

    return (
      <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden">
        {/* Image */}
        <div className="relative w-full h-64 overflow-hidden">
          <img src={imageUrl} alt={property.title || 'Property'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          
          {/* Heart icon */}
          <button className="absolute top-3 left-3 p-2 bg-white/90 rounded-full text-gray-600 hover:text-red-500 hover:bg-white shadow-sm transition-colors">
            <FiHeart className="w-4 h-4" />
          </button>

          {/* Status badge */}
          <div className="absolute top-3 right-3">
            {getStatusBadge(property.status)}
          </div>

          {/* View Details button */}
          <Link
            to={`/properties/${property._id}`}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-dwellio-600 hover:bg-dwellio-700 flex items-center justify-center text-white transition-colors shadow-lg opacity-0 group-hover:opacity-100"
            title="View Details"
          >
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Location and Rating */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">
                {property.location.city}, {property.location.state}
              </p>
              <p className="text-xs text-gray-500 line-clamp-1">
                {property.location.address}
              </p>
            </div>
            <div className="flex items-center ml-2">
              <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700 ml-1">4.8</span>
            </div>
          </div>

          {/* Property Type */}
          <p className="text-sm text-gray-600 mb-3 capitalize">
            {property.propertyType || 'Apartment'}
          </p>

          {/* Features */}
          <div className="flex items-center gap-4 mb-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <FiHome className="w-3 h-3" />
              <span>{property.bedrooms || 'N/A'} beds</span>
            </div>
            <div className="flex items-center gap-1">
              <FiDroplet className="w-3 h-3" />
              <span>{property.bathrooms || 'N/A'} baths</span>
            </div>
            <div className="flex items-center gap-1">
              <FiSquare className="w-3 h-3" />
              <span>120 m²</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900">
                {formatShortCurrency(property.rent.amount)}
              </p>
              <p className="text-sm text-gray-500">per {property.rent.period}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dwellio-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Stay Somewhere Amazing</h1>
              <p className="text-gray-600 mt-1">
                Find the perfect rental property for your needs
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="text-sm text-gray-500">
                {filteredProperties.length} properties available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-lg">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by location, property type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-dwellio-500 focus:border-dwellio-500 transition-all duration-300"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Property Type Filter */}
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-dwellio-500 focus:border-dwellio-500"
            >
              <option value="all">All Types</option>
              <option value="flat">Flat</option>
              <option value="duplex">Duplex</option>
              <option value="bungalow">Bungalow</option>
              <option value="studio">Studio</option>
            </select>

            {/* Price Range Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-dwellio-500 focus:border-dwellio-500"
            >
              <option value="all">All Prices</option>
              <option value="under-1m">Under ₦1M</option>
              <option value="1m-5m">₦1M - ₦5M</option>
              <option value="5m-10m">₦5M - ₦10M</option>
              <option value="above-10m">Above ₦10M</option>
            </select>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'available', label: 'Available' },
                { key: 'rented', label: 'Rented' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as 'all' | 'available' | 'rented')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === tab.key
                      ? 'bg-dwellio-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="ml-auto flex items-center bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full transition-colors ${viewMode === 'grid'
                    ? 'bg-white text-dwellio-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                  }`}
                title="Grid View"
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full transition-colors ${viewMode === 'list'
                    ? 'bg-white text-dwellio-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                  }`}
                title="List View"
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <FiHome className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm
                ? `No properties match your search criteria.`
                : `No ${filter === 'all' ? '' : filter + ' '}properties available at the moment.`}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
                setPriceRange('all');
                setPropertyType('all');
              }}
              className="bg-dwellio-600 hover:bg-dwellio-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
            }`}>
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
