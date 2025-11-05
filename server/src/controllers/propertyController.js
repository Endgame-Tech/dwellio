// ubani/controllers/propertyController.js
import Property from "../models/Property.js";
import User from "../models/User.js";
import Application from "../models/Application.js";

// Get curated properties for tenant (only after move-out intent)
const getCuratedProperties = async (req, res) => {
  try {
    // Check if user has active move-out intent
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Allow all authenticated users to browse properties
    // Payment will be required only for application submission

    const {
      page = 1,
      limit = 12,
      city,
      minPrice,
      maxPrice,
      propertyType,
      bedrooms,
      bathrooms,
    } = req.query;

    // Build query with optional filters from query parameters
    const query = {
      status: "approved",
      isActive: true,
    };

    // Optional filters from query parameters
    if (city) {
      query["location.city"] = { $regex: city, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query["rent.amount"] = {};
      if (minPrice) query["rent.amount"].$gte = parseInt(minPrice);
      if (maxPrice) query["rent.amount"].$lte = parseInt(maxPrice);
    }

    if (propertyType) {
      query.type = propertyType;
    }

    if (bedrooms) {
      query.bedrooms = parseInt(bedrooms);
    }

    if (bathrooms) {
      query.bathrooms = parseInt(bathrooms);
    }

    const properties = await Property.find(query)
      .populate("landlordId", "fullName phoneNumber email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Property.countDocuments(query);

    res.json({
      success: true,
      data: properties,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
        limit: parseInt(limit),
      },

    });
  } catch (error) {
    console.error("Get curated properties error:", error);
    res.status(500).json({
      message: "Failed to fetch properties",
      error: error.message,
    });
  }
};

// Get single property details (requires move-out intent)
const getPropertyById = async (req, res) => {
  try {
    // Check if user has active move-out intent
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const moveOutIntent = user.tenantProfile?.moveOutIntent;
    if (!moveOutIntent || !moveOutIntent.facilitationRequested) {
      return res.status(403).json({
        message: "Property viewing requires move-out intent submission",
        code: "MOVE_OUT_INTENT_REQUIRED",
      });
    }

    if (moveOutIntent.status === "pending") {
      return res.status(403).json({
        message:
          "Complete your move-out request payment to view property details",
        code: "PAYMENT_REQUIRED",
      });
    }

    const property = await Property.findById(req.params.id).populate(
      "landlordId",
      "fullName phoneNumber email"
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Only show available properties
    if (property.status !== "available" || !property.isActive) {
      return res.status(404).json({ message: "Property not available" });
    }

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error("Get property error:", error);
    res.status(500).json({
      message: "Failed to fetch property",
      error: error.message,
    });
  }
};

// Submit application for a property
const submitApplication = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { moveInDate, monthlyBudget, occupancy, tenantMessage, urgency } =
      req.body;

    // Validate property exists and is available
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.status !== "available") {
      return res
        .status(400)
        .json({ message: "Property is not available for application" });
    }

    // Check if tenant already has pending application for this property
    const existingApplication = await Application.findOne({
      tenantId: req.user.userId,
      propertyId: propertyId,
      status: { $in: ["pending", "reviewing"] },
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({
          message: "You already have a pending application for this property",
        });
    }

    // Create application
    const application = new Application({
      tenantId: req.user.userId,
      propertyId: propertyId,
      landlordId: property.landlordId,
      applicationData: {
        moveInDate,
        monthlyBudget,
        occupancy,
        tenantMessage,
        urgency,
      },
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    console.error("Submit application error:", error);
    res.status(500).json({
      message: "Failed to submit application",
      error: error.message,
    });
  }
};

// Get tenant's applications
const getMyApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { tenantId: req.user.userId };
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate({
        path: "propertyId",
        select: "title type location media rent deposit",
      })
      .populate("landlordId", "fullName phoneNumber email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      data: applications,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get my applications error:", error);
    res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};

// Withdraw application
const withdrawApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findOne({
      _id: applicationId,
      tenantId: req.user.userId,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (
      application.status !== "pending" &&
      application.status !== "reviewing"
    ) {
      return res
        .status(400)
        .json({ message: "Cannot withdraw application in current status" });
    }

    application.status = "withdrawn";
    await application.save();

    res.json({
      success: true,
      message: "Application withdrawn successfully",
    });
  } catch (error) {
    console.error("Withdraw application error:", error);
    res.status(500).json({
      message: "Failed to withdraw application",
      error: error.message,
    });
  }
};

// Check move-out intent eligibility
const checkMoveOutEligibility = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const moveOutIntent = user.tenantProfile?.moveOutIntent;
    const hasActiveIntent =
      moveOutIntent && moveOutIntent.facilitationRequested;
    const isPaid = moveOutIntent && moveOutIntent.status !== "pending";

    res.json({
      success: true,
      data: {
        hasActiveIntent,
        isPaid,
        canViewProperties: hasActiveIntent && isPaid,
        moveOutIntent: moveOutIntent || null,
        message: !hasActiveIntent
          ? "Submit a move-out intent to access property listings"
          : !isPaid
          ? "Complete payment to view curated properties"
          : "You can now view properties matched to your preferences",
      },
    });
  } catch (error) {
    console.error("Check move-out eligibility error:", error);
    res.status(500).json({
      message: "Failed to check eligibility",
      error: error.message,
    });
  }
};

// Get property areas and statistics (for move-out intent form)
const getPropertyAreas = async (req, res) => {
  try {
    const areas = await Property.aggregate([
      { $match: { status: "available", isActive: true } },
      {
        $group: {
          _id: null,
          cities: { $addToSet: "$location.city" },
          lgas: { $addToSet: "$location.lga" },
          priceRanges: {
            $push: {
              min: { $min: "$rent.amount" },
              max: { $max: "$rent.amount" },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          cities: 1,
          lgas: 1,
          minPrice: { $min: "$priceRanges.min" },
          maxPrice: { $max: "$priceRanges.max" },
        },
      },
    ]);

    const propertyTypes = await Property.distinct("type", {
      status: "available",
      isActive: true,
    });

    res.json({
      success: true,
      data: {
        availableAreas: areas[0] || {
          cities: [],
          lgas: [],
          minPrice: 0,
          maxPrice: 0,
        },
        propertyTypes,
        totalAvailableProperties: await Property.countDocuments({
          status: "available",
          isActive: true,
        }),
      },
    });
  } catch (error) {
    console.error("Get property areas error:", error);
    res.status(500).json({
      message: "Failed to fetch property areas",
      error: error.message,
    });
  }
};

// Export all controller methods
export {
  getCuratedProperties,
  getPropertyById,
  submitApplication,
  getMyApplications,
  withdrawApplication,
  checkMoveOutEligibility,
  getPropertyAreas,
};
