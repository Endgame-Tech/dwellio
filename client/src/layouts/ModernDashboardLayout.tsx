import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DarkModeToggle from '../components/DarkModeToggle';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
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

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/properties') return 'Properties';
    if (path === '/applications') return 'Applications';
    if (path === '/move-out') return 'Move Out Intent';
    if (path === '/tenant/profile') return 'Profile';
    if (path.startsWith('/tenant/')) return 'Profile';
    return 'Dashboard';
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
    },
    {
      name: 'Properties',
      href: '/properties',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      name: 'Applications',
      href: '/applications',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: 'Move Out',
      href: '/move-out',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
    },
    {
      name: 'Profile',
      href: '/tenant/profile',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen dwellio-dashboard-bg flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40bg-opacity-50 lg:hidden backdrop-blur-xs z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 ${sidebarMinimized && !isMobile ? 'w-20' : 'w-72'} dwellio-glass-sidebar dark:bg-neutral-900/95 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 bg-dwellio-dark/50 dark:bg-neutral-800/50">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-dwellio-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-dwellio-dark font-bold text-lg">D</span>
            </div>
            {!sidebarMinimized && (
              <span className="text-dwellio-light dark:text-neutral-100 text-xl font-bold transition-opacity duration-300">dwellio</span>
            )}
          </Link>
          <div className="flex items-center space-x-2">
            {/* Minimize/Expand Button - Only on desktop */}
            {!isMobile && (
              <button
                onClick={() => setSidebarMinimized(!sidebarMinimized)}
                className="p-2 text-dwellio-light/70 hover:text-dwellio-light hover:bg-white/10 bg-white rounded-lg transition-colors ml-0.5 border border-dwellio-dark scale-3d"
                title={sidebarMinimized ? "Expand sidebar" : "Minimize sidebar"}
              >
                {sidebarMinimized ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
                  </svg>
                )}
              </button>
            )}
            {/* Mobile Close Button */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-dwellio-light hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => isMobile && setSidebarOpen(false)}
              className={`dwellio-nav-item-modern ${isActive(item.href)
                ? 'dwellio-nav-item-active'
                : 'hover:bg-dwellio-light/10'
                } ${sidebarMinimized ? 'justify-center px-3' : ''}`}
              title={sidebarMinimized ? item.name : ''}
            >
              <div className={`w-6 h-6 flex-shrink-0 ${sidebarMinimized ? 'mr-0' : 'mr-3'}`}>
                {item.icon}
              </div>
              {!sidebarMinimized && (
                <span className="truncate transition-opacity duration-300">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-dwellio-light/20">
          <div className={`flex items-center px-4 py-3 bg-dwellio-dark/30 rounded-xl ${sidebarMinimized ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 bg-dwellio-primary rounded-lg flex items-center justify-center text-dwellio-dark font-semibold flex-shrink-0">
              <span className="text-sm">{user?.firstName?.charAt(0) || 'U'}</span>
            </div>
            {!sidebarMinimized && (
              <>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-dwellio-light font-medium text-sm truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-dwellio-primary opacity-45 text-xs truncate">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="ml-2 p-2 text-dwellio-light/70 hover:text-dwellio-light hover:bg-dwellio-light/10 rounded-lg transition-colors flex-shrink-0"
                  title="Sign out"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            )}
            {sidebarMinimized && (
              <div className="absolute left-full ml-2 hidden group-hover:block">
                <div className="bg-dwellio-dark text-dwellio-light p-2 rounded-lg shadow-lg whitespace-nowrap">
                  <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs opacity-70">{user?.email}</p>
                </div>
              </div>
            )}
          </div>
          {/* Logout button when minimized */}
          {sidebarMinimized && (
            <div className="mt-2 flex justify-center">
              <button
                onClick={logout}
                className="p-2 text-dwellio-light/70 hover:text-dwellio-light hover:bg-dwellio-light/10 rounded-lg transition-colors"
                title="Sign out"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header - Fixed */}
        <header className="flex h-16 shrink-0 items-center gap-x-4 bg-dwellio-light/95 dark:bg-neutral-900/95 backdrop-blur-sm px-6 lg:px-8 shadow-sm border-b border-gray-200 dark:border-neutral-700 w-full z-30">
          {/* Mobile menu button */}
          <button
            type="button"
            className="-m-2 p-2 text-dwellio-dark dark:text-neutral-300 hover:text-dwellio-dark dark:hover:text-neutral-100 hover:bg-dwellio-primary/20 dark:hover:bg-neutral-700 rounded-lg lg:hidden transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Page title section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl lg:text-2xl font-bold text-dwellio-dark dark:text-neutral-100 truncate">
              {getPageTitle()}
            </h1>
            <p className="hidden sm:block text-dwellio-dark/60 dark:text-neutral-400 text-sm">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} • Lagos, Nigeria
            </p>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-x-3">
            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Search - Hidden on mobile, visible on tablet+ */}
            <div className="hidden md:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-40 lg:w-48 pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-dwellio-500 focus:border-dwellio-500 bg-gray-50 focus:bg-white transition-colors"
                placeholder="Search..."
              />
            </div>

            {/* Mobile search button */}
            <button className="md:hidden p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Notifications */}
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg relative transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0.5 right-0.5 block h-1.5 w-1.5 rounded-full bg-red-400"></span>
            </button>
          </div>
        </header>

        {/* Main Dashboard Content Grid - This is the scrolling container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Primary Content Area - Only this scrolls */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden dwellio-dashboard-bg dwellio-scrollbar-hidden">
            <div className="p-6 w-full max-w-none">
              {children || <Outlet />}
            </div>
          </main>

          {/* Right Sidebar - Widgets and Status */}
          <aside className="hidden xl:flex xl:flex-col xl:w-80 xl:bg-white/35 xl:border-l xl:border-gray-200 xl:overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Status Widget */}
              <div className="bg-gradient-to-br from-[#ccf080] to-gray-800 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Status Overview</h3>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Applications</span>
                    <span className="font-semibold">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Rent Status</span>
                    <span className="font-semibold text-green-400">Paid</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Lease</span>
                    <span className="font-semibold">11 months left</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/applications"
                    className="flex items-center p-3 rounded-xl bg-dwellio-50 hover:bg-dwellio-100 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-dwellio-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">New Application</p>
                      <p className="text-sm text-gray-600">Apply for properties</p>
                    </div>
                  </Link>

                  <Link
                    to="/tenant/profile"
                    className="flex items-center p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Update Profile</p>
                      <p className="text-sm text-gray-600">Manage your info</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-dwellio-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">Rent Due</p>
                      <p className="text-sm text-gray-600">Due in 5 days</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">Property Inspection</p>
                      <p className="text-sm text-gray-600">Next week</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">Lease Renewal</p>
                      <p className="text-sm text-gray-600">In 2 months</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
