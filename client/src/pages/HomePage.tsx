import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import TestimonialCard from '../components/TestimonialCard';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FiCheck,
  FiFileText,
  FiDollarSign,
  FiSearch,
  FiTrendingUp,
  FiUsers
} from 'react-icons/fi';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  // Refs for GSAP animations
  const whyChooseSectionRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const howItWorksContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = whyChooseSectionRef.current;
    const background = backgroundRef.current;
    const content = contentRef.current;
    const image = imageRef.current;
    const howItWorksSection = howItWorksRef.current;
    const howItWorksContent = howItWorksContentRef.current;

    if (section && background && content && image && howItWorksSection && howItWorksContent) {
      // Set initial states
      gsap.set(background, { 
        background: 'linear-gradient(135deg, rgb(248 250 252) 0%, rgb(255 255 255) 50%, rgb(240 253 244) 100%)'
      });

      // Create timeline for the animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end: 'bottom+=800 40%',
          toggleActions: 'play none none reverse',
        }
      });

      // Background color animation
      tl.to(background, {
        background: 'linear-gradient(135deg, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(55 65 81) 100%)',
        duration: 1.5,
        ease: 'power2.out'
      })
      // Content text color animation
      .to(content.querySelectorAll('h2, p, h3'), {
        color: 'white',
        duration: 1,
        ease: 'power2.out'
      }, '-=1')
      // Badge animation
      .to(content.querySelector('.badge'), {
        background: 'linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.2))',
        borderColor: 'rgba(255,255,255,0.3)',
        duration: 1,
        ease: 'power2.out'
      }, '-=1')
      // Feature items animation
      .to(content.querySelectorAll('.feature-description'), {
        color: 'rgb(229 231 235)',
        duration: 1,
        ease: 'power2.out'
      }, '-=1')
      // How It Works section animation
      .to(howItWorksSection, {
        background: 'transparent',
        duration: 0.5,
        ease: 'power2.out'
      }, '-=1')
      // How It Works content animation
      .to(howItWorksContent.querySelectorAll('h2, p'), {
        color: 'white',
        duration: 1,
        ease: 'power2.out'
      }, '-=1')
      // How It Works cards animation
      .to(howItWorksContent.querySelectorAll('.step-card'), {
        background: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(16px)',
        duration: 1,
        ease: 'power2.out'
      }, '-=1')
      // Step numbers and titles
      .to(howItWorksContent.querySelectorAll('.step-number'), {
        background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
        color: 'white',
        duration: 1,
        ease: 'power2.out'
      }, '-=1')
      .to(howItWorksContent.querySelectorAll('.step-title, .step-description'), {
        color: 'white',
        duration: 1,
        ease: 'power2.out'
      }, '-=1');
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-white font-inter">
      <Navbar overlay />

      {/* Hero Section - Enhanced layout with better contrast */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image with Enhanced Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://medias.renoassistance.ca/image/upload/ar_4:3,c_crop/v1730239142/renoassistance/residential/articles/2023-12/styles-de-maison/Modern-house-with-pool.jpg"
            alt="Modern sustainable homes and apartments"
            className="w-full h-full object-cover scale-105 transform"
          />
          {/* Multi-layered overlay for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-dwellio-900/30 via-transparent to-transparent"></div>
        </div>

        {/* Enhanced floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-dwellio-400/20 to-dwellio-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-32 w-80 h-80 bg-gradient-to-br from-green-400/10 to-dwellio-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-to-br from-dwellio-500/15 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 min-h-screen py-20 sm:py-24 lg:py-28">

            {/* Core Messaging - Enhanced Layout */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center">

              {/* Badge with better visibility */}
              <div className="mb-6 lg:mb-8">
                <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse shadow-lg shadow-green-400/50"></div>
                  <span className="text-white/90 font-medium">Modern Tenant Representation Platform</span>
                </div>
              </div>

              {/* Enhanced headline with better typography */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6 lg:mb-8">
                <span className="block text-white drop-shadow-2xl">Lower Upfront</span>
                <span className="block text-white drop-shadow-2xl">Rental Costs.</span>
                <span className="block bg-gradient-to-r from-green-400 to-dwellio-400 bg-clip-text text-transparent drop-shadow-2xl">Higher Living Standards.</span>
              </h1>

              {/* Improved description with better contrast */}
              <p className="text-lg sm:text-xl lg:text-xl leading-relaxed mb-8 lg:mb-10 max-w-2xl text-gray-100 drop-shadow-lg">
                Dwellio helps Nigerian tenants secure quality, verified homes with reduced agency fees, transparent documentation, negotiated deposits, and guided onboarding. We combine professional representation with a digital workspace that keeps every step simple, traceable, and stress‑free.
              </p>

              {/* Enhanced CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 mb-8 lg:mb-10">
                {isAuthenticated ? (
                  <>
                    <Link to="/properties" className="group border inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-dwellio-600 to-dwellio-700 rounded-xl hover:from-dwellio-700 hover:to-dwellio-800 transform hover:backdrop-blur-md transition-all duration-300 shadow-xl shadow-dwellio-600/25">
                      <span>Browse Verified Homes</span>
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                    <Link to="/tenant/profile" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300">
                      Go to Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/signup" className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-dwellio-600 to-dwellio-700 rounded-xl hover:from-dwellio-700 hover:to-dwellio-800 transform hover:scale-105 transition-all duration-300 shadow-xl shadow-dwellio-600/25">
                      <span>Get Started Free</span>
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                    <Link to="/signin" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300">
                      How It Works
                    </Link>
                  </>
                )}
              </div>

              {/* Enhanced feature badges */}
              <div className="flex flex-wrap gap-3 lg:gap-4">
                {[
                  { icon: <FiCheck className="w-4 h-4" />, label: "Verified Listings" },
                  { icon: <FiFileText className="w-4 h-4" />, label: "Document Validation" },
                  { icon: <FiDollarSign className="w-4 h-4" />, label: "Negotiated Deposits" },
                  { icon: <FiSearch className="w-4 h-4" />, label: "Transparent Tracking" }
                ].map((item, index) => (
                  <span key={index} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white/90 hover:bg-white/20 transition-all duration-300 cursor-default">
                    <span className="text-green-400">{item.icon}</span>
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Enhanced Side Stats Cards */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center gap-6 lg:gap-8">
              {[
                { value: '₦500K+', label: 'Average Savings', icon: <FiDollarSign className="w-8 h-8 lg:w-10 lg:h-10" />, color: 'from-green-500/20 to-emerald-500/10' },
                { value: '95%', label: 'Success Rate', icon: <FiTrendingUp className="w-8 h-8 lg:w-10 lg:h-10" />, color: 'from-blue-500/20 to-cyan-500/10' },
                { value: '500+', label: 'Happy Tenants', icon: <FiUsers className="w-8 h-8 lg:w-10 lg:h-10" />, color: 'from-purple-500/20 to-pink-500/10' },
              ].map(card => (
                <div key={card.label} className="group relative overflow-hidden p-6 lg:p-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl hover:bg-white/15 hover:border-white/30 transition-all duration-500 transform hover:scale-105">
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-50 pointer-events-none`} />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <div className="text-4xl lg:text-5xl font-bold mb-2 text-white drop-shadow-lg">{card.value}</div>
                      <div className="text-sm lg:text-base tracking-wide uppercase font-semibold text-white/80">{card.label}</div>
                    </div>
                    <div className="text-white/60 group-hover:text-white/100 transition-all duration-300">
                      {card.icon}
                    </div>
                  </div>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none"></div>
      </div>

      {/* Comprehensive Services Section */}
      <div className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Comprehensive Tenant Representation Services
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              From initial property search to lease negotiation, we handle every aspect of your rental journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Property Search & Market Analysis */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-dwellio-700 rounded-xl flex items-center justify-center group-hover:bg-dwellio-800 transition-colors">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Property Search & Market Analysis</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Identify optimal properties based on your budget, preferences, and lifestyle requirements through comprehensive market research.
              </p>
              <a href="#" className="text-dwellio-700 font-medium hover:text-dwellio-800 transition-colors">
                Learn more →
              </a>
            </div>

            {/* Lease Negotiation */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-dwellio-700 rounded-xl flex items-center justify-center group-hover:bg-dwellio-800 transition-colors">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lease Negotiation</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Secure favorable terms, rent concessions, and tenant improvement allowances on your behalf through expert negotiation.
              </p>
              <a href="#" className="text-dwellio-700 font-medium hover:text-dwellio-800 transition-colors">
                Learn more →
              </a>
            </div>

            {/* Transaction Management */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-dwellio-700 rounded-xl flex items-center justify-center group-hover:bg-dwellio-800 transition-colors">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transaction Management</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Guide you through due diligence, documentation, and move-in processes seamlessly from start to finish.
              </p>
              <a href="#" className="text-dwellio-700 font-medium hover:text-dwellio-800 transition-colors">
                Learn more →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-12 sm:py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
          {/* Header */}
          <div className="text-left mb-10 sm:mb-12 lg:mb-16">
            <p className="text-sm font-medium text-gray-600 mb-2 tracking-wide uppercase">TESTIMONIALS</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Don't take our word for it!<br />
              Hear it from our partners.
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* Testimonial 1 */}
            <div className="space-y-8">
              <TestimonialCard
                quote="The lovely team at Dwellio has provided our startup with significant leverage. Their work is exceptionally professional, and Adrian is always attentive to our needs, taking the time to understand our briefs and offer valuable direction. Additionally, their turnaround times are impressively fast!"
                name="Patrick Nwamadi"
                title="UX Manager at Superhabits"
                image="https://randomuser.me/api/portraits/men/45.jpg"
              />
            </div>

            {/* Testimonial 2 */}
            <div className="space-y-8">
              <TestimonialCard
                quote="Dwellio has completely transformed how we approach property management. Their innovative platform and dedicated team have made finding quality homes effortless for our clients."
                name="Priscilla Pugh"
                title="Product Designer at Lightdash"
                image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2088"
              />
            </div>

            {/* Testimonial 3 */}
            <div className="space-y-8">
              <TestimonialCard
                quote="Dwellio has greatly exceeded our expectations. The communication is always excellent, the turnaround is extremely quick, and the designs are fresh, innovative, and spot on!"
                name="Rob West"
                title="CEO of Kingdom Advisors"
                image="https://randomuser.me/api/portraits/men/32.jpg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Combined Sections with Unified Background */}
      <div ref={whyChooseSectionRef} className="relative">
        {/* Unified Dynamic Background for Both Sections */}
        <div ref={backgroundRef} className="absolute inset-0 bg-gradient-to-br from-dwellio-50 via-white to-green-50"></div>
        
        {/* Why Choose Section */}
        <div className="relative py-16 sm:py-20 lg:py-32 overflow-hidden">
          {/* Floating Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -right-32 w-96 h-96 bg-gradient-to-br from-dwellio-400/10 to-green-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
            <div className="absolute bottom-32 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/8 to-dwellio-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s', animationDuration: '8s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-dwellio-600/5 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
              
              {/* Content Section with Enhanced Styling */}
              <div ref={contentRef} className="order-2 lg:order-1 relative z-10 flex flex-col justify-center">
                {/* Animated Badge */}
                <div className="mb-8">
                  <div className="badge inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-dwellio-100 to-green-100 border border-dwellio-200/50 shadow-sm">
                    <div className="w-2 h-2 bg-gradient-to-r from-dwellio-500 to-green-500 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-dwellio-700 font-semibold">Why Choose Your Tenant Representative</span>
                  </div>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  <span>Your </span>
                  <span className="bg-gradient-to-r from-dwellio-600 to-green-500 bg-clip-text text-transparent">Advocate</span>
                  <span> in Every</span>
                  <br />
                  <span>Rental Transaction</span>
                </h2>
                
                <p className="text-lg sm:text-xl mb-10 leading-relaxed">
                  Unlike landlord brokers who represent property owners, we work exclusively for tenants. Our loyalty is to <span className="font-semibold text-dwellio-700">you</span> and your rental interests.
                </p>

                {/* Enhanced Feature List */}
                <div className="space-y-6">
                  {[
                    {
                      icon: <FiDollarSign className="w-5 h-5" />,
                      title: "No cost to you - landlord pays our commission",
                      description: "Our services are completely free to tenants as landlords compensate us directly.",
                      gradient: "from-green-500 to-emerald-600"
                    },
                    {
                      icon: <FiUsers className="w-5 h-5" />,
                      title: "Exclusive tenant representation - no conflicts of interest",
                      description: "We work solely for tenants, ensuring your interests are our only priority in every negotiation.",
                      gradient: "from-dwellio-500 to-dwellio-600"
                    },
                    {
                      icon: <FiTrendingUp className="w-5 h-5" />,
                      title: "Market expertise across all residential property types",
                      description: "From apartments to houses, we have deep knowledge of all residential rental sectors.",
                      gradient: "from-blue-500 to-dwellio-500"
                    },
                    {
                      icon: <FiCheck className="w-5 h-5" />,
                      title: "Proven track record of securing favorable lease terms",
                      description: "Our experience delivers measurable savings and improved lease conditions for our clients.",
                      gradient: "from-green-500 to-dwellio-500"
                    },
                    {
                      icon: <FiFileText className="w-5 h-5" />,
                      title: "Full-service support from search to move-in",
                      description: "We guide you through every step of the process, from initial search to final move-in.",
                      gradient: "from-dwellio-600 to-green-500"
                    }
                  ].map((feature, index) => (
                    <div key={index} className="group flex items-start hover:transform hover:translate-x-2 transition-all duration-300">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                        <span className="text-white">{feature.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-dwellio-700 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="feature-description leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Image Section - Full Height */}
              <div ref={imageRef} className="relative order-1 lg:order-2 flex items-stretch">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-dwellio-400/20 to-green-400/20 rounded-3xl blur-2xl transform rotate-6 scale-105"></div>
                
                {/* Main Image Container - Full Height */}
                <div className="relative group w-full">
                  <div className="overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-700 group-hover:scale-105 group-hover:rotate-1 h-full">
                    <img
                      src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073"
                      alt="Modern apartment complex"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dwellio-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Floating Stats Card */}
                  <div className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 transform transition-all duration-500 group-hover:scale-105">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-dwellio-700 mb-1">98%</div>
                      <div className="text-sm text-gray-600 font-medium">Client Satisfaction</div>
                    </div>
                  </div>

                  {/* Floating Achievement Badge */}
                  <div className="absolute -top-4 -left-4 bg-gradient-to-r from-green-500 to-dwellio-600 text-white rounded-2xl p-4 shadow-xl transform transition-all duration-500 group-hover:rotate-12">
                    <div className="flex items-center space-x-2">
                      <FiCheck className="w-5 h-5" />
                      <span className="font-semibold text-sm">Trusted Partner</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section - Enhanced with Dynamic Design */}
        <div ref={howItWorksRef} className="relative py-16 sm:py-20 lg:py-32 overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-32 -left-40 w-96 h-96 bg-gradient-to-br from-dwellio-400/8 to-green-400/4 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s' }}></div>
          <div className="absolute bottom-20 -right-32 w-80 h-80 bg-gradient-to-br from-green-400/6 to-dwellio-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '9s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-dwellio-600/4 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s', animationDuration: '6s' }}></div>
        </div>

        <div ref={howItWorksContentRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            {/* Animated Badge */}
            <div className="mb-8">
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-dwellio-100 to-green-100 border border-dwellio-200/50 shadow-sm">
                <div className="w-2 h-2 bg-gradient-to-r from-dwellio-500 to-green-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-dwellio-700 font-semibold">Simple Process</span>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
              <span>How It </span>
              <span className="bg-gradient-to-r from-green-400 to-dwellio-400 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed text-white">
              Our simple process makes finding your next home easier than ever, with <span className="font-semibold text-green-300">professional support</span> at every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                number: "1",
                title: "Sign Up & Share Your Vision",
                description: "Create your account and let us know your requirements for your ideal home. Tell us about your lifestyle, budget, and preferences.",
                icon: <FiUsers className="w-6 h-6" />,
                gradient: "from-dwellio-500 to-dwellio-600",
                delay: "0s"
              },
              {
                number: "2", 
                title: "Get Matched with Perfect Properties",
                description: "Our expert team matches you with verified properties that meet your criteria and budget, saving you time and effort.",
                icon: <FiSearch className="w-6 h-6" />,
                gradient: "from-green-500 to-dwellio-500",
                delay: "0.2s"
              },
              {
                number: "3",
                title: "Move In with Confidence",
                description: "We handle negotiations, paperwork, and move-in coordination, ensuring a smooth transition to your new home.",
                icon: <FiCheck className="w-6 h-6" />,
                gradient: "from-dwellio-600 to-green-500",
                delay: "0.4s"
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className="step-card group relative bg-white/10 backdrop-blur-md p-8 lg:p-10 rounded-3xl border border-white/20 text-center hover:bg-white/20 transition-all duration-500 hover:scale-105 transform"
                style={{ animationDelay: step.delay }}
              >
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Step Number with Enhanced Design */}
                <div className="relative mb-8">
                  <div className={`step-number w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>
                  
                  {/* Floating Icon */}
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12">
                    <span className="text-white">{step.icon}</span>
                  </div>
                </div>

                <h3 className="step-title text-xl lg:text-2xl font-bold mb-4 text-white transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="step-description text-base lg:text-lg leading-relaxed text-gray-200">
                  {step.description}
                </p>

                {/* Connecting Line (except for last item) */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 -right-6 lg:-right-8">
                    <div className="w-12 lg:w-16 h-0.5 bg-gradient-to-r from-dwellio-300 to-green-300 relative">
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-dwellio-400 rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 lg:mt-20">
            <div className="inline-flex flex-col sm:flex-row gap-4 lg:gap-6">
              <Link 
                to="/signup" 
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-dwellio-600 to-dwellio-700 rounded-xl hover:from-dwellio-700 hover:to-dwellio-800 transform hover:scale-105 transition-all duration-300 shadow-xl shadow-dwellio-600/25"
              >
                <span>Get Started Today</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                to="/properties" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-dwellio-700 bg-dwellio-100 hover:bg-dwellio-200 rounded-xl transition-all duration-300"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-12 sm:py-16 lg:py-20 bg-dwellio-900 text-[#17241f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Ready to Find Your Perfect Home?</h2>
              <p className="text-base sm:text-lg lg:text-xl text-dwellio-100 mb-6 sm:mb-8">
                Reach out to us today and let us help you find your dream home with our professional tenant representation services.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-4 text-dwellio-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+234 800 123 4567</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-4 text-dwellio-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>contact@dwellio.com</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-4 text-dwellio-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>123 Victoria Island, Lagos, Nigeria</span>
                </div>
              </div>

              <div className="mt-8 flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-dwellio-700 flex items-center justify-center hover:bg-dwellio-600 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-dwellio-700 flex items-center justify-center hover:bg-dwellio-600 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.531A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-dwellio-700 flex items-center justify-center hover:bg-dwellio-600 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-white text-gray-900 rounded-xl p-6 sm:p-8 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-dwellio-800">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-dwellio-500 focus:border-dwellio-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-dwellio-500 focus:border-dwellio-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-dwellio-500 focus:border-dwellio-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-dwellio-500 focus:border-dwellio-500"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-dwellio-700 text-white py-3 px-6 rounded-lg hover:bg-dwellio-800 transition-colors font-medium"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="mb-6">
                <span className="text-2xl font-bold font-inter">dwellio</span>
              </div>
              <p className="text-gray-400 mb-6">
                Your trusted tenant representative in Nigeria. Finding you the perfect home with lower fees and better service.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.531A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Properties</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Services</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Property Search</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Landlord Negotiation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Document Verification</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Move-in Assistance</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tenant Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-3 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-400">123 Victoria Island, Lagos, Nigeria</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-3 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-400">+234 800 123 4567</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-3 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-400">contact@dwellio.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Dwellio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}