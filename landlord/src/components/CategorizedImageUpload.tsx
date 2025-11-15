import React, { useState } from 'react';
import { FiImage, FiX, FiPlus, FiAlertCircle } from 'react-icons/fi';

export interface ImageCategory {
  id: string;
  label: string;
  minImages?: number;
  maxImages?: number;
}

export interface CategorizedImage {
  url: string;
  category: string;
  filename?: string;
}

interface CategorizedImageUploadProps {
  images: CategorizedImage[];
  onChange: (images: CategorizedImage[]) => void;
  categories?: ImageCategory[];
  className?: string;
}

const DEFAULT_CATEGORIES: ImageCategory[] = [
  { id: 'living_room', label: 'Living Room', minImages: 3 },
  { id: 'kitchen', label: 'Kitchen', minImages: 3 },
  { id: 'bedroom', label: 'Bedroom', minImages: 3 },
  { id: 'bathroom', label: 'Bathroom', minImages: 3 },
  { id: 'outside', label: 'Outside/Exterior', minImages: 3 },
  { id: 'aerial', label: 'Aerial View', minImages: 1 },
  { id: 'other', label: 'Other', minImages: 0 },
];

const CategorizedImageUpload: React.FC<CategorizedImageUploadProps> = ({
  images,
  onChange,
  categories = DEFAULT_CATEGORIES,
  className = '',
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || 'living_room');
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Get images for the active category
  const getCategoryImages = (categoryId: string): CategorizedImage[] => {
    return images.filter((img) => img.category === categoryId);
  };

  // Add image to category
  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;

    const newImage: CategorizedImage = {
      url: imageUrlInput.trim(),
      category: activeCategory,
    };

    onChange([...images, newImage]);
    setImageUrlInput('');
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    const categoryImages = getCategoryImages(activeCategory);
    const imageToRemove = categoryImages[index];
    const newImages = images.filter((img) => img !== imageToRemove);
    onChange(newImages);
  };

  // Check if category meets minimum requirement
  const getCategoryStatus = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    const categoryImages = getCategoryImages(categoryId);
    const count = categoryImages.length;
    const minImages = category?.minImages || 0;

    return {
      count,
      minImages,
      isValid: count >= minImages,
      message: minImages > 0 ? `${count}/${minImages} min` : `${count} images`,
    };
  };

  const currentCategoryImages = getCategoryImages(activeCategory);
  const currentCategory = categories.find((c) => c.id === activeCategory);
  const categoryStatus = getCategoryStatus(activeCategory);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto space-x-1 pb-px -mb-px scrollbar-hide">
          {categories.map((category) => {
            const status = getCategoryStatus(category.id);
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={`
                  relative px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-t-lg transition-all
                  ${isActive
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {category.label}
                  <span
                    className={`
                      text-xs px-2 py-0.5 rounded-full
                      ${status.isValid
                        ? 'bg-green-100 text-green-700'
                        : status.count > 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-600'
                      }
                    `}
                  >
                    {status.message}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add {currentCategory?.label} Images
              {currentCategory?.minImages && currentCategory.minImages > 0 && (
                <span className="text-red-500 ml-1">
                  (min. {currentCategory.minImages} required)
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImage();
                  }
                }}
                className="landlord-input flex-1"
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
              />
              <button
                type="button"
                onClick={handleAddImage}
                disabled={!imageUrlInput.trim()}
                className="landlord-btn-primary flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiPlus className="w-4 h-4" />
                Add Image
              </button>
            </div>
          </div>
        </div>

        {/* Validation Message */}
        {!categoryStatus.isValid && currentCategory?.minImages && currentCategory.minImages > 0 && (
          <div className="mt-3 flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              Please add at least {currentCategory.minImages} images for {currentCategory.label}.
              You have {categoryStatus.count} so far.
            </span>
          </div>
        )}
      </div>

      {/* Image Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">
            {currentCategory?.label} Images ({currentCategoryImages.length})
          </h4>
          {currentCategoryImages.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const newImages = images.filter((img) => img.category !== activeCategory);
                onChange(newImages);
              }}
              className="text-xs text-red-600 hover:text-red-800 font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentCategoryImages.length === 0 ? (
            <div className="col-span-2 md:col-span-3 lg:col-span-4 text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                No {currentCategory?.label.toLowerCase()} images added yet
              </p>
              <p className="text-xs text-gray-400 mt-1">Add image URLs above to get started</p>
            </div>
          ) : (
            currentCategoryImages.map((image, index) => (
              <div key={index} className="relative group aspect-video">
                <img
                  src={image.url}
                  alt={`${currentCategory?.label} ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/300x200?text=Image+Error';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 hover:scale-110"
                  title="Remove image"
                >
                  <FiX className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs bg-black bg-opacity-70 text-white px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <FiImage className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Upload Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((category) => {
                const status = getCategoryStatus(category.id);
                return (
                  <div
                    key={category.id}
                    className="flex items-center justify-between text-xs bg-white rounded px-2 py-1.5"
                  >
                    <span className="text-gray-700 font-medium">{category.label}:</span>
                    <span
                      className={`font-semibold ${status.isValid ? 'text-green-600' : 'text-gray-500'
                        }`}
                    >
                      {status.count}
                      {category.minImages && category.minImages > 0 && `/${category.minImages}`}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-xs text-blue-700">
              <strong>Total Images:</strong> {images.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorizedImageUpload;
