import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import {
  FaHome,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaFileAlt
} from 'react-icons/fa';

interface MoveOutFormData {
  preferredMoveDate: string;
  currentNoticeGiven: boolean;
  noticePeriodWeeks: number;
  reason: string;
  referenceContactOk: boolean;
  feedbackForLandlord: string;
}

interface NewHomePreferences {
  preferredAreas: string[];
  propertyType: string;
  bedrooms: number;
  maxRent: number;
  specialRequirements: string;
}

export default function MoveOutIntent() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<MoveOutFormData>({
    preferredMoveDate: '',
    currentNoticeGiven: false,
    noticePeriodWeeks: 4,
    reason: '',
    referenceContactOk: true,
    feedbackForLandlord: ''
  });

  const [preferences, setPreferences] = useState<NewHomePreferences>({
    preferredAreas: [],
    propertyType: 'apartment',
    bedrooms: 1,
    maxRent: 0,
    specialRequirements: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const moveOutData = {
        intendedDate: formData.preferredMoveDate,
        reason: formData.reason,
        preferredAreas: preferences.preferredAreas,
        budgetRange: {
          min: 0,
          max: preferences.maxRent
        },
        propertyType: preferences.propertyType,
        facilitationRequested: true
      };

      const response = await api.tenant.submitMoveOutIntent(moveOutData);
      if (response.success) {
        toast.success('Move-out intent submitted successfully! We\'ll show you matching properties soon.');
        navigate('/dashboard');
      } else {
        toast.error('Failed to submit move-out intent');
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to submit move-out intent:', error);
      toast.error('Failed to submit move-out intent. Please try again.');
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6 sm:mb-8">
      {[1, 2, 3].map((stepNumber) => (
        <div key={stepNumber} className="flex items-center">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300 ${step >= stepNumber
            ? 'bg-ubani-primary text-ubani-dark shadow-sm'
            : 'bg-ubani-primary/10 text-ubani-dark/50'
            }`}>
            {step > stepNumber ? <FaCheck className="w-3 h-3 sm:w-4 sm:h-4" /> : stepNumber}
          </div>
          {stepNumber < 3 && (
            <div className={`w-8 sm:w-16 h-1 mx-2 sm:mx-3 rounded-full transition-all duration-300 ${step > stepNumber ? 'bg-ubani-primary' : 'bg-ubani-primary/20'
              }`}></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 lg:p-8 ubani-dashboard-bg min-h-full w-full ubani-dashboard-container">
      <div className="max-w-7xl mx-auto space-y-8 w-full">
        {/* Welcome Message */}
        <div className="ubani-animate-slide-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-ubani-dark">
            Find Your Next Home
          </h1>
          <p className="text-ubani-dark/70 mt-2 text-sm sm:text-base">
            Let us help you find the perfect place to move to
          </p>
        </div>

        <div className="ubani-modern-card ubani-hover-lift ubani-animate-fade-in max-w-4xl mx-auto">
          <StepIndicator />

          <form onSubmit={handleSubmit}>
            {/* Step 1: Move Date & Location */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-ubani-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <FaCalendarAlt className="w-6 h-6 sm:w-8 sm:h-8 text-ubani-dark" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-ubani-dark mb-2">When and Where?</h2>
                  <p className="text-ubani-dark/60 text-sm sm:text-base">Tell us about your moving timeline and current situation</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-ubani-primary/10 rounded-xl p-6 border border-ubani-primary/20">
                    <label className="block text-sm font-medium text-ubani-dark mb-3">
                      Preferred Move Date
                    </label>
                    <input
                      type="date"
                      value={formData.preferredMoveDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferredMoveDate: e.target.value }))}
                      className="w-full p-4 border border-ubani-primary/30 rounded-xl focus:ring-2 focus:ring-ubani-primary focus:border-ubani-primary bg-white transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="bg-ubani-primary/10 rounded-xl p-6 border border-ubani-primary/20">
                    <label className="block text-sm font-medium text-ubani-dark mb-3">
                      Notice Period (weeks)
                    </label>
                    <select
                      value={formData.noticePeriodWeeks}
                      onChange={(e) => setFormData(prev => ({ ...prev, noticePeriodWeeks: parseInt(e.target.value) }))}
                      className="w-full p-4 border border-ubani-primary/30 rounded-xl focus:ring-2 focus:ring-ubani-primary focus:border-ubani-primary bg-white transition-all duration-300"
                    >
                      <option value={2}>2 weeks</option>
                      <option value={4}>4 weeks</option>
                      <option value={8}>8 weeks</option>
                      <option value={12}>12 weeks</option>
                    </select>
                  </div>
                </div>

                <div className="bg-ubani-primary/10 rounded-xl p-6 border border-ubani-primary/20">
                  <label className="block text-sm font-medium text-ubani-dark mb-3">
                    Reason for Moving
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full p-4 border border-ubani-primary/30 rounded-xl focus:ring-2 focus:ring-ubani-primary focus:border-ubani-primary bg-white transition-all duration-300"
                    rows={4}
                    placeholder="Please share why you're looking to move..."
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-ubani-primary hover:bg-ubani-primary-dark px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium text-ubani-dark transition-colors inline-flex items-center space-x-2 text-sm sm:text-base ubani-hover-lift"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Preferences */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <FaHome className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-ubani-dark mb-2">Your New Home Preferences</h2>
                  <p className="text-ubani-dark/60 text-sm sm:text-base">Help us find the perfect property for you</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-ubani-primary/10 rounded-xl p-6 border border-ubani-primary/20">
                    <label className="block text-sm font-medium text-ubani-dark mb-3">
                      Property Type
                    </label>
                    <select
                      value={preferences.propertyType}
                      onChange={(e) => setPreferences(prev => ({ ...prev, propertyType: e.target.value }))}
                      className="w-full p-4 border border-ubani-primary/30 rounded-xl focus:ring-2 focus:ring-ubani-primary focus:border-ubani-primary bg-white transition-all duration-300"
                    >
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="studio">Studio</option>
                      <option value="duplex">Duplex</option>
                    </select>
                  </div>

                  <div className="bg-ubani-primary/10 rounded-xl p-6 border border-ubani-primary/20">
                    <label className="block text-sm font-medium text-ubani-dark mb-3">
                      Number of Bedrooms
                    </label>
                    <select
                      value={preferences.bedrooms}
                      onChange={(e) => setPreferences(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                      className="w-full p-4 border border-ubani-primary/30 rounded-xl focus:ring-2 focus:ring-ubani-primary focus:border-ubani-primary bg-white transition-all duration-300"
                    >
                      <option value={1}>1 Bedroom</option>
                      <option value={2}>2 Bedrooms</option>
                      <option value={3}>3 Bedrooms</option>
                      <option value={4}>4+ Bedrooms</option>
                    </select>
                  </div>

                  <div className="bg-ubani-primary/10 rounded-xl p-6 border border-ubani-primary/20">
                    <label className="block text-sm font-medium text-ubani-dark mb-3">
                      Maximum Monthly Rent (₦)
                    </label>
                    <input
                      type="number"
                      value={preferences.maxRent}
                      onChange={(e) => setPreferences(prev => ({ ...prev, maxRent: parseInt(e.target.value) }))}
                      className="w-full p-4 border border-ubani-primary/30 rounded-xl focus:ring-2 focus:ring-ubani-primary focus:border-ubani-primary bg-white transition-all duration-300"
                      placeholder="1,000,000"
                      required
                    />
                  </div>
                </div>

                <div className="bg-ubani-primary/10 rounded-xl p-6 border border-ubani-primary/20">
                  <label className="block text-sm font-medium text-ubani-dark mb-3">
                    Special Requirements
                  </label>
                  <textarea
                    value={preferences.specialRequirements}
                    onChange={(e) => setPreferences(prev => ({ ...prev, specialRequirements: e.target.value }))}
                    className="w-full p-4 border border-ubani-primary/30 rounded-xl focus:ring-2 focus:ring-ubani-primary focus:border-ubani-primary bg-white transition-all duration-300"
                    rows={4}
                    placeholder="Any specific requirements or preferences..."
                  />
                </div>

                <div className="flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-ubani-primary/10 hover:bg-ubani-primary/20 text-ubani-dark px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-medium border border-ubani-primary/30 transition-colors inline-flex items-center space-x-2 text-sm sm:text-base ubani-hover-lift"
                  >
                    <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-ubani-primary hover:bg-ubani-primary-dark text-ubani-dark px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-medium transition-colors inline-flex items-center space-x-2 text-sm sm:text-base ubani-hover-lift"
                  >
                    <span>Continue</span>
                    <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Service Selection */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-ubani-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <FaCheck className="w-6 h-6 sm:w-8 sm:h-8 text-ubani-dark" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-ubani-dark mb-2">How Can We Help?</h2>
                  <p className="text-ubani-dark/60 text-sm sm:text-base">Choose the services you'd like assistance with</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  <div className="ubani-modern-card ubani-hover-lift p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <FaMapMarkerAlt className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-ubani-dark mb-2 text-sm sm:text-base">Property Search</h3>
                    <p className="text-xs sm:text-sm text-ubani-dark/60">We'll find properties that match your criteria</p>
                  </div>

                  <div className="ubani-modern-card ubani-hover-lift p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <FaMoneyBillWave className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-ubani-dark mb-2 text-sm sm:text-base">Landlord Negotiation</h3>
                    <p className="text-xs sm:text-sm text-ubani-dark/60">We'll negotiate the best terms for you</p>
                  </div>

                  <div className="ubani-modern-card ubani-hover-lift p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <FaFileAlt className="w-6 h-6 sm:w-8 sm:h-8 text-slate-600" />
                    </div>
                    <h3 className="font-semibold text-ubani-dark mb-2 text-sm sm:text-base">Documentation Help</h3>
                    <p className="text-xs sm:text-sm text-ubani-dark/60">We'll help with contracts and paperwork</p>
                  </div>
                </div>

                <div className="bg-ubani-primary/10 rounded-xl p-4 sm:p-6 border border-ubani-primary/20">
                  <h3 className="font-semibold text-ubani-dark mb-4 sm:mb-6 text-sm sm:text-base">Preview: Your Search</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-sm">
                    <div>
                      <span className="text-ubani-dark/50 text-xs uppercase tracking-wider">Property Type</span>
                      <p className="font-semibold text-ubani-dark capitalize mt-1">{preferences.propertyType}</p>
                    </div>
                    <div>
                      <span className="text-ubani-dark/50 text-xs uppercase tracking-wider">Bedrooms</span>
                      <p className="font-semibold text-ubani-dark mt-1">{preferences.bedrooms}</p>
                    </div>
                    <div>
                      <span className="text-ubani-dark/50 text-xs uppercase tracking-wider">Max Rent</span>
                      <p className="font-semibold text-ubani-dark mt-1">₦{preferences.maxRent.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-ubani-dark/50 text-xs uppercase tracking-wider">Move Date</span>
                      <p className="font-semibold text-ubani-dark mt-1">{formData.preferredMoveDate}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-ubani-primary/10 hover:bg-ubani-primary/20 text-ubani-dark px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-medium border border-ubani-primary/30 transition-colors inline-flex items-center space-x-2 text-sm sm:text-base ubani-hover-lift"
                  >
                    <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-ubani-primary hover:bg-ubani-primary-dark text-ubani-dark px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-medium transition-colors disabled:opacity-50 inline-flex items-center space-x-2 text-sm sm:text-base ubani-hover-lift"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-ubani-dark border-t-transparent rounded-full"></div>
                        <span className="hidden sm:inline">Submitting...</span>
                        <span className="sm:hidden">Submit</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Find My Next Home</span>
                        <span className="sm:hidden">Find Home</span>
                        <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
