// dwellio/models/Unit.js
import mongoose from 'mongoose';

const structureSchema = new mongoose.Schema({
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  toilets: { type: Number, required: true },
  kitchen: { type: Boolean, default: true },
  livingRoom: { type: Boolean, default: true },
  balcony: { type: Boolean, default: false },
  furnishing: {
    type: String,
    enum: ['fully', 'semi', 'none'],
    default: 'none'
  },
  sharedCompound: { type: Boolean, default: false },
  separateMeter: { type: Boolean, default: false },
  waterSource: { type: String, enum: ['borehole', 'tank', 'government'], default: 'borehole' },
  generatorAvailable: { type: Boolean, default: false },
  powerSupply: { type: String, enum: ['poor', 'fair', 'good', '24/7'], default: 'fair' },
  internetReady: { type: Boolean, default: false },
  accessibilityFriendly: { type: Boolean, default: false }
}, { _id: false });

const rentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  serviceCharge: { type: Number, default: 0 },
  frequency: { type: String, enum: ['monthly', 'quarterly', 'biannually', 'yearly'], required: true },
  deposit: { type: Number, default: 0 }
}, { _id: false });

const unitSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  unitCode: { type: String, required: true },
  structure: structureSchema,
  rent: rentSchema,
  availableFrom: { type: Date, required: true },
  isOccupied: { type: Boolean, default: false },
  assignedTenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  autoRenewEnabled: { type: Boolean, default: false },
  lastMaintained: { type: Date },
  meterInfo: {
    type: String,
    enum: ['separate', 'shared', 'unknown'],
    default: 'unknown'
  },
  unitDocs: [String],
  customTerms: { type: String },
  status: {
    type: String,
    enum: ['active', 'vacant', 'pendingEviction', 'unlisted'],
    default: 'vacant'
  }
}, { timestamps: true });

const Unit = mongoose.model('Unit', unitSchema);
export default Unit;
