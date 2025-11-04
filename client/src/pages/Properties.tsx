import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertiesApi } from '../services/api';
import { toast } from 'react-toastify';
import type { Property } from '../types';
import Navbar from '../components/Navbar';
import PageContainer from '../components/PageContainer';
import Footer from '../components/Footer';
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
        return <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-ubani-yellow/20 text-ubani-yellow border border-ubani-yellow/30">Available</span>;
      case 'occupied':
        return <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-gray-300 border border-white/20">Occupied</span>;
      case 'pending':
        return <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">Pending</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-gray-300 border border-white/20">{status}</span>;
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
      <div className="group relative bg-[#1a1a1a] rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/10 hover:border-ubani-yellow/30 overflow-hidden">
        {/* Image */}
        <div className="relative w-full h-64 overflow-hidden">
          <img src={imageUrl} alt={property.title || 'Property'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-ubani-black/80 via-ubani-black/20 to-transparent opacity-60"></div>

          {/* Heart icon */}
          <button className="absolute top-4 left-4 w-10 h-10 rounded-full bg-ubani-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:text-ubani-yellow hover:bg-ubani-black/80 transition-all transform hover:scale-110">
            <FiHeart className="w-5 h-5" />
          </button>

          {/* Status badge */}
          <div className="absolute top-4 right-4">
            {getStatusBadge(property.status)}
          </div>

          {/* View Details button */}
          <Link
            to={`/properties/${property._id}`}
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-ubani-yellow hover:bg-ubani-yellow/90 flex items-center justify-center text-ubani-black transition-all shadow-xl opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
            title="View Details"
          >
            <FiArrowRight className="w-6 h-6" />
          </Link>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Location and Rating */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-white mb-1">
                {property.location.city}, {property.location.state}
              </p>
              <p className="text-xs text-gray-400 line-clamp-1">
                {property.location.address}
              </p>
            </div>
            <div className="flex items-center ml-3 bg-ubani-yellow/10 px-2 py-1 rounded-lg">
              <FiStar className="w-4 h-4 text-ubani-yellow fill-current" />
              <span className="text-sm font-semibold text-ubani-yellow ml-1">4.8</span>
            </div>
          </div>

          {/* Property Type */}
          <p className="text-sm text-ubani-yellow mb-3 capitalize font-medium">
            {property.propertyType || 'Apartment'}
          </p>

          {/* Features */}
          <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <FiHome className="w-4 h-4 text-ubani-yellow" />
              <span>{property.bedrooms || 'N/A'} beds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiDroplet className="w-4 h-4 text-ubani-yellow" />
              <span>{property.bathrooms || 'N/A'} baths</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiSquare className="w-4 h-4 text-ubani-yellow" />
              <span>120 m²</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div>
              <p className="text-2xl font-bold text-white">
                {formatShortCurrency(property.rent.amount)}
              </p>
              <p className="text-sm text-gray-400">per {property.rent.period}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ubani-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-ubani-yellow mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ubani-black font-sans">
      <Navbar />

      {/* Header */}
      <div className="bg-ubani-black border-b border-white/10">
        <PageContainer>
          <div className="py-12 sm:py-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3">
                  Stay Somewhere <span className="text-ubani-yellow">Amazing</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-300">
                  Find the perfect rental property for your needs
                </p>
              </div>
              <div className="flex items-center gap-3 bg-[#1a1a1a] px-6 py-4 rounded-2xl border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-ubani-yellow/10 flex items-center justify-center">
                  <FiHome className="w-6 h-6 text-ubani-yellow" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{filteredProperties.length}</p>
                  <p className="text-sm text-gray-400">Properties Available</p>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-40 backdrop-blur-sm">
        <PageContainer>
          <div className="py-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-2xl">
                <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by location, property type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-ubani-black border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all duration-300"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Property Type Filter */}
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="px-5 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all"
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
                className="px-5 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all"
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
                    className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${filter === tab.key
                      ? 'bg-ubani-yellow text-ubani-black'
                      : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222222] hover:text-white border border-white/10'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="ml-auto flex items-center bg-[#1a1a1a] border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid'
                    ? 'bg-ubani-yellow text-ubani-black shadow-sm'
                    : 'text-gray-400 hover:text-white'
                    }`}
                  title="Grid View"
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-all ${viewMode === 'list'
                    ? 'bg-ubani-yellow text-ubani-black shadow-sm'
                    : 'text-gray-400 hover:text-white'
                    }`}
                  title="List View"
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Properties Content */}
      <div className="py-12 sm:py-16">
        <PageContainer>
          {filteredProperties.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 rounded-3xl bg-ubani-yellow/10 flex items-center justify-center mx-auto mb-6">
                <FiHome className="w-12 h-12 text-ubani-yellow" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">No properties found</h3>
              <p className="text-gray-400 mb-10 max-w-md mx-auto text-lg">
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
                className="bg-ubani-yellow hover:bg-ubani-yellow/90 text-ubani-black px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-xl"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
              }`}>
              {filteredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </PageContainer>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
