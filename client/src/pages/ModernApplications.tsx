import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertiesApi } from '../services/api';
import { toast } from 'react-toastify';
import type { Application } from '../types';
import {
  FaFileAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaUser,
  FaEye,
  FaInfoCircle
} from 'react-icons/fa';

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    // Fetch applications from API
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await propertiesApi.getMyApplications();

        if (response.success && response.data) {
          setApplications(response.data);
        } else {
          toast.error('Failed to load applications');
        }
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'reviewing':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'withdrawn':
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
      default:
        return 'bg-ubani-yellow/20 text-ubani-yellow border border-ubani-yellow/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'reviewing':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Declined';
      case 'withdrawn':
        return 'Withdrawn';
      default:
        return 'Pending';
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'pending') return app.status === 'pending' || app.status === 'reviewing';
    return app.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ubani-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ubani-yellow mx-auto mb-4"></div>
          <p className="text-white">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-ubani-black min-h-full w-full">
      <div className="max-w-7xl mx-auto space-y-8 w-full">
        {/* Welcome Message */}
        <div className="ubani-animate-slide-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            My Applications
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Track your property applications and see updates from landlords
          </p>
        </div>

        {/* Stats Cards */}
        <div className="ubani-stats-grid ubani-animate-fade-in">
          {/* Total Applications */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 hover:border-ubani-yellow/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-ubani-yellow/20 rounded-xl">
                <FaFileAlt className="w-6 h-6 text-ubani-yellow" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Total Applications</h3>
              <p className="text-3xl font-bold text-white">{applications.length}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">All time</span>
              </div>
            </div>
          </div>

          {/* Pending Applications */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <FaClock className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Pending</h3>
              <p className="text-3xl font-bold text-white">
                {applications.filter(app => app.status === 'pending' || app.status === 'reviewing').length}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">Under review</span>
              </div>
            </div>
          </div>

          {/* Approved Applications */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <FaCheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Approved</h3>
              <p className="text-3xl font-bold text-white">
                {applications.filter(app => app.status === 'approved').length}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">Successful</span>
              </div>
            </div>
          </div>

          {/* Rejected Applications */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 hover:border-rose-500/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-rose-500/20 rounded-xl">
                <FaTimesCircle className="w-6 h-6 text-rose-500" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Rejected</h3>
              <p className="text-3xl font-bold text-white">
                {applications.filter(app => app.status === 'rejected').length}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">Declined</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 ubani-animate-slide-up">
          <div className="flex flex-wrap gap-3">
            {[
              { key: 'all', label: 'All Applications' },
              { key: 'pending', label: 'Pending' },
              { key: 'approved', label: 'Approved' },
              { key: 'rejected', label: 'Rejected' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as 'all' | 'pending' | 'approved' | 'rejected')}
                className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${filter === tab.key
                  ? 'bg-ubani-yellow text-ubani-black shadow-lg transform hover:scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-ubani-yellow/30 transform hover:scale-105'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-12 ubani-animate-slide-up text-center">
            <div className="w-16 h-16 bg-ubani-yellow/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaFileAlt className="w-8 h-8 text-ubani-yellow" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No applications found</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {filter === 'all'
                ? "You haven't applied to any properties yet. Request move-out support to get started."
                : `No ${filter} applications found.`}
            </p>
            <Link
              to="/move-out"
              className="bg-ubani-yellow hover:bg-ubani-yellow/90 px-8 py-4 rounded-xl font-medium transition-all inline-flex items-center space-x-3 text-ubani-black transform hover:scale-105 shadow-lg"
            >
              <FaFileAlt className="w-5 h-5" />
              <span>Request Move-Out Support</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((application) => {
              const property = typeof application.propertyId === 'object' ? application.propertyId : null;
              const propertyTitle = property?.title || 'Property';
              const propertyAddress = property?.location?.address || 'No address available';
              const propertyRent = property?.rent?.amount || 0;

              return (
                <div key={application._id} className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 hover:border-ubani-yellow/30 transition-all duration-300 ubani-animate-slide-up">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                        <h3 className="text-xl font-semibold text-white">
                          {propertyTitle}
                        </h3>
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium self-start ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300 mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-500/20 rounded-lg flex items-center justify-center border border-slate-500/30">
                            <FaMapMarkerAlt className="w-5 h-5 text-slate-400" />
                          </div>
                          <span className="flex-1">{propertyAddress}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                            <FaMoneyBillWave className="w-5 h-5 text-emerald-500" />
                          </div>
                          <span>₦{propertyRent.toLocaleString()}/year</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                            <FaCalendarAlt className="w-5 h-5 text-blue-500" />
                          </div>
                          <span>Move-in: {new Date(application.applicationData.moveInDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-ubani-yellow/20 rounded-lg flex items-center justify-center border border-ubani-yellow/30">
                            <FaUser className="w-5 h-5 text-ubani-yellow" />
                          </div>
                          <span>Budget: ₦{application.applicationData.monthlyBudget.toLocaleString()}/month</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start lg:items-end text-left lg:text-right space-y-4">
                      <p className="text-sm text-gray-500">
                        Applied: {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                      <Link
                        to={`/properties/${application.propertyId}`}
                        className="bg-ubani-yellow/10 hover:bg-ubani-yellow/20 border border-ubani-yellow/30 hover:border-ubani-yellow/50 px-6 py-3 rounded-xl text-white transition-all inline-flex items-center space-x-2 transform hover:scale-105"
                      >
                        <FaEye className="w-4 h-4" />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </div>

                  {/* Notes/Message */}
                  {application.applicationData.tenantMessage && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-6">
                      <h4 className="font-medium text-white mb-2">Your Message</h4>
                      <p className="text-sm text-gray-400">{application.applicationData.tenantMessage}</p>
                    </div>
                  )}

                  {/* Ubani Facilitation Note */}
                  <div className="bg-ubani-yellow/10 border border-ubani-yellow/30 rounded-xl p-4 mt-6">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-ubani-yellow/20 rounded-lg flex items-center justify-center border border-ubani-yellow/30">
                        <FaInfoCircle className="w-5 h-5 text-ubani-yellow" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white mb-1">Ubani Representation</h4>
                        <p className="text-sm text-gray-400">
                          We're representing you in this application. Our team will handle negotiations and follow up with the landlord on your behalf.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
