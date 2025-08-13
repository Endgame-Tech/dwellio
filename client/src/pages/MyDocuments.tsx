import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { tenantApi } from '../services/api';
import { FaUpload, FaCheck, FaExclamationTriangle, FaFileAlt, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import type { Document, User } from '../types';

export default function MyDocuments() {
  const { updateUserContext } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);

  const documentTypes = [
    { key: 'id_card', label: 'Valid ID', description: 'National ID, International Passport, or Driver\'s License' },
    { key: 'bank_statement', label: 'Bank Statement', description: 'Last 3 months bank statement' },
    { key: 'employment_letter', label: 'Employment Letter', description: 'Letter from your employer confirming employment' },
    { key: 'utility_bill', label: 'Utility Bill', description: 'Recent utility bill (electricity, water, etc.)' },
    { key: 'passport', label: 'Passport Photo', description: 'Recent passport-sized photograph' }
  ];

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        const response = await tenantApi.getProfile();
        
        if (response.success && response.data) {
          const userData = response.data as User;
          setDocuments(userData.tenantProfile?.documents || []);
        }
      } catch (error) {
        console.error('Failed to load documents:', error);
        toast.error('Failed to load documents');
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const handleDocumentUpload = async (documentType: string, file: File) => {
    setUploadingDocType(documentType);
    
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
      setUploadingDocType(null);
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
        return <FaCheck className="text-green-600" />;
      case 'pending':
        return <FaExclamationTriangle className="text-yellow-600" />;
      case 'rejected':
        return <FaExclamationTriangle className="text-red-600" />;
      default:
        return <FaUpload className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const DocumentCard = ({ docType }: { docType: typeof documentTypes[0] }) => {
    const status = getDocumentStatus(docType.key as Document['type']);
    const document = documents.find(d => d.type === docType.key);
    const isUploading = uploadingDocType === docType.key;
    
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FaFileAlt className="text-primary-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{docType.label}</h3>
              <p className="text-sm text-gray-600">{docType.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(status)}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {status === 'missing' ? 'Not Uploaded' : status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>

        {document && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{document.filename}</p>
                <p className="text-xs text-gray-600">
                  Uploaded on {new Date(document.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {document.url && (
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-primary-600 hover:text-primary-800"
                    title="View document"
                  >
                    <FaEye />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleDocumentUpload(docType.key, file);
              }
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            disabled={isUploading}
          />
          {isUploading && (
            <p className="text-sm text-primary-600">Uploading...</p>
          )}
          {status === 'rejected' && (
            <p className="text-sm text-red-600">
              Document was rejected. Please upload a new version.
            </p>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaFileAlt className="text-4xl text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your documents...</p>
        </div>
      </div>
    );
  }

  const uploadedCount = documents.length;
  const verifiedCount = documents.filter(d => d.verified || d.status === 'verified').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
              <p className="text-gray-600">Manage your verification documents</p>
            </div>
            <Link
              to="/dashboard"
              className="text-primary-700 hover:text-primary-800 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaFileAlt className="text-blue-700" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{uploadedCount}</p>
                <p className="text-gray-600">Documents Uploaded</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaCheck className="text-green-700" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{verifiedCount}</p>
                <p className="text-gray-600">Verified Documents</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FaExclamationTriangle className="text-yellow-700" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{uploadedCount - verifiedCount}</p>
                <p className="text-gray-600">Pending Review</p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documentTypes.map(docType => (
            <DocumentCard key={docType.key} docType={docType} />
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Document Upload Guidelines</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Upload clear, high-quality images or PDF files</li>
            <li>• Ensure all text in the document is readable</li>
            <li>• Maximum file size: 5MB per document</li>
            <li>• Accepted formats: PDF, JPG, PNG, DOC, DOCX</li>
            <li>• Documents are typically reviewed within 24-48 hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
}