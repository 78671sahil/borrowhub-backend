 import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },

    // location: {
    //   type: { type: String, default: "Point" }, // GeoJSON requirement
    //   coordinates: { type: [Number], default: [0, 0] }, // GeoJSON requirement
    //   city: String,
    //   address: String,
    //   pincode: String,
    // },
    location: {
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number], required: true }, // [longitude, latitude] dhyan rakhna, Mongo mein ulta hota hai (lng pehle, lat baad mein)
  city: { type: String }
},

    description: String,
    condition: String,

    minDays: Number,
    maxDays: Number,

    pricePerDay: Number,
    deposit: Number,

    images: [
      {
        url: String,
        isCover: Boolean,
      },
    ],

    // ✅ ADD THIS
    status: {
      type: String,
      enum: ["available", "borrowed" ,"reserved","disputed_in_court", 
      "stolen"],
      default: "available",
    },
    adminCourt: {
  reason: { type: String },
  caseStartedAt: { type: Date },
  verdict: { type: String, enum: ["pending", "guilty", "innocent"], default: "pending" }, // 🔥 YE ADD KARNA HAI
  adminNote: { type: String } // 🔥 YE BHI ADD KAR DE SAFETY KE LIYE
},


   
borrowedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},

borrowFrom: {
  type: Date,
},

borrowTo: {
  type: Date,
},


    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickupOtp: { type: String },
    pickupEvidence: [{ type: String }],

    // ✅ ADD THIS
   
  },
  { timestamps: true }
);

itemSchema.index({ "location.coordinates": "2dsphere" });

export default mongoose.model("Item", itemSchema);
