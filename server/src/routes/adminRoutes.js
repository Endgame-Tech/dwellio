import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserStatus,
  getAllProperties,
  approveProperty,
  getAllApplications,
  getChartData,
  getSystemSettings
} from '../controllers/adminController.js';
import {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  requireAdminAuth,
  requireAdminPermission,
  createAdminUser
} from '../controllers/adminAuthController.js';

const router = express.Router();

// Public admin routes (no authentication required)
router.post('/auth/login', adminLogin);

// Protected admin routes (require admin authentication)
router.use(requireAdminAuth);

// Admin profile routes
router.get('/auth/profile', getAdminProfile);
router.put('/auth/profile', updateAdminProfile);
router.post('/auth/change-password', changeAdminPassword);

// Dashboard routes
router.get('/dashboard/stats', requireAdminPermission('analytics', 'read'), getDashboardStats);
router.get('/charts/:type', requireAdminPermission('analytics', 'read'), getChartData);

// User management routes (regular users only, excludes admins)
router.get('/users', requireAdminPermission('users', 'read'), getAllUsers);
router.get('/users/:id', requireAdminPermission('users', 'read'), getUserById);
router.put('/users/:id/status', requireAdminPermission('users', 'update'), updateUserStatus);

// Admin user management routes (separate from regular users)
router.post('/admin-users', requireAdminPermission('admin_management', 'create'), createAdminUser);

// Property management routes
router.get('/properties', requireAdminPermission('properties', 'read'), getAllProperties);
router.put('/properties/:id/approve', requireAdminPermission('properties', 'update'), approveProperty);


// Application management routes
router.get('/applications', requireAdminPermission('applications', 'read'), getAllApplications);

// Settings routes
router.get('/settings', requireAdminPermission('settings', 'read'), getSystemSettings);

export default router;