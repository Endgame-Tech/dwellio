import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { tenantApi } from '../services/api';
import { toast } from 'react-toastify';
import {
  FaHome,
  FaMoneyBillWave,
  FaFileAlt,
  FaTools,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaChevronRight,
  FaBell
} from 'react-icons/fa';

interface DashboardStats {
  activeApplications: number;
  pendingPayments: number;
  monthlyRent: number;
  maintenanceRequests: number;
}

interface Activity {
  id: string;
  type: 'payment' | 'application' | 'maintenance' | 'notice';
  title: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'urgent';
}

export default function ModernTenantDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    activeApplications: 0,
    pendingPayments: 0,
    monthlyRent: 0,
    maintenanceRequests: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch dashboard summary stats
        const summaryResponse = await tenantApi.getDashboardSummary();
        if (summaryResponse.success && summaryResponse.data) {
          const summary = summaryResponse.data;
          setStats({
            activeApplications: summary.totalApplications ?? 0,
            pendingPayments: summary.totalPayments ?? 0,
            monthlyRent: summary.monthlyRent ?? 0,
            maintenanceRequests: summary.maintenanceRequests ?? 0,
          });
        }

        // Fetch recent activities
        const activitiesResponse = await tenantApi.getRecentActivities(8);
        if (activitiesResponse.success && activitiesResponse.data) {
          setActivities(
            activitiesResponse.data.map((a: import('../types').Activity) => ({
              id: a._id || Math.random().toString(36).slice(2),
              type: a.type || 'notice',
              title: a.description || 'Activity',
              description: a.description || 'No description available',
              timestamp: a.createdAt || new Date().toISOString(),
              status: a.status || 'pending',
            }))
          );
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-dwellio-primary/20 text-dwellio-dark';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-dwellio-light/50 text-dwellio-dark';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dwellio-dashboard-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dwellio-primary mx-auto mb-4"></div>
          <p className="text-dwellio-dark">Loading dashboard...</p>
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
            Hello, {user?.firstName || user?.name || 'Tenant'}!
          </h1>
          <p className="text-dwellio-dark/70 mt-2 text-sm sm:text-base">
            Welcome back to your modern property dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="dwellio-stats-grid dwellio-animate-fade-in">
          {/* Active Applications */}
          <div className="dwellio-modern-card dwellio-hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-dwellio-primary/20 rounded-xl dwellio-icon-modern">
                <FaFileAlt className="w-6 h-6 text-dwellio-dark" />
              </div>
              <div className="text-right">
                <button className="text-dwellio-dark/40 hover:text-dwellio-dark transition-colors">
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-dwellio-dark/70 mb-2">Active Applications</h3>
              <p className="text-3xl font-bold text-dwellio-dark">{stats.activeApplications}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-dwellio-dark/50">This month</span>
              </div>
            </div>
          </div>

          {/* Pending Payments */}
          <div className="dwellio-modern-card dwellio-hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl dwellio-icon-modern">
                <FaMoneyBillWave className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-right">
                <button className="text-dwellio-dark/40 hover:text-dwellio-dark transition-colors">
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-dwellio-dark/70 mb-2">Pending Payments</h3>
              <p className="text-3xl font-bold text-dwellio-dark">{stats.pendingPayments}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-dwellio-dark/50">Outstanding payments</span>
              </div>
            </div>
          </div>

          {/* Monthly Rent */}
          <div className="dwellio-modern-card dwellio-hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl dwellio-icon-modern">
                <FaHome className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-right">
                <button className="text-dwellio-dark/40 hover:text-dwellio-dark transition-colors">
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-dwellio-dark/70 mb-2">Monthly Rent</h3>
              <p className="text-2xl lg:text-3xl font-bold text-dwellio-dark">₦{stats.monthlyRent.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-dwellio-dark/50">Monthly amount</span>
              </div>
            </div>
          </div>

          {/* Maintenance Requests */}
          <div className="dwellio-modern-card dwellio-hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-100 rounded-xl dwellio-icon-modern">
                <FaTools className="w-6 h-6 text-slate-600" />
              </div>
              <div className="text-right">
                <button className="text-dwellio-dark/40 hover:text-dwellio-dark transition-colors">
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-dwellio-dark/70 mb-2">Maintenance Requests</h3>
              <p className="text-3xl font-bold text-dwellio-dark">{stats.maintenanceRequests}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-dwellio-dark/50">Open requests</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Two Columns */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Activities - Takes 2 columns in xl */}
          <div className="xl:col-span-2 dwellio-modern-card dwellio-animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-dwellio-dark">Recent Activities</h3>
              <button className="text-sm text-dwellio-dark hover:text-dwellio-primary-dark font-medium transition-colors">
                See All
              </button>
            </div>

            <div className="space-y-4">
              {activities.length > 0 ? activities.slice(0, 4).map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-dwellio-light/30 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-dwellio-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    {activity.type === 'payment' && <FaMoneyBillWave className="w-5 h-5 text-dwellio-dark" />}
                    {activity.type === 'application' && <FaFileAlt className="w-5 h-5 text-dwellio-dark" />}
                    {activity.type === 'maintenance' && <FaTools className="w-5 h-5 text-dwellio-dark" />}
                    {activity.type === 'notice' && <FaBell className="w-5 h-5 text-dwellio-dark" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dwellio-dark truncate">{activity.title}</p>
                    <p className="text-xs text-dwellio-dark/50">
                      {new Date(activity.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <FaClock className="w-8 h-8 text-dwellio-dark/30 mx-auto mb-3" />
                  <p className="text-dwellio-dark/50 text-sm">No recent activities</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Upcoming */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="dwellio-modern-card dwellio-animate-slide-up">
              <h3 className="text-lg font-semibold text-dwellio-dark mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-3 sm:p-4 bg-dwellio-primary/20 rounded-xl hover:bg-dwellio-primary/30 transition-colors text-left dwellio-hover-lift">
                  <FaFileAlt className="w-5 h-5 sm:w-6 sm:h-6 text-dwellio-dark mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-dwellio-dark">New Application</p>
                  <p className="text-xs text-dwellio-dark/50 hidden sm:block">Apply for property</p>
                </button>
                <button className="p-3 sm:p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors text-left dwellio-hover-lift">
                  <FaMoneyBillWave className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-dwellio-dark">Pay Rent</p>
                  <p className="text-xs text-dwellio-dark/50 hidden sm:block">Make payment</p>
                </button>
                <button className="p-3 sm:p-4 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors text-left dwellio-hover-lift">
                  <FaTools className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-dwellio-dark">Maintenance</p>
                  <p className="text-xs text-dwellio-dark/50 hidden sm:block">Report issue</p>
                </button>
                <button className="p-3 sm:p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-left dwellio-hover-lift">
                  <FaUser className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-dwellio-dark">Profile</p>
                  <p className="text-xs text-dwellio-dark/50 hidden sm:block">Update info</p>
                </button>
              </div>
            </div>

            {/* Upcoming Payments */}
            <div className="dwellio-modern-card dwellio-animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-dwellio-dark">Upcoming Payments</h3>
                <button className="text-sm text-dwellio-primary hover:text-dwellio-primary-dark font-medium transition-colors">
                  See Details
                </button>
              </div>

              {/* Show upcoming payments if available, otherwise show empty state */}
              {stats.monthlyRent > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-dwellio-primary/10 rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-2 h-2 bg-dwellio-primary rounded-full flex-shrink-0"></div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-dwellio-dark">Monthly Rent</p>
                        <p className="text-xs text-dwellio-dark/50">Next due date</p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-dwellio-dark flex-shrink-0">₦{stats.monthlyRent.toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <FaCalendarAlt className="w-6 h-6 sm:w-8 sm:h-8 text-dwellio-dark/30 mx-auto mb-2 sm:mb-3" />
                  <p className="text-dwellio-dark/50 text-xs sm:text-sm">No upcoming payments</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}