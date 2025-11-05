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
    <div className="min-h-screen bg-ubani-black flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 ${sidebarMinimized && !isMobile ? 'w-20' : 'w-72'} bg-[#1a1a1a] border-r border-white/10 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <Link to="/" className="flex items-center space-x-3">
            {sidebarMinimized ? (
              <img
                src="/favicon.svg"
                alt="Ubani Logo"
                className="w-10 h-10 transition-all duration-300"
              />
            ) : (
              <>
                <div className="w-10 h-10 bg-ubani-yellow rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-ubani-black font-bold text-lg">U</span>
                </div>
                <span className="text-white text-xl font-bold transition-opacity duration-300">Ubani</span>
              </>
            )}
          </Link>
          <div className="flex items-center space-x-2">
            {/* Minimize/Expand Button - Only on desktop */}
            {!isMobile && (
              <button
                onClick={() => setSidebarMinimized(!sidebarMinimized)}
                className="p-2 text-gray-400 hover:text-ubani-yellow hover:bg-white/10 rounded-lg transition-colors"
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
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-2 px-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => isMobile && setSidebarOpen(false)}
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${isActive(item.href)
                ? 'bg-ubani-yellow text-ubani-black font-semibold shadow-lg'
                : 'text-gray-400 hover:bg-white/10 hover:text-ubani-yellow'
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
        <div className="p-4 border-t border-white/10">
          <div className={`flex items-center px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors ${sidebarMinimized ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 bg-ubani-yellow rounded-lg flex items-center justify-center text-ubani-black font-semibold flex-shrink-0">
              <span className="text-sm">{user?.firstName?.charAt(0) || 'U'}</span>
            </div>
            {!sidebarMinimized && (
              <>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="ml-2 p-2 text-gray-400 hover:text-ubani-yellow hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
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
                <div className="bg-[#1a1a1a] text-white p-2 rounded-lg shadow-lg whitespace-nowrap border border-white/10">
                  <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
            )}
          </div>
          {/* Logout button when minimized */}
          {sidebarMinimized && (
            <div className="mt-2 flex justify-center">
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-ubani-yellow hover:bg-white/10 rounded-lg transition-colors"
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
        <header className="flex h-16 shrink-0 items-center gap-x-4 bg-[#1a1a1a] backdrop-blur-sm px-6 lg:px-8 shadow-sm border-b border-white/10 w-full z-30">
          {/* Mobile menu button */}
          <button
            type="button"
            className="-m-2 p-2 text-gray-400 hover:text-ubani-yellow hover:bg-white/10 rounded-lg lg:hidden transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Page title section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl lg:text-2xl font-bold text-white truncate">
              {getPageTitle()}
            </h1>
            <p className="hidden sm:block text-gray-400 text-sm">
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
                className="block w-40 lg:w-48 pl-9 pr-3 py-1.5 border border-white/10 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow bg-ubani-black text-white transition-colors"
                placeholder="Search..."
              />
            </div>

            {/* Mobile search button */}
            <button className="md:hidden p-1.5 text-gray-400 hover:text-ubani-yellow hover:bg-white/10 rounded-lg transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Notifications */}
            <button className="p-1.5 text-gray-400 hover:text-ubani-yellow hover:bg-white/10 rounded-lg relative transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0.5 right-0.5 block h-1.5 w-1.5 rounded-full bg-ubani-yellow"></span>
            </button>
          </div>
        </header>

        {/* Main Dashboard Content Grid - This is the scrolling container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Primary Content Area - Only this scrolls */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden ubani-scrollbar-hidden">
            <div className="w-full max-w-none">
              {children || <Outlet />}
            </div>
          </main>

          {/* Right Sidebar - Widgets and Status */}
          <aside className="hidden xl:flex xl:flex-col xl:w-80 xl:bg-[#1a1a1a] xl:border-l xl:border-white/10 xl:overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Status Widget */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg text-white font-semibold">Status Overview</h3>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Applications</span>
                    <span className="font-semibold text-white">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Rent Status</span>
                    <span className="font-semibold text-green-600">Paid</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Lease</span>
                    <span className="font-semibold text-white">11 months left</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/applications"
                    className="flex items-center p-3 rounded-xl bg-ubani-yellow/10 hover:bg-ubani-yellow/20 border border-ubani-yellow/20 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-ubani-yellow rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-ubani-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">New Application</p>
                      <p className="text-sm text-gray-400">Apply for properties</p>
                    </div>
                  </Link>

                  <Link
                    to="/tenant/profile"
                    className="flex items-center p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Update Profile</p>
                      <p className="text-sm text-gray-400">Manage your info</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-4">Upcoming</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-ubani-yellow rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-white">Rent Due</p>
                      <p className="text-sm text-gray-400">Due in 5 days</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-white">Property Inspection</p>
                      <p className="text-sm text-gray-400">Next week</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-white">Lease Renewal</p>
                      <p className="text-sm text-gray-400">In 2 months</p>
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
