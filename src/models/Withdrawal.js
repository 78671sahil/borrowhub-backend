import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    upiId: { type: String, required: true }, // User jo UPI daalega wo yahan aayegi
    status: {
      type: String,
      enum: ["pending", "completed", "rejected"],
      default: "pending", // Shuru mein pending, jab tu admin se pay karega tab completed
    },
  },
  { timestamps: true }
);

export default mongoose.model("Withdrawal", withdrawalSchema);