// ubani/models/Property.js
import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    state: { type: String, required: true },
    city: { type: String, required: true },
    lga: { type: String, required: true },
    address: { type: String, required: true },
    gps: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["flat", "duplex", "bungalow", "studio", "shop", "office"],
      required: true,
    },
    landlordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Simplified for tenant-focused MVP
    landlordContact: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
      name: { type: String, required: true },
    },
    location: locationSchema,
    media: [
      {
        url: { type: String },
        filename: { type: String },
        originalName: { type: String },
        size: { type: Number },
      },
    ],
    amenities: [{ type: String }],
    description: { type: String, required: true },
    rent: {
      amount: { type: Number, required: true },
      period: { type: String, enum: ["monthly", "yearly"], default: "yearly" },
    },
    deposit: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "occupied", "pending"],
      default: "available",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);
export default Property;
