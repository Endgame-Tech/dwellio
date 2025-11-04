import React from 'react';

interface PropertyCardProps {
  image: string;
  address: string;
  size?: 'small' | 'large' | 'wide' | 'tall';
}

export default function PropertyCard({ image, address, size = 'small' }: PropertyCardProps) {
  // Determine the grid span based on size
  const sizeClasses = {
    small: 'col-span-1 row-span-1 h-[300px]',
    large: 'col-span-2 row-span-2 h-[620px]',
    wide: 'col-span-2 row-span-1 h-[300px]',
    tall: 'col-span-1 row-span-2 h-[620px]'
  };

  return (
    <div className={`group relative overflow-hidden rounded-[2.5rem] cursor-pointer ${sizeClasses[size]}`}>
      {/* Background Image */}
      <img
        src={image}
        alt={address}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Gradient Overlay */}
      <div className="absolute w-full inset-0 bg-gradient-to-t from-ubani-black/90 via-ubani-black/20 to-transparent"></div>

      {/* Address Label */}
      <div className="absolute bottom-0 left-0 right-0 w-full">
        <div className="bg-[#202020bb] rounded-[2.5rem] px-8 sm:px-12 py-4 sm:py-6 inline-block w-full">
          <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-normal whitespace-nowrap transition-colors">
            {address}
          </h3>
        </div>
      </div>
    </div>
  );
}
