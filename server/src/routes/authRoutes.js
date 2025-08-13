import express from 'express';
import {
  signup,
  login,
  getMe,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword,
  requestEmailVerification,
  verifyEmail,
  requireAuth,
  requireRole
} from '../controllers/authController.js';

const router = express.Router();

// Signup
router.post('/signup', signup);
// Login
router.post('/login', login);
// Get current user profile
router.get('/me', requireAuth, getMe);
// Update profile
router.put('/me', requireAuth, updateProfile);
// Change password
router.post('/change-password', requireAuth, changePassword);
// Password reset (request and reset)
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
// Email verification (request and verify)
router.post('/request-email-verification', requireAuth, requestEmailVerification);
router.post('/verify-email', verifyEmail);

// Only allow admins to access this route
router.get('/admin-only', requireAuth, requireRole('admin'), (req, res) => res.send('Admin content'));

export default router;
