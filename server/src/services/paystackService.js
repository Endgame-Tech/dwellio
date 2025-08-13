import axios from 'axios';

class PaystackService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY;
    this.baseURL = 'https://api.paystack.co';
    
    if (!this.secretKey) {
      console.warn('PAYSTACK_SECRET_KEY not found in environment variables');
    }
  }

  // Initialize a transaction
  async initializeTransaction(data) {
    try {
      const response = await axios.post(
        `${this.baseURL}/transaction/initialize`,
        {
          email: data.email,
          amount: data.amount * 100, // Convert to kobo
          currency: 'NGN',
          reference: data.reference,
          callback_url: data.callback_url,
          metadata: {
            custom_fields: [
              {
                display_name: "User ID",
                variable_name: "user_id",
                value: data.userId
              },
              {
                display_name: "Payment Type",
                variable_name: "payment_type", 
                value: data.paymentType
              },
              {
                display_name: "Property ID",
                variable_name: "property_id",
                value: data.propertyId || ''
              }
            ]
          }
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Paystack initialization error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Payment initialization failed'
      };
    }
  }

  // Verify a transaction
  async verifyTransaction(reference) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        }
      );

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Paystack verification error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Payment verification failed'
      };
    }
  }

  // Create a customer
  async createCustomer(customerData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/customer`,
        {
          email: customerData.email,
          first_name: customerData.firstName,
          last_name: customerData.lastName,
          phone: customerData.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Paystack customer creation error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Customer creation failed'
      };
    }
  }

  // Get banks for transfer
  async getBanks() {
    try {
      const response = await axios.get(
        `${this.baseURL}/bank`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        }
      );

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Paystack banks fetch error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch banks'
      };
    }
  }

  // Generate payment reference
  generateReference(prefix = 'DWL') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  }

  // Calculate facilitation fee (example: 5% of annual rent or minimum ₦50,000)
  calculateFacilitationFee(annualRent) {
    const percentage = 0.05; // 5%
    const minimumFee = 50000; // ₦50,000
    const calculatedFee = annualRent * percentage;
    return Math.max(calculatedFee, minimumFee);
  }
}

export default new PaystackService();