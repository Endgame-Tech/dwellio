import Landlord from "../models/Landlord.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Helper: Generate JWT for landlord
const generateLandlordToken = (landlord) => {
  const jwtSecret = process.env.JWT_SECRET;
  return jwt.sign(
    {
      landlordId: landlord._id,
      email: landlord.email,
      landlordRole: landlord.landlordRole,
      isLandlord: true, // Flag to distinguish from regular user tokens
    },
    jwtSecret,
    { expiresIn: "8h" } // Shorter session for security
  );
};

// Helper: Get default permissions based on landlord role
const getDefaultPermissions = (landlordRole) => {
  const permissionSets = {
    super_landlord: [
      {
        resource: "users",
        actions: ["create", "read", "update", "delete", "export"],
      },
      {
        resource: "properties",
        actions: ["create", "read", "update", "delete", "approve", "export"],
      },
      {
        resource: "applications",
        actions: ["create", "read", "update", "delete", "approve", "export"],
      },
      { resource: "payments", actions: ["read", "update", "export"] },
      { resource: "analytics", actions: ["read", "export"] },
      { resource: "settings", actions: ["read", "update"] },
      { resource: "system_logs", actions: ["read", "export"] },
      { resource: "reports", actions: ["read", "create", "export"] },
    ],
    landlord: [
      { resource: "users", actions: ["read", "update"] },
      { resource: "properties", actions: ["read", "update", "approve"] },
      { resource: "applications", actions: ["read", "update", "approve"] },
      { resource: "payments", actions: ["read"] },
      { resource: "analytics", actions: ["read"] },
      { resource: "reports", actions: ["read"] },
    ],
    moderator: [
      { resource: "users", actions: ["read", "update"] },
      { resource: "properties", actions: ["read"] },
      { resource: "applications", actions: ["read"] },
      { resource: "analytics", actions: ["read"] },
    ],
    analyst: [
      { resource: "users", actions: ["read"] },
      { resource: "properties", actions: ["read"] },
      { resource: "applications", actions: ["read"] },
      { resource: "payments", actions: ["read"] },
      { resource: "analytics", actions: ["read", "export"] },
      { resource: "reports", actions: ["read", "create", "export"] },
    ],
  };

  return permissionSets[landlordRole] || [];
};

// Landlord Login
export const landlordLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find landlord by email
    const landlord = await Landlord.findOne({
      email: email.toLowerCase(),
      "security.isActive": true,
    });

    if (!landlord) {
      return res.status(401).json({
        success: false,
        message: "Invalid landlord credentials.",
      });
    }

    // Check if account is locked
    if (landlord.isLocked()) {
      return res.status(423).json({
        success: false,
        message:
          "Account temporarily locked due to too many failed login attempts.",
      });
    }

    // Check if landlord is verified
    if (!landlord.security.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Landlord account not verified. Contact Alpha Landlordistrator.",
      });
    }

    // Verify password
    const isMatch = await landlord.comparePassword(password);
    if (!isMatch) {
      await landlord.incrementLoginAttempts();
      return res.status(401).json({
        success: false,
        message: "Invalid landlord credentials.",
      });
    }

    // Reset login attempts on successful login
    await landlord.resetLoginAttempts();

    // Update last login
    landlord.security.lastLogin = new Date();
    landlord.security.sessionToken = crypto.randomBytes(32).toString("hex");
    await landlord.save();

    // Log login activity
    await landlord.logActivity(
      "login",
      "auth",
      null,
      "Successful landlord login",
      req
    );

    // Generate token
    const token = generateLandlordToken(landlord);

    // Prepare safe landlord object for response
    const landlordResponse = {
      _id: landlord._id,
      firstName: landlord.firstName,
      lastName: landlord.lastName,
      fullName: landlord.fullName,
      email: landlord.email,
      landlordRole: landlord.landlordRole,
      permissions: landlord.permissions,
      profile: landlord.profile,
      lastLogin: landlord.security.lastLogin,
    };

    res.json({
      success: true,
      token,
      user: landlordResponse, // Keep 'user' key for compatibility with frontend
      message: "Landlord login successful",
    });
  } catch (error) {
    console.error("Landlord login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get Landlord Profile
export const getLandlordProfile = async (req, res) => {
  try {
    const landlord = await Landlord.findById(req.landlord.landlordId)
      .select("-password -security.twoFactorSecret -security.sessionToken")
      .populate("audit.createdBy", "firstName lastName email landlordRole");

    if (!landlord) {
      return res.status(404).json({
        success: false,
        message: "Landlord not found",
      });
    }

    res.json({
      success: true,
      user: landlord, // Keep 'user' key for compatibility with frontend
    });
  } catch (error) {
    console.error("Get landlord profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch landlord profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update Landlord Profile
export const updateLandlordProfile = async (req, res) => {
  try {
    const { firstName, lastName, profile } = req.body;
    const landlordId = req.landlord.landlordId;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (profile) updateData.profile = { ...updateData.profile, ...profile };

    updateData["audit.lastModifiedBy"] = landlordId;
    updateData["audit.lastModifiedAt"] = new Date();

    const landlord = await Landlord.findByIdAndUpdate(
      landlordId,
      { $set: updateData },
      {
        new: true,
        select: "-password -security.twoFactorSecret -security.sessionToken",
      }
    );

    if (!landlord) {
      return res.status(404).json({
        success: false,
        message: "Landlord not found",
      });
    }

    // Log profile update activity
    await landlord.logActivity(
      "update",
      "landlord_profile",
      landlordId,
      "Profile updated",
      req
    );

    res.json({
      success: true,
      user: landlord,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update landlord profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update landlord profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Change Landlord Password
export const changeLandlordPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const landlordId = req.landlord.landlordId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long",
      });
    }

    const landlord = await Landlord.findById(landlordId);
    if (!landlord) {
      return res.status(404).json({
        success: false,
        message: "Landlord not found",
      });
    }

    // Verify current password
    const isMatch = await landlord.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    landlord.password = newPassword;
    landlord.audit.lastModifiedBy = landlordId;
    landlord.audit.lastModifiedAt = new Date();
    await landlord.save();

    // Log password change activity
    await landlord.logActivity(
      "update",
      "landlord_password",
      landlordId,
      "Password changed",
      req
    );

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change landlord password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Landlord Middleware for Authentication
export const requireLandlordAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No landlord token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if it's an landlord token
    if (!decoded.isLandlord) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Landlord privileges required.",
      });
    }

    // Verify landlord still exists and is active
    const landlord = await Landlord.findById(decoded.landlordId);
    if (
      !landlord ||
      !landlord.security.isActive ||
      !landlord.security.isVerified
    ) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Landlord account inactive or not found.",
      });
    }

    req.landlord = decoded;
    req.landlordDocument = landlord;
    next();
  } catch (error) {
    console.error("Landlord auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid landlord token.",
    });
  }
};

