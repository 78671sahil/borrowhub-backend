 import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },

    location: {
      city: { type: String, required: true },
      address: String,
      pincode: { type: String, required: true },
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
      enum: ["available", "borrowed" ,"reserved"],
      default: "available",
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

    // ✅ ADD THIS
   
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
