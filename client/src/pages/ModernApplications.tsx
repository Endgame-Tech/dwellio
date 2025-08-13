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
        return 'bg-emerald-100 text-emerald-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-amber-100 text-amber-800';
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
      <div className="min-h-screen flex items-center justify-center dwellio-dashboard-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dwellio-primary mx-auto mb-4"></div>
          <p className="text-dwellio-dark">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 dwellio-dashboard-bg min-h-full w-full dwellio-dashboard-container">
      <div className="max-w-7xl mx-auto space-y-8 w-full">
        {/* Welcome Message */}
        <div className="dwellio-animate-slide-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-dwellio-dark">
            My Applications
          </h1>
          <p className="text-dwellio-dark/70 mt-2 text-sm sm:text-base">
            Track your property applications and see updates from landlords
          </p>
        </div>

        {/* Stats Cards */}
        <div className="dwellio-stats-grid dwellio-animate-fade-in">
          {/* Total Applications */}
          <div className="dwellio-modern-card dwellio-hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-dwellio-primary/20 rounded-xl dwellio-icon-modern">
                <FaFileAlt className="w-6 h-6 text-dwellio-dark" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-dwellio-dark/70 mb-2">Total Applications</h3>
              <p className="text-3xl font-bold text-dwellio-dark">{applications.length}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-dwellio-dark/50">All time</span>
              </div>
            </div>
          </div>

          {/* Pending Applications */}
          <div className="dwellio-modern-card dwellio-hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-xl dwellio-icon-modern">
                <FaClock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-dwellio-dark/70 mb-2">Pending</h3>
              <p className="text-3xl font-bold text-dwellio-dark">
                {applications.filter(app => app.status === 'pending' || app.status === 'reviewing').length}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-dwellio-dark/50">Under review</span>
              </div>
            </div>
          </div>

          {/* Approved Applications */}
          <div className="dwellio-modern-card dwellio-hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl dwellio-icon-modern">
                <FaCheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-dwellio-dark/70 mb-2">Approved</h3>
              <p className="text-3xl font-bold text-dwellio-dark">
                {applications.filter(app => app.status === 'approved').length}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-dwellio-dark/50">Successful</span>
              </div>
            </div>
          </div>

          {/* Rejected Applications */}
          <div className="dwellio-modern-card dwellio-hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-rose-100 rounded-xl dwellio-icon-modern">
                <FaTimesCircle className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-dwellio-dark/70 mb-2">Rejected</h3>
              <p className="text-3xl font-bold text-dwellio-dark">
                {applications.filter(app => app.status === 'rejected').length}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-dwellio-dark/50">Declined</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="dwellio-modern-card dwellio-animate-slide-up">
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
                  ? 'bg-dwellio-primary text-dwellio-dark shadow-lg dwellio-hover-lift'
                  : 'bg-dwellio-primary/10 hover:bg-dwellio-primary/20 text-dwellio-dark dwellio-hover-lift'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="dwellio-modern-card dwellio-animate-slide-up text-center py-12">
            <div className="w-16 h-16 bg-dwellio-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaFileAlt className="w-8 h-8 text-dwellio-dark/40" />
            </div>
            <h3 className="text-xl font-semibold text-dwellio-dark mb-2">No applications found</h3>
            <p className="text-dwellio-dark/60 mb-8 max-w-md mx-auto">
              {filter === 'all'
                ? "You haven't applied to any properties yet. Request move-out support to get started."
                : `No ${filter} applications found.`}
            </p>
            <Link
              to="/move-out"
              className="bg-dwellio-primary hover:bg-dwellio-primary-dark px-8 py-4 rounded-xl font-medium transition-colors inline-flex items-center space-x-3 text-dwellio-dark dwellio-hover-lift"
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
                <div key={application._id} className="dwellio-modern-card dwellio-hover-lift dwellio-animate-slide-up">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                        <h3 className="text-xl font-semibold text-dwellio-dark">
                          {propertyTitle}
                        </h3>
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium self-start ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-dwellio-dark/70 mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <FaMapMarkerAlt className="w-5 h-5 text-slate-600" />
                          </div>
                          <span className="flex-1">{propertyAddress}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <FaMoneyBillWave className="w-5 h-5 text-emerald-600" />
                          </div>
                          <span>₦{propertyRent.toLocaleString()}/year</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FaCalendarAlt className="w-5 h-5 text-blue-600" />
                          </div>
                          <span>Move-in: {new Date(application.applicationData.moveInDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-dwellio-primary/20 rounded-lg flex items-center justify-center">
                            <FaUser className="w-5 h-5 text-dwellio-dark" />
                          </div>
                          <span>Budget: ₦{application.applicationData.monthlyBudget.toLocaleString()}/month</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start lg:items-end text-left lg:text-right space-y-4">
                      <p className="text-sm text-dwellio-dark/50">
                        Applied: {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                      <Link
                        to={`/properties/${application.propertyId}`}
                        className="bg-dwellio-primary/10 hover:bg-dwellio-primary/20 px-6 py-3 rounded-xl text-dwellio-dark transition-colors inline-flex items-center space-x-2 dwellio-hover-lift"
                      >
                        <FaEye className="w-4 h-4" />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </div>

                  {/* Notes/Message */}
                  {application.applicationData.tenantMessage && (
                    <div className="bg-dwellio-primary/10 rounded-xl p-4 mt-6 border border-dwellio-primary/20">
                      <h4 className="font-medium text-dwellio-dark mb-2">Your Message</h4>
                      <p className="text-sm text-dwellio-dark/70">{application.applicationData.tenantMessage}</p>
                    </div>
                  )}

                  {/* Dwellio Facilitation Note */}
                  <div className="bg-dwellio-primary/20 border border-dwellio-primary/30 rounded-xl p-4 mt-6">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-dwellio-primary/30 rounded-lg flex items-center justify-center">
                        <FaInfoCircle className="w-5 h-5 text-dwellio-dark" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-dwellio-dark mb-1">Dwellio Representation</h4>
                        <p className="text-sm text-dwellio-dark/70">
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
