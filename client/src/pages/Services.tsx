import { useState } from 'react';
import Navbar from '../components/Navbar';
import PageContainer from '../components/PageContainer';
import Footer from '../components/Footer';
import {
  FiHome,
  FiSearch,
  FiUsers,
  FiTool,
  FiDollarSign,
  FiShield,
  FiClock,
  FiCheck,
  FiArrowRight,
  FiStar,
  FiTrendingUp,
  FiAward
} from 'react-icons/fi';

export default function Services() {
  const [selectedService, setSelectedService] = useState(0);

  const mainServices = [
    {
      icon: <FiHome className="w-8 h-8" />,
      title: "Property Management",
      description: "Complete property management solutions for landlords and property owners.",
      features: [
        "Tenant screening and verification",
        "Rent collection and financial reporting",
        "Property maintenance coordination",
        "Legal compliance and documentation",
        "Regular property inspections",
        "24/7 emergency response"
      ],
      pricing: "Starting from ₦50,000/month",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070"
    },
    {
      icon: <FiSearch className="w-8 h-8" />,
      title: "Tenant Representation",
      description: "Professional representation for tenants seeking the perfect rental property.",
      features: [
        "Property search and matching",
        "Lease negotiation support",
        "Property viewing coordination",
        "Documentation assistance",
        "Market analysis and pricing",
        "Move-in support services"
      ],
      pricing: "Free for tenants",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2096"
    },
    {
      icon: <FiTool className="w-8 h-8" />,
      title: "Maintenance Services",
      description: "Comprehensive property maintenance and repair services.",
      features: [
        "Routine maintenance scheduling",
        "Emergency repair services",
        "Quality contractor network",
        "Maintenance cost optimization",
        "Preventive maintenance programs",
        "Digital maintenance tracking"
      ],
      pricing: "Pay per service",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069"
    },
    {
      icon: <FiDollarSign className="w-8 h-8" />,
      title: "Financial Management",
      description: "Complete financial management and reporting for your properties.",
      features: [
        "Automated rent collection",
        "Financial reporting and analytics",
        "Expense tracking and management",
        "Tax documentation support",
        "Revenue optimization strategies",
        "Digital payment processing"
      ],
      pricing: "3% of collected rent",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070"
    }
  ];

  const additionalServices = [
    {
      icon: <FiShield className="w-8 h-8" />,
      title: "Property Insurance",
      description: "Comprehensive insurance coverage for your properties and tenants.",
      features: ["Building insurance", "Content protection", "Liability coverage", "Quick claims processing"]
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Legal Services",
      description: "Expert legal support for all property-related matters.",
      features: ["Contract drafting", "Dispute resolution", "Eviction proceedings", "Legal compliance"]
    },
    {
      icon: <FiClock className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Round-the-clock support for emergencies and urgent matters.",
      features: ["Emergency hotline", "Online support portal", "Mobile app support", "Multilingual assistance"]
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: "Market Analysis",
      description: "Detailed market insights and property valuation services.",
      features: ["Property valuation", "Market trends analysis", "Investment advice", "ROI calculations"]
    }
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "₦25,000",
      period: "/month",
      description: "Perfect for individual property owners",
      features: [
        "Up to 3 properties",
        "Basic tenant screening",
        "Monthly financial reports",
        "Standard maintenance coordination",
        "Email support",
        "Mobile app access"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "₦75,000",
      period: "/month",
      description: "Ideal for growing property portfolios",
      features: [
        "Up to 15 properties",
        "Advanced tenant screening",
        "Weekly financial reports",
        "Priority maintenance service",
        "Phone & email support",
        "Dedicated account manager",
        "Legal document templates",
        "Market analysis reports"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large property management companies",
      features: [
        "Unlimited properties",
        "Custom tenant screening",
        "Real-time reporting",
        "24/7 emergency response",
        "Dedicated support team",
        "Custom integrations",
        "White-label solutions",
        "Advanced analytics"
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Bola Adeyemi",
      role: "Property Owner",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      quote: "Ubani has transformed how I manage my properties. Their technology platform makes everything so much easier.",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "Tenant",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=400&h=400&fit=crop&crop=face",
      quote: "Finding my perfect apartment through Ubani was seamless. Their team handled everything professionally.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Real Estate Investor",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      quote: "The financial reporting and analytics have helped me optimize my investment returns significantly.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-ubani-black font-sans">
      <Navbar overlay />

      {/* Hero Section */}
      <div className="relative bg-ubani-black pt-20">
        <PageContainer noPaddingTop>
          <div className="text-center py-16 sm:py-20 lg:py-24">
            <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-ubani-yellow/30">
              <FiAward className="w-4 h-4 text-ubani-yellow" />
              <span className="text-sm text-white/90 font-medium">Premium Services</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Comprehensive Property
              <span className="block text-ubani-yellow">Management Solutions</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Everything you need to manage, maintain, and grow your property portfolio with confidence
            </p>
          </div>
        </PageContainer>
      </div>

      {/* Main Services */}
      <div className="py-16 sm:py-20 lg:py-24 bg-ubani-black">
        <PageContainer noPaddingTop>
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-sm font-medium text-ubani-yellow mb-2 tracking-wide uppercase">CORE SERVICES</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive property management solutions designed to simplify your operations
            </p>
          </div>

          {/* Service Tabs */}
          <div className="flex flex-wrap justify-center mb-12 gap-3">
            {mainServices.map((service, index) => (
              <button
                key={index}
                onClick={() => setSelectedService(index)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedService === index
                    ? 'bg-ubani-yellow text-ubani-black shadow-lg'
                    : 'bg-[#1a1a1a] text-white hover:bg-[#222222] border border-white/10'
                }`}
              >
                {service.icon}
                <span>{service.title}</span>
              </button>
            ))}
          </div>

          {/* Selected Service Details */}
          <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-ubani-yellow rounded-2xl flex items-center justify-center text-ubani-black flex-shrink-0">
                    {mainServices[selectedService].icon}
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {mainServices[selectedService].title}
                    </h3>
                    <p className="text-ubani-yellow font-semibold">
                      {mainServices[selectedService].pricing}
                    </p>
                  </div>
                </div>

                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  {mainServices[selectedService].description}
                </p>

                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-white text-sm uppercase tracking-wide">
                    What's Included
                  </h4>
                  {mainServices[selectedService].features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <FiCheck className="w-5 h-5 text-ubani-yellow flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="bg-ubani-yellow text-ubani-black px-8 py-4 rounded-full font-semibold hover:bg-ubani-yellow/90 transition-all transform hover:scale-105 inline-flex items-center space-x-2 shadow-xl">
                  <span>Get Started</span>
                  <FiArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="relative min-h-[400px] lg:min-h-full">
                <img
                  src={mainServices[selectedService].image}
                  alt={mainServices[selectedService].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ubani-black via-ubani-black/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Additional Services */}
      <div className="py-16 sm:py-20 lg:py-24 bg-ubani-black">
        <PageContainer noPaddingTop>
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-sm font-medium text-ubani-yellow mb-2 tracking-wide uppercase">ADDITIONAL SERVICES</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Specialized Support Services
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Complementary services to enhance your property management experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="group bg-[#1a1a1a] p-8 rounded-3xl hover:bg-[#222222] transition-all duration-300 border border-white/10 hover:border-ubani-yellow/30"
              >
                <div className="w-16 h-16 bg-ubani-yellow rounded-2xl flex items-center justify-center text-ubani-black mb-6 transform transition-all duration-300 group-hover:scale-110">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-ubani-yellow transition-colors">{service.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{service.description}</p>
                <div className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-2">
                      <FiCheck className="w-4 h-4 text-ubani-yellow flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </div>

      {/* Pricing Section */}
      <div className="py-16 sm:py-20 lg:py-24 bg-ubani-black">
        <PageContainer noPaddingTop>
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-sm font-medium text-ubani-yellow mb-2 tracking-wide uppercase">PRICING PLANS</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Flexible pricing options designed to grow with your property portfolio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-[#1a1a1a] rounded-3xl p-8 border transition-all duration-300 ${
                  plan.popular
                    ? 'border-ubani-yellow scale-105 shadow-xl shadow-ubani-yellow/20'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-ubani-yellow text-ubani-black px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-ubani-yellow">{plan.price}</span>
                    <span className="text-gray-400 text-lg">{plan.period}</span>
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <FiCheck className="w-5 h-5 text-ubani-yellow flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-ubani-yellow text-ubani-black hover:bg-ubani-yellow/90 shadow-xl'
                      : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </PageContainer>
      </div>

      {/* Testimonials */}
      <div className="py-16 sm:py-20 lg:py-24 bg-ubani-black">
        <PageContainer noPaddingTop>
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-sm font-medium text-ubani-yellow mb-2 tracking-wide uppercase">TESTIMONIALS</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Trusted by Property Owners
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              See what our clients have to say about their experience with Dwellio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/10 hover:border-ubani-yellow/30 transition-all duration-300 hover:bg-[#222222]"
              >
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 text-ubani-yellow fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-ubani-yellow/20"
                  />
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </div>

      {/* CTA Section */}
      <div className="relative py-16 sm:py-20 lg:py-24 bg-ubani-black overflow-hidden">
        {/* Floating Background Elements with Yellow Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -right-32 w-96 h-96 bg-ubani-yellow/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 -left-40 w-80 h-80 bg-ubani-yellow/3 rounded-full blur-3xl"></div>
        </div>

        <PageContainer noPaddingTop>
          <div className="relative text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your <span className="text-ubani-yellow">Property Management?</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of property owners and tenants who trust Dwellio for their property management needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center bg-ubani-yellow text-ubani-black px-8 py-4 rounded-full font-semibold hover:bg-ubani-yellow/90 transition-all transform hover:scale-105 shadow-xl"
              >
                Contact Sales
              </a>
              <a
                href="/properties"
                className="inline-flex items-center justify-center border-2 border-white/10 bg-white/5 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all"
              >
                Browse Properties
              </a>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}