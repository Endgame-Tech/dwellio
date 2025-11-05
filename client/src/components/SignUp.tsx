import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaCamera, FaUser } from 'react-icons/fa';
import logo from '../assets/logo.png';

export default function SignUp() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'tenant' as const,
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      setProfileImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Create form data for signup
      const signupData = {
        ...form,
        profileImage: profileImage
      };

      await signup(signupData);
      toast.success('Sign up successful!');
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Create Your Account</h2>
          <p className="text-gray-400 mb-8">Join thousands of users managing their properties with ease</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Profile Image Upload */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-ubani-yellow to-ubani-yellow-dark flex items-center justify-center border-4 border-ubani-black shadow-lg">
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="w-8 h-8 text-ubani-black" />
                  )}
                </div>
                <label
                  htmlFor="profile-image-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-ubani-yellow hover:bg-ubani-yellow/90 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg border-2 border-ubani-black"
                >
                  <FaCamera className="w-3 h-3 text-ubani-black" />
                </label>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
            <div className="text-center mb-6">
              <p className="text-sm text-gray-400">
                Upload your profile picture (optional)
              </p>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG up to 5MB
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-ubani-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-ubani-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-ubani-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
              <input
                id="phoneNumber"
                type="text"
                name="phoneNumber"
                placeholder="Enter your phone number"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-ubani-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a strong password"
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
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">I am a</label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-ubani-black border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all"
              >
                <option value="tenant">Tenant</option>
                <option value="landlord">Landlord</option>
                <option value="referrer">Referrer</option>
              </select>
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
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <span className="text-gray-400">Already have an account? </span>
            <Link to="/signin" className="text-ubani-yellow font-semibold hover:text-ubani-yellow/80 transition-colors">
              Sign In
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
