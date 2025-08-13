// dwellio/models/Loan.js
import mongoose from 'mongoose';

const installmentSchema = new mongoose.Schema({
  dueDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  paid: { type: Boolean, default: false },
  paidAt: { type: Date }
}, { _id: false });

const loanSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  interest: {
    type: Number,
    required: true // as percentage
  },
  totalRepayable: {
    type: Number,
    required: true
  },
  installments: [installmentSchema],
  status: {
    type: String,
    enum: ['active', 'repaid', 'defaulted'],
    default: 'active'
  },
  approvedAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

loanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Loan = mongoose.model('Loan', loanSchema);
export default Loan;
