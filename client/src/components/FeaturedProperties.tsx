import { useState } from 'react';
import PageContainer from './PageContainer';
import PropertyCard from './PropertyCard';

export default function FeaturedProperties() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Flat', 'House', 'Villa', 'Apartment'];

  const properties = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075',
      address: '123 Main St, Anytown, CA',
      size: 'small' as const,
      type: 'Flat'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053',
      address: '456 Oak Ave, Lagos',
      size: 'small' as const,
      type: 'Apartment'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070',
      address: '789 Palm Street, Abuja',
      size: 'small' as const,
      type: 'Villa'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070',
      address: '321 Victoria Island',
      size: 'small' as const,
      type: 'Flat'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070',
      address: '654 Lekki Phase 1',
      size: 'small' as const,
      type: 'House'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2087',
      address: '987 Banana Island',
      size: 'small' as const,
      type: 'Villa'
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071',
      address: '147 Ikoyi Crescent',
      size: 'large' as const,
      type: 'House'
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?q=80&w=2070',
      address: '258 Parkview Estate',
      size: 'tall' as const,
      type: 'Villa'
    },
    {
      id: 9,
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084',
      address: '369 Ajah Gardens',
      size: 'small' as const,
      type: 'Apartment'
    }
  ];

  return (
    <div className="py-16 sm:py-20 lg:py-24 bg-ubani-black">
      <PageContainer noPaddingTop>
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Featured <span className="text-ubani-yellow">Properties</span>
          </h2>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-8">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-full font-medium text-sm sm:text-base transition-all duration-300 ${activeFilter === filter
                  ? 'bg-ubani-yellow text-ubani-black'
                  : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222222] hover:text-white border border-white/10'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={{
                _id: property.id.toString(),
                images: [property.image],
                location: { address: property.address },
                type: property.type
              }}
              size={property.size}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 sm:mt-16">
          <a
            href="/properties"
            className="group inline-flex items-center justify-center bg-ubani-yellow text-ubani-black px-8 py-4 rounded-full font-semibold hover:bg-ubani-yellow/90 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <span>View All Properties</span>
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </PageContainer>
    </div>
  );
}
