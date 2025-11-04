// ubani/models/Estate.js
import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

const estateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    state: { type: String, required: true },
    city: { type: String, required: true },
    lga: { type: String, required: true },
    address: { type: String, required: true },
    gps: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  propertyIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
  ],
  rulesDocument: { type: String }, // URL or file path
  facilities: [facilitySchema],
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  sharedMedia: [String], // image URLs
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

estateSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Estate = mongoose.model("Estate", estateSchema);
export default Estate;
