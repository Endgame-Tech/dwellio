import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserStatus,
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  approveProperty,
  rejectProperty,
  duplicateProperty,
  deleteProperty,
  getAllApplications,
  getChartData,
  getSystemSettings,
} from "../controllers/landlordController.js";
import {
  landlordLogin,
  getLandlordProfile,
  updateLandlordProfile,
  changeLandlordPassword,
  requireLandlordAuth,
  requireLandlordPermission,
  createLandlordUser,
} from "../controllers/landlordAuthController.js";

const router = express.Router();

// Public landlord routes (no authentication required)
router.post("/auth/login", landlordLogin);

// Protected landlord routes (require landlord authentication)
router.use(requireLandlordAuth);

// Landlord profile routes
router.get("/auth/profile", getLandlordProfile);
router.put("/auth/profile", updateLandlordProfile);
router.post("/auth/change-password", changeLandlordPassword);

// Dashboard routes
router.get(
  "/dashboard/stats",
  requireLandlordPermission("analytics", "read"),
  getDashboardStats
);
router.get(
  "/charts/:type",
  requireLandlordPermission("analytics", "read"),
  getChartData
);

// User management routes (regular users only, excludes landlords)
router.get("/users", requireLandlordPermission("users", "read"), getAllUsers);
router.get(
  "/users/:id",
  requireLandlordPermission("users", "read"),
  getUserById
);
router.put(
  "/users/:id/status",
  requireLandlordPermission("users", "update"),
  updateUserStatus
);

// Landlord user management routes (separate from regular users)
router.post(
  "/landlord-users",
  requireLandlordPermission("landlord_management", "create"),
  createLandlordUser
);

// Property management routes
router.get(
  "/properties",
  requireLandlordPermission("properties", "read"),
  getAllProperties
);
router.get(
  "/properties/:id",
  requireLandlordPermission("properties", "read"),
  getProperty
);
router.post(
  "/properties",
  requireLandlordPermission("properties", "create"),
  createProperty
);
router.put(
  "/properties/:id",
  requireLandlordPermission("properties", "update"),
  updateProperty
);
router.put(
  "/properties/:id/approve",
  requireLandlordPermission("properties", "update"),
  approveProperty
);
router.put(
  "/properties/:id/reject",
  requireLandlordPermission("properties", "update"),
  rejectProperty
);
router.post(
  "/properties/:id/duplicate",
  requireLandlordPermission("properties", "create"),
  duplicateProperty
);
router.delete(
  "/properties/:id",
  requireLandlordPermission("properties", "delete"),
  deleteProperty
);

// Application management routes
router.get(
  "/applications",
  requireLandlordPermission("applications", "read"),
  getAllApplications
);

// Settings routes
router.get(
  "/settings",
  requireLandlordPermission("settings", "read"),
  getSystemSettings
);

export default router;
