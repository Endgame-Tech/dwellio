// ubani/routes/propertyRoutes.js
import express from "express";
import {
  getCuratedProperties,
  getPropertyById,
  submitApplication,
  getMyApplications,
  withdrawApplication,
  checkMoveOutEligibility,
  getPropertyAreas,
} from "../controllers/propertyController.js";
import { requireAuth } from "../controllers/authController.js";

const router = express.Router();

// Public routes - Anyone can browse properties
router.get("/areas", getPropertyAreas); // Get available areas and property types
router.get("/", getCuratedProperties); // Get curated properties (public access)
router.get("/:id", getPropertyById); // Get single property (public access)

// Protected routes - Require authentication
router.get("/eligibility", requireAuth, checkMoveOutEligibility); // Check if user can view properties
router.post("/:propertyId/apply", requireAuth, submitApplication); // Submit application
router.get("/applications/my", requireAuth, getMyApplications); // Get my applications
router.put(
  "/applications/:applicationId/withdraw",
  requireAuth,
  withdrawApplication
); // Withdraw application

export default router;
