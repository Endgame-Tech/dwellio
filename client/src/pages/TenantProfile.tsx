import { useState, useEffect } from 'react';
import {
  FaCheck,
  FaExclamationTriangle,
  FaUpload,
  FaUser,
  FaHome,
  FaFileAlt,
  FaPhone,
  FaEnvelope,
  FaBriefcase,
  FaEdit,
  FaShieldAlt,
  FaTimes,
  FaSave,
  FaCamera
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { tenantApi } from '../services/api';
import { toast } from 'react-toastify';
import type { Document, User } from '../types';

interface CurrentResidence {
  address: string;
  landlordName?: string;
  landlordPhone?: string;
  moveInDate?: string;
  leaseEndDate?: string;
}

interface PersonalInfoForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  occupation: string;
  monthlyIncome: string;
  employerName: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}

export default function TenantProfile() {
  const { user, updateUserContext } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'documents' | 'residence'>('personal');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Edit mode states
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingResidence, setIsEditingResidence] = useState(false);

  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoForm>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    occupation: user?.tenantProfile?.occupation || '',
    monthlyIncome: user?.tenantProfile?.monthlyIncome?.toString() || '',
    employerName: user?.tenantProfile?.employerName || '',
    emergencyContactName: user?.tenantProfile?.emergencyContactName || '',
    emergencyContactPhone: user?.tenantProfile?.emergencyContactPhone || '',
    emergencyContactRelationship:
      user?.tenantProfile?.emergencyContactRelationship || ''
  });

  // Residence Form State
  const [residenceForm, setResidenceForm] = useState<CurrentResidence>({
    address: user?.tenantProfile?.currentResidence?.address || '',
    landlordName: user?.tenantProfile?.currentResidence?.landlordName || '',
    landlordPhone: user?.tenantProfile?.currentResidence?.landlordPhone || '',
    moveInDate: user?.tenantProfile?.currentResidence?.moveInDate || '',
    leaseEndDate: user?.tenantProfile?.currentResidence?.leaseEndDate || ''
  });

  // Profile image states
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Saving states for various forms
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingResidence, setSavingResidence] = useState(false);

  useEffect(() => {
    // Load profile data and calculate completion
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await tenantApi.getProfile();

        if (response.success && response.data) {
          const userData = response.data as User;

          // Update personal info
          setPersonalInfo({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || '',
            occupation: userData.tenantProfile?.occupation || '',
            monthlyIncome: userData.tenantProfile?.monthlyIncome?.toString() || '',
            employerName: userData.tenantProfile?.employerName || '',
            emergencyContactName: userData.tenantProfile?.emergencyContactName || '',
            emergencyContactPhone: userData.tenantProfile?.emergencyContactPhone || '',
            emergencyContactRelationship: userData.tenantProfile?.emergencyContactRelationship || ''
          });

          // Update residence form
          setResidenceForm({
            address: userData.tenantProfile?.currentResidence?.address || '',
            landlordName: userData.tenantProfile?.currentResidence?.landlordName || '',
            landlordPhone: userData.tenantProfile?.currentResidence?.landlordPhone || '',
            moveInDate: userData.tenantProfile?.currentResidence?.moveInDate || '',
            leaseEndDate: userData.tenantProfile?.currentResidence?.leaseEndDate || ''
          });

          // Set documents
          setDocuments(userData.tenantProfile?.documents || []);

          // Update user context
          updateUserContext(userData);

          // Get profile completion percentage from dashboard stats
          const statsResponse = await tenantApi.getDashboardStats();
          if (statsResponse.success && statsResponse.data) {
            setProfileCompletion(statsResponse.data.profileCompletion?.percentage || 0);
          }
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [updateUserContext]);

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPersonal(true);

    try {
      const updateData = {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        phoneNumber: personalInfo.phoneNumber,
        tenantProfile: {
          occupation: personalInfo.occupation,
          monthlyIncome: parseInt(personalInfo.monthlyIncome, 10),
          employerName: personalInfo.employerName,
          emergencyContactName: personalInfo.emergencyContactName,
          emergencyContactPhone: personalInfo.emergencyContactPhone,
          emergencyContactRelationship: personalInfo.emergencyContactRelationship, // Added this field
          documents: user?.tenantProfile?.documents || []
        }
      };

      const response = await tenantApi.updateProfile(updateData);

      if (response.success) {
        toast.success('Personal information updated successfully!');
        setIsEditingPersonal(false); // Exit edit mode
        // Refresh profile data
        const profileResponse = await tenantApi.getProfile();
        if (profileResponse.success && profileResponse.data) {
          updateUserContext(profileResponse.data);
        }
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleResidenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingResidence(true);

    try {
      const updateData = {
        tenantProfile: {
          currentResidence: {
            address: residenceForm.address,
            landlordName: residenceForm.landlordName,
            landlordPhone: residenceForm.landlordPhone,
            moveInDate: residenceForm.moveInDate,
            leaseEndDate: residenceForm.leaseEndDate
          },
          documents: user?.tenantProfile?.documents || []
        }
      };

      const response = await tenantApi.updateProfile(updateData);

      if (response.success) {
        toast.success('Residence information updated successfully!');
        setIsEditingResidence(false); // Exit edit mode
        // Refresh profile data
        const profileResponse = await tenantApi.getProfile();
        if (profileResponse.success && profileResponse.data) {
          updateUserContext(profileResponse.data);
        }
      } else {
        toast.error('Failed to update residence information');
      }
    } catch (error) {
      console.error('Failed to update residence:', error);
      toast.error('Failed to update residence information');
    } finally {
      setSavingResidence(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Auto-upload the image
      handleImageUploadSubmit(file);
    }
  };

  const handleImageUploadSubmit = async (file: File) => {
    setUploadingImage(true);

    try {
      const response = await tenantApi.uploadProfilePhoto(file);

      if (response.success) {
        toast.success('Profile picture updated successfully!');
        // Refresh profile data
        const profileResponse = await tenantApi.getProfile();
        if (profileResponse.success && profileResponse.data) {
          updateUserContext(profileResponse.data);
        }
      } else {
        toast.error('Failed to update profile picture');
      }
    } catch (error) {
      console.error('Failed to upload profile image:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setUploadingImage(false);
      setProfilePhotoPreview('');
    }
  };

  const handleDocumentUpload = async (documentType: string, file: File) => {
    setLoading(true);

    try {
      const response = await tenantApi.uploadDocument(file, documentType);

      if (response.success && response.data) {
        toast.success('Document uploaded successfully!');
        // Refresh profile data to get updated documents
        const profileResponse = await tenantApi.getProfile();
        if (profileResponse.success && profileResponse.data) {
          setDocuments(profileResponse.data.tenantProfile?.documents || []);
          updateUserContext(profileResponse.data);
        }
      } else {
        toast.error('Failed to upload document');
      }
    } catch (error) {
      console.error('Failed to upload document:', error);
      toast.error('Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const getDocumentStatus = (type: Document['type']) => {
    const doc = documents.find(d => d.type === type);
    if (!doc) return 'missing';
    if (doc.status) return doc.status;
    return doc.verified ? 'verified' : 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <FaCheck className="text-emerald-400" />;
      case 'pending':
        return <FaExclamationTriangle className="text-yellow-400" />;
      case 'rejected':
        return <FaExclamationTriangle className="text-red-400" />;
      default:
        return <FaUpload className="text-gray-500" />;
    }
  };

  const DocumentUploadSection = ({ type, title, description }: { type: Document['type'], title: string, description: string }) => {
    const status = getDocumentStatus(type);

    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-ubani-yellow/30 hover:shadow-lg transition-all duration-300 group">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="font-bold text-white mb-2 text-lg">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
          </div>
          <div className="flex items-center space-x-3 ml-4">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${status === 'verified' ? 'bg-emerald-500/20' :
              status === 'pending' ? 'bg-amber-500/20' :
                status === 'rejected' ? 'bg-rose-500/20' :
                  'bg-gray-500/20'
              }`}>
              {getStatusIcon(status)}
            </div>
            {status !== 'missing' && (
              <span className={`text-xs px-4 py-2 rounded-full font-semibold ${status === 'verified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            )}
          </div>
        </div>

        <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-ubani-yellow/40 hover:bg-ubani-yellow/5 transition-all duration-300 group-hover:border-ubani-yellow/40 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-2 right-2 w-16 h-16 bg-ubani-yellow rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-12 h-12 bg-ubani-yellow rounded-full"></div>
          </div>

          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleDocumentUpload(type, file);
              }
            }}
            className="hidden"
            id={`file-upload-${type}`}
          />
          <label htmlFor={`file-upload-${type}`} className="cursor-pointer relative z-10">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-ubani-yellow/20 to-ubani-yellow/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FaUpload className="w-7 h-7 text-ubani-yellow" />
              </div>
              <span className="text-base font-semibold text-white mb-2">
                {status === 'missing' ? 'Upload Document' : 'Replace Document'}
              </span>
              <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                PDF, JPG, PNG up to 10MB
              </span>
            </div>
          </label>
        </div>
      </div>
    );
  }; if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ubani-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ubani-yellow mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ubani-black p-4 sm:p-6">
      {/* Clean Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-ubani-yellow rounded-xl flex items-center justify-center">
              <FaUser className="w-6 h-6 text-ubani-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                My Profile
              </h1>
              <p className="text-gray-400 mt-1">
                Manage your personal information and account settings
              </p>
            </div>
          </div>

          {/* Edit Profile Button */}
          {activeTab === 'personal' && (
            <button
              onClick={() => setIsEditingPersonal(!isEditingPersonal)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2 ${isEditingPersonal
                ? 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                : 'bg-ubani-yellow text-ubani-black hover:bg-ubani-yellow/90'
                }`}
            >
              {isEditingPersonal ? (
                <>
                  <FaTimes className="w-4 h-4" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <FaEdit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          )}

          {activeTab === 'residence' && (
            <button
              onClick={() => setIsEditingResidence(!isEditingResidence)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2 ${isEditingResidence
                ? 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                : 'bg-ubani-yellow text-ubani-black hover:bg-ubani-yellow/90'
                }`}
            >
              {isEditingResidence ? (
                <>
                  <FaTimes className="w-4 h-4" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <FaEdit className="w-4 h-4" />
                  <span>Edit Residence</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Clean Profile Overview Card */}
      <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-8 mb-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
          {/* Profile Avatar and Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-8">
            <div className="relative">
              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-ubani-yellow rounded-2xl flex items-center justify-center overflow-hidden">
                {profilePhotoPreview || user?.profilePhoto ? (
                  <img
                    src={profilePhotoPreview || user?.profilePhoto || ''}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl lg:text-4xl font-bold text-ubani-black">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                )}
                {/* Upload overlay */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-300 group">
                  <label
                    htmlFor="profile-image-upload"
                    className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {uploadingImage ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <FaCamera className="w-6 h-6 text-white" />
                    )}
                  </label>
                </div>
              </div>

              {/* Camera button */}
              <label
                htmlFor="profile-image-upload"
                className="absolute -bottom-2 -left-2 w-8 h-8 lg:w-10 lg:h-10 bg-ubani-yellow hover:bg-ubani-yellow/90 rounded-xl flex items-center justify-center border-2 border-ubani-black cursor-pointer transition-colors"
              >
                {uploadingImage ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-ubani-black border-t-transparent"></div>
                ) : (
                  <FaCamera className="w-3 h-3 lg:w-4 lg:h-4 text-ubani-black" />
                )}
              </label>

              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />

              {/* Simple Verification Badge */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 lg:w-10 lg:h-10 bg-emerald-500 rounded-xl flex items-center justify-center border-2 border-ubani-black">
                <FaCheck className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="mb-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  {user?.firstName} {user?.lastName}
                </h2>
                <div className="flex items-center space-x-2 text-emerald-400 mb-3">
                  <FaShieldAlt className="w-4 h-4" />
                  <span className="font-medium text-sm bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30">
                    Verified Account
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FaEnvelope className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-400">Email Address</p>
                    <p className="text-white font-semibold truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <FaPhone className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-400">Phone Number</p>
                    <p className="text-white font-semibold truncate">
                      {user?.phoneNumber || 'Not provided'}
                    </p>
                  </div>
                </div>

                {user?.tenantProfile?.occupation && (
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <FaBriefcase className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-400">Occupation</p>
                      <p className="text-white font-semibold truncate">
                        {user.tenantProfile.occupation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="xl:w-80 space-y-4">
            {/* Profile Completion */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
              <div className="text-center mb-4">
                <div className="text-sm font-medium text-gray-400 mb-3">Profile Completion</div>
                <div className="relative w-20 h-20 mx-auto">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/10"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="text-ubani-yellow"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${profileCompletion}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{profileCompletion}%</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  {profileCompletion === 100 ? 'Profile Complete!' : 'Complete your profile'}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-lg border border-white/10 p-4 text-center">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <FaFileAlt className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-lg font-bold text-white">{documents.length}</div>
                <div className="text-xs text-gray-400">Documents</div>
              </div>
              <div className="bg-white/5 rounded-lg border border-white/10 p-4 text-center">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <FaCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {documents.filter(doc => doc.verified || doc.status === 'verified').length}
                </div>
                <div className="text-xs text-gray-400">Verified</div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-emerald-500/10 rounded-lg border border-emerald-500/30 p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-emerald-400 font-medium text-sm">Account Active</span>
              </div>
              <p className="text-emerald-500/70 text-xs mt-1">All systems operational</p>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Navigation Tabs */}
      <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6 mb-8">
        <div className="flex flex-wrap gap-2">
          {[
            {
              key: 'personal',
              label: 'Personal Info',
              icon: <FaUser className="w-4 h-4" />
            },
            {
              key: 'documents',
              label: 'Documents',
              icon: <FaFileAlt className="w-4 h-4" />
            },
            {
              key: 'residence',
              label: 'Current Residence',
              icon: <FaHome className="w-4 h-4" />
            }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'personal' | 'documents' | 'residence')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 inline-flex items-center space-x-2 ${activeTab === tab.key
                ? 'bg-ubani-yellow text-ubani-black'
                : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10'
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div>
            <div className="px-8 py-6 bg-blue-500/10 border-b border-blue-500/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FaUser className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-400">Personal Information</h2>
                  <p className="text-blue-400/70 text-sm mt-1">Update your personal details and contact information</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              {!isEditingPersonal ? (
                /* Read-only view */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        First Name
                      </label>
                      <p className="text-lg text-white font-medium">
                        {personalInfo.firstName || 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Last Name
                      </label>
                      <p className="text-lg text-white font-medium">
                        {personalInfo.lastName || 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Email Address
                      </label>
                      <p className="text-lg text-white font-medium">
                        {personalInfo.email || 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Phone Number
                      </label>
                      <p className="text-lg text-white font-medium">
                        {personalInfo.phoneNumber || 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Occupation
                      </label>
                      <p className="text-lg text-white font-medium">
                        {personalInfo.occupation || 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Monthly Income
                      </label>
                      <p className="text-lg text-white font-medium">
                        {personalInfo.monthlyIncome ? `₦${Number(personalInfo.monthlyIncome).toLocaleString()}` : 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Employer Name
                      </label>
                      <p className="text-lg text-white font-medium">
                        {personalInfo.employerName || 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Emergency Contact Name
                      </label>
                      <p className="text-lg text-white font-medium">
                        {personalInfo.emergencyContactName || 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Emergency Contact Phone
                      </label>
                      <p className="text-lg text-white font-medium">
                        {personalInfo.emergencyContactPhone || 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Emergency Contact Relationship
                      </label>
                      <p className="text-lg text-white font-medium">
                        {personalInfo.emergencyContactRelationship || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Edit mode form */
                <form onSubmit={handlePersonalInfoSubmit}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-colors text-white placeholder-gray-500"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-colors text-white placeholder-gray-500"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-colors text-white placeholder-gray-500"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={personalInfo.phoneNumber}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-colors text-white placeholder-gray-500"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Occupation *
                      </label>
                      <input
                        type="text"
                        value={personalInfo.occupation}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, occupation: e.target.value }))}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-colors text-white placeholder-gray-500"
                        placeholder="Enter your occupation"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Monthly Income (₦) *
                      </label>
                      <input
                        type="number"
                        value={personalInfo.monthlyIncome}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-colors text-white placeholder-gray-500"
                        placeholder="Enter your monthly income"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Employer Name
                      </label>
                      <input
                        type="text"
                        value={personalInfo.employerName}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, employerName: e.target.value }))}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-colors text-white placeholder-gray-500"
                        placeholder="Enter your employer name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        value={personalInfo.emergencyContactName}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-colors text-white placeholder-gray-500"
                        placeholder="Enter emergency contact name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Emergency Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={personalInfo.emergencyContactPhone}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-colors text-white placeholder-gray-500"
                        placeholder="Enter emergency contact phone"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Emergency Contact Relationship
                      </label>
                      <input
                        type="text"
                        value={personalInfo.emergencyContactRelationship}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, emergencyContactRelationship: e.target.value }))}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-colors text-white placeholder-gray-500"
                        placeholder="Enter relationship (e.g., Parent, Sibling)"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6 border-t border-white/10 mt-8">
                    <button
                      type="button"
                      onClick={() => setIsEditingPersonal(false)}
                      className="bg-white/5 hover:bg-white/10 text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2 border border-white/10"
                    >
                      <FaTimes className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="submit"
                      disabled={savingPersonal || loading}
                      className="bg-ubani-yellow hover:bg-ubani-yellow/90 text-ubani-black px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2 disabled:opacity-50"
                    >
                      <FaSave className="w-4 h-4" />
                      <span>{savingPersonal ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div>
            <div className="px-8 py-6 bg-emerald-500/10 border-b border-emerald-500/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <FaFileAlt className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-emerald-400">Documents</h2>
                  <p className="text-emerald-400/70 text-sm mt-1">Upload required documents for verification</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DocumentUploadSection
                  type="id_card"
                  title="Valid ID"
                  description="Upload your National ID, International Passport, or Driver's License"
                />
                <DocumentUploadSection
                  type="bank_statement"
                  title="Bank Statement"
                  description="Last 3 months bank statement"
                />
                <DocumentUploadSection
                  type="employment_letter"
                  title="Employment Letter"
                  description="Letter from your employer confirming your employment"
                />
                <DocumentUploadSection
                  type="utility_bill"
                  title="Utility Bill"
                  description="Recent utility bill (electricity, water, etc.)"
                />
              </div>
            </div>
          </div>
        )}

        {/* Current Residence Tab */}
        {activeTab === 'residence' && (
          <div>
            <div className="px-8 py-6 bg-purple-500/10 border-b border-purple-500/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <FaHome className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-purple-400">Current Residence</h2>
                  <p className="text-purple-400/70 text-sm mt-1">Provide details about your current living situation</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              {!isEditingResidence ? (
                /* Read-only view */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Current Address
                      </label>
                      <p className="text-lg text-white font-medium">
                        {residenceForm.address || 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Landlord Name
                      </label>
                      <p className="text-lg text-white font-medium">
                        {residenceForm.landlordName || 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Landlord Phone
                      </label>
                      <p className="text-lg text-white font-medium">
                        {residenceForm.landlordPhone || 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Move-In Date
                      </label>
                      <p className="text-lg text-white font-medium">
                        {residenceForm.moveInDate ? new Date(residenceForm.moveInDate).toLocaleDateString() : 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Lease End Date
                      </label>
                      <p className="text-lg text-white font-medium">
                        {residenceForm.leaseEndDate ? new Date(residenceForm.leaseEndDate).toLocaleDateString() : 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Edit mode form */
                <form onSubmit={handleResidenceSubmit}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Current Address *
                      </label>
                      <input
                        type="text"
                        value={residenceForm.address}
                        onChange={(e) => setResidenceForm(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-colors text-white placeholder-gray-500"
                        placeholder="Enter your current address"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Landlord Name
                      </label>
                      <input
                        type="text"
                        value={residenceForm.landlordName}
                        onChange={(e) => setResidenceForm(prev => ({ ...prev, landlordName: e.target.value }))}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-colors text-white placeholder-gray-500"
                        placeholder="Enter landlord name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Landlord Phone
                      </label>
                      <input
                        type="tel"
                        value={residenceForm.landlordPhone}
                        onChange={(e) => setResidenceForm(prev => ({ ...prev, landlordPhone: e.target.value }))}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-colors text-white placeholder-gray-500"
                        placeholder="Enter landlord phone"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Move-In Date
                      </label>
                      <input
                        type="date"
                        value={residenceForm.moveInDate}
                        onChange={(e) => setResidenceForm(prev => ({ ...prev, moveInDate: e.target.value }))}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-colors text-white placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Lease End Date
                      </label>
                      <input
                        type="date"
                        value={residenceForm.leaseEndDate}
                        onChange={(e) => setResidenceForm(prev => ({ ...prev, leaseEndDate: e.target.value }))}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-colors text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6 border-t border-white/10 mt-8">
                    <button
                      type="button"
                      onClick={() => setIsEditingResidence(false)}
                      className="bg-white/5 hover:bg-white/10 text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2 border border-white/10"
                    >
                      <FaTimes className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="submit"
                      disabled={savingResidence || loading}
                      className="bg-ubani-yellow hover:bg-ubani-yellow/90 text-ubani-black px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2 disabled:opacity-50"
                    >
                      <FaSave className="w-4 h-4" />
                      <span>{savingResidence ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
