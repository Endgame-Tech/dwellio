// dwellio/models/Application.js
import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'approved', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  applicationData: {
    moveInDate: { type: Date, required: true },
    monthlyBudget: { type: Number, required: true },
    occupancy: { type: Number, required: true },
    tenantMessage: { type: String },
    urgency: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
  },
  landlordResponse: {
    message: { type: String },
    counterOffer: {
      rent: { type: Number },
      deposit: { type: Number },
      terms: { type: String }
    },
    decidedAt: { type: Date }
  },
  rejectionReason: { type: String },
  notes: { type: String },
  // Dwellio facilitation
  dwellioFacilitated: {
    type: Boolean,
    default: true
  },
  dwellioNotes: { type: String }
}, { timestamps: true });

// Indexes for efficient queries
applicationSchema.index({ tenantId: 1, status: 1 });
applicationSchema.index({ propertyId: 1, status: 1 });
applicationSchema.index({ landlordId: 1, status: 1 });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
