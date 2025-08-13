import { useState } from 'react';
import Navbar from '../components/Navbar';
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
      bio: "With over 10 years in real estate and technology, Adrian founded Dwellio to revolutionize property management in Nigeria.",
      linkedin: "#",
      twitter: "#",
      email: "adrian@dwellio.com"
    },
    {
      name: "Kemi Adebayo",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=400&h=400&fit=crop&crop=face",
      bio: "Kemi brings 8 years of operational excellence from leading property management firms across Lagos and Abuja.",
      linkedin: "#",
      twitter: "#",
      email: "kemi@dwellio.com"
    },
    {
      name: "Chidi Okafor",
      role: "Head of Technology",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Former software architect at top fintech companies, Chidi leads our technical innovation and platform development.",
      linkedin: "#",
      twitter: "#",
      email: "chidi@dwellio.com"
    },
    {
      name: "Amina Hassan",
      role: "Head of Customer Success",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Amina ensures our clients receive exceptional service and support throughout their property journey.",
      linkedin: "#",
      twitter: "#",
      email: "amina@dwellio.com"
    }
  ];

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "Dwellio was established with a vision to simplify property management in Nigeria."
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
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-dwellio-600 to-dwellio-800 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                About <span className="text-yellow-400">Dwellio</span>
              </h1>
              <p className="text-xl md:text-2xl text-dwellio-100 max-w-3xl mx-auto leading-relaxed">
                We're revolutionizing property management in Nigeria, making it simple, 
                transparent, and efficient for everyone.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {[
                { key: 'story', label: 'Our Story', icon: <FiUsers className="w-4 h-4" /> },
                { key: 'mission', label: 'Mission & Values', icon: <FiTarget className="w-4 h-4" /> },
                { key: 'team', label: 'Our Team', icon: <FiHeart className="w-4 h-4" /> },
                { key: 'timeline', label: 'Our Journey', icon: <FiTrendingUp className="w-4 h-4" /> }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-dwellio-600 text-dwellio-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Our Story */}
          {activeTab === 'story' && (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Dwellio was born from a simple observation: property management in Nigeria was 
                    unnecessarily complex, opaque, and frustrating for both landlords and tenants.
                  </p>
                  <p>
                    Founded in 2020 by Adrian Okoro, a real estate veteran with over a decade of 
                    experience, Dwellio set out to bridge the gap between traditional property 
                    management and modern technology solutions.
                  </p>
                  <p>
                    What started as a small team in Lagos has grown into Nigeria's leading property 
                    management platform, serving thousands of properties and tens of thousands of 
                    satisfied customers across major Nigerian cities.
                  </p>
                  <p>
                    Today, we're not just a property management company – we're a technology-driven 
                    platform that's reshaping how Nigerians find, rent, and manage properties.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"
                  alt="Modern building"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-dwellio-600 rounded-full flex items-center justify-center">
                      <FiUsers className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">10,000+</p>
                      <p className="text-sm text-gray-600">Happy Customers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mission & Values */}
          {activeTab === 'mission' && (
            <div className="space-y-16">
              {/* Mission Statement */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  To make property management in Nigeria simple, transparent, and efficient by 
                  leveraging technology to connect landlords, tenants, and property professionals 
                  in a seamless ecosystem.
                </p>
              </div>

              {/* Values */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">Our Core Values</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {values.map((value, index) => (
                    <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow text-center">
                      <div className="w-16 h-16 bg-dwellio-100 rounded-full flex items-center justify-center mx-auto mb-4 text-dwellio-600">
                        {value.icon}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our diverse team of experts brings together decades of experience in real estate, 
                  technology, and customer service.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                    <div className="relative">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex space-x-3">
                          <a href={member.linkedin} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                            <FiLinkedin className="w-4 h-4" />
                          </a>
                          <a href={member.twitter} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                            <FiTwitter className="w-4 h-4" />
                          </a>
                          <a href={`mailto:${member.email}`} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                            <FiMail className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-dwellio-600 font-medium mb-3">{member.role}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {activeTab === 'timeline' && (
            <div>
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Journey</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  From a small startup to Nigeria's leading property management platform.
                </p>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-dwellio-200"></div>

                <div className="space-y-12">
                  {milestones.map((milestone, index) => (
                    <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      {/* Timeline dot */}
                      <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-dwellio-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                      
                      {/* Content */}
                      <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                          <div className="text-dwellio-600 font-bold text-lg mb-2">{milestone.year}</div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">{milestone.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-dwellio-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Experience the Dwellio Difference?</h2>
              <p className="text-xl text-dwellio-100 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who have made Dwellio their trusted property partner.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/properties"
                  className="bg-white text-dwellio-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  Browse Properties
                </a>
                <a
                  href="/contact"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-dwellio-600 transition-colors"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}