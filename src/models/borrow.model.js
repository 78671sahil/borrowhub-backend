//  import mongoose from "mongoose";

// const borrowSchema = new mongoose.Schema(
//   {
//     item: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Item",
//       required: true,
//     },

//     borrower: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     borrowFrom: {
//       type: Date,
//       required: true,
//     },

//     borrowTo: {
//       type: Date,
//       required: true,
//     },

//     deposit: Number,
//     pricePerDay: Number,

//     paymentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Payment",
//     },

//     status: {
//       type: String,
//       enum: ["active", "returned"],
//       default: "active",
//     },

//     penaltyAmount: { type: Number, default: 0 },
//     refundedAmount: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Borrow", borrowSchema);
 import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },

    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ FIXED: Wapas purane naam kar diye
    borrowFrom: {
      type: Date,
      required: true,
    },

    borrowTo: {
      type: Date,
      required: true,
    },

    // ✅ FIXED: Purane naam
    pricePerDay: { type: Number },
    totalRent: { type: Number },

    deposit: { type: Number, default: 0 },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    status: {
      type: String,
      enum: ["active", "returned", "disputed", "completed", "overdue", "reserved"],
      default: "reserved",
    },

    // 🔥 FIX: Ye naya field zaroori hai OTP fix ke liye
    pickupOtp: { type: String }, 

    // Evidence fields
    pickupEvidence: { type: [String], default: [] },

    damagePhotos: [
        { type: String } 
    ],

    // Mandate Info
    mandateDetails: {
      subscriptionId: { type: String }, 
      limit: { type: Number },          
      isActive: { type: Boolean, default: true }
    },

    // Return Security
    returnOtp: { type: String }, 

    penaltyAmount: { type: Number, default: 0 }, 
    finalDeduction: { type: Number, default: 0 }, 
    
    refundedAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Borrow", borrowSchema);