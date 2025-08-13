// dwellio/routes/propertyRoutes.js
import express from 'express';
import {
  getCuratedProperties,
  getPropertyById,
  submitApplication,
  getMyApplications,
  withdrawApplication,
  checkMoveOutEligibility,
  getPropertyAreas
} from '../controllers/propertyController.js';
import { requireAuth } from '../controllers/authController.js';

const router = express.Router();

// Public routes for area information
router.get('/areas', getPropertyAreas); // Get available areas and property types

// Protected routes - Tenant actions (require move-out intent)
router.get('/eligibility', requireAuth, checkMoveOutEligibility); // Check if user can view properties
router.get('/', requireAuth, getCuratedProperties); // Get curated properties (requires move-out intent)
router.get('/:id', requireAuth, getPropertyById); // Get single property (requires move-out intent)
router.post('/:propertyId/apply', requireAuth, submitApplication); // Submit application
router.get('/applications/my', requireAuth, getMyApplications); // Get my applications
router.put('/applications/:applicationId/withdraw', requireAuth, withdrawApplication); // Withdraw application

export default router;
