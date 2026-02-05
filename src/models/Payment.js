 import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    borrower: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    rentAmount: Number,
    depositAmount: Number,
    platformFee: Number,
    totalPaid: Number,

    razorpayOrderId: String,
    razorpayPaymentId: String,

    status: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "paid",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
