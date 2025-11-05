// ubani/controllers/tenantController.js
import { uploadImage, deleteImage } from "../config/cloudinary.js";
import User from "../models/User.js";
import Application from "../models/Application.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get tenant profile
export const getTenantProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get tenant profile error:", error);
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

// Update tenant profile
export const updateTenantProfile = async (req, res) => {
  try {
    const updates = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.password;
    delete updates.email;
    delete updates.role;
    delete updates.trustScore;
    delete updates.verificationStatus;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update tenant profile error:", error);
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// Upload verification documents
export const uploadVerificationDocument = async (req, res) => {
  try {
    const { documentType } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const allowedTypes = [
      "id_card",
      "utility_bill",
      "bank_statement",
      "employment_letter",
      "passport",
    ];
    if (!allowedTypes.includes(documentType)) {
      return res.status(400).json({ message: "Invalid document type" });
    }

    const documentData = {
      type: documentType,
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      uploadDate: new Date(),
      verified: false,
    };

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { "tenantProfile.documents": documentData } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "Document uploaded successfully",
      data: documentData,
    });
  } catch (error) {
    console.error("Upload document error:", error);
    res.status(500).json({
      message: "Failed to upload document",
      error: error.message,
    });
  }
};

// Submit move-out intent
export const submitMoveOutIntent = async (req, res) => {
  try {
    const {
      intendedDate,
      reason,
      preferredAreas,
      budgetRange,
      propertyType,
      facilitationRequested,
    } = req.body;

    const moveOutData = {
      "tenantProfile.moveOutIntent": {
        intendedDate,
        reason,
        preferredAreas,
        budgetRange,
        propertyType,
        facilitationRequested,
        status: "pending",
      },
    };

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: moveOutData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "Move-out intent submitted successfully",
      data: user.tenantProfile.moveOutIntent,
    });
  } catch (error) {
    console.error("Submit move-out intent error:", error);
    res.status(500).json({
      message: "Failed to submit move-out intent",
      error: error.message,
    });
  }
};

// Get tenant dashboard stats
export const getTenantDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user profile
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get application statistics
    const applications = await Application.countDocuments({ tenantId: userId });

    // Calculate profile completion
    const profileCompletion = calculateProfileCompletion(user);

    // Get recent applications
    const recentApplications = await Application.find({ tenantId: userId })
      .populate("propertyId", "title type location rent features")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get application stats by status
    const applicationStats = await Application.aggregate([
      { $match: { tenantId: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format current residence data
    const currentResidence = user.tenantProfile?.currentResidence?.address
      ? {
          address: user.tenantProfile.currentResidence.address,
          leaseExpiry: user.tenantProfile.currentResidence.leaseEndDate,
        }
      : null;

    res.json({
      success: true,
      data: {
        user,
        profileCompletion,
        verificationStatus: user.verificationStatus,
        trustworthinessScore: user.trustScore,
        applications,
        currentResidence,
        applicationStats,
        recentApplications,
      },
    });
  } catch (error) {
    console.error("Get tenant dashboard stats error:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};

// Helper function to calculate profile completion
function calculateProfileCompletion(user) {
  const requiredFields = [
    "tenantProfile.occupation",
    "tenantProfile.employerName",
    "tenantProfile.monthlyIncome",
    "tenantProfile.emergencyContactName",
    "tenantProfile.emergencyContactPhone",
  ];

  const optionalFields = [
    "tenantProfile.guarantorName",
    "tenantProfile.guarantorPhone",
    "tenantProfile.guarantorEmail",
    "tenantProfile.currentResidence.address",
  ];

  let completed = 0;
  let total = requiredFields.length + optionalFields.length;

  // Check required fields
  requiredFields.forEach((field) => {
    if (getNestedValue(user, field)) {
      completed++;
    }
  });

  // Check optional fields
  optionalFields.forEach((field) => {
    if (getNestedValue(user, field)) {
      completed++;
    }
  });

  // Check documents
  if (user.tenantProfile?.documents?.length > 0) {
    completed++;
  }
  total++;

  return {
    percentage: Math.round((completed / total) * 100),
    completed,
    total,
  };
}

// Upload house image
export const uploadHouseImage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { category } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Image category is required",
      });
    }

    const validCategories = [
      "aerial_view",
      "sitting_room",
      "bedroom",
      "kitchen",
      "bathroom",
      "exterior",
      "other",
    ];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid image category",
      });
    }

    // Upload to Cloudinary
    const result = await uploadImage(req.file.buffer, {
      folder: `ubani/house-images/${userId}`,
      public_id: `${category}_${Date.now()}`,
    });

    // Create image object
    const newImage = {
      id: result.public_id,
      category,
      url: result.secure_url,
      publicId: result.public_id,
      fileName: req.file.originalname,
      uploadedAt: new Date(),
    };

    // Update user's house info
    const user = await User.findById(userId);
    if (!user.tenantProfile) {
      user.tenantProfile = {};
    }
    if (!user.tenantProfile.houseInfo) {
      user.tenantProfile.houseInfo = { images: [] };
    }
    if (!user.tenantProfile.houseInfo.images) {
      user.tenantProfile.houseInfo.images = [];
    }

    user.tenantProfile.houseInfo.images.push(newImage);
    await user.save();

    res.json({
      success: true,
      data: {
        id: result.public_id,
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    console.error("Upload house image error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload house image",
      error: error.message,
    });
  }
};

