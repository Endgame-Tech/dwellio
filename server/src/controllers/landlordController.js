import User from "../models/User.js";
import Property from "../models/Property.js";
import Application from "../models/Application.js";
import Payment from "../models/Payment.js";
import mongoose from "mongoose";

// Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProperties,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalPayments,
    ] = await Promise.all([
      User.countDocuments({ role: { $in: ["tenant", "landlord"] } }), // Only regular users
      Property.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: "pending" }),
      Application.countDocuments({ status: "approved" }),
      Application.countDocuments({ status: "rejected" }),
      Payment.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).catch(() => [{ total: 0 }]), // Fallback if Payment collection doesn't exist or has different structure
    ]);

    // Get new users this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thisMonth },
      role: { $in: ["tenant", "landlord"] }, // Only regular users
    });

    // Calculate monthly revenue (current month)
    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: thisMonth },
          status: "completed",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]).catch(() => [{ total: 0 }]); // Fallback if Payment collection doesn't exist or has different structure

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProperties,
        pendingApplications,
        totalRevenue: totalPayments[0]?.total || 0,
        newUsersThisMonth,
        activeApplications: pendingApplications,
        completedApplications: approvedApplications,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        totalApplications,
        approvedApplications,
        rejectedApplications,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};

// User Management
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      role = "",
      isVerified = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object - only regular users (tenant/landlord)
    const filter = {
      role: { $in: ["tenant", "landlord"] }, // Only regular users
    };

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (role && role !== "all") {
      filter.role = role;
    }

    if (isVerified !== "") {
      filter.isVerified = isVerified === "true";
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, totalCount] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified, isActive, reason } = req.body;

    console.log("updateUserStatus - ID:", id, "Body:", {
      isVerified,
      isActive,
      reason,
    });

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const updateData = {};
    if (typeof isVerified !== "undefined") {
      // Convert isVerified boolean to verificationStatus enum
      updateData.verificationStatus = isVerified ? "verified" : "pending";
      console.log(
        "Setting verificationStatus to:",
        updateData.verificationStatus
      );
    }
    if (typeof isActive !== "undefined") updateData.isActive = isActive;
    if (reason) updateData.statusReason = reason;

    console.log("Update data:", updateData);

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      select: "-password",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(
      "Updated user - verificationStatus:",
      user.verificationStatus,
      "isVerified virtual:",
      user.isVerified
    );

    res.json({
      success: true,
      data: user,
      message: "User status updated successfully",
    });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message,
    });
  }
};

// Property Management
export const getAllProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      type = "",
      status = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "location.address": { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
      ];
    }

    if (type && type !== "all") {
      filter.type = type;
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [properties, totalCount] = await Promise.all([
      Property.find(filter)
        .populate("landlordId", "firstName lastName email phoneNumber")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Property.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get properties error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
      error: error.message,
    });
  }
};

// Get single property by ID
export const getProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property = await Property.findById(id).populate(
      "landlordId",
      "firstName lastName email phoneNumber"
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error("Get property error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch property",
      error: error.message,
    });
  }
};

// Create a new property
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      location,
      rent,
      deposit,
      bedrooms,
      bathrooms,
      area,
      amenities,
      media,
      landlordContact,
      landlordId,
      status,
      approvalStatus,
    } = req.body;

    // Validation
    if (!title || !type || !location || !rent) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: title, type, location, and rent",
      });
    }

    if (!location.lga) {
      return res.status(400).json({
        success: false,
        message: "LGA is required in location",
      });
    }

    if (
      !landlordContact ||
      !landlordContact.name ||
      !landlordContact.phone ||
      !landlordContact.email
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Landlord contact information (name, phone, email) is required",
      });
    }

    // Create new property
    const property = new Property({
      title,
      description,
      type,
      location,
      rent,
      deposit: deposit || rent.amount, // Default deposit to rent amount if not provided
      bedrooms: bedrooms || 1,
      bathrooms: bathrooms || 1,
      area,
      amenities: amenities || [],
      media: media || [],
      landlordContact,
      landlordId: landlordId || req.landlord?.landlordId || req.user?.userId, // Use landlordId from body, or landlord ID, or user ID
      status: status || "available",
      approvalStatus: approvalStatus || "approved", // Landlord-created properties are auto-approved
      isActive: true,
    });

    await property.save();

    res.status(201).json({
      success: true,
      data: property,
      message: "Property created successfully",
    });
  } catch (error) {
    console.error("Create property error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create property",
      error: error.message,
    });
  }
};

