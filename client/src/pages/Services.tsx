import { useState } from 'react';
import Navbar from '../components/Navbar';
import { 
  FiHome, 
  FiSearch, 
  FiUsers, 
  FiTool, 
  FiDollarSign, 
  FiShield,
  FiClock,
  FiPhone,
  FiCheck,
  FiArrowRight,
  FiStar,
  FiHeart,
  FiTrendingUp,
  FiAward
} from 'react-icons/fi';

export default function Services() {
  const [selectedService, setSelectedService] = useState(0);

  const mainServices = [
    {
      icon: <FiHome className="w-12 h-12" />,
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
      icon: <FiSearch className="w-12 h-12" />,
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
      icon: <FiTool className="w-12 h-12" />,
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
      icon: <FiDollarSign className="w-12 h-12" />,
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
      quote: "Dwellio has transformed how I manage my properties. Their technology platform makes everything so much easier.",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "Tenant",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=400&h=400&fit=crop&crop=face",
      quote: "Finding my perfect apartment through Dwellio was seamless. Their team handled everything professionally.",
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
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-dwellio-600 to-dwellio-800 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Our <span className="text-yellow-400">Services</span>
              </h1>
              <p className="text-xl md:text-2xl text-dwellio-100 max-w-3xl mx-auto leading-relaxed">
                Comprehensive property management solutions designed to make your life easier
              </p>
            </div>
          </div>
        </div>

        {/* Main Services */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for successful property management in one platform
            </p>
          </div>

          {/* Service Tabs */}
          <div className="flex flex-wrap justify-center mb-12 gap-2">
            {mainServices.map((service, index) => (
              <button
                key={index}
                onClick={() => setSelectedService(index)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedService === index
                    ? 'bg-dwellio-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span className="text-sm">{service.icon}</span>
                <span>{service.title}</span>
              </button>
            ))}
          </div>

          {/* Selected Service Details */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 lg:p-12">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-dwellio-100 rounded-xl flex items-center justify-center text-dwellio-600">
                    {mainServices[selectedService].icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{mainServices[selectedService].title}</h3>
                    <p className="text-dwellio-600 font-medium">{mainServices[selectedService].pricing}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  {mainServices[selectedService].description}
                </p>

                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-gray-900">What's Included:</h4>
                  {mainServices[selectedService].features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="bg-dwellio-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-dwellio-700 transition-colors inline-flex items-center space-x-2">
                  <span>Get Started</span>
                  <FiArrowRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="relative">
                <img
                  src={mainServices[selectedService].image}
                  alt={mainServices[selectedService].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-dwellio-600/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Services */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Additional Services</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Specialized services to complement your property management needs
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {additionalServices.map((service, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-dwellio-100 rounded-xl flex items-center justify-center text-dwellio-600 mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pricing Plans</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that best fits your property management needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow p-8 ${plan.popular ? 'ring-2 ring-dwellio-600 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-dwellio-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-4 rounded-full font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-dwellio-600 text-white hover:bg-dwellio-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}>
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Don't just take our word for it - hear from our satisfied customers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-2xl">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-dwellio-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-dwellio-100 mb-8 max-w-2xl mx-auto">
                Join thousands of property owners and tenants who trust Dwellio for their property management needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="bg-white text-dwellio-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  Contact Sales
                </a>
                <a
                  href="/signup"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-dwellio-600 transition-colors"
                >
                  Start Free Trial
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}