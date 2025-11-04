import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageContainer from '../components/PageContainer';
import TestimonialCard from '../components/TestimonialCard';
import FeaturedProperties from '../components/FeaturedProperties';
import Footer from '../components/Footer';
import {
  FiCheck,
  FiFileText,
  FiDollarSign,
  FiSearch,
  FiUsers,
  FiTrendingUp,
} from 'react-icons/fi';

export default function HomePage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  // Hero image slider state
  const heroImages = [
    'https://www.uniquehomes.com/wp-content/uploads/2025/10/Screenshot-2025-10-08-at-2.49.46%E2%80%AFPM.png',
    'https://www.bhg.com/thmb/FcKK-L23QiqiDVjrjLgfa1uFZU8=/4000x0/filters:no_upscale():strip_icc()/101495134_preview-b192d3b7d4b04188a014754b9ffa6f79.jpg',
    'https://images.homify.com/v1443707104/p/photo/image/962351/Kloof_Rd_by_Nico_van_der_Meulen_Architects_07_resize.jpg',
    'https://images.squarespace-cdn.com/content/v1/61498fccf02cd27e1852151a/d5615038-a4ac-4b8a-9a42-0c8746b35396/What+is+an+estate+charge.jpg'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

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
    <div className="min-h-screen bg-ubani-black font-sans">
      <Navbar overlay />

      {/* Hero Section - Image with layered white container background */}
      <div className="relative bg-ubani-black">
        <PageContainer>
          {/* Container wrapper for layered effect */}
          <div className="relative min-h-[calc(80vh-8rem)]">

            {/* Back white container - offset/displaced */}
            <div className="absolute inset-0 bg-white rounded-[2.5rem] translate-x-4 translate-y-4 shadow-lg"></div>

            {/* Front container with house image slider */}
            <div className="relative w-full rounded-[2.5rem] border-2 border-white overflow-hidden shadow-2xl min-h-[calc(80vh-8rem)] flex items-end">
              {/* Background image slider */}
              <div className="absolute inset-0">
                {heroImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Modern Home ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                  />
                ))}
              </div>

              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-ubani-black via-ubani-black/0 to-transparent"></div>

              {/* Slider indicators */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
                      ? 'bg-ubani-yellow w-8'
                      : 'bg-white/50 hover:bg-white/75'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Text content overlay - positioned at bottom */}
              <div className="relative z-10  px-8 sm:px-12 pb-12">
                {/* Headline with yellow accent */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl max-w-5xl font-bold leading-tight mb-6">
                  <span className="block text-white">Lower Upfront Rental Costs.</span>
                  <span className="block text-ubani-yellow">Higher Living Standards.</span>

                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg text-white leading-relaxed max-w-7xl">
                  Dwellio helps Nigerian tenants secure quality, verified homes with reduced agency fees, transparent documentation, negotiated deposits, and guided onboarding. We combine professional representation with a digital workspace that keeps every step simple, traceable, and stress-free.
                </p>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Statistics Section */}
      <div className="py-16 sm:py-20 bg-ubani-black">
        <PageContainer noPaddingTop>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">

            {/* Average Savings */}
            <div className="text-center">
              <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-ubani-yellow mb-4">
                ₦500K+
              </div>
              <div className="text-xl sm:text-2xl text-white font-light">
                Average Savings
              </div>
            </div>

            {/* Success Rate */}
            <div className="text-center">
              <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-ubani-yellow mb-4">
                95%
              </div>
              <div className="text-xl sm:text-2xl text-white font-light">
                Success Rate
              </div>
            </div>

            {/* Happy Tenants */}
            <div className="text-center">
              <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-ubani-yellow mb-4">
                500+
              </div>
              <div className="text-xl sm:text-2xl text-white font-light">
                Happy Tenants
              </div>
            </div>

          </div>
        </PageContainer>
      </div>

      {/* Comprehensive Services Section */}
      <div className="py-16 sm:py-20 lg:py-24 bg-ubani-black">
        <PageContainer noPaddingTop>
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Comprehensive Tenant Representation Services
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              From initial property search to lease negotiation, we handle every aspect of your rental journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Property Search & Market Analysis */}
            <div className="bg-[#1a1a1a] rounded-3xl p-8 hover:bg-[#222222] transition-colors">
              <div className="w-16 h-16 mb-6 bg-ubani-yellow rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-ubani-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                Property Search & Market Analysis
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Identify optimal properties based on your budget, preferences, and lifestyle requirements through comprehensive market research.
              </p>
              <a href="#" className="inline-block text-white underline hover:text-ubani-yellow transition-colors">
                Learn more
              </a>
            </div>

            {/* Lease Negotiation */}
            <div className="bg-[#1a1a1a] rounded-3xl p-8 hover:bg-[#222222] transition-colors">
              <div className="w-16 h-16 mb-6 bg-ubani-yellow rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-ubani-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                Property Search & Market Analysis
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Identify optimal properties based on your budget, preferences, and lifestyle requirements through comprehensive market research.
              </p>
              <a href="#" className="inline-block text-white underline hover:text-ubani-yellow transition-colors">
                Learn more
              </a>
            </div>

            {/* Transaction Management */}
            <div className="bg-[#1a1a1a] rounded-3xl p-8 hover:bg-[#222222] transition-colors">
              <div className="w-16 h-16 mb-6 bg-ubani-yellow rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-ubani-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                Property Search & Market Analysis
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Identify optimal properties based on your budget, preferences, and lifestyle requirements through comprehensive market research.
              </p>
              <a href="#" className="inline-block text-white underline hover:text-ubani-yellow transition-colors">
                Learn more
              </a>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Featured Properties Section */}
      <FeaturedProperties />

      {/* Testimonials Section */}
      <div className="  ">
        <PageContainer className="" noPaddingTop>
          {/* Header */}
          <div className="text-left mb-10 sm:mb-12 lg:mb-16">
            {/* <p className="text-sm font-medium text-ubani-yellow mb-2 tracking-wide uppercase">TESTIMONIALS</p> */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Don't take our word for it!<br />
              <span className="text-ubani-yellow">Hear it from our partners.</span>
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">

            {/* Testimonial 1 */}
            <div className="space-y-8">
              <TestimonialCard
                quote="The lovely team at Dwellio has provided our startup with significant leverage. Their work is exceptionally professional, and Adrian is always attentive to our needs, taking the time to understand our briefs and offer valuable direction. Additionally, their turnaround times are impressively fast!"
                name="Century Favour"
                title="UX Manager at Superhabits"
                image="https://centuryfavour.com/wp-content/uploads/2025/07/Century-Favour.jpg"
              />
            </div>

            {/* Testimonial 2 */}
            <div className="space-y-8">
              <TestimonialCard
                quote="Dwellio has completely transformed how we approach property management. Their innovative platform and dedicated team have made finding quality homes effortless for our clients."
                name="Precious Ebere"
                title="Product Designer at Lightdash"
                image="https://scontent.fabv3-1.fna.fbcdn.net/v/t39.30808-6/332357320_918082625993953_1796182917463866993_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEqG8k6mXepx0NSYc8jBhb0g4_IuSmNYtuDj8i5KY1i289EjOX_ixv9EDZhQJlBDUpan-QpWUomS6fpWtSyMbrK&_nc_ohc=hJO3GXYN7AMQ7kNvwFaPi4O&_nc_oc=Admq0kb-3pNwUHQd4hvJ2vnHHdAnZHyLGYcdLjlIs8g67eBQGKgzHtBvgGcfa1ZL1FQ&_nc_zt=23&_nc_ht=scontent.fabv3-1.fna&_nc_gid=6ZG7Hm0Bke2yMyB99He0Eg&oh=00_Afhi7QtKlS-9t_49fF_opouT755J0LkeK1PXeM3KGL9Jow&oe=690F1233"
              />
            </div>

            {/* Testimonial 3 */}
            <div className="space-y-8">
              <TestimonialCard
                quote="Dwellio has greatly exceeded our expectations. The communication is always excellent, the turnaround is extremely quick, and the designs are fresh, innovative, and spot on!"
                name="Rob West"
                title="CEO of Kingdom Advisors"
                image="https://imageio.forbes.com/specials-images/imageserve/66c3b9c5b69e4e9fcffc9ca6/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds"
              />
            </div>
            {/* Testimonial 4 */}
            <div className="space-y-8">
              <TestimonialCard
                quote="The lovely team at Dwellio has provided our startup with significant leverage. Their work is exceptionally professional, and Adrian is always attentive to our needs, taking the time to understand our briefs and offer valuable direction. Additionally, their turnaround times are impressively fast!"
                name="Jessica Nwamadi"
                title="UX Manager at Superhabits"
                image="https://img.freepik.com/free-photo/indian-woman-posing-cute-stylish-outfit-camera-smiling_482257-122351.jpg?semt=ais_hybrid&w=740&q=80"
              />
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Combined Sections with Black Background */}
      <div className="relative bg-ubani-black">
        {/* Why Choose Section */}
        <div className="relative py-16 sm:py-20 lg:py-32 overflow-hidden">
          {/* Floating Background Elements with Yellow Glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -right-32 w-96 h-96 bg-ubani-yellow/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-32 -left-40 w-80 h-80 bg-ubani-yellow/3 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-ubani-yellow/4 rounded-full blur-2xl"></div>
          </div>

          <PageContainer className="" noPaddingTop>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">

              {/* Content Section with Enhanced Styling */}
              <div className="order-2 lg:order-1 relative z-10 flex flex-col justify-center">
                {/* Animated Badge */}
                <div className="mb-8">
                  <div className="badge inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-white/5 border border-ubani-yellow/30 shadow-sm">
                    <div className="w-2 h-2 bg-ubani-yellow rounded-full mr-3 animate-pulse"></div>
                    <span className="text-ubani-yellow font-semibold">Why Choose Your Tenant Representative</span>
                  </div>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
                  Your Advocate in Every Rental Transaction
                </h2>

                <p className="text-lg sm:text-xl mb-10 leading-relaxed text-gray-300">
                  Unlike landlord brokers who represent property owners, we work exclusively for tenants. Our loyalty is to <span className="font-semibold text-ubani-yellow">you</span> and your rental interests.
                </p>                {/* Enhanced Feature List */}
                <div className="space-y-6">
                  {[
                    {
                      icon: <FiDollarSign className="w-5 h-5" />,
                      title: "No cost to you - landlord pays our commission",
                      description: "Our services are completely free to tenants as landlords compensate us directly.",
                      gradient: "from-ubani-yellow to-ubani-yellow-dark"
                    },
                    {
                      icon: <FiUsers className="w-5 h-5" />,
                      title: "Exclusive tenant representation - no conflicts of interest",
                      description: "We work solely for tenants, ensuring your interests are our only priority in every negotiation.",
                      gradient: "from-ubani-yellow to-ubani-yellow-dark"
                    },
                    {
                      icon: <FiTrendingUp className="w-5 h-5" />,
                      title: "Market expertise across all residential property types",
                      description: "From apartments to houses, we have deep knowledge of all residential rental sectors.",
                      gradient: "from-ubani-yellow to-ubani-yellow-dark"
                    },
                    {
                      icon: <FiCheck className="w-5 h-5" />,
                      title: "Proven track record of securing favorable lease terms",
                      description: "Our experience delivers measurable savings and improved lease conditions for our clients.",
                      gradient: "from-ubani-yellow to-ubani-yellow-dark"
                    },
                    {
                      icon: <FiFileText className="w-5 h-5" />,
                      title: "Full-service support from search to move-in",
                      description: "We guide you through every step of the process, from initial search to final move-in.",
                      gradient: "from-ubani-yellow to-ubani-yellow-dark"
                    }
                  ].map((feature, index) => (
                    <div key={index} className="group flex items-start hover:transform hover:translate-x-2 transition-all duration-300">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                        <span className="text-ubani-black">{feature.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2 text-white group-hover:text-ubani-yellow transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="feature-description leading-relaxed text-gray-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Image Section - Full Height */}
              <div className="relative order-1 lg:order-2 flex items-stretch">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-ubani-yellow/10 rounded-3xl blur-2xl transform rotate-6 scale-105"></div>

                {/* Main Image Container - Full Height */}
                <div className="relative group w-full">
                  <div className="overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-700 group-hover:scale-105 group-hover:rotate-1 h-full border border-ubani-yellow/20">
                    <img
                      src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073"
                      alt="Modern apartment complex"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ubani-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Floating Stats Card */}
                  <div className="absolute -bottom-6 -right-6 bg-ubani-yellow/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-ubani-yellow transform transition-all duration-500 group-hover:scale-105">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-ubani-black mb-1">98%</div>
                      <div className="text-sm text-ubani-black/80 font-medium">Client Satisfaction</div>
                    </div>
                  </div>

                  {/* Floating Achievement Badge */}
                  <div className="absolute -top-4 -left-4 bg-ubani-yellow text-ubani-black rounded-2xl p-4 shadow-xl transform transition-all duration-500 group-hover:rotate-12">
                    <div className="flex items-center space-x-2">
                      <FiCheck className="w-5 h-5" />
                      <span className="font-semibold text-sm">Trusted Partner</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PageContainer>
        </div>

        {/* How It Works Section */}
        <div className="py-16 sm:py-20 lg:py-24 bg-ubani-black">
          <PageContainer noPaddingTop>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
                How It <span className="text-ubani-yellow">Works</span>
              </h2>
              <p className="text-lg sm:text-xl max-w-3xl mx-auto text-gray-300">
                Simple steps to find your perfect home
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  number: "1",
                  title: "Sign Up",
                  description: "Create your account and share your home preferences, budget, and lifestyle requirements.",
                  icon: <FiUsers className="w-6 h-6" />
                },
                {
                  number: "2",
                  title: "Get Matched",
                  description: "We match you with verified properties that meet your criteria and budget.",
                  icon: <FiSearch className="w-6 h-6" />
                },
                {
                  number: "3",
                  title: "Move In",
                  description: "We handle negotiations, paperwork, and coordination for a smooth move-in.",
                  icon: <FiCheck className="w-6 h-6" />
                }
              ].map((step, index) => (
                <div
                  key={index}
                  className="group relative bg-[#1a1a1a] p-8 rounded-3xl border border-white/10 hover:border-ubani-yellow/30 transition-all duration-300 hover:bg-[#222222]"
                >
                  {/* Step Number */}
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-ubani-yellow text-ubani-black text-2xl font-bold transform transition-all duration-300 group-hover:scale-110">
                    {step.number}
                  </div>

                  <h3 className="text-xl lg:text-2xl font-bold mb-3 text-white text-center group-hover:text-ubani-yellow transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-base text-gray-400 leading-relaxed text-center">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12 sm:mt-16">
              <Link
                to="/signup"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-ubani-yellow text-ubani-black rounded-full hover:bg-ubani-yellow/90 transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <span>Get Started Today</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </PageContainer>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 sm:py-20 lg:py-24 bg-ubani-black">
        <PageContainer noPaddingTop>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">
                Ready to Find Your <span className="text-ubani-yellow">Perfect Home?</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
                Reach out to us today and let us help you find your dream home with our professional tenant representation services.
              </p>

              {/* Contact Details */}
              <div className="space-y-6 mb-8">
                <div className="flex items-start group">
                  <div className="w-12 h-12 rounded-2xl bg-ubani-yellow/10 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-ubani-yellow/20 transition-colors">
                    <svg className="w-6 h-6 text-ubani-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Phone</p>
                    <p className="text-white font-medium">+234 800 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-12 h-12 rounded-2xl bg-ubani-yellow/10 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-ubani-yellow/20 transition-colors">
                    <svg className="w-6 h-6 text-ubani-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Email</p>
                    <p className="text-white font-medium">contact@ubani.com</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-12 h-12 rounded-2xl bg-ubani-yellow/10 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-ubani-yellow/20 transition-colors">
                    <svg className="w-6 h-6 text-ubani-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Office</p>
                    <p className="text-white font-medium">123 Victoria Island, Lagos, Nigeria</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <p className="text-sm text-gray-400 mb-4">Follow Us</p>
                <div className="flex space-x-4">
                  <a href="#" className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center hover:bg-ubani-yellow hover:border-ubani-yellow transition-all group">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-ubani-black transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center hover:bg-ubani-yellow hover:border-ubani-yellow transition-all group">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-ubani-black transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.531A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center hover:bg-ubani-yellow hover:border-ubani-yellow transition-all group">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-ubani-black transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#1a1a1a] rounded-3xl p-8 sm:p-10 border border-white/10">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-white">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-ubani-black border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-ubani-black border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-ubani-black border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-ubani-black border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all resize-none"
                    placeholder="Tell us about your dream home..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-ubani-yellow text-ubani-black py-4 px-6 rounded-full hover:bg-ubani-yellow/90 transition-all font-semibold text-lg transform hover:scale-105 shadow-xl"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}