// Delete house image
export const deleteHouseImage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { imageId } = req.params;

    const user = await User.findById(userId);
    if (!user.tenantProfile?.houseInfo?.images) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const imageIndex = user.tenantProfile.houseInfo.images.findIndex(
      (img) => img.id === imageId
    );
    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const image = user.tenantProfile.houseInfo.images[imageIndex];

    // Delete from Cloudinary
    await deleteImage(image.publicId);

    // Remove from user's house info
    user.tenantProfile.houseInfo.images.splice(imageIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete house image error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete house image",
      error: error.message,
    });
  }
};

// Upload profile photo
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image file provided" });
    }

    const userId = req.user.userId;
    // Upload to Cloudinary (reuse existing helper)
    const result = await uploadImage(req.file.buffer, {
      folder: `ubani/profile-photos/${userId}`,
      public_id: `profile_${Date.now()}`,
    });

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.profilePhoto = result.secure_url;
    await user.save();

    res.json({
      success: true,
      message: "Profile photo updated successfully",
      data: { url: result.secure_url },
    });
  } catch (error) {
    console.error("Upload profile photo error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload profile photo",
      error: error.message,
    });
  }
};

// Update credit history
export const updateCreditHistory = async (req, res) => {
  try {
    const {
      paymentHistory,
      creditUtilization,
      creditLength,
      creditMix,
      newCredit,
    } = req.body;

    // Validate input ranges (0-100 for each factor)
    const factors = {
      paymentHistory,
      creditUtilization,
      creditLength,
      creditMix,
      newCredit,
    };
    for (const [key, value] of Object.entries(factors)) {
      if (value !== undefined && (value < 0 || value > 100)) {
        return res.status(400).json({
          message: `${key} must be between 0 and 100`,
        });
      }
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update credit history
    if (!user.creditHistory) {
      user.creditHistory = {};
    }

    Object.assign(user.creditHistory, {
      ...factors,
      lastUpdated: new Date(),
    });

    await user.save(); // This will trigger credit score recalculation

    res.json({
      success: true,
      message: "Credit history updated successfully",
      data: {
        creditScore: user.creditScore,
        trustScore: user.trustScore,
        creditHistory: user.creditHistory,
      },
    });
  } catch (error) {
    console.error("Update credit history error:", error);
    res.status(500).json({
      message: "Failed to update credit history",
      error: error.message,
    });
  }
};

// Get credit and trust scores
export const getScores = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "trustScore creditScore creditHistory verificationStatus"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Recalculate scores to ensure they're up to date
    user.trustScore = user.calculateTrustScore();
    user.creditScore = user.calculateCreditScore();
    await user.save();

    res.json({
      success: true,
      data: {
        trustScore: user.trustScore,
        creditScore: user.creditScore,
        creditHistory: user.creditHistory,
        verificationStatus: user.verificationStatus,
        scoreBreakdown: {
          trustScore: {
            profileCompletion: "40%",
            documentVerification: "35%",
            currentResidence: "15%",
            employmentVerification: "10%",
          },
          creditScore: {
            paymentHistory: "35%",
            creditUtilization: "30%",
            creditLength: "15%",
            creditMix: "10%",
            newCredit: "10%",
          },
        },
      },
    });
  } catch (error) {
    console.error("Get scores error:", error);
    res.status(500).json({
      message: "Failed to fetch scores",
      error: error.message,
    });
  }
};

// Verify document (admin function)
export const verifyDocument = async (req, res) => {
  try {
    const { userId, documentId, verified, rejectionReason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const document = user.tenantProfile?.documents?.id(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    document.verified = verified;
    if (!verified && rejectionReason) {
      document.rejectionReason = rejectionReason;
    }

    // Check if all required documents are verified
    const requiredDocTypes = ["id_card", "bank_statement"];
    const verifiedRequiredDocs = user.tenantProfile.documents.filter(
      (doc) => requiredDocTypes.includes(doc.type) && doc.verified
    );

    if (verifiedRequiredDocs.length >= requiredDocTypes.length) {
      user.verificationStatus = "verified";
    }

    await user.save(); // This will recalculate trust score

    res.json({
      success: true,
      message: `Document ${verified ? "verified" : "rejected"} successfully`,
      data: {
        document,
        verificationStatus: user.verificationStatus,
        trustScore: user.trustScore,
      },
    });
  } catch (error) {
    console.error("Verify document error:", error);
    res.status(500).json({
      message: "Failed to verify document",
      error: error.message,
    });
  }
};

// Request move-out facilitation fee
export const requestMoveOutFacilitation = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has move-out intent
    if (!user.tenantProfile?.moveOutIntent?.facilitationRequested) {
      return res.status(400).json({
        message: "Move-out facilitation must be requested first",
      });
    }

    // Calculate facilitation fee (5% instead of typical 10%)
    const budgetMax = user.tenantProfile.moveOutIntent.budgetRange?.max || 0;
    const facilitationFee = Math.round(budgetMax * 0.05); // 5% fee
    const savings = Math.round(budgetMax * 0.05); // 5% savings compared to 10%

    res.json({
      success: true,
      data: {
        facilitationFee,
        savings,
        currency: "NGN",
        description:
          "Ubani facilitation fee - 5% instead of typical 10% agent fee",
        services: [
          "Property matching based on your preferences",
          "Negotiation with landlords on your behalf",
          "Contract review and support",
          "Documentation assistance",
          "Move-in coordination",
        ],
      },
    });
  } catch (error) {
    console.error("Request move-out facilitation error:", error);
    res.status(500).json({
      message: "Failed to calculate facilitation fee",
      error: error.message,
    });
  }
};

