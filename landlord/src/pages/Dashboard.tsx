import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLandlord } from '../context/LandlordContext';
import { landlordApi } from '../services/api';
import { DashboardStats, ChartData } from '../types';
import {
  FiUsers,
  FiMapPin,
  FiFileText,
  FiDollarSign,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
  FiEye,
  FiRefreshCw
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { toast } from 'react-toastify';

const COLORS = ['#1e40af', '#059669', '#dc2626', '#d97706', '#7c3aed'];

interface StatsCard {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href?: string;
}

export default function Dashboard() {
  const { user, hasPermission } = useLandlord();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<{
    users: ChartData[];
    properties: ChartData[];
    applications: ChartData[];
    payments: ChartData[];
  }>({
    users: [],
    properties: [],
    applications: [],
    payments: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load stats
      const statsResponse = await landlordApi.getDashboardStats();
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }

      // Load chart data
      const [usersChart, propertiesChart, applicationsChart, paymentsChart] = await Promise.all([
        landlordApi.getChartData('users'),
        landlordApi.getChartData('properties'),
        landlordApi.getChartData('applications'),
        landlordApi.getChartData('payments'),
      ]);

      setChartData({
        users: usersChart.success ? usersChart.data : [],
        properties: propertiesChart.success ? propertiesChart.data : [],
        applications: applicationsChart.success ? applicationsChart.data : [],
        payments: paymentsChart.success ? paymentsChart.data : [],
      });

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    toast.success('Dashboard refreshed');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="landlord-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statsCards: StatsCard[] = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: '+12%',
      changeType: 'increase',
      icon: FiUsers,
      color: 'text-blue-600 bg-blue-100',
      href: hasPermission('users.read') ? '/landlord/users' : undefined,
    },
    {
      title: 'Total Properties',
      value: stats?.totalProperties || 0,
      change: '+8%',
      changeType: 'increase',
      icon: FiMapPin,
      color: 'text-green-600 bg-green-100',
      href: hasPermission('properties.read') ? '/landlord/properties' : undefined,
    },
    {
      title: 'Pending Applications',
      value: stats?.pendingApplications || 0,
      change: '-5%',
      changeType: 'decrease',
      icon: FiFileText,
      color: 'text-orange-600 bg-orange-100',
      href: hasPermission('applications.read') ? '/landlord/applications' : undefined,
    },
    {
      title: 'Monthly Revenue',
      value: `₦${(stats?.totalRevenue || 0).toLocaleString()}`,
      change: '+15%',
      changeType: 'increase',
      icon: FiDollarSign,
      color: 'text-purple-600 bg-purple-100',
      href: hasPermission('payments.read') ? '/landlord/payments' : undefined,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your property management platform.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="landlord-btn-secondary flex items-center"
        >
          <FiRefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsCards.map((card) => (
          <div key={card.title} className="landlord-card landlord-card-hover">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                {card.href && (
                  <Link to={card.href} className="text-gray-400 hover:text-gray-600">
                    <FiEye className="w-4 h-4" />
                  </Link>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
                <div className="flex items-baseline justify-between">
                  <p className="landlord-stats-number">{card.value}</p>
                  <div className={`flex items-center text-sm font-medium ${card.changeType === 'increase' ? 'text-green-600' :
                    card.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                    {card.changeType === 'increase' && <FiArrowUp className="w-3 h-3 mr-1" />}
                    {card.changeType === 'decrease' && <FiArrowDown className="w-3 h-3 mr-1" />}
                    {card.change}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Registration Trend */}
        <div className="landlord-card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Registration Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.users}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#1e40af"
                    strokeWidth={2}
                    dot={{ fill: '#1e40af', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Property Distribution */}
        <div className="landlord-card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.properties}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.properties.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Application Status */}
        <div className="landlord-card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.applications}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#059669" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="landlord-card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Payments</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.payments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#d97706" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="landlord-card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hasPermission('users.create') && (
              <Link to="/landlord/users/new" className="landlord-btn-primary text-center">
                Add New User
              </Link>
            )}
            {hasPermission('properties.create') && (
              <Link to="/landlord/properties/new" className="landlord-btn-primary text-center">
                Add New Property
              </Link>
            )}
            {hasPermission('settings.write') && (
              <Link to="/landlord/settings" className="landlord-btn-secondary text-center">
                System Settings
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {hasPermission('logs.read') && (
        <div className="landlord-card">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Link to="/landlord/activity" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {/* Activity items would be populated from API */}
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New user registration</p>
                  <p className="text-xs text-gray-600">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Property application submitted</p>
                  <p className="text-xs text-gray-600">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Payment processed</p>
                  <p className="text-xs text-gray-600">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}