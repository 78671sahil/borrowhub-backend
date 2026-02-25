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

    borrowFrom: {
      type: Date,
      required: true,
    },

    borrowTo: {
      type: Date,
      required: true,
    },

    // Ab ye zero (0) rahega mostly, par field rehne de
    deposit: { type: Number, default: 0 },
    pricePerDay: Number,

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    status: {
      type: String,
      enum: ["active", "returned", "disputed" , "completed", "overdue", "reserved","cancelled"], // 'disputed' add kiya safety ke liye
      default: "active",
    },

    pickupOtp: { type: String }, // OTP for pickup verification

    // 🔥 1. Saboot (Pickup ke time)


     pickupPhotos: [
    { type: String } // URL of photos uploaded by Borrower
  ],

  // 🔥 2. Saboot (Return/Damage ke time)
  damagePhotos: [
    { type: String } // URL of photos uploaded by Lender (if damaged)
  ],

    

    // 🔥🔥 NEW: MANDATE STORE KARNE KE LIYE
    mandateDetails: {
      subscriptionId: { type: String }, // e.g. "sub_K98..."
      limit: { type: Number },          // e.g. 50000 (Item Value)
      isActive: { type: Boolean, default: true } // Jab tak item wapas na aaye, ye true rahega
    },

    // 🔥🔥 NEW: RETURN SECURITY
    // Jab item borrow hoga, tabhi ek OTP generate karke yahan save kar lenge
    returnOtp: { type: String }, 
    pickupEvidence: [{ type: String }], // Yahan photos ke URL save honge

    penaltyAmount: { type: Number, default: 0 }, // Late fees
    finalDeduction: { type: Number, default: 0 }, 
    totalPrice: { type: Number, default: 0 },// Total jo return ke time kata (Damage + Late)
    
    refundedAmount: { type: Number, default: 0 }, // Purana field (optional rakh)
  },
  { timestamps: true }
);


 

export default mongoose.model("Borrow", borrowSchema);