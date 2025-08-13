import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Helper: Generate JWT for admin
const generateAdminToken = (admin) => {
  const jwtSecret = process.env.JWT_SECRET;
  return jwt.sign(
    { 
      adminId: admin._id, 
      email: admin.email, 
      adminRole: admin.adminRole,
      isAdmin: true // Flag to distinguish from regular user tokens
    },
    jwtSecret,
    { expiresIn: '8h' } // Shorter session for security
  );
};

// Helper: Get default permissions based on admin role
const getDefaultPermissions = (adminRole) => {
  const permissionSets = {
    super_admin: [
      { resource: 'users', actions: ['create', 'read', 'update', 'delete', 'export'] },
      { resource: 'properties', actions: ['create', 'read', 'update', 'delete', 'approve', 'export'] },
      { resource: 'applications', actions: ['create', 'read', 'update', 'delete', 'approve', 'export'] },
      { resource: 'payments', actions: ['read', 'update', 'export'] },
      { resource: 'analytics', actions: ['read', 'export'] },
      { resource: 'settings', actions: ['read', 'update'] },
      { resource: 'system_logs', actions: ['read', 'export'] },
      { resource: 'reports', actions: ['read', 'create', 'export'] }
    ],
    admin: [
      { resource: 'users', actions: ['read', 'update'] },
      { resource: 'properties', actions: ['read', 'update', 'approve'] },
      { resource: 'applications', actions: ['read', 'update', 'approve'] },
      { resource: 'payments', actions: ['read'] },
      { resource: 'analytics', actions: ['read'] },
      { resource: 'reports', actions: ['read'] }
    ],
    moderator: [
      { resource: 'users', actions: ['read', 'update'] },
      { resource: 'properties', actions: ['read'] },
      { resource: 'applications', actions: ['read'] },
      { resource: 'analytics', actions: ['read'] }
    ],
    analyst: [
      { resource: 'users', actions: ['read'] },
      { resource: 'properties', actions: ['read'] },
      { resource: 'applications', actions: ['read'] },
      { resource: 'payments', actions: ['read'] },
      { resource: 'analytics', actions: ['read', 'export'] },
      { resource: 'reports', actions: ['read', 'create', 'export'] }
    ]
  };

  return permissionSets[adminRole] || [];
};

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required.' 
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ 
      email: email.toLowerCase(),
      'security.isActive': true 
    });

    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid admin credentials.' 
      });
    }

    // Check if account is locked
    if (admin.isLocked()) {
      return res.status(423).json({ 
        success: false,
        message: 'Account temporarily locked due to too many failed login attempts.' 
      });
    }

    // Check if admin is verified
    if (!admin.security.isVerified) {
      return res.status(403).json({ 
        success: false,
        message: 'Admin account not verified. Contact Alpha Administrator.' 
      });
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      await admin.incrementLoginAttempts();
      return res.status(401).json({ 
        success: false,
        message: 'Invalid admin credentials.' 
      });
    }

    // Reset login attempts on successful login
    await admin.resetLoginAttempts();

    // Update last login
    admin.security.lastLogin = new Date();
    admin.security.sessionToken = crypto.randomBytes(32).toString('hex');
    await admin.save();

    // Log login activity
    await admin.logActivity('login', 'auth', null, 'Successful admin login', req);

    // Generate token
    const token = generateAdminToken(admin);

    // Prepare safe admin object for response
    const adminResponse = {
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      fullName: admin.fullName,
      email: admin.email,
      adminRole: admin.adminRole,
      permissions: admin.permissions,
      profile: admin.profile,
      lastLogin: admin.security.lastLogin
    };

    res.json({
      success: true,
      token,
      user: adminResponse, // Keep 'user' key for compatibility with frontend
      message: 'Admin login successful'
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.adminId)
      .select('-password -security.twoFactorSecret -security.sessionToken')
      .populate('audit.createdBy', 'firstName lastName email adminRole');

    if (!admin) {
      return res.status(404).json({ 
        success: false,
        message: 'Admin not found' 
      });
    }

    res.json({
      success: true,
      user: admin // Keep 'user' key for compatibility with frontend
    });

  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch admin profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update Admin Profile
export const updateAdminProfile = async (req, res) => {
  try {
    const { firstName, lastName, profile } = req.body;
    const adminId = req.admin.adminId;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (profile) updateData.profile = { ...updateData.profile, ...profile };
    
    updateData['audit.lastModifiedBy'] = adminId;
    updateData['audit.lastModifiedAt'] = new Date();

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      { $set: updateData },
      { new: true, select: '-password -security.twoFactorSecret -security.sessionToken' }
    );

    if (!admin) {
      return res.status(404).json({ 
        success: false,
        message: 'Admin not found' 
      });
    }

    // Log profile update activity
    await admin.logActivity('update', 'admin_profile', adminId, 'Profile updated', req);

    res.json({
      success: true,
      user: admin,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update admin profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Change Admin Password
export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.adminId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Current password and new password are required' 
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false,
        message: 'New password must be at least 8 characters long' 
      });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ 
        success: false,
        message: 'Admin not found' 
      });
    }

    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }

    // Update password
    admin.password = newPassword;
    admin.audit.lastModifiedBy = adminId;
    admin.audit.lastModifiedAt = new Date();
    await admin.save();

    // Log password change activity
    await admin.logActivity('update', 'admin_password', adminId, 'Password changed', req);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change admin password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to change password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Admin Middleware for Authentication
