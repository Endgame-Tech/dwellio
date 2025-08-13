// dwellio/models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: true
  },
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  },
  // Referral system integration
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  referralId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Referral',
    default: null // Set if this payment triggers a commission
  },
  amount: {
    type: Number,
    required: true
  },
  // Platform and commission breakdown
  platformFee: {
    type: Number,
    default: 0 // Platform fee amount
  },
  commissionAmount: {
    type: Number,
    default: 0 // Commission amount for referrer
  },
  landlordAmount: {
    type: Number,
    required: true // Amount going to landlord
  },
  type: {
    type: String,
    enum: ['rent', 'deposit', 'service_charge', 'loan_repay'],
    required: true
  },
  method: {
    type: String,
    enum: ['card', 'transfer', 'wallet'],
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'pending'
  },
  referenceId: {
    type: String,
    required: true,
    unique: true
  },
  receiptUrl: { type: String },
  paidAt: { type: Date },
  // Commission processing flags
  commissionProcessed: {
    type: Boolean,
    default: false
  },
  commissionProcessedAt: {
    type: Date,
    default: null
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
