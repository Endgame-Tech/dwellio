// ubani/models/Admin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Admin Permission Schema
const adminPermissionSchema = new mongoose.Schema(
  {
    resource: {
      type: String,
      required: true,
      enum: [
        "users",
        "properties",
        "applications",
        "payments",
        "analytics",
        "settings",
        "admin_management",
        "system_logs",
        "reports",
      ],
    },
    actions: [
      {
        type: String,
        enum: ["create", "read", "update", "delete", "approve", "export"],
      },
    ],
  },
  { _id: false }
);

// Admin Schema - Completely separate from User schema
const adminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    // Admin-specific roles with granular permissions
    adminRole: {
      type: String,
      enum: [
        "alpha_admin", // Full system access (your email)
        "super_admin", // Almost full access, created by alpha_admin
        "admin", // Standard admin with limited permissions
        "moderator", // Basic moderation permissions
        "analyst", // Read-only access for reports/analytics
      ],
      required: true,
      default: "admin",
    },
    // Granular permissions for each admin
    permissions: [adminPermissionSchema],
    // Admin profile information
    profile: {
      avatar: { type: String },
      bio: { type: String, maxlength: 500 },
      department: {
        type: String,
        enum: [
          "Operations",
          "Customer Support",
          "Analytics",
          "Security",
          "Management",
        ],
      },
      phoneNumber: {
        type: String,
        trim: true,
      },
      timezone: {
        type: String,
        default: "Africa/Lagos",
      },
      language: {
        type: String,
        default: "en",
        enum: ["en", "ha", "ig", "yo"], // English, Hausa, Igbo, Yoruba
      },
    },
    // Security and access control
    security: {
      isActive: {
        type: Boolean,
        default: true,
      },
      isVerified: {
        type: Boolean,
        default: false, // Must be verified by alpha_admin or super_admin
      },
      lastLogin: { type: Date },
      loginAttempts: { type: Number, default: 0 },
      lockUntil: { type: Date },
      twoFactorEnabled: {
        type: Boolean,
        default: false,
      },
      twoFactorSecret: { type: String },
      // IP restrictions (optional)
      allowedIPs: [{ type: String }],
      sessionToken: { type: String }, // For additional session security
    },
    // Audit trail
    audit: {
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: function () {
          return this.adminRole !== "alpha_admin";
        },
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
      lastModifiedAt: {
        type: Date,
        default: Date.now,
      },
      // Track all actions performed by this admin
      activityLog: [
        {
          action: { type: String, required: true },
          resource: { type: String, required: true },
          resourceId: { type: String },
          details: { type: String },
          ipAddress: { type: String },
          userAgent: { type: String },
          timestamp: { type: Date, default: Date.now },
        },
      ],
    },
  },
  {
    timestamps: true,
    // Add indexes for better performance
    indexes: [
      { email: 1 },
      { adminRole: 1 },
      { "security.isActive": 1 },
      { "audit.createdBy": 1 },
    ],
  }
);

// Virtual for full name
adminSchema.virtual("displayName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Compound index for security queries
adminSchema.index({ email: 1, "security.isActive": 1 });

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12); // Higher salt rounds for admin security
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update fullName before saving
adminSchema.pre("save", function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  next();
});

// Update lastModifiedAt on any update
adminSchema.pre("findOneAndUpdate", function () {
  this.set({ "audit.lastModifiedAt": new Date() });
});

// Password comparison method
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if admin is locked out
adminSchema.methods.isLocked = function () {
  return this.security.lockUntil && this.security.lockUntil > Date.now();
};

// Increment login attempts
adminSchema.methods.incrementLoginAttempts = async function () {
  const maxLoginAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours

  // If we have a previous lock that has expired, restart at 1
  if (this.security.lockUntil && this.security.lockUntil < Date.now()) {
    return await this.updateOne({
      $unset: {
        "security.lockUntil": 1,
      },
      $set: {
        "security.loginAttempts": 1,
      },
    });
  }

  const updates = { $inc: { "security.loginAttempts": 1 } };

  // If we have hit max attempts and it's not locked yet, lock the account
  if (this.security.loginAttempts + 1 >= maxLoginAttempts && !this.isLocked()) {
    updates.$set = { "security.lockUntil": Date.now() + lockTime };
  }

  return await this.updateOne(updates);
};

// Reset login attempts
adminSchema.methods.resetLoginAttempts = async function () {
  return await this.updateOne({
    $unset: {
      "security.loginAttempts": 1,
      "security.lockUntil": 1,
    },
  });
};

// Check if admin has specific permission
adminSchema.methods.hasPermission = function (resource, action) {
  // Alpha admin has all permissions
  if (this.adminRole === "alpha_admin") {
    return true;
  }

  // Super admin has almost all permissions except admin management
  if (this.adminRole === "super_admin" && resource !== "admin_management") {
    return true;
  }

  // Check specific permissions
  const permission = this.permissions.find((p) => p.resource === resource);
  return permission && permission.actions.includes(action);
};

// Log admin activity
adminSchema.methods.logActivity = async function (
  action,
  resource,
  resourceId = null,
  details = null,
  req = null
) {
  const activityEntry = {
    action,
    resource,
    resourceId: resourceId?.toString(),
    details,
    ipAddress: req?.ip || req?.connection?.remoteAddress,
    userAgent: req?.get("User-Agent"),
    timestamp: new Date(),
  };

  this.audit.activityLog.push(activityEntry);

  // Keep only last 100 activities to prevent document size issues
  if (this.audit.activityLog.length > 100) {
    this.audit.activityLog = this.audit.activityLog.slice(-100);
  }

  await this.save();
};

// Static method to find active admins
adminSchema.statics.findActive = function () {
  return this.find({ "security.isActive": true, "security.isVerified": true });
};

// Static method to create alpha admin (only if none exists)
adminSchema.statics.createAlphaAdmin = async function (adminData) {
  const existingAlpha = await this.findOne({ adminRole: "alpha_admin" });
  if (existingAlpha) {
    throw new Error("Alpha admin already exists");
  }

  const alphaAdmin = new this({
    ...adminData,
    adminRole: "alpha_admin",
    security: {
      isActive: true,
      isVerified: true,
      ...adminData.security,
    },
    permissions: [], // Alpha admin doesn't need explicit permissions
  });

  return await alphaAdmin.save();
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