export const requireAdminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. No admin token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's an admin token
    if (!decoded.isAdmin) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.' 
      });
    }

    // Verify admin still exists and is active
    const admin = await Admin.findById(decoded.adminId);
    if (!admin || !admin.security.isActive || !admin.security.isVerified) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. Admin account inactive or not found.' 
      });
    }

    req.admin = decoded;
    req.adminDocument = admin;
    next();

  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Invalid admin token.' 
    });
  }
};

// Permission Middleware
export const requireAdminPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      const admin = req.adminDocument;
      
      if (!admin) {
        return res.status(401).json({ 
          success: false,
          message: 'Admin authentication required' 
        });
      }

      // Check permission
      if (!admin.hasPermission(resource, action)) {
        return res.status(403).json({ 
          success: false,
          message: `Access denied. Missing permission: ${action} on ${resource}` 
        });
      }

      next();
    } catch (error) {
      console.error('Admin permission middleware error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Permission check failed' 
      });
    }
  };
};

// Create Admin User (only for alpha_admin and super_admin)
export const createAdminUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, adminRole, permissions, profile } = req.body;
    const creatorAdminId = req.admin.adminId;
    const creator = req.adminDocument;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, email, and password are required'
      });
    }

    // Only alpha_admin can create super_admin, super_admin and alpha can create others
    if (adminRole === 'super_admin' && creator.adminRole !== 'alpha_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only Alpha Admin can create Super Admin accounts'
      });
    }

    if (adminRole === 'alpha_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot create another Alpha Admin account'
      });
    }

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Get default permissions for role
    const defaultPermissions = permissions || getDefaultPermissions(adminRole || 'admin');

    // Create admin
    const newAdmin = new Admin({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      adminRole: adminRole || 'admin',
      permissions: defaultPermissions,
      profile: {
        phoneNumber,
        ...profile
      },
      security: {
        isActive: true,
        isVerified: creator.adminRole === 'alpha_admin' || creator.adminRole === 'super_admin'
      },
      audit: {
        createdBy: creatorAdminId
      }
    });

    await newAdmin.save();

    // Log creation activity
    await creator.logActivity('create', 'admin_user', newAdmin._id, `Created ${adminRole || 'admin'} account`, req);

    // Return safe admin object
    const adminResponse = {
      _id: newAdmin._id,
      firstName: newAdmin.firstName,
      lastName: newAdmin.lastName,
      fullName: newAdmin.fullName,
      email: newAdmin.email,
      adminRole: newAdmin.adminRole,
      permissions: newAdmin.permissions,
      profile: newAdmin.profile,
      security: {
        isActive: newAdmin.security.isActive,
        isVerified: newAdmin.security.isVerified
      },
      audit: {
        createdBy: newAdmin.audit.createdBy,
        createdAt: newAdmin.audit.createdAt
      }
    };

    res.status(201).json({
      success: true,
      data: adminResponse,
      message: 'Admin user created successfully'
    });

  } catch (error) {
    console.error('Create admin user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};