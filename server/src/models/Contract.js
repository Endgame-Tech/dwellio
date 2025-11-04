// ubani/models/Contract.js
import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Unit",
    required: true,
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Referral tracking
  referralId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Referral",
    default: null,
  },
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // Person who gets commission
  },
  // Contract terms
  rentAmount: {
    type: Number,
    required: true,
  },
  deposit: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true, // in months
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["draft", "active", "expired", "terminated", "renewed"],
    default: "draft",
  },
  terms: {
    type: String,
    required: true,
  },
  // Commission details
  hasReferralCommission: {
    type: Boolean,
    default: false,
  },
  commissionRate: {
    type: Number,
    default: 5.0,
  },
  commissionAmount: {
    type: Number,
    default: 0,
  },
  commissionPaid: {
    type: Boolean,
    default: false,
  },
  signedAt: {
    type: Date,
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

contractSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Calculate commission if referral exists
  if (this.referralId && !this.commissionPaid) {
    this.hasReferralCommission = true;
    this.commissionAmount = (this.rentAmount * this.commissionRate) / 100;
  }

  next();
});

const Contract = mongoose.model("Contract", contractSchema);
export default Contract;
