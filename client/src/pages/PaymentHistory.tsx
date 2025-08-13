import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { paymentApi } from '../services/api';
import { FaCreditCard, FaCalendarAlt, FaCheck, FaClock, FaTimes, FaDownload, FaReceipt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import type { Payment } from '../types';

interface PaymentHistoryItem extends Payment {
  type: 'rent' | 'deposit' | 'service_fee' | 'application_fee';
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: 'card' | 'bank_transfer' | 'cash';
  description: string;
  propertyTitle?: string;
}

export default function PaymentHistory() {
  useAuth();
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [dateRange, setDateRange] = useState<'all' | '30' | '90' | '365'>('all');

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        
        // Fetch real payment history from API
        const response = await paymentApi.getPaymentHistory({ page: 1, limit: 50 });
        
        if (response.success && response.data && Array.isArray(response.data.payments)) {
          // Transform API data to match component interface
          const transformedPayments: PaymentHistoryItem[] = response.data.payments.map((payment: Payment & {
            description?: string;
            property?: { title?: string };
            date?: string;
          }) => ({
            _id: payment._id || payment.reference,
            amount: payment.amount,
            paymentType: payment.paymentType,
            type: payment.paymentType as 'rent' | 'deposit' | 'service_fee' | 'application_fee',
            status: payment.status as 'completed' | 'pending' | 'failed',
            paymentMethod: 'card', // Default since Paystack primarily uses cards
            reference: payment.reference,
            description: payment.description || 'Payment transaction',
            propertyTitle: payment.property?.title,
            createdAt: payment.date || payment.createdAt,
            updatedAt: payment.date || payment.updatedAt
          }));
          
          setPayments(transformedPayments);
        }
      } catch (error) {
        console.error('Failed to load payment history:', error);
        toast.error('Failed to load payment history');
        // Set empty array if API fails
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FaCheck className="text-green-600" />;
      case 'pending':
        return <FaClock className="text-yellow-600" />;
      case 'failed':
        return <FaTimes className="text-red-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'rent':
        return 'Rent Payment';
      case 'deposit':
        return 'Security Deposit';
      case 'service_fee':
        return 'Service Fee';
      case 'application_fee':
        return 'Application Fee';
      default:
        return type;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <FaCreditCard className="text-blue-600" />;
      case 'bank_transfer':
        return <FaReceipt className="text-green-600" />;
      case 'cash':
        return <span className="text-gray-600">💵</span>;
      default:
        return <FaCreditCard className="text-gray-600" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter !== 'all' && payment.status !== filter) return false;
    
    if (dateRange !== 'all') {
      const paymentDate = new Date(payment.createdAt);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(dateRange));
      if (paymentDate < cutoffDate) return false;
    }
    
    return true;
  });

  const totalAmount = filteredPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const handleDownloadReceipt = () => {
    // Mock receipt download - replace with actual implementation
    toast.info('Receipt download feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaCreditCard className="text-4xl text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
              <p className="text-gray-600">Track all your payments and transactions</p>
            </div>
            <Link
              to="/dashboard"
              className="text-primary-700 hover:text-primary-800 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaCheck className="text-green-700" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">₦{totalAmount.toLocaleString()}</p>
                <p className="text-gray-600">Total Paid</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaCreditCard className="text-blue-700" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{filteredPayments.length}</p>
                <p className="text-gray-600">Total Transactions</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FaClock className="text-yellow-700" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {filteredPayments.filter(p => p.status === 'pending').length}
                </p>
                <p className="text-gray-600">Pending</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaTimes className="text-red-700" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {filteredPayments.filter(p => p.status === 'failed').length}
                </p>
                <p className="text-gray-600">Failed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'completed' | 'pending' | 'failed')}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as 'all' | '30' | '90' | '365')}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last Year</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Payments List */}
        {filteredPayments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaCreditCard className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600">No payments match your current filters.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map(payment => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {getPaymentTypeLabel(payment.type)}
                          </div>
                          <div className="text-sm text-gray-500">{payment.description}</div>
                          {payment.propertyTitle && (
                            <div className="text-xs text-gray-400">{payment.propertyTitle}</div>
                          )}
                          <div className="text-xs text-gray-400">Ref: {payment.reference}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₦{payment.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <span className="ml-2 text-sm text-gray-900 capitalize">
                            {payment.paymentMethod.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">{payment.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(payment.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {payment.status === 'completed' && (
                          <button
                            onClick={handleDownloadReceipt}
                            className="text-primary-600 hover:text-primary-900 flex items-center"
                          >
                            <FaDownload className="mr-1" />
                            Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}