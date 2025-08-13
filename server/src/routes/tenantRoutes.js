// dwellio/routes/tenantRoutes.js
import express from "express";
import {
  getTenantProfile,
  updateTenantProfile,
  uploadVerificationDocument,
  submitMoveOutIntent,
  getTenantDashboardStats,
  uploadHouseImage,
  deleteHouseImage,
  updateCreditHistory,
  getScores,
  verifyDocument,
  requestMoveOutFacilitation,
  getRecentActivities,
  getDashboardSummary,
  uploadProfilePhoto,
} from "../controllers/tenantController.js";
import { requireAuth } from "../controllers/authController.js";
import { uploadSingleFile } from "../middleware/upload.js";
import { uploadSingleImage } from "../middleware/houseImageUpload.js";

const router = express.Router();

// All tenant routes require authentication
router.use(requireAuth);

// Profile management
router.get("/profile", getTenantProfile);
router.put("/profile", updateTenantProfile);
router.post("/profile/photo", uploadSingleImage, uploadProfilePhoto);

// Document upload
router.post("/documents", uploadSingleFile, uploadVerificationDocument);

// Move-out intent
router.post("/move-out-intent", submitMoveOutIntent);

// Dashboard stats
router.get("/dashboard/stats", getTenantDashboardStats);
router.get("/dashboard/activities", getRecentActivities);
router.get("/dashboard/summary", getDashboardSummary);

// House image management
router.post("/house-images", uploadSingleImage, uploadHouseImage);
router.delete("/house-images/:imageId", deleteHouseImage);

// Credit and verification
router.put("/credit-history", updateCreditHistory);
router.get("/scores", getScores);
router.post("/verify-document", verifyDocument); // Admin only - should add admin middleware
router.post("/move-out-facilitation", requestMoveOutFacilitation);

export default router;
