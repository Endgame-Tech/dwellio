import { useState, useEffect } from 'react';
import { propertiesApi } from '../services/api';
import { toast } from 'react-toastify';
import type { Property } from '../types';
import Navbar from '../components/Navbar';
import PageContainer from '../components/PageContainer';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import {
  FiSearch,
  FiGrid,
  FiList,
  FiHome
} from 'react-icons/fi';

interface PropertyListItem extends Property {
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  images: string[];
}

// Backend property response type (matches server Property model)
interface BackendProperty {
  _id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  approvalStatus?: string;
  isActive: boolean;
  location: {
    address: string;
    city: string;
    lga: string;
    state: string;
  };
  rent: {
    amount: number;
    period: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  amenities: string[];
  media?: Array<{ url: string; filename?: string }>;
  landlordContact?: {
    name: string;
    phone: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function Properties() {
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'rented'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [propertyType, setPropertyType] = useState<string>('all');

  // Helper function to assign random sizes for masonry grid
  const getPropertySize = (index: number): 'small' | 'large' | 'wide' | 'tall' => {
    const pattern = ['small', 'small', 'small', 'small', 'small', 'small', 'large', 'tall', 'small'];
    return pattern[index % pattern.length] as 'small' | 'large' | 'wide' | 'tall';
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await propertiesApi.getCuratedProperties();

        console.log('🔍 Properties API Response:', response);
        console.log('✅ Response success:', response.success);
        console.log('📦 Response data:', response.data);
        console.log('📊 Response data length:', response.data?.length);

        if (response.success && response.data) {
          console.log('🚀 Processing properties...', response.data);
          const transformedProperties: PropertyListItem[] = response.data.map((prop: BackendProperty | Property) => {
            // Check if it's backend format (flat structure) or frontend format (nested)
            const isBackendFormat = 'bedrooms' in prop && typeof (prop as BackendProperty).bedrooms === 'number';

            return {
              ...prop,
              propertyType: prop.type,
              // Handle both nested (frontend type) and flat (backend model) structures
              bedrooms: isBackendFormat
                ? (prop as BackendProperty).bedrooms || 0
                : (prop as Property).features?.bedrooms || 0,
              bathrooms: isBackendFormat
                ? (prop as BackendProperty).bathrooms || 0
                : (prop as Property).features?.bathrooms || 0,
              // Handle both nested media object and direct media array
              images: isBackendFormat && Array.isArray((prop as BackendProperty).media)
                ? (prop as BackendProperty).media!.map(m => m.url)
                : (prop as Property).media?.images || []
            } as PropertyListItem;
          });
          console.log('✨ Transformed properties:', transformedProperties);
          console.log('📝 Transformed properties count:', transformedProperties.length);
          setProperties(transformedProperties);
        } else {
          console.warn('⚠️ No properties data or success=false');
          toast.error('Failed to load properties');
        }
      } catch (error) {
        const err = error as { message?: string; response?: { data?: { message?: string }; status?: number } };
        console.error('Failed to fetch properties:', error);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        toast.error(err.response?.data?.message || err.message || 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

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
        <PageContainer className='noPaddingTop'>
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
        <PageContainer className='noPaddingTop'>
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
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5 auto-rows-auto'
              : 'grid-cols-1'
              }`}>
              {filteredProperties.map((property, index) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  size={viewMode === 'grid' ? getPropertySize(index) : 'small'}
                />
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
