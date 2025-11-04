import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/logo.png';

interface NavbarProps {
  overlay?: boolean; // When true (e.g. homepage hero) navbar overlays content instead of taking layout space
}

export default function Navbar({ overlay = false }: NavbarProps) {
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();



  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const navBase = 'fixed top-0 inset-x-0 z-50 transition-colors duration-300 w-full';

  return (
    <>
      <nav className={`${navBase} `}>
        <div className="mx-auto px-4 sm:px-6 lg:px-14">
          <div className="flex justify-between h-32">
            {/* Logo */}
            <div className="flex bg-blend-multiply items-center">
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="Ubani"
                  className="h-16 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {/* Navigation links in pill container */}
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2.5 space-x-6">
                <Link
                  to="/about"
                  className="text-white text-md font-light hover:text-ubani-yellow transition-colors"
                >
                  About Us
                </Link>
                <Link
                  to="/properties"
                  className="text-white text-md font-light hover:text-ubani-yellow transition-colors"
                >
                  Properties
                </Link>
                <Link
                  to="/services"
                  className="text-white text-md font-light hover:text-ubani-yellow transition-colors"
                >
                  Services
                </Link>
                <Link
                  to="/contact"
                  className="text-white text-md font-light hover:text-ubani-yellow transition-colors"
                >
                  Contact
                </Link>
              </div>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/applications"
                    className="text-white text-md font-light hover:text-ubani-yellow transition-colors"
                  >
                    Applications
                  </Link>
                  <Link
                    to="/dashboard"
                    className="text-white text-md font-light hover:text-ubani-yellow transition-colors"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <Link
                  to="/signin"
                  className="bg-white text-ubani-black text-md font-bold px-6 py-2.5 rounded-full hover:bg-ubani-yellow transition-colors"
                >
                  Log In
                </Link>
              )}
            </div>

            {/* Right side - User menu and mobile button */}
            <div className="flex lg:hidden items-center space-x-3">
              {/* Desktop User Menu */}
              {isAuthenticated && (
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-ubani-yellow to-yellow-400 rounded-lg flex items-center justify-center text-ubani-black font-semibold text-sm">
                      {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-white">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700 py-1 z-50">
                      <Link
                        to="/tenant/profile"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      <Link
                        to="/tenant/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        </svg>
                        Dashboard
                      </Link>
                      <div className="border-t border-gray-700 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 bg-black/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/about"
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive('/about')
                  ? 'bg-white/15 text-white'
                  : 'text-white/90 hover:bg-white/10'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/properties"
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive('/properties')
                  ? 'bg-white/15 text-white'
                  : 'text-white/90 hover:bg-white/10'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Properties
              </Link>
              <Link
                to="/services"
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive('/services')
                  ? 'bg-white/15 text-white'
                  : 'text-white/90 hover:bg-white/10'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/contact"
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive('/contact')
                  ? 'bg-white/15 text-white'
                  : 'text-white/90 hover:bg-white/10'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/applications"
                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive('/applications')
                      ? 'bg-white/15 text-white'
                      : 'text-white/90 hover:bg-white/10'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Applications
                  </Link>
                  <Link
                    to="/dashboard"
                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive('/dashboard')
                      ? 'bg-white/15 text-white'
                      : 'text-white/90 hover:bg-white/10'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/tenant/profile"
                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive('/tenant/profile')
                      ? 'bg-white/15 text-white'
                      : 'text-white/90 hover:bg-white/10'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  {/* Mobile user info */}
                  <div className="border-t border-white/20 pt-4 mt-4">
                    <div className="flex items-center px-3 pb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-ubani-yellow to-yellow-400 rounded-lg flex items-center justify-center font-semibold text-ubani-black ring-1 ring-white/20">
                        {user?.firstName?.charAt(0) || 'U'}
                      </div>
                      <div className="ml-3">
                        <p className="text-base font-medium text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-white/60">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:bg-white/10 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-white/20 pt-4 mt-4 space-y-1">
                  <Link
                    to="/signin"
                    className="block px-3 py-2 rounded-lg text-base font-medium transition-colors bg-white text-ubani-black hover:bg-gray-100 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      {/* Spacer to offset fixed nav height on non-overlay pages */}
      {!overlay && <div className="h-16" aria-hidden="true" />}
    </>
  );
}
