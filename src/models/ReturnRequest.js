//  import mongoose from "mongoose";
 
//  const returnRequestSchema = new mongoose.Schema({
//   borrow: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Borrow",
//     required: true,   // 🔥 IMPORTANT
//   },

//   item: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Item",
//     required: true,
//   },

//   borrower: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },

//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },

//   otp: String,
//   otpExpiresAt: Date,

//   status: {
//     type: String,
//     enum: ["pending", "completed"],
//     default: "pending",
//   },
// }, { timestamps: true });


// export default mongoose.model("ReturnRequest", returnRequestSchema);
import mongoose from "mongoose";

const returnRequestSchema = new mongoose.Schema({
  borrow: { type: mongoose.Schema.Types.ObjectId, ref: "Borrow", required: true },
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  borrower: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  otp: String,
  otpExpiresAt: Date,

  // 🔥 NEW FIELDS FOR PENALTY LOGIC
  damageClaimed: { type: Number, default: 0 }, // Lender ne jo manga
  lateFeesCalculated: { type: Number, default: 0 }, // System ne jo calculate kiya
  totalPenalty: { type: Number, default: 0 },  // Total (Damage + Late)
  
  proofImage: { type: String }, // URL of the damaged photo uploaded by Lender
  
  lenderComment: { type: String },
   // Lender ka note (e.g., "Screen cracked")

   // Schema me ye field add kar de:
penaltyClaimedAt: { type: Date }, // Jab Lender ne penalty maangi
isAutoSettled: { type: Boolean, default: false }, // Tracking ke liye

  status: {
    type: String,
    // 👇 'waiting_approval' aur 'disputed' add kiya
     enum: ["pending", "waiting_approval", "completed", "disputed", "pending_borrower_action"], 
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.model("ReturnRequest", returnRequestSchema);