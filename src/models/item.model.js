 import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    // 📝 BASIC INFO
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, default: "Good" },

    // 💰 MONEY
    pricePerDay: { type: Number, required: true },
    deposit: { type: Number, default: 0 },

    // 📅 DURATION
    minDays: { type: Number, default: 1 },
    maxDays: { type: Number, default: 30 },

    // 📍 LOCATION
    city: { type: String, default: "" },
    address: { type: String, default: "" },
    pincode: { type: String, default: "" },

    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },

    // 🖼️ IMAGES
    images: [
      {
        url: { type: String, required: true },
        isCover: { type: Boolean, default: false },
      },
    ],

    // 🔥 MANDATE
    mandate: {
      isActive: { type: Boolean, default: false },
      mandateId: { type: String, default: "" },
      maxDeductibleAmount: { type: Number, default: 0 }
    },

    // ⚖️ ADMIN COURT
    adminCourt: {
      isCaseOpen: { type: Boolean, default: false },
      reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      reason: { type: String, default: "" },
      caseStartedAt: { type: Date },
      adminNotes: { type: String, default: "" },
      verdict: { type: String, enum: ["pending", "guilty", "innocent"], default: "pending" }
    },

    // 👑 OWNER & BORROWER INFO
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    // 🚦 STATUS
    status: {
      type: String,
      // "reserved" ka matlab Payment ho gayi, par item abhi Lender ke paas hai (Handover pending)
      enum: ["available", "borrowed", "reserved", "disputed_in_court", "completed"], 
      default: "available",
    },

    // 📅 DATES
    borrowFrom: Date,
    borrowTo: Date,

    // 🔥 FIX: Ye Field Zaroori hai "To Give" page ke liye
    pickupOtp: { type: String, default: "" }, 
    pickupEvidence: { type: [String], default: [] },

    // 🔄 RETURN REQUEST
    returnRequest: {
        otp: { type: String },
        status: { type: String, enum: ["pending", "completed"], default: "pending" },
        requestedAt: { type: Date }
    },
  },
  { timestamps: true }
);

itemSchema.index({ location: "2dsphere" });

export default mongoose.model("Item", itemSchema);