// Update a property
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    // Validation
    if (updateData.location && !updateData.location.lga) {
      return res.status(400).json({
        success: false,
        message: "LGA is required in location",
      });
    }

    if (updateData.landlordContact) {
      const { name, phone, email } = updateData.landlordContact;
      if (!name || !phone || !email) {
        return res.status(400).json({
          success: false,
          message:
            "Landlord contact information (name, phone, email) is required",
        });
      }
    }

    // Validate status enum if present
    if (
      updateData.status &&
      !["available", "occupied", "pending"].includes(updateData.status)
    ) {
      return res.status(400).json({
        success: false,
        message: `Invalid status value: "${updateData.status}". Must be one of: available, occupied, pending`,
      });
    }

    // Validate approvalStatus enum if present
    if (
      updateData.approvalStatus &&
      !["approved", "not_approved", "pending"].includes(
        updateData.approvalStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: `Invalid approvalStatus value: "${updateData.approvalStatus}". Must be one of: approved, not_approved, pending`,
      });
    }

    // Update property
    const property = await Property.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.json({
      success: true,
      data: property,
      message: "Property updated successfully",
    });
  } catch (error) {
    console.error("Update property error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update property",
      error: error.message,
    });
  }
};

// Approve a property
export const approveProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property = await Property.findByIdAndUpdate(
      id,
      { approvalStatus: "approved", rejectionReason: null },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.json({
      success: true,
      data: property,
      message: "Property approved successfully",
    });
  } catch (error) {
    console.error("Approve property error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve property",
      error: error.message,
    });
  }
};

// Reject a property
export const rejectProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property = await Property.findByIdAndUpdate(
      id,
      {
        approvalStatus: "not_approved",
        rejectionReason: reason || "Not approved by landlord",
      },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.json({
      success: true,
      data: property,
      message: "Property rejected successfully",
    });
  } catch (error) {
    console.error("Reject property error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject property",
      error: error.message,
    });
  }
};

// Duplicate a property
export const duplicateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    // Find the original property
    const originalProperty = await Property.findById(id);

    if (!originalProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Create a new property object with all the original data
    const duplicatedPropertyData = {
      title: `${originalProperty.title} (Copy)`,
      description: originalProperty.description,
      type: originalProperty.type,
      location: originalProperty.location,
      rent: originalProperty.rent,
      deposit: originalProperty.deposit,
      bedrooms: originalProperty.bedrooms,
      bathrooms: originalProperty.bathrooms,
      area: originalProperty.area,
      amenities: originalProperty.amenities,
      media: originalProperty.media,
      landlordContact: originalProperty.landlordContact,
      landlordId: originalProperty.landlordId,
      status: "available", // Reset status to available
      approvalStatus: "approved", // Landlord-duplicated properties are auto-approved
      isActive: true,
    };

    // Create the new property
    const duplicatedProperty = new Property(duplicatedPropertyData);
    await duplicatedProperty.save();

    res.status(201).json({
      success: true,
      data: duplicatedProperty,
      message: "Property duplicated successfully",
    });
  } catch (error) {
    console.error("Duplicate property error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to duplicate property",
      error: error.message,
    });
  }
};

// Delete a property
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    // Find and delete the property
    const property = await Property.findByIdAndDelete(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.json({
      success: true,
      message: "Property deleted successfully",
      data: { id: property._id },
    });
  } catch (error) {
    console.error("Delete property error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete property",
      error: error.message,
    });
  }
};

