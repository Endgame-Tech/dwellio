import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useLandlord } from '../context/LandlordContext';
import {
  FiHome,
  FiUsers,
  FiMapPin,
  FiFileText,
  FiDollarSign,
  FiTool,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
  FiSearch,
  FiActivity,
  FiShield,
  FiBarChart,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', href: '/landlord', icon: FiHome },
  { name: 'Users', href: '/landlord/users', icon: FiUsers, permission: 'users.read' },
  { name: 'Properties', href: '/landlord/properties', icon: FiMapPin, permission: 'properties.read' },
  { name: 'Applications', href: '/landlord/applications', icon: FiFileText, permission: 'applications.read' },
  { name: 'Payments', href: '/landlord/payments', icon: FiDollarSign, permission: 'payments.read' },
  { name: 'Maintenance', href: '/landlord/maintenance', icon: FiTool, permission: 'maintenance.read' },
  { name: 'Analytics', href: '/landlord/analytics', icon: FiBarChart, permission: 'analytics.read' },
  { name: 'Activity Logs', href: '/landlord/activity', icon: FiActivity, permission: 'logs.read' },
  { name: 'Settings', href: '/landlord/settings', icon: FiSettings, permission: 'settings.read' },
];

export default function LandlordLayout() {
  const { user, logout, hasPermission } = useLandlord();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/landlord/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => {
    if (path === '/landlord' && location.pathname === '/landlord') return true;
    return location.pathname.startsWith(path) && path !== '/landlord';
  };

  const getPageTitle = () => {
    const path = location.pathname;
    const item = sidebarItems.find(item => isActive(item.href));
    return item?.name || 'Dashboard';
  };

  const filteredSidebarItems = sidebarItems.filter(item => {
    const hasPerms = !item.permission || hasPermission(item.permission);
    console.log(`Item: ${item.name}, Permission: ${item.permission}, Has Permission: ${hasPerms}, User Permissions:`, user?.permissions);
    return hasPerms;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/landlord" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-gray-900 text-lg font-bold">Ubani Landlord</span>
          </Link>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {filteredSidebarItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => isMobile && setSidebarOpen(false)}
              className={`landlord-nav-item ${isActive(item.href) ? 'landlord-nav-item-active' : 'landlord-nav-item-inactive'
                }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0">
              {user?.firstName?.charAt(0) || 'A'}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-gray-900 font-medium text-sm truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              title="Sign out"
            >
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <FiMenu className="h-6 w-6" />
          </button>

          {/* Page title section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-gray-900 truncate">
              {getPageTitle()}
            </h1>
            <p className="hidden sm:block text-gray-600 text-sm">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Search */}
            <div className="hidden md:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search..."
              />
            </div>

            {/* Mobile search button */}
            <button className="md:hidden p-2 text-gray-400 hover:text-gray-500 rounded-lg">
              <FiSearch className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 rounded-lg relative">
              <FiBell className="w-6 h-6" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user?.firstName?.charAt(0) || 'A'}
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}