// Permission Middleware
export const requireLandlordPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      const landlord = req.landlordDocument;

      if (!landlord) {
        return res.status(401).json({
          success: false,
          message: "Landlord authentication required",
        });
      }

      // Check permission
      if (!landlord.hasPermission(resource, action)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Missing permission: ${action} on ${resource}`,
        });
      }

      next();
    } catch (error) {
      console.error("Landlord permission middleware error:", error);
      res.status(500).json({
        success: false,
        message: "Permission check failed",
      });
    }
  };
};

// Create Landlord User (only for alpha_landlord and super_landlord)
export const createLandlordUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      landlordRole,
      permissions,
      profile,
    } = req.body;
    const creatorLandlordId = req.landlord.landlordId;
    const creator = req.landlordDocument;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, email, and password are required",
      });
    }

    // Only alpha_landlord can create super_landlord, super_landlord and alpha can create others
    if (
      landlordRole === "super_landlord" &&
      creator.landlordRole !== "alpha_landlord"
    ) {
      return res.status(403).json({
        success: false,
        message: "Only Alpha Landlord can create Super Landlord accounts",
      });
    }

    if (landlordRole === "alpha_landlord") {
      return res.status(403).json({
        success: false,
        message: "Cannot create another Alpha Landlord account",
      });
    }

    // Check if email already exists
    const existingLandlord = await Landlord.findOne({
      email: email.toLowerCase(),
    });
    if (existingLandlord) {
      return res.status(400).json({
        success: false,
        message: "Landlord with this email already exists",
      });
    }

    // Get default permissions for role
    const defaultPermissions =
      permissions || getDefaultPermissions(landlordRole || "landlord");

    // Create landlord
    const newLandlord = new Landlord({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      landlordRole: landlordRole || "landlord",
      permissions: defaultPermissions,
      profile: {
        phoneNumber,
        ...profile,
      },
      security: {
        isActive: true,
        isVerified:
          creator.landlordRole === "alpha_landlord" ||
          creator.landlordRole === "super_landlord",
      },
      audit: {
        createdBy: creatorLandlordId,
      },
    });

    await newLandlord.save();

    // Log creation activity
    await creator.logActivity(
      "create",
      "landlord_user",
      newLandlord._id,
      `Created ${landlordRole || "landlord"} account`,
      req
    );

    // Return safe landlord object
    const landlordResponse = {
      _id: newLandlord._id,
      firstName: newLandlord.firstName,
      lastName: newLandlord.lastName,
      fullName: newLandlord.fullName,
      email: newLandlord.email,
      landlordRole: newLandlord.landlordRole,
      permissions: newLandlord.permissions,
      profile: newLandlord.profile,
      security: {
        isActive: newLandlord.security.isActive,
        isVerified: newLandlord.security.isVerified,
      },
      audit: {
        createdBy: newLandlord.audit.createdBy,
        createdAt: newLandlord.audit.createdAt,
      },
    };

    res.status(201).json({
      success: true,
      data: landlordResponse,
      message: "Landlord user created successfully",
    });
  } catch (error) {
    console.error("Create landlord user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create landlord user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