// Application Management
export const getAllApplications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [applications, totalCount] = await Promise.all([
      Application.find(filter)
        .populate("tenantId", "firstName lastName email phoneNumber")
        .populate("propertyId", "title type location rent")
        .populate("landlordId", "firstName lastName email phoneNumber")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Application.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};

// Chart Data
export const getChartData = async (req, res) => {
  try {
    const { type } = req.params;
    let data = [];

    // Define sixMonthsAgo for all cases that need it
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    switch (type) {
      case "users":
        try {
          // Get user registration trend for last 6 months (exclude landlord users)
          data = await User.aggregate([
            {
              $match: {
                createdAt: { $gte: sixMonthsAgo },
                role: { $in: ["tenant", "landlord"] }, // Only regular users
              },
            },
            {
              $group: {
                _id: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            {
              $project: {
                name: {
                  $dateToString: {
                    format: "%b",
                    date: {
                      $dateFromParts: {
                        year: "$_id.year",
                        month: "$_id.month",
                      },
                    },
                  },
                },
                value: "$count",
              },
            },
          ]);
        } catch (error) {
          console.error("Users chart error:", error);
          // Fallback data
          data = [
            { name: "Jan", value: 0 },
            { name: "Feb", value: 0 },
            { name: "Mar", value: 0 },
            { name: "Apr", value: 0 },
            { name: "May", value: 0 },
            { name: "Jun", value: 0 },
          ];
        }
        break;

      case "properties":
        try {
          // Get property status distribution
          data = await Property.aggregate([
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                name: "$_id",
                value: "$count",
              },
            },
          ]);
          // Capitalize the first letter in JavaScript
          data = data.map((item) => ({
            name: item.name
              ? item.name.charAt(0).toUpperCase() + item.name.slice(1)
              : item.name,
            value: item.value,
          }));
        } catch (error) {
          console.error("Properties chart error:", error);
          // Fallback data
          data = [
            { name: "Available", value: 0 },
            { name: "Occupied", value: 0 },
            { name: "Pending", value: 0 },
          ];
        }
        break;

      case "applications":
        try {
          // Get application status distribution
          data = await Application.aggregate([
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                name: "$_id",
                value: "$count",
              },
            },
          ]);
          // Capitalize the first letter and handle underscores in JavaScript
          data = data.map((item) => ({
            name: item.name
              ? item.name
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")
              : item.name,
            value: item.value,
          }));
        } catch (error) {
          console.error("Applications chart error:", error);
          // Fallback data
          data = [
            { name: "Pending", value: 0 },
            { name: "Approved", value: 0 },
            { name: "Rejected", value: 0 },
          ];
        }
        break;

      case "payments":
        // Get monthly payments for last 6 months
        try {
          const paymentsData = await Payment.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
              $group: {
                _id: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" },
                },
                total: { $sum: "$amount" },
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            {
              $project: {
                name: {
                  $dateToString: {
                    format: "%b",
                    date: {
                      $dateFromParts: {
                        year: "$_id.year",
                        month: "$_id.month",
                      },
                    },
                  },
                },
                value: "$total",
              },
            },
          ]);
          data = paymentsData;
        } catch (error) {
          // Fallback data if Payment collection doesn't exist
          data = [
            { name: "Jan", value: 0 },
            { name: "Feb", value: 0 },
            { name: "Mar", value: 0 },
          ];
        }
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid chart type",
        });
    }

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Get chart data error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chart data",
      error: error.message,
    });
  }
};

// Note: Landlord user management is now handled by landlordAuthController.js
// with the new Landlord schema

// System Settings (placeholder)
export const getSystemSettings = async (req, res) => {
  try {
    // This would typically fetch from a settings collection
    const settings = {
      siteName: "Ubani Landlord",
      maintenanceMode: false,
      allowRegistration: true,
      emailNotifications: true,
      smsNotifications: false,
      maxFileSize: 5242880, // 5MB
      allowedFileTypes: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
    };

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get system settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch system settings",
      error: error.message,
    });
  }
};
