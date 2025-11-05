// import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiHome, FiDroplet, FiMaximize2 } from 'react-icons/fi';

interface PropertyCardProps {
  property: {
    _id: string;
    title?: string;
    description?: string;
    propertyType?: string;
    type?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    images?: string[];
    rent?: {
      amount: number;
      period?: string;
    };
    location?: {
      address?: string;
      city?: string;
      state?: string;
    };
    status?: string;
  };
  size?: 'small' | 'large' | 'wide' | 'tall';
}

export default function PropertyCard({ property, size = 'small' }: PropertyCardProps) {
  // Determine the grid span based on size
  const sizeClasses = {
    small: 'col-span-1 row-span-1 h-[400px]',
    large: 'col-span-2 row-span-2 h-[620px]',
    wide: 'col-span-2 row-span-1 h-[400px]',
    tall: 'col-span-1 row-span-2 h-[620px]'
  };

  // Get the first image or use a placeholder
  const imageUrl = property.images && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?auto=format&fit=crop&w=1000&q=80';

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}K`;
    return `₦${amount}`;
  };

  const address = property.location?.address || property.location?.city || 'Location not specified';
  const propertyType = property.propertyType || property.type || 'Property';

  return (
    <Link
      to={`/properties/${property._id}`}
      className={`group relative overflow-hidden rounded-3xl cursor-pointer bg-[#1a1a1a] border border-white/10 hover:border-ubani-yellow/50 transition-all duration-300 ${sizeClasses[size]}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 h-[60%]">
        <img
          src={imageUrl}
          alt={property.title || address}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a1a1a]"></div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
        {/* Property Type Badge */}
        <div className="inline-block">
          <span className="px-3 py-1 bg-ubani-yellow/20 text-ubani-yellow text-xs font-semibold rounded-full border border-ubani-yellow/30">
            {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}
          </span>
        </div>

        {/* Title */}
        {property.title && (
          <h3 className="text-white text-lg font-semibold line-clamp-1">
            {property.title}
          </h3>
        )}

        {/* Address */}
        <div className="flex items-start gap-2 text-gray-400">
          <FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm line-clamp-1">{address}</p>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          {property.bedrooms !== undefined && (
            <div className="flex items-center gap-1">
              <FiHome className="w-4 h-4" />
              <span>{property.bedrooms} Bed</span>
            </div>
          )}
          {property.bathrooms !== undefined && (
            <div className="flex items-center gap-1">
              <FiDroplet className="w-4 h-4" />
              <span>{property.bathrooms} Bath</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center gap-1">
              <FiMaximize2 className="w-4 h-4" />
              <span>{property.area}m²</span>
            </div>
          )}
        </div>

        {/* Price */}
        {property.rent && (
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-ubani-yellow">
                {formatCurrency(property.rent.amount)}
              </span>
              <span className="text-sm text-gray-500">
                /{property.rent.period || 'year'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Hover Effect Indicator */}
      <div className="absolute top-4 right-4 w-10 h-10 bg-ubani-yellow rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg className="w-5 h-5 text-ubani-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