// Get recent activities for dashboard
export const getRecentActivities = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 10 } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const activities = [];

    // Get recent applications
    const recentApplications = await Application.find({ tenantId: userId })
      .populate("propertyId", "title location")
      .sort({ createdAt: -1 })
      .limit(3);

    recentApplications.forEach((app) => {
      activities.push({
        id: app._id,
        type: "application",
        title: `Application ${app.status}`,
        description: `Your application for ${
          app.propertyId?.title || "property"
        } is ${app.status}`,
        timestamp: app.createdAt,
        status: app.status,
      });
    });

    // Get recent payments
    const paymentHistory = user.tenantProfile?.paymentHistory || [];
    const recentPayments = paymentHistory
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);

    recentPayments.forEach((payment) => {
      activities.push({
        id: payment._id || payment.reference,
        type: "payment",
        title: "Payment Completed",
        description: `₦${payment.amount.toLocaleString()} - ${
          payment.description
        }`,
        timestamp: payment.date,
        status: payment.status,
      });
    });

    // Add document verification activities
    const documents = user.tenantProfile?.documents || [];
    documents.forEach((doc) => {
      if (doc.verified !== undefined) {
        activities.push({
          id: doc._id,
          type: "document",
          title: `Document ${doc.verified ? "Verified" : "Rejected"}`,
          description: `${doc.type.replace("_", " ")} document ${
            doc.verified ? "approved" : "needs attention"
          }`,
          timestamp: doc.uploadDate,
          status: doc.verified ? "completed" : "rejected",
        });
      }
    });

    // Add move-out intent activity
    if (user.tenantProfile?.moveOutIntent) {
      const moveOutIntent = user.tenantProfile.moveOutIntent;
      activities.push({
        id: "move-out-intent",
        type: "move_out",
        title: "Move-out Intent Submitted",
        description: `Looking for properties in ${
          moveOutIntent.preferredAreas?.join(", ") || "various areas"
        }`,
        timestamp: moveOutIntent.createdAt || user.createdAt,
        status: moveOutIntent.status || "active",
      });
    }

    // Sort by timestamp (newest first) and limit
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: sortedActivities,
    });
  } catch (error) {
    console.error("Get recent activities error:", error);
    res.status(500).json({
      message: "Failed to fetch activities",
      error: error.message,
    });
  }
};

// Get dashboard summary for modern dashboard
export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get application counts
    const applicationCounts = await Application.aggregate([
      { $match: { tenantId: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      activeApplications:
        applicationCounts.find((item) => item._id === "pending")?.count || 0,
      approvedApplications:
        applicationCounts.find((item) => item._id === "approved")?.count || 0,
      rejectedApplications:
        applicationCounts.find((item) => item._id === "rejected")?.count || 0,
      totalApplications: applicationCounts.reduce(
        (sum, item) => sum + item.count,
        0
      ),
    };

    // Calculate pending payments (example: if facilitation fee not paid)
    const facilitationPaid =
      user.tenantProfile?.moveOutIntent?.facilitationPayment?.status ===
      "completed";
    stats.pendingPayments = facilitationPaid ? 0 : 1;

    // Monthly rent from current residence or last application
    let monthlyRent = 0;
    if (user.tenantProfile?.currentResidence?.monthlyRent) {
      monthlyRent = user.tenantProfile.currentResidence.monthlyRent;
    } else {
      // Get from most recent approved application
      const lastApprovedApp = await Application.findOne({
        tenantId: userId,
        status: "approved",
      })
        .populate("propertyId", "rent")
        .sort({ createdAt: -1 });

      if (lastApprovedApp && lastApprovedApp.propertyId?.rent) {
        const rent = lastApprovedApp.propertyId.rent;
        monthlyRent =
          rent.period === "monthly" ? rent.amount : rent.amount / 12;
      }
    }
    stats.monthlyRent = Math.round(monthlyRent);

    // Maintenance requests (placeholder - would need a maintenance system)
    stats.maintenanceRequests = 0;

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get dashboard summary error:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard summary",
      error: error.message,
    });
  }
};

// Helper function to get nested object values
function getNestedValue(obj, path) {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}
