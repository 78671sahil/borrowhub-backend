 import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    address: { type: String },
    idProof: { type: String },
    profilePic: { type: String },

    otp: String,
    otpExpiry: Date,

    

    isVerified: {
      type: Boolean,
      default: false,
    },
     rating: {
    type: Number,
    default: 4.5,   // ⭐ simple logic for now
  },
  },
  { timestamps: true }
);

   const User = mongoose.model("User", userSchema);
export default User;
  
