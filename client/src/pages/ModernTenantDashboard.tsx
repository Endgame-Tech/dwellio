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
        return 'bg-ubani-yellow/20 text-ubani-black border border-ubani-yellow/30';
      case 'completed':
        return 'bg-green-500/20 text-green-700 border border-green-500/30';
      case 'urgent':
        return 'bg-red-500/20 text-red-700 border border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-700 border border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ubani-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ubani-yellow mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
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
            Hello, {user?.firstName || user?.name || 'Tenant'}!
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Welcome back to your modern property dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="ubani-stats-grid ubani-animate-fade-in">
          {/* Active Applications */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 hover:border-ubani-yellow/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-ubani-yellow/20 rounded-xl">
                <FaFileAlt className="w-6 h-6 text-ubani-yellow" />
              </div>
              <div className="text-right">
                <button className="text-gray-400 hover:text-ubani-yellow transition-colors">
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Active Applications</h3>
              <p className="text-3xl font-bold text-white">{stats.activeApplications}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">This month</span>
              </div>
            </div>
          </div>

          {/* Pending Payments */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <FaMoneyBillWave className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-right">
                <button className="text-gray-400 hover:text-orange-500 transition-colors">
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Pending Payments</h3>
              <p className="text-3xl font-bold text-white">{stats.pendingPayments}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">Outstanding payments</span>
              </div>
            </div>
          </div>

          {/* Monthly Rent */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <FaHome className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="text-right">
                <button className="text-gray-400 hover:text-emerald-500 transition-colors">
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Monthly Rent</h3>
              <p className="text-2xl lg:text-3xl font-bold text-white">₦{stats.monthlyRent.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">Monthly amount</span>
              </div>
            </div>
          </div>

          {/* Maintenance Requests */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <FaTools className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-right">
                <button className="text-gray-400 hover:text-blue-500 transition-colors">
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Maintenance Requests</h3>
              <p className="text-3xl font-bold text-white">{stats.maintenanceRequests}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">Open requests</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Two Columns */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Activities - Takes 2 columns in xl */}
          <div className="xl:col-span-2 bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 ubani-animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Activities</h3>
              <button className="text-sm text-ubani-yellow hover:text-ubani-yellow/80 font-medium transition-colors">
                See All
              </button>
            </div>

            <div className="space-y-4">
              {activities.length > 0 ? activities.slice(0, 4).map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-white/5 rounded-lg transition-colors border border-white/5 hover:border-ubani-yellow/30">
                  <div className="w-10 h-10 bg-ubani-yellow/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    {activity.type === 'payment' && <FaMoneyBillWave className="w-5 h-5 text-ubani-yellow" />}
                    {activity.type === 'application' && <FaFileAlt className="w-5 h-5 text-ubani-yellow" />}
                    {activity.type === 'maintenance' && <FaTools className="w-5 h-5 text-ubani-yellow" />}
                    {activity.type === 'notice' && <FaBell className="w-5 h-5 text-ubani-yellow" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                    <p className="text-xs text-gray-400">
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
                  <FaClock className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No recent activities</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Upcoming */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 ubani-animate-slide-up">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-3 sm:p-4 bg-ubani-yellow/10 border border-ubani-yellow/20 rounded-xl hover:bg-ubani-yellow/20 hover:border-ubani-yellow/40 transition-all text-left transform hover:scale-105">
                  <FaFileAlt className="w-5 h-5 sm:w-6 sm:h-6 text-ubani-yellow mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-white">New Application</p>
                  <p className="text-xs text-gray-400 hidden sm:block">Apply for property</p>
                </button>
                <button className="p-3 sm:p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all text-left transform hover:scale-105">
                  <FaMoneyBillWave className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-white">Pay Rent</p>
                  <p className="text-xs text-gray-400 hidden sm:block">Make payment</p>
                </button>
                <button className="p-3 sm:p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 hover:border-blue-500/40 transition-all text-left transform hover:scale-105">
                  <FaTools className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-white">Maintenance</p>
                  <p className="text-xs text-gray-400 hidden sm:block">Report issue</p>
                </button>
                <button className="p-3 sm:p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl hover:bg-purple-500/20 hover:border-purple-500/40 transition-all text-left transform hover:scale-105">
                  <FaUser className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-white">Profile</p>
                  <p className="text-xs text-gray-400 hidden sm:block">Update info</p>
                </button>
              </div>
            </div>

            {/* Upcoming Payments */}
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 ubani-animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Upcoming Payments</h3>
                <button className="text-sm text-ubani-yellow hover:text-ubani-yellow/80 font-medium transition-colors">
                  See Details
                </button>
              </div>

              {/* Show upcoming payments if available, otherwise show empty state */}
              {stats.monthlyRent > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-ubani-yellow/10 border border-ubani-yellow/20 rounded-lg hover:bg-ubani-yellow/20 transition-colors">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-2 h-2 bg-ubani-yellow rounded-full flex-shrink-0 animate-pulse"></div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-white">Monthly Rent</p>
                        <p className="text-xs text-gray-400">Next due date</p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-ubani-yellow flex-shrink-0">₦{stats.monthlyRent.toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <FaCalendarAlt className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 mx-auto mb-2 sm:mb-3" />
                  <p className="text-gray-500 text-xs sm:text-sm">No upcoming payments</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}