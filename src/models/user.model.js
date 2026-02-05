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

    otp: String,
    otpExpiry: Date,

    

    isVerified: {
      type: Boolean,
      default: false,
    },
    location: {
    type: { type: String, default: "Point" }, // Hamesha "Point" rahega
    coordinates: { type: [Number], default: [0, 0] } // [Longitude, Latitude]
  },
     rating: {
    type: Number,
    default: 4.5,   // ⭐ simple logic for now
  },
  profilePic: { type: String, default: "" },

  idProof: { type: String, default: "" }, // Yaha Cloudinary ka URL aayega
  isVerified: { type: Boolean, default: false } ,// (Optional
  address: { type: String, default: "" },
  },
  { timestamps: true }
);

   const User = mongoose.model("User", userSchema);
export default User;
  
