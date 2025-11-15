// ubani/models/Landlord.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Landlord Permission Schema
const landlordPermissionSchema = new mongoose.Schema(
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
        "landlord_management",
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

// Landlord Schema - Completely separate from User schema
const landlordSchema = new mongoose.Schema(
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
    // Landlord-specific roles with granular permissions
    landlordRole: {
      type: String,
      enum: [
        "alpha_landlord", // Full system access (your email)
        "super_landlord", // Almost full access, created by alpha_landlord
        "landlord", // Standard landlord with limited permissions
        "moderator", // Basic moderation permissions
        "analyst", // Read-only access for reports/analytics
      ],
      required: true,
      default: "landlord",
    },
    // Granular permissions for each landlord
    permissions: [landlordPermissionSchema],
    // Landlord profile information
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
        default: false, // Must be verified by alpha_landlord or super_landlord
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
        ref: "Landlord",
        required: function () {
          return this.landlordRole !== "alpha_landlord";
        },
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Landlord",
      },
      lastModifiedAt: {
        type: Date,
        default: Date.now,
      },
      // Track all actions performed by this landlord
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
      { landlordRole: 1 },
      { "security.isActive": 1 },
      { "audit.createdBy": 1 },
    ],
  }
);

// Virtual for full name
landlordSchema.virtual("displayName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Compound index for security queries
landlordSchema.index({ email: 1, "security.isActive": 1 });

// Hash password before saving
landlordSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12); // Higher salt rounds for landlord security
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update fullName before saving
landlordSchema.pre("save", function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  next();
});

// Update lastModifiedAt on any update
landlordSchema.pre("findOneAndUpdate", function () {
  this.set({ "audit.lastModifiedAt": new Date() });
});

// Password comparison method
landlordSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if landlord is locked out
landlordSchema.methods.isLocked = function () {
  return this.security.lockUntil && this.security.lockUntil > Date.now();
};

// Increment login attempts
landlordSchema.methods.incrementLoginAttempts = async function () {
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
landlordSchema.methods.resetLoginAttempts = async function () {
  return await this.updateOne({
    $unset: {
      "security.loginAttempts": 1,
      "security.lockUntil": 1,
    },
  });
};

// Check if landlord has specific permission
landlordSchema.methods.hasPermission = function (resource, action) {
  // Alpha landlord has all permissions
  if (this.landlordRole === "alpha_landlord") {
    return true;
  }

  // Super landlord has almost all permissions except landlord management
  if (
    this.landlordRole === "super_landlord" &&
    resource !== "landlord_management"
  ) {
    return true;
  }

  // Check specific permissions
  const permission = this.permissions.find((p) => p.resource === resource);
  return permission && permission.actions.includes(action);
};

// Log landlord activity
landlordSchema.methods.logActivity = async function (
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

// Static method to find active landlords
landlordSchema.statics.findActive = function () {
  return this.find({ "security.isActive": true, "security.isVerified": true });
};

// Static method to create alpha landlord (only if none exists)
landlordSchema.statics.createAlphaLandlord = async function (landlordData) {
  const existingAlpha = await this.findOne({ landlordRole: "alpha_landlord" });
  if (existingAlpha) {
    throw new Error("Alpha landlord already exists");
  }

  const alphaLandlord = new this({
    ...landlordData,
    landlordRole: "alpha_landlord",
    security: {
      isActive: true,
      isVerified: true,
      ...landlordData.security,
    },
    permissions: [], // Alpha landlord doesn't need explicit permissions
  });

  return await alphaLandlord.save();
};

const Landlord = mongoose.model("Landlord", landlordSchema);

export default Landlord;
