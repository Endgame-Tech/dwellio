import User from '../models/User.js';
import Property from '../models/Property.js';
import paystackService from '../services/paystackService.js';
import crypto from 'crypto';

// Initialize payment for facilitation fee
const initializeFacilitationPayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { propertyId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already has an active facilitation payment
    if (user.tenantProfile?.moveOutIntent?.facilitationPayment?.status === 'completed') {
      return res.status(400).json({ 
        message: 'Facilitation fee already paid',
        code: 'ALREADY_PAID'
      });
    }

    let facilitationFee = 50000; // Default ₦50,000

    // If applying for a specific property, calculate based on that property
    if (propertyId) {
      const property = await Property.findById(propertyId);
      if (property) {
        const annualRent = property.rent.amount * (property.rent.period === 'monthly' ? 12 : 1);
        facilitationFee = paystackService.calculateFacilitationFee(annualRent);
      }
    }

    const reference = paystackService.generateReference('FAC');
    
    const paymentData = {
      email: user.email,
      amount: facilitationFee,
      reference: reference,
      userId: userId,
      paymentType: 'facilitation_fee',
      propertyId: propertyId,
      callback_url: `${process.env.CLIENT_URL}/payment/callback`
    };

    const paymentResult = await paystackService.initializeTransaction(paymentData);

    if (!paymentResult.success) {
      return res.status(400).json({ 
        message: 'Failed to initialize payment',
        error: paymentResult.error
      });
    }

    // Store payment reference in user profile
    await User.findByIdAndUpdate(userId, {
      'tenantProfile.moveOutIntent.facilitationPayment': {
        reference: reference,
        amount: facilitationFee,
        status: 'pending',
        initiatedAt: new Date(),
        propertyId: propertyId
      }
    });

    res.json({
      success: true,
      data: {
        authorization_url: paymentResult.data.authorization_url,
        access_code: paymentResult.data.access_code,
        reference: reference,
        amount: facilitationFee
      }
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verify payment callback
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const verificationResult = await paystackService.verifyTransaction(reference);

    if (!verificationResult.success) {
      return res.status(400).json({ 
        message: 'Payment verification failed',
        error: verificationResult.error
      });
    }

    const paymentData = verificationResult.data;

    if (paymentData.status !== 'success') {
      return res.status(400).json({ 
        message: 'Payment was not successful',
        status: paymentData.status
      });
    }

    // Extract metadata
    const metadata = paymentData.metadata;
    const userId = metadata.custom_fields.find(field => field.variable_name === 'user_id')?.value;
    const paymentType = metadata.custom_fields.find(field => field.variable_name === 'payment_type')?.value;
    const propertyId = metadata.custom_fields.find(field => field.variable_name === 'property_id')?.value;

    if (!userId) {
      return res.status(400).json({ message: 'Invalid payment metadata' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update payment status based on type
    if (paymentType === 'facilitation_fee') {
      await User.findByIdAndUpdate(userId, {
        'tenantProfile.moveOutIntent.facilitationPayment.status': 'completed',
        'tenantProfile.moveOutIntent.facilitationPayment.completedAt': new Date(),
        'tenantProfile.moveOutIntent.facilitationPayment.paystackData': {
          id: paymentData.id,
          reference: paymentData.reference,
          amount: paymentData.amount / 100, // Convert from kobo
          currency: paymentData.currency,
          transaction_date: paymentData.transaction_date
        },
        'tenantProfile.moveOutIntent.facilitationRequested': true,
        'tenantProfile.moveOutIntent.status': 'active'
      });

      // Add to payment history
      await User.findByIdAndUpdate(userId, {
        $push: {
          'tenantProfile.paymentHistory': {
            type: 'facilitation_fee',
            amount: paymentData.amount / 100,
            reference: paymentData.reference,
            status: 'completed',
            date: new Date(),
            description: 'Property Application Facilitation Fee',
            propertyId: propertyId,
            paystackData: paymentData
          }
        }
      });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        reference: paymentData.reference,
        amount: paymentData.amount / 100,
        status: paymentData.status,
        paymentType: paymentType
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user payment history
const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const paymentHistory = user.tenantProfile?.paymentHistory || [];
    
    // Sort by date (newest first)
    const sortedHistory = paymentHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedHistory = sortedHistory.slice(startIndex, endIndex);

    // Get property details for payments that have propertyId
    const enrichedHistory = await Promise.all(
      paginatedHistory.map(async (payment) => {
        if (payment.propertyId) {
          const property = await Property.findById(payment.propertyId).select('title location images');
          return {
            ...payment.toObject(),
            property: property
          };
        }
        return payment.toObject();
      })
    );

    res.json({
      success: true,
      data: {
        payments: enrichedHistory,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(paymentHistory.length / limit),
          totalItems: paymentHistory.length,
          hasNextPage: endIndex < paymentHistory.length,
          hasPreviousPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const facilitationPayment = user.tenantProfile?.moveOutIntent?.facilitationPayment;
    const hasActiveFacilitation = facilitationPayment?.status === 'completed';

    res.json({
      success: true,
      data: {
        facilitationFee: {
          paid: hasActiveFacilitation,
          amount: facilitationPayment?.amount || null,
          paidAt: facilitationPayment?.completedAt || null,
          reference: facilitationPayment?.reference || null
        },
        canApplyToProperties: hasActiveFacilitation
      }
    });

  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Paystack webhook handler
const handleWebhook = async (req, res) => {
  try {
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      // Handle successful payment
      const reference = event.data.reference;
      await verifyPayment({ params: { reference } }, res);
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};

export {
  initializeFacilitationPayment,
  verifyPayment,
  getPaymentHistory,
  getPaymentStatus,
  handleWebhook
};