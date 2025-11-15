import { useState } from 'react';
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

export default function CategorizedImageUpload({
    images,
    onChange,
    categories = DEFAULT_CATEGORIES,
    className = '',
}: CategorizedImageUploadProps) {
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
            <div className="border-b border-white/10">
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
                                        ? 'bg-ubani-yellow/20 text-ubani-yellow border-b-2 border-ubani-yellow'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }
                `}
                            >
                                <span className="flex items-center gap-2">
                                    {category.label}
                                    <span
                                        className={`
                      text-xs px-2 py-0.5 rounded-full
                      ${status.isValid
                                                ? 'bg-green-500/20 text-green-400'
                                                : status.count > 0
                                                    ? 'bg-yellow-500/20 text-yellow-400'
                                                    : 'bg-white/10 text-gray-400'
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
            <div className="bg-white/5 rounded-lg p-4 border-2 border-dashed border-white/10">
                <div className="flex items-start gap-3">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-white mb-2">
                            Add {currentCategory?.label} Images
                            {currentCategory?.minImages && currentCategory.minImages > 0 && (
                                <span className="text-red-400 ml-1">
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
                                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow"
                                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                            />
                            <button
                                type="button"
                                onClick={handleAddImage}
                                disabled={!imageUrlInput.trim()}
                                className="px-6 py-2 bg-ubani-yellow text-ubani-black rounded-lg hover:bg-ubani-yellow/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2 whitespace-nowrap"
                            >
                                <FiPlus className="w-4 h-4" />
                                Add Image
                            </button>
                        </div>
                    </div>
                </div>

                {/* Validation Message */}
                {!categoryStatus.isValid && currentCategory?.minImages && currentCategory.minImages > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-yellow-400 bg-yellow-500/10 px-3 py-2 rounded-lg border border-yellow-500/20">
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
                    <h4 className="text-sm font-medium text-white">
                        {currentCategory?.label} Images ({currentCategoryImages.length})
                    </h4>
                    {currentCategoryImages.length > 0 && (
                        <button
                            type="button"
                            onClick={() => {
                                const newImages = images.filter((img) => img.category !== activeCategory);
                                onChange(newImages);
                            }}
                            className="text-xs text-red-400 hover:text-red-300 font-medium"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentCategoryImages.length === 0 ? (
                        <div className="col-span-2 md:col-span-3 lg:col-span-4 text-center py-12 bg-white/5 rounded-lg border-2 border-dashed border-white/10">
                            <FiImage className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                            <p className="text-sm text-gray-400">
                                No {currentCategory?.label.toLowerCase()} images added yet
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Add image URLs above to get started</p>
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
            <div className="bg-ubani-yellow/10 rounded-lg p-4 border border-ubani-yellow/30">
                <div className="flex items-start gap-3">
                    <FiImage className="w-5 h-5 text-ubani-yellow flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-ubani-yellow mb-2">Upload Summary</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {categories.map((category) => {
                                const status = getCategoryStatus(category.id);
                                return (
                                    <div
                                        key={category.id}
                                        className="flex items-center justify-between text-xs bg-white/5 rounded px-2 py-1.5"
                                    >
                                        <span className="text-gray-300 font-medium">{category.label}:</span>
                                        <span
                                            className={`font-semibold ${status.isValid ? 'text-green-400' : 'text-gray-400'
                                                }`}
                                        >
                                            {status.count}
                                            {category.minImages && category.minImages > 0 && `/${category.minImages}`}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-3 text-xs text-ubani-yellow">
                            <strong>Total Images:</strong> {images.length}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
