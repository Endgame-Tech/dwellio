// Script to create the Alpha Landlord account
import dotenv from "dotenv";
import mongoose from "mongoose";
import Landlord from "../models/Landlord.js";

dotenv.config();

const createAlphaLandlord = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/ubani";
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    // Check if Alpha Landlord already exists
    const existingAlpha = await Landlord.findOne({
      landlordRole: "alpha_landlord",
    });
    if (existingAlpha) {
      console.log("Alpha Landlord already exists:", existingAlpha.email);
      process.exit(0);
    }

    // Create Alpha Landlord with your email
    const alphaLandlordData = {
      firstName: "Alpha",
      lastName: "Landlordistrator",
      email: "getchoma@gmail.com", // Your email as the Alpha Landlord
      password: "S0BwB$cuIqx_82Z", // Your specified passwordN
      landlordRole: "alpha_landlord",
      profile: {
        department: "Management",
        phoneNumber: "+234-XXX-XXX-XXXX", // You can update this later
        timezone: "Africa/Lagos",
        language: "en",
        bio: "Alpha Landlordistrator with full system access",
      },
      security: {
        isActive: true,
        isVerified: true,
        twoFactorEnabled: false, // You can enable this later for extra security
      },
      permissions: [], // Alpha landlord doesn't need explicit permissions
      audit: {
        createdAt: new Date(),
        // createdBy is not set for alpha landlord as they are the root landlord
      },
    };

    const alphaLandlord = new Landlord(alphaLandlordData);
    await alphaLandlord.save();

    console.log("✅ Alpha Landlord created successfully!");
    console.log("📧 Email:", alphaLandlord.email);
    console.log("🔐 Password: S0BwB$cuIqx_82Z");
    console.log("👑 Role:", alphaLandlord.landlordRole);
    console.log("🆔 ID:", alphaLandlord._id);
    console.log("");
    console.log(
      "🚀 You can now login to the landlord dashboard with these credentials."
    );
    console.log(
      "⚠️  For security, consider changing the password after first login."
    );
    console.log(
      "🔒 Consider enabling two-factor authentication in your profile settings."
    );
  } catch (error) {
    console.error("❌ Error creating Alpha Landlord:", error.message);
    if (error.code === 11000) {
      console.error("This email is already registered as an landlord.");
    }
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

// Run the script
createAlphaLandlord();
