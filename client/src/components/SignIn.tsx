import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../assets/logo.png';

export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
    <div className="min-h-screen bg-ubani-black flex items-center justify-center px-4 sm:px-6 lg:px-8 font-sans">
      {/* Simple centered form */}
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <img src={logo} alt="Ubani" className="h-16 sm:h-20 mx-auto" />
          </Link>
          <p className="text-gray-400 text-sm">Your trusted tenant representative</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Welcome Back</h2>
          <p className="text-gray-400 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-ubani-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 bg-ubani-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-ubani-yellow transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" className="text-sm text-ubani-yellow hover:text-ubani-yellow/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-ubani-yellow text-ubani-black py-4 rounded-full font-semibold hover:bg-ubani-yellow/90 disabled:opacity-50 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-ubani-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

          <div className="mt-8 text-center">
            <span className="text-gray-400">Don't have an account? </span>
            <Link to="/signup" className="text-ubani-yellow font-semibold hover:text-ubani-yellow/80 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Back to home link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-400 hover:text-ubani-yellow transition-colors text-sm inline-flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
