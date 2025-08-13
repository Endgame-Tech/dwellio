import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  overlay?: boolean; // When true (e.g. homepage hero) navbar overlays content instead of taking layout space
}

export default function Navbar({ overlay = false }: NavbarProps) {
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!overlay) return; // Only add scroll listener for overlay variant
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [overlay]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const navBase = 'fixed top-0 inset-x-0 z-50 transition-colors duration-300 w-full';
  const navVariant = overlay
    ? `${scrolled ? 'backdrop-blur-sm bg-text-[#FFFFFF70] dark:bg-text-[#FFFFFF60] shadow-sm' : 'bg-transparent'} `
    : 'backdrop-blur-sm bg-text-[#FFFFFF70] dark:bg-text-[#FFFFFF70] shadow-sm';

  const atTopOverlay = overlay && !scrolled;

  // Helper to compute classes for non-active nav links
  const baseLink = atTopOverlay
    ? 'text-white/90 hover:text-white'
    : 'text-dwellio-dark nav-item-hover';

  const activeLink = atTopOverlay
    ? 'bg-white/15 text-white backdrop-blur-sm'
    : 'nav-item-active';

  const linkClass = (path: string, exactOnly = false) => {
    const active = isActive(path) && (!exactOnly || location.pathname === path);
    return `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? activeLink : baseLink}`;
  };

  return (
    <>
      <nav className={`${navBase} ${navVariant}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-dwellio-to-br rounded-xl flex items-center justify-center shadow-lg ${atTopOverlay ? 'ring-1 ring-white/20' : ''}`}>
                  <span className={`font-bold text-lg ${atTopOverlay ? 'text-white' : 'text-dwellio-dark'}`}>D</span>
                </div>
                <span className={`text-xl font-bold ${atTopOverlay ? 'text-white' : 'text-dwellio-dark'}`}>dwellio</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              <Link
                to="/about"
                className={linkClass('/about')}
              >
                About Us
              </Link>
              <Link
                to="/properties"
                className={linkClass('/properties')}
              >
                Properties
              </Link>
              <Link
                to="/services"
                className={linkClass('/services')}
              >
                Services
              </Link>
              <Link
                to="/contact"
                className={linkClass('/contact')}
              >
                Contact
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/applications"
                    className={linkClass('/applications')}
                  >
                    Applications
                  </Link>
                  <Link
                    to="/dashboard"
                    className={linkClass('/dashboard')}
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-3 ml-4">
                  <Link
                    to="/signin"
                    className={`btn-dwellio-outline ${atTopOverlay ? 'border-white text-white hover:bg-white/10' : ''}`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className={`btn-dwellio-primary shadow-sm ${atTopOverlay ? 'bg-white text-dwellio-dark hover:bg-white/90' : ''}`}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Right side - User menu and mobile button */}
            <div className="flex items-center space-x-3">
              {/* Desktop User Menu */}
              {isAuthenticated && (
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-dwellio-light transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-dwellio-to-br rounded-lg flex items-center justify-center text-dwellio-dark font-semibold text-sm">
                      {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-dwellio-dark">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
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
                    <div className="absolute right-0 mt-2 w-48 bg-dwellio-light rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        to="/tenant/profile"
                        className="flex items-center px-4 py-2 text-sm text-dwellio-dark hover:bg-dwellio-primary transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      <Link
                        to="/tenant/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-dwellio-dark hover:bg-dwellio-primary transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        </svg>
                        Dashboard
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
                className={`md:hidden inline-flex items-center justify-center p-2 rounded-lg ${atTopOverlay ? 'text-white hover:bg-white/10' : 'text-dwellio-dark hover:bg-dwellio-light'} transition-colors`}
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
          <div className={`md:hidden border-t ${atTopOverlay ? 'border-white/20 bg-white/10 backdrop-blur-md' : 'border-gray-200 bg-dwellio-light'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/about"
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive('/about')
                  ? `${atTopOverlay ? 'bg-white/15 text-white' : 'nav-item-active'}`
                  : `${atTopOverlay ? 'text-white/90 hover:bg-white/10' : 'text-dwellio-dark hover:bg-dwellio-primary'}`
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/properties"
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive('/properties')
                  ? `${atTopOverlay ? 'bg-white/15 text-white' : 'nav-item-active'}`
                  : `${atTopOverlay ? 'text-white/90 hover:bg-white/10' : 'text-dwellio-dark hover:bg-dwellio-primary'}`
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Properties
              </Link>
              <Link
                to="/services"
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive('/services')
                  ? `${atTopOverlay ? 'bg-white/15 text-white' : 'nav-item-active'}`
                  : `${atTopOverlay ? 'text-white/90 hover:bg-white/10' : 'text-dwellio-dark hover:bg-dwellio-primary'}`
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/contact"
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive('/contact')
                  ? `${atTopOverlay ? 'bg-white/15 text-white' : 'nav-item-active'}`
                  : `${atTopOverlay ? 'text-white/90 hover:bg-white/10' : 'text-dwellio-dark hover:bg-dwellio-primary'}`
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
                      ? `${atTopOverlay ? 'bg-white/15 text-white' : 'nav-item-active'}`
                      : `${atTopOverlay ? 'text-white/90 hover:bg-white/10' : 'text-dwellio-dark hover:bg-dwellio-primary'}`
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Applications
                  </Link>
                  <Link
                    to="/dashboard"
                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive('/dashboard')
                      ? `${atTopOverlay ? 'bg-white/15 text-white' : 'nav-item-active'}`
                      : `${atTopOverlay ? 'text-white/90 hover:bg-white/10' : 'text-dwellio-dark hover:bg-dwellio-primary'}`
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/tenant/profile"
                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive('/tenant/profile')
                      ? `${atTopOverlay ? 'bg-white/15 text-white' : 'nav-item-active'}`
                      : `${atTopOverlay ? 'text-white/90 hover:bg-white/10' : 'text-dwellio-dark hover:bg-dwellio-primary'}`
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  {/* Mobile user info */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center px-3 pb-3">
                      <div className={`w-10 h-10 bg-gradient-dwellio-to-br rounded-lg flex items-center justify-center font-semibold ${atTopOverlay ? 'text-white ring-1 ring-white/20' : 'text-dwellio-dark'}`}>
                        {user?.firstName?.charAt(0) || 'U'}
                      </div>
                      <div className="ml-3">
                        <p className={`text-base font-medium ${atTopOverlay ? 'text-white' : 'text-dwellio-dark'}`}>
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className={`text-sm ${atTopOverlay ? 'text-white/60' : 'text-gray-500'}`}>{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 ${atTopOverlay ? 'hover:bg-white/10' : 'hover:bg-red-50'} transition-colors`}
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-1">
                  <Link
                    to="/signin"
                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${atTopOverlay ? 'text-white/90 hover:bg-white/10' : 'text-dwellio-dark hover:bg-dwellio-primary'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${atTopOverlay ? 'bg-white text-dwellio-dark hover:bg-white/90' : 'bg-dwellio-primary text-dwellio-dark hover:bg-dwellio-primary-dark'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
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
