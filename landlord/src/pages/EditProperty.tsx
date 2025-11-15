import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { landlordApi } from '../services/api';
import { toast } from 'react-toastify';
import { FiHome, FiMapPin, FiDollarSign, FiImage, FiSave, FiX } from 'react-icons/fi';
import CategorizedImageUpload, { CategorizedImage } from '../components/CategorizedImageUpload';

interface PropertyFormData {
  title: string;
  description: string;
  type: string;
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
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  media: CategorizedImage[]; // Changed to use categorized images
  landlordContact: {
    name: string;
    phone: string;
    email: string;
  };
  status: string;
}

export default function EditProperty() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetchingProperty, setFetchingProperty] = useState(true);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    type: 'flat',
    location: {
      address: '',
      city: '',
      lga: '',
      state: ''
    },
    rent: {
      amount: 0,
      period: 'yearly'
    },
    deposit: 0,
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    amenities: [],
    media: [],
    landlordContact: {
      name: '',
      phone: '',
      email: ''
    },
    status: 'available'
  });

  const [amenityInput, setAmenityInput] = useState('');
  // Removed imageUrlInput state - now handled by CategorizedImageUpload component

  // Fetch property data on mount
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      try {
        setFetchingProperty(true);
        const response = await landlordApi.getProperty(id);

        if (response.success && response.data) {
          const property = response.data;
          console.log('Fetched property data:', property);

          // Backend uses 'media' field, but the Property type has 'images'
          // Try both fields to handle any inconsistencies
          // Convert to CategorizedImage format
          const mediaData = (property as any).media || property.images || [];
          const convertedMedia: CategorizedImage[] = Array.isArray(mediaData)
            ? mediaData.map((img: any) => {
              if (typeof img === 'string') {
                // If it's just a URL string, assign to 'other' category by default
                return { url: img, category: 'other' };
              } else if (img.url && img.category) {
                // Already in correct format
                return img;
              } else if (img.url) {
                // Has URL but no category
                return { url: img.url, category: 'other', filename: img.filename };
              }
              return { url: '', category: 'other' };
            }).filter((img: CategorizedImage) => img.url)
            : [];

          setFormData({
            title: property.title || '',
            description: property.description || '',
            type: property.type || 'flat',
            location: {
              address: (property.location as any)?.address || '',
              city: property.location?.city || '',
              lga: (property.location as any)?.lga || '',
              state: property.location?.state || ''
            },
            rent: property.rent || {
              amount: 0,
              period: 'yearly'
            },
            deposit: (property as any).deposit || 0,
            bedrooms: property.bedrooms || 1,
            bathrooms: property.bathrooms || 1,
            area: property.area || 0,
            amenities: property.amenities || [],
            media: convertedMedia,
            landlordContact: (property as any).landlordContact || {
              name: '',
              phone: '',
              email: ''
            },
            status: property.status || 'available'
          });
        } else {
          toast.error('Failed to load property');
          navigate('/landlord/properties');
        }
      } catch (error: any) {
        console.error('Fetch property error:', error);
        toast.error('Failed to load property');
        navigate('/landlord/properties');
      } finally {
        setFetchingProperty(false);
      }
    };

    fetchProperty();
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof PropertyFormData] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof PropertyFormData] as any),
          [child]: numValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  // Image handling is now done by CategorizedImageUpload component
  const handleImagesChange = (newImages: CategorizedImage[]) => {
    setFormData(prev => ({
      ...prev,
      media: newImages
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.type || !formData.location.address || !formData.rent.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!id) {
      toast.error('Property ID is missing');
      return;
    }

    try {
      setLoading(true);

      // Prepare the update data - only include editable fields
      // Note: Backend expects 'media' not 'images'
      const updateData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        location: formData.location,
        rent: formData.rent,
        deposit: formData.deposit,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        area: formData.area,
        amenities: formData.amenities,
        media: formData.media,  // Backend uses 'media' field
        landlordContact: formData.landlordContact,
        status: formData.status,
        // DO NOT send: _id, landlordId, approvalStatus, createdAt, updatedAt, isActive, rejectionReason
      };

      // Log the data being sent for debugging
      console.log('Sending update data:', updateData);

      const response = await landlordApi.updateProperty(id, updateData as any);

      if (response.success) {
        toast.success('Property updated successfully');
        navigate('/landlord/properties');
      } else {
        toast.error(response.message || 'Failed to update property');
      }
    } catch (error: any) {
      console.error('Update property error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProperty) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="landlord-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property...</p>
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
            <FiHome className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
            <p className="text-gray-600">Update property information</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/landlord/properties')}
          className="landlord-btn-secondary flex items-center"
        >
          <FiX className="w-4 h-4 mr-2" />
          Cancel
        </button>
      </div>

      {/* Form - Same as NewProperty but with update logic */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="landlord-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiHome className="w-5 h-5 mr-2 text-blue-600" />
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="landlord-input w-full"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="landlord-input w-full"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="landlord-select w-full"
                required
              >
                <option value="flat">Flat</option>
                <option value="duplex">Duplex</option>
                <option value="bungalow">Bungalow</option>
                <option value="studio">Studio</option>
                <option value="shop">Shop</option>
                <option value="office">Office</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="landlord-select w-full"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="landlord-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiMapPin className="w-5 h-5 mr-2 text-blue-600" />
            Location Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleInputChange}
                className="landlord-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleInputChange}
                className="landlord-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LGA <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location.lga"
                value={formData.location.lga}
                onChange={handleInputChange}
                className="landlord-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleInputChange}
                className="landlord-input w-full"
                required
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="landlord-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiDollarSign className="w-5 h-5 mr-2 text-blue-600" />
            Property Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rent Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="rent.amount"
                value={formData.rent.amount}
                onChange={handleNumberChange}
                className="landlord-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rent Period
              </label>
              <select
                name="rent.period"
                value={formData.rent.period}
                onChange={handleInputChange}
                className="landlord-select w-full"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deposit Amount
              </label>
              <input
                type="number"
                name="deposit"
                value={formData.deposit}
                onChange={handleNumberChange}
                className="landlord-input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleNumberChange}
                className="landlord-input w-full"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleNumberChange}
                className="landlord-input w-full"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area (sqm)
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleNumberChange}
                className="landlord-input w-full"
              />
            </div>
          </div>
        </div>

        {/* Landlord Contact */}
        <div className="landlord-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Landlord Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="landlordContact.name"
                value={formData.landlordContact.name}
                onChange={handleInputChange}
                className="landlord-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="landlordContact.phone"
                value={formData.landlordContact.phone}
                onChange={handleInputChange}
                className="landlord-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="landlordContact.email"
                value={formData.landlordContact.email}
                onChange={handleInputChange}
                className="landlord-input w-full"
                required
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="landlord-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                className="landlord-input flex-1"
                placeholder="Add amenity"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="landlord-btn-primary"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Images - Categorized Upload */}
        <div className="landlord-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiImage className="w-5 h-5 mr-2 text-blue-600" />
            Property Images
          </h2>
          <CategorizedImageUpload
            images={formData.media}
            onChange={handleImagesChange}
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/landlord/properties')}
            className="landlord-btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="landlord-btn-primary flex items-center"
          >
            {loading ? (
              <>
                <div className="landlord-spinner mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4 mr-2" />
                Update Property
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
