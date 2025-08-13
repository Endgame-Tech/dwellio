import express from 'express';
import { requireAuth } from '../controllers/authController.js';
import {
  initializeFacilitationPayment,
  verifyPayment,
  getPaymentHistory,
  getPaymentStatus,
  handleWebhook
} from '../controllers/paymentController.js';

const router = express.Router();

// Initialize facilitation fee payment
router.post('/facilitation/initialize', requireAuth, initializeFacilitationPayment);

// Verify payment
router.get('/verify/:reference', requireAuth, verifyPayment);

// Get payment history
router.get('/history', requireAuth, getPaymentHistory);

// Get payment status
router.get('/status', requireAuth, getPaymentStatus);

// Paystack webhook (no auth required)
router.post('/webhook', handleWebhook);

export default router;