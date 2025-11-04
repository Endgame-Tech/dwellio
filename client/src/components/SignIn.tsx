import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';
import { FaSun, FaMoon, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({
        email: form.email,
        password: form.password,
      });
      toast.success('Signed in successfully!');
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else if (typeof err === 'string') {
        setError(err);
        toast.error(err);
      } else {
        setError('An unexpected error occurred');
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ubani-dashboard-bg min-h-screen flex">
      {/* Left side - Image/Brand section (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ubani-800/90 to-ubani-950/90 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"
          alt="Modern apartment interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex flex-col justify-center items-center h-full px-12">
          <div className="ubani-modern-card max-w-lg p-8 text-center">
            <div className="mb-8">
              <Link to="/" className="inline-block">
                <span className="text-4xl font-bold font-display ubani-text-gradient">ubani</span>
              </Link>
            </div>
            <blockquote className="italic text-lg mb-6 text-gray-700 dark:text-gray-300">
              "Ubani helped me find my dream apartment with half the usual agent fees. Their service was exceptional throughout the entire process."
            </blockquote>
            <div className="flex items-center justify-center">
              <img
                src="https://randomuser.me/api/portraits/women/42.jpg"
                alt="Testimonial author"
                className="w-12 h-12 rounded-full mr-4 border-2 border-ubani-400"
              />
              <div className="text-left">
                <p className="font-semibold text-gray-900 dark:text-white">Sarah Johnson</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Lagos, Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-3 rounded-full bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 dark:border-gray-600/30 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-pressed={theme === 'dark'}
        >
          <span className="sr-only">{theme === 'light' ? 'Enable dark mode' : 'Enable light mode'}</span>
          {theme === 'light' ? (
            <FaMoon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <FaSun className="w-5 h-5 text-yellow-500" />
          )}
        </button>

        <div className="w-full max-w-md">
          {/* Logo for mobile view */}
          <div className="text-center mb-8 lg:hidden">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-bold font-display ubani-text-gradient">ubani</span>
            </Link>
          </div>

          <div className="ubani-modern-card p-8">
            <h2 className="text-2xl font-bold mb-6 text-center ubani-text-gradient">Welcome Back</h2>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-lg backdrop-blur-sm focus:ring-2 focus:ring-ubani-500 focus:border-ubani-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-lg backdrop-blur-sm focus:ring-2 focus:ring-ubani-500 focus:border-ubani-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-ubani-600 dark:hover:text-ubani-400 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <Link to="/forgot-password" className="text-sm text-ubani-600 dark:text-ubani-400 hover:text-ubani-800 dark:hover:text-ubani-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                className="w-full ubani-button-gradient py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
              <Link to="/signup" className="ubani-text-gradient font-medium hover:underline transition-all duration-300">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
