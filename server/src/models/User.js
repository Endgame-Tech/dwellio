// ubani/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
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
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["tenant", "landlord"],
      default: "tenant",
    },
    // Tenant-specific fields
    tenantProfile: {
      occupation: { type: String },
      employerName: { type: String },
      monthlyIncome: { type: Number },
      emergencyContactName: { type: String },
      emergencyContactPhone: { type: String },
      emergencyContactRelationship: { type: String },
      guarantorName: { type: String },
      guarantorPhone: { type: String },
      guarantorEmail: { type: String },
      // Current residence information
      currentResidence: {
        address: { type: String },
        landlordName: { type: String },
        landlordPhone: { type: String },
        moveInDate: { type: Date },
        rentAmount: { type: Number },
        isCurrentlyRenting: { type: Boolean, default: false },
      },
      // Verification documents
      documents: [
        {
          type: {
            type: String,
            enum: [
              "id_card",
              "utility_bill",
              "bank_statement",
              "employment_letter",
              "passport",
            ],
          },
          url: { type: String },
          filename: { type: String },
          uploadDate: { type: Date, default: Date.now },
          verified: { type: Boolean, default: false },
        },
      ],
      // Move-out intent
      moveOutIntent: {
        intendedDate: { type: Date },
        reason: { type: String },
        preferredAreas: [{ type: String }],
        budgetRange: {
          min: { type: Number },
          max: { type: Number },
        },
        propertyType: { type: String },
        facilitationRequested: { type: Boolean, default: false },
        status: {
          type: String,
          enum: ["pending", "searching", "matched", "completed"],
          default: "pending",
        },
      },
      // House information
      houseInfo: {
        images: [
          {
            id: { type: String },
            category: {
              type: String,
              enum: [
                "aerial_view",
                "sitting_room",
                "bedroom",
                "kitchen",
                "bathroom",
                "exterior",
                "other",
              ],
            },
            url: { type: String },
            publicId: { type: String }, // Cloudinary public ID for deletion
            fileName: { type: String },
            uploadedAt: { type: Date, default: Date.now },
          },
        ],
        features: [{ type: String }],
        amenities: [{ type: String }],
        description: { type: String },
        size: { type: String },
        bedrooms: { type: Number, default: 0 },
        bathrooms: { type: Number, default: 0 },
        yearBuilt: { type: String },
        propertyType: {
          type: String,
          enum: ["apartment", "house", "condo", "townhouse", "studio"],
        },
      },
    },
    // Verification status
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    trustScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    creditScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 850,
    },
    creditHistory: {
      paymentHistory: { type: Number, default: 0 }, // 35% weight
      creditUtilization: { type: Number, default: 0 }, // 30% weight
      creditLength: { type: Number, default: 0 }, // 15% weight
      creditMix: { type: Number, default: 0 }, // 10% weight
      newCredit: { type: Number, default: 0 }, // 10% weight
      lastUpdated: { type: Date, default: Date.now },
    },
    profilePhoto: {
      type: String,
    },
    preferredContactMethod: {
      type: String,
      enum: ["email", "sms", "whatsapp"],
      default: "email",
    },
    status: {
      type: String,
      enum: ["active", "banned", "pending"],
      default: "active",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Generate fullName from firstName and lastName
  if (this.firstName && this.lastName) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }

  // Hash password if it's modified
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }

  // Calculate scores if relevant fields are modified
  if (
    this.isModified("tenantProfile") ||
    this.isModified("verificationStatus") ||
    this.isModified("creditHistory")
  ) {
    this.trustScore = this.calculateTrustScore();
    this.creditScore = this.calculateCreditScore();
  }

  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate trust score based on profile completeness and verification
userSchema.methods.calculateTrustScore = function () {
  let score = 0;

  // Profile completeness (40 points)
  const profileFields = [
    this.tenantProfile?.occupation,
    this.tenantProfile?.employerName,
    this.tenantProfile?.monthlyIncome,
    this.tenantProfile?.emergencyContactName,
    this.tenantProfile?.emergencyContactPhone,
    this.tenantProfile?.guarantorName,
    this.tenantProfile?.guarantorPhone,
    this.tenantProfile?.guarantorEmail,
  ];
  const completedFields = profileFields.filter(
    (field) => field && field.trim() !== ""
  ).length;
  score += (completedFields / profileFields.length) * 40;

  // Document verification (35 points)
  if (this.verificationStatus === "verified") {
    score += 35;
  } else if (this.verificationStatus === "pending") {
    const verifiedDocs =
      this.tenantProfile?.documents?.filter((doc) => doc.verified).length || 0;
    const totalDocs = this.tenantProfile?.documents?.length || 0;
    if (totalDocs > 0) {
      score += (verifiedDocs / totalDocs) * 35;
    }
  }

  // Current residence info (15 points)
  if (
    this.tenantProfile?.currentResidence?.address &&
    this.tenantProfile?.currentResidence?.landlordName &&
    this.tenantProfile?.currentResidence?.moveInDate
  ) {
    score += 15;
  }

  // Employment verification (10 points)
  if (
    this.tenantProfile?.occupation &&
    this.tenantProfile?.employerName &&
    this.tenantProfile?.monthlyIncome
  ) {
    score += 10;
  }

  return Math.min(Math.round(score), 100);
};

// Calculate credit score based on various factors
userSchema.methods.calculateCreditScore = function () {
  let score = 300; // Base score
  const history = this.creditHistory;

  if (!history) return score;

  // Payment History (35% weight) - max 187 points
  score += Math.round(history.paymentHistory * 1.87);

  // Credit Utilization (30% weight) - max 165 points
  score += Math.round(history.creditUtilization * 1.65);

  // Length of Credit History (15% weight) - max 82 points
  score += Math.round(history.creditLength * 0.82);

  // Credit Mix (10% weight) - max 55 points
  score += Math.round(history.creditMix * 0.55);

  // New Credit (10% weight) - max 55 points
  score += Math.round(history.newCredit * 0.55);

  return Math.min(Math.max(score, 300), 850);
};

// Update both scores before saving
// Virtual field for backwards compatibility with landlord interface
userSchema.virtual("isVerified").get(function () {
  return this.verificationStatus === "verified";
});

// Ensure virtual fields are serialized
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

userSchema.pre("save", function (next) {
  if (
    this.isModified("tenantProfile") ||
    this.isModified("verificationStatus") ||
    this.isModified("creditHistory")
  ) {
    this.trustScore = this.calculateTrustScore();
    this.creditScore = this.calculateCreditScore();
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
