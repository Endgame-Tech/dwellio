import { useState } from 'react';
import Navbar from '../components/Navbar';
import PageContainer from '../components/PageContainer';
import {
  FiUsers,
  FiTarget,
  FiHeart,
  FiAward,
  FiTrendingUp,
  FiShield,
  FiLinkedin,
  FiTwitter,
  FiMail
} from 'react-icons/fi';

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState('story');

  const teamMembers = [
    {
      name: "Adrian Okoro",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "With over 10 years in real estate and technology, Adrian founded Ubani to revolutionize property management in Nigeria.",
      linkedin: "#",
      twitter: "#",
      email: "adrian@ubani.com"
    },
    {
      name: "Kemi Adebayo",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=400&h=400&fit=crop&crop=face",
      bio: "Kemi brings 8 years of operational excellence from leading property management firms across Lagos and Abuja.",
      linkedin: "#",
      twitter: "#",
      email: "kemi@ubani.com"
    },
    {
      name: "Chidi Okafor",
      role: "Head of Technology",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Former software architect at top fintech companies, Chidi leads our technical innovation and platform development.",
      linkedin: "#",
      twitter: "#",
      email: "chidi@ubani.com"
    },
    {
      name: "Amina Hassan",
      role: "Head of Customer Success",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Amina ensures our clients receive exceptional service and support throughout their property journey.",
      linkedin: "#",
      twitter: "#",
      email: "amina@ubani.com"
    }
  ];

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "Ubani was established with a vision to simplify property management in Nigeria."
    },
    {
      year: "2021",
      title: "First 100 Properties",
      description: "Successfully onboarded our first 100 properties across Lagos and Abuja."
    },
    {
      year: "2022",
      title: "Technology Platform Launch",
      description: "Launched our comprehensive digital platform for seamless property management."
    },
    {
      year: "2023",
      title: "5,000+ Happy Tenants",
      description: "Reached the milestone of serving over 5,000 satisfied tenants nationwide."
    },
    {
      year: "2024",
      title: "Expansion Phase",
      description: "Expanding operations to Port Harcourt, Kano, and other major Nigerian cities."
    }
  ];

  const values = [
    {
      icon: <FiShield className="w-8 h-8" />,
      title: "Trust & Transparency",
      description: "We believe in complete transparency in all our dealings, building lasting trust with our clients."
    },
    {
      icon: <FiHeart className="w-8 h-8" />,
      title: "Customer First",
      description: "Every decision we make is centered around providing exceptional value to our customers."
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: "Innovation",
      description: "We continuously innovate to provide cutting-edge solutions for modern property management."
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our service delivery and operations."
    }
  ];

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

            {/* Front container with image */}
            <div className="relative w-full rounded-[2.5rem] border-2 border-white overflow-hidden shadow-2xl min-h-[calc(80vh-8rem)] flex items-end">
              {/* Background image */}
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"
                alt="About Ubani"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-ubani-black via-ubani-black/0 to-transparent"></div>

              {/* Text content overlay - positioned at bottom */}
              <div className="relative z-10 px-8 sm:px-12 pb-12">
                {/* Headline with yellow accent */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  <span className="block text-white">About</span>
                  <span className="block text-ubani-yellow">Ubani</span>
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg text-white leading-relaxed max-w-3xl">
                  We're revolutionizing property management in Nigeria, making it simple,
                  transparent, and efficient for everyone.
                </p>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#1a1a1a] border-b border-white/10 sticky top-0 z-40">
        <PageContainer noPaddingTop>
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { key: 'story', label: 'Our Story', icon: <FiUsers className="w-4 h-4" /> },
              { key: 'mission', label: 'Mission & Values', icon: <FiTarget className="w-4 h-4" /> },
              { key: 'team', label: 'Our Team', icon: <FiHeart className="w-4 h-4" /> },
              { key: 'timeline', label: 'Our Journey', icon: <FiTrendingUp className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab.key
                  ? 'border-ubani-yellow text-ubani-yellow'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-white/30'
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </PageContainer>
      </div>

      {/* Content Sections */}
      <div className="relative py-16 sm:py-20 bg-ubani-black overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -right-32 w-96 h-96 bg-ubani-yellow/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 -left-40 w-80 h-80 bg-ubani-yellow/3 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-ubani-yellow/4 rounded-full blur-2xl"></div>
        </div>

        <PageContainer noPaddingTop>
          {/* Our Story */}
          {activeTab === 'story' && (
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8">Our Story</h2>
                <div className="space-y-4 sm:space-y-6 text-gray-300 text-base sm:text-lg leading-relaxed">
                  <p>
                    Ubani was born from a simple observation: property management in Nigeria was
                    unnecessarily complex, opaque, and frustrating for both landlords and tenants.
                  </p>
                  <p>
                    Founded in 2020 by Adrian Okoro, a real estate veteran with over a decade of
                    experience, Ubani set out to bridge the gap between traditional property
                    management and modern technology solutions.
                  </p>
                  <p>
                    What started as a small team in Lagos has grown into Nigeria's leading property
                    management platform, serving thousands of properties and tens of thousands of
                    satisfied customers across major Nigerian cities.
                  </p>
                  <p>
                    Today, we're not just a property management company – we're a <span className="text-ubani-yellow font-semibold">technology-driven
                      platform</span> that's reshaping how Nigerians find, rent, and manage properties.
                  </p>
                </div>
              </div>
              <div className="relative group">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-ubani-yellow/10 rounded-3xl blur-2xl transform rotate-3 scale-105"></div>

                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"
                    alt="Modern building"
                    className="rounded-3xl shadow-2xl transform transition-transform duration-700 group-hover:scale-105 border border-ubani-yellow/20"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-ubani-yellow p-6 sm:p-8 rounded-2xl shadow-xl transform transition-all duration-500 group-hover:scale-105">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-ubani-black rounded-full flex items-center justify-center">
                        <FiUsers className="w-6 h-6 sm:w-7 sm:h-7 text-ubani-yellow" />
                      </div>
                      <div>
                        <p className="text-2xl sm:text-3xl font-bold text-ubani-black">10,000+</p>
                        <p className="text-sm text-ubani-black/80 font-medium">Happy Customers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mission & Values */}
          {activeTab === 'mission' && (
            <div className="space-y-16 sm:space-y-20">
              {/* Mission Statement */}
              <div className="text-center">
                <div className="mb-8">
                  <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-white/5 border border-ubani-yellow/30 shadow-sm">
                    <div className="w-2 h-2 bg-ubani-yellow rounded-full mr-3 animate-pulse"></div>
                    <span className="text-ubani-yellow font-semibold">Our Mission</span>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Making Property Management <span className="text-ubani-yellow">Simple & Efficient</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  To make property management in Nigeria simple, transparent, and efficient by
                  leveraging technology to connect landlords, tenants, and property professionals
                  in a seamless ecosystem.
                </p>
              </div>

              {/* Values */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12 sm:mb-16">Our Core Values</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                  {values.map((value, index) => (
                    <div key={index} className="group bg-[#1a1a1a] p-8 rounded-3xl hover:bg-[#222222] transition-all duration-300 text-center border border-white/10 hover:border-ubani-yellow/30 hover:scale-105 transform">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-ubani-yellow rounded-2xl flex items-center justify-center mx-auto mb-6 text-ubani-black transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                        {value.icon}
                      </div>
                      <h4 className="text-lg sm:text-xl font-semibold text-white mb-3 group-hover:text-ubani-yellow transition-colors">{value.title}</h4>
                      <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Team */}
          {activeTab === 'team' && (
            <div>
              <div className="text-center mb-16">
                <div className="mb-8">
                  <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-white/5 border border-ubani-yellow/30 shadow-sm">
                    <div className="w-2 h-2 bg-ubani-yellow rounded-full mr-3 animate-pulse"></div>
                    <span className="text-ubani-yellow font-semibold">The Team</span>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Meet Our <span className="text-ubani-yellow">Expert Team</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                  Our diverse team of experts brings together decades of experience in real estate,
                  technology, and customer service.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {teamMembers.map((member, index) => (
                  <div key={index} className="bg-[#1a1a1a] rounded-3xl hover:bg-[#222222] transition-all duration-300 overflow-hidden group border border-white/10 hover:border-ubani-yellow/30 hover:scale-105 transform">
                    <div className="relative overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-64 sm:h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <div className="flex space-x-3 justify-center">
                          <a href={member.linkedin} className="w-10 h-10 bg-ubani-yellow rounded-full flex items-center justify-center hover:bg-ubani-yellow/80 transition-colors">
                            <FiLinkedin className="w-5 h-5 text-ubani-black" />
                          </a>
                          <a href={member.twitter} className="w-10 h-10 bg-ubani-yellow rounded-full flex items-center justify-center hover:bg-ubani-yellow/80 transition-colors">
                            <FiTwitter className="w-5 h-5 text-ubani-black" />
                          </a>
                          <a href={`mailto:${member.email}`} className="w-10 h-10 bg-ubani-yellow rounded-full flex items-center justify-center hover:bg-ubani-yellow/80 transition-colors">
                            <FiMail className="w-5 h-5 text-ubani-black" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 group-hover:text-ubani-yellow transition-colors">{member.name}</h3>
                      <p className="text-ubani-yellow font-medium mb-3 text-sm">{member.role}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {activeTab === 'timeline' && (
            <div>
              <div className="text-center mb-16 sm:mb-20">
                <div className="mb-8">
                  <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-white/5 border border-ubani-yellow/30 shadow-sm">
                    <div className="w-2 h-2 bg-ubani-yellow rounded-full mr-3 animate-pulse"></div>
                    <span className="text-ubani-yellow font-semibold">Our Journey</span>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Our <span className="text-ubani-yellow">Growth Story</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                  From a small startup to Nigeria's leading property management platform.
                </p>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-ubani-yellow/50 via-ubani-yellow/30 to-ubani-yellow/10"></div>

                <div className="space-y-12 sm:space-y-16">
                  {milestones.map((milestone, index) => (
                    <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      {/* Timeline dot */}
                      <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 bg-ubani-yellow rounded-full border-4 border-ubani-black shadow-xl z-10 animate-pulse"></div>

                      {/* Content */}
                      <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 lg:pr-16' : 'md:pl-12 lg:pl-16'}`}>
                        <div className="group bg-[#1a1a1a] p-6 sm:p-8 rounded-3xl hover:bg-[#222222] transition-all duration-300 border border-white/10 hover:border-ubani-yellow/30 hover:scale-105 transform">
                          <div className="text-ubani-yellow font-bold text-xl sm:text-2xl mb-3">{milestone.year}</div>
                          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 group-hover:text-ubani-yellow transition-colors">{milestone.title}</h3>
                          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">{milestone.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </PageContainer>
      </div>

      {/* CTA Section */}
      <div className="bg-ubani-yellow relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-ubani-black/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-ubani-black/5 rounded-full blur-3xl"></div>

        <PageContainer noPaddingTop>
          <div className="text-center py-16 sm:py-20 lg:py-24 relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-ubani-black leading-tight">
              Ready to Experience the <br className="hidden sm:block" />
              <span className="text-ubani-black">Ubani Difference?</span>
            </h2>
            <p className="text-lg sm:text-xl text-ubani-black/80 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who have made Ubani their trusted property partner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <a
                href="/properties"
                className="group inline-flex items-center justify-center bg-ubani-black text-ubani-yellow px-8 py-4 rounded-full font-semibold hover:bg-ubani-black/90 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <span>Browse Properties</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center border-2 border-ubani-black text-ubani-black px-8 py-4 rounded-full font-semibold hover:bg-ubani-black hover:text-ubani-yellow transition-all duration-300 transform hover:scale-105"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}