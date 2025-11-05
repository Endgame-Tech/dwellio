import { useState } from 'react';
import Navbar from '../components/Navbar';
import PageContainer from '../components/PageContainer';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiSend,
  FiUser,
  FiMessageSquare,
  FiHome,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiCheck
} from 'react-icons/fi';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    category: 'general',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        category: 'general',
        message: '',
        priority: 'normal'
      });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <FiPhone className="w-6 h-6" />,
      title: "Phone",
      details: ["+234 800 123 4567", "+234 801 234 5678"],
      description: "Mon-Fri 8AM-6PM, Sat 9AM-3PM"
    },
    {
      icon: <FiMail className="w-6 h-6" />,
      title: "Email",
      details: ["info@ubani.com", "support@ubani.com"],
      description: "We respond within 2 hours"
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: "Office",
      details: ["123 Victoria Island", "Lagos, Nigeria"],
      description: "Visit us for in-person consultations"
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Business Hours",
      details: ["Mon-Fri: 8:00 AM - 6:00 PM", "Sat: 9:00 AM - 3:00 PM"],
      description: "24/7 emergency support available"
    }
  ];

  const departments = [
    {
      name: "Sales",
      email: "sales@ubani.com",
      phone: "+234 800 123 4567",
      description: "New inquiries and partnerships"
    },
    {
      name: "Support",
      email: "support@ubani.com",
      phone: "+234 801 234 5678",
      description: "Technical support and assistance"
    },
    {
      name: "Property Management",
      email: "properties@ubani.com",
      phone: "+234 802 345 6789",
      description: "Property listings and management"
    },
    {
      name: "Finance",
      email: "finance@ubani.com",
      phone: "+234 803 456 7890",
      description: "Billing and payment inquiries"
    }
  ];

  const faqs = [
    {
      question: "How quickly do you respond to inquiries?",
      answer: "We typically respond to all inquiries within 2 hours during business hours, and within 24 hours on weekends."
    },
    {
      question: "Do you offer emergency support?",
      answer: "Yes, we provide 24/7 emergency support for urgent property-related issues for our managed properties."
    },
    {
      question: "Can I schedule a property viewing?",
      answer: "Absolutely! Contact our property team to schedule viewings at your convenience, including weekends."
    },
    {
      question: "What areas do you service?",
      answer: "We currently service Lagos, Abuja, Port Harcourt, and Kano, with plans to expand to more cities soon."
    }
  ];

  return (
    <div className="min-h-screen bg-ubani-black font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-ubani-black border-b border-white/10">
        <PageContainer className='noPaddingTop'>
          <div className="py-16 sm:py-20 lg:py-24 text-center">
            <h1 className="text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Get in <span className="text-ubani-yellow">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We're here to help with all your property management needs. Reach out to us today!
            </p>
          </div>
        </PageContainer>
      </div>

      {/* Contact Form and Info */}
      <div className="py-12 sm:py-16">
        <PageContainer className='noPaddingTop'>
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 p-8 sm:p-10">
                <div className="mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Send us a Message</h2>
                  <p className="text-gray-400 text-lg">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                        First Name *
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ubani-yellow w-5 h-5" />
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-12 pr-4 py-3 bg-ubani-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all"
                          placeholder="Enter your first name"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ubani-yellow w-5 h-5" />
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-12 pr-4 py-3 bg-ubani-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ubani-yellow w-5 h-5" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-12 pr-4 py-3 bg-ubani-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ubani-yellow w-5 h-5" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-ubani-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject and Category */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                        Category *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-ubani-black border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="sales">Sales</option>
                        <option value="support">Technical Support</option>
                        <option value="property">Property Management</option>
                        <option value="billing">Billing & Finance</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2">
                        Priority
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-ubani-black border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <div className="relative">
                      <FiMessageSquare className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ubani-yellow w-5 h-5" />
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-ubani-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all"
                        placeholder="Brief description of your inquiry"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-ubani-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-ubani-yellow focus:border-ubani-yellow transition-all resize-none"
                      placeholder="Please provide detailed information about your inquiry..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-ubani-yellow text-ubani-black py-4 rounded-full font-semibold hover:bg-ubani-yellow/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-xl flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-ubani-black"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Quick Contact Info */}
              <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-ubani-yellow/10 rounded-xl flex items-center justify-center text-ubani-yellow flex-shrink-0">
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{info.title}</h4>
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-gray-300 text-sm">{detail}</p>
                        ))}
                        <p className="text-xs text-gray-500 mt-1">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Follow Us</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: <FiFacebook className="w-5 h-5" />, name: "Facebook" },
                    { icon: <FiTwitter className="w-5 h-5" />, name: "Twitter" },
                    { icon: <FiInstagram className="w-5 h-5" />, name: "Instagram" },
                    { icon: <FiLinkedin className="w-5 h-5" />, name: "LinkedIn" }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className="bg-ubani-yellow/10 text-ubani-yellow border border-ubani-yellow/20 p-4 rounded-xl hover:bg-ubani-yellow hover:text-ubani-black transition-all transform hover:scale-105 flex items-center space-x-2"
                    >
                      {social.icon}
                      <span className="font-medium text-sm">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Departments */}
      <div className="py-12 sm:py-16 bg-ubani-black border-t border-white/10">
        <PageContainer>
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Contact by Department</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Reach out to the right team for faster assistance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <div key={index} className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/10 hover:border-ubani-yellow/30 hover:bg-[#222222] transition-all hover:scale-105 transform">
                <div className="w-12 h-12 bg-ubani-yellow/10 rounded-xl flex items-center justify-center text-ubani-yellow mb-4">
                  <FiHome className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{dept.name}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{dept.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FiMail className="w-4 h-4 text-ubani-yellow" />
                    <a href={`mailto:${dept.email}`} className="text-sm text-gray-300 hover:text-ubani-yellow transition-colors">
                      {dept.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiPhone className="w-4 h-4 text-ubani-yellow" />
                    <a href={`tel:${dept.phone}`} className="text-sm text-gray-300 hover:text-ubani-yellow transition-colors">
                      {dept.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </div>

      {/* FAQ Section */}
      <div className="py-12 sm:py-16 bg-ubani-black border-t border-white/10">
        <PageContainer>
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-[#1a1a1a] p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-ubani-yellow/30 transition-all">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-ubani-yellow/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <FiCheck className="w-5 h-5 text-ubani-yellow" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-3 text-lg">{faq.question}</h3>
                    <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </div>

      {/* Map Section (Placeholder) */}
      <div className="py-12 sm:py-16 bg-ubani-black border-t border-white/10">
        <PageContainer>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Visit Our Office</h2>
            <p className="text-xl text-gray-300">
              Schedule an appointment for in-person consultations
            </p>
          </div>

          <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-ubani-yellow/10 flex items-center justify-center mx-auto mb-6">
                <FiMapPin className="w-10 h-10 text-ubani-yellow" />
              </div>
              <p className="text-gray-300 text-lg font-medium mb-2">Interactive Map Coming Soon</p>
              <p className="text-gray-400">123 Victoria Island, Lagos, Nigeria</p>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
