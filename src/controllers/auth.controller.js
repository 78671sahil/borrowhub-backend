 
// //   }
// // };





// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";
// import { sendWhatsAppOTP } from "../utils/whatsapp.util.js";

// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// // 1. Register
// export const register = async (req, res) => {
//   try {
//     const { name, phone, password } = req.body;
    
//     // Check if user already exists and is verified
//     const existingUser = await User.findOne({ phone });
//     if (existingUser && existingUser.isVerified) {
//       return res.status(400).json({ success: false, message: "User already exists with this phone number." });
//     }

//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 Min
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 🔥 SAVE/UPDATE USER: upsert aur new true rakha h taaki updated doc return ho
//     const updatedUser = await User.findOneAndUpdate(
//       { phone },
//       { name, password: hashedPassword, otp, otpExpiry, isVerified: false },
//       { upsert: true, new: true, runValidators: true }
//     );

//     console.log(`✅ Registration OTP for ${phone} saved in DB: ${updatedUser.otp}`);

//     // WhatsApp par bhejo
//     await sendWhatsAppOTP(phone, otp);

//     res.json({ success: true, message: "OTP sent to your WhatsApp number." });
//   } catch (err) {
//     console.error("REGISTER ERROR:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 2. Verify OTP (Registration ke liye)
// export const verifyRegisterOtp = async (req, res) => {
//   try {
//     const { phone, otp } = req.body;
//     console.log(`🔍 Verification Attempt - Phone: ${phone}, Entered OTP: ${otp}`);

//     const user = await User.findOne({ phone });

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found." });
//     }

//     console.log(`📁 DB stored OTP: ${user.otp}, Expiry: ${user.otpExpiry}`);

//     // 🔥 STRICT MATCHING
//     if (!user.otp || user.otp !== otp) {
//       console.log("❌ OTP Mismatch!");
//       return res.status(400).json({ success: false, message: "Invalid OTP. Please check again." });
//     }

//     if (user.otpExpiry < new Date()) {
//       console.log("❌ OTP Expired!");
//       return res.status(400).json({ success: false, message: "OTP has expired." });
//     }

//     // Success
//     user.isVerified = true;
//     user.otp = null; // Clear OTP after use
//     user.otpExpiry = null;
//     await user.save();

//     console.log(`✅ User ${phone} verified successfully!`);
//     res.json({ success: true, message: "Verification successful. You can now login." });
//   } catch (err) {
//     console.error("VERIFY ERROR:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 3. Login
// export const login = async (req, res) => {
//   try {
//     const { phone, password } = req.body;
//     const user = await User.findOne({ phone });

//     if (!user) return res.status(404).json({ success: false, message: "User not found." });
//     if (!user.isVerified) return res.status(400).json({ success: false, message: "Please verify your phone number first." });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials." });

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

//     res.json({ 
//       success: true, 
//       token, 
//       user: { _id: user._id, name: user.name, phone: user.phone } 
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 4. Forgot Password
// export const forgotPassword = async (req, res) => {
//   try {
//     const { phone } = req.body;
//     const user = await User.findOne({ phone });
    
//     if (!user) return res.status(404).json({ success: false, message: "User not found." });

//     const otp = generateOTP();
//     user.otp = otp;
//     user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
//     await user.save();

//     console.log(`✅ Reset OTP for ${phone} saved in DB: ${otp}`);
//     await sendWhatsAppOTP(phone, otp);

//     res.json({ success: true, message: "Reset OTP sent to WhatsApp." });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 5. Reset Password (Reset page pe verify + update)
// export const resetPassword = async (req, res) => {
//   try {
//     const { phone, otp, newPassword } = req.body;
    
//     const user = await User.findOne({ phone });
//     if (!user) return res.status(404).json({ success: false, message: "User not found." });

//     // Verify OTP first
//     if (!user.otp || user.otp !== otp || user.otpExpiry < new Date()) {
//       return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
//     }

//     user.password = await bcrypt.hash(newPassword, 10);
//     user.otp = null;
//     user.otpExpiry = null;
//     await user.save();

//     res.json({ success: true, message: "Password reset successful." });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 6. Resend OTP
// export const resendOtp = async (req, res) => {
//   try {
//     const { phone } = req.body;
//     const user = await User.findOne({ phone });

//     if (!user) return res.status(404).json({ success: false, message: "User not found." });

//     const otp = generateOTP();
//     user.otp = otp;
//     user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
//     await user.save();

//     console.log(`✅ Resend OTP for ${phone} saved in DB: ${otp}`);
//     await sendWhatsAppOTP(phone, otp);

//     res.json({ success: true, message: "OTP resent successfully." });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { sendWhatsAppOTP } from "../utils/whatsapp.util.js";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. Register
export const register = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    
    // Check if user already exists and is verified
    const existingUser = await User.findOne({ phone });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ success: false, message: "User already exists with this phone number." });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 Min
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 SAVE/UPDATE USER
    const updatedUser = await User.findOneAndUpdate(
      { phone },
      { name, password: hashedPassword, otp, otpExpiry, isVerified: false },
      { upsert: true, new: true, runValidators: true }
    );

    console.log(`✅ Registration OTP for ${phone} saved in DB: ${updatedUser.otp}`);

    // 🔥 FALLBACK LOGIC START (For Register)
    try {
        await sendWhatsAppOTP(phone, otp);
        res.json({ success: true, message: "OTP sent to your WhatsApp number." });
    } catch (waError) {
        console.error("⚠️ WhatsApp API Failed via Register:", waError.message);
        // Fallback: Send OTP in response so student can see alert
        res.json({ 
            success: true, 
            message: "Network Issue. Use this OTP.", 
            fallbackOtp: otp // <--- Backup OTP
        });
    }
    // 🔥 FALLBACK LOGIC END

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Verify OTP (Registration ke liye)
export const verifyRegisterOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    console.log(`🔍 Verification Attempt - Phone: ${phone}, Entered OTP: ${otp}`);

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    console.log(`📁 DB stored OTP: ${user.otp}, Expiry: ${user.otpExpiry}`);

    // 🔥 STRICT MATCHING
    if (!user.otp || user.otp !== otp) {
      console.log("❌ OTP Mismatch!");
      return res.status(400).json({ success: false, message: "Invalid OTP. Please check again." });
    }

    if (user.otpExpiry < new Date()) {
      console.log("❌ OTP Expired!");
      return res.status(400).json({ success: false, message: "OTP has expired." });
    }

    // Success
    user.isVerified = true;
    user.otp = null; // Clear OTP after use
    user.otpExpiry = null;
    await user.save();

    console.log(`✅ User ${phone} verified successfully!`);
    res.json({ success: true, message: "Verification successful. You can now login." });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Login
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });

    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    if (!user.isVerified) return res.status(400).json({ success: false, message: "Please verify your phone number first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials." });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ 
      success: true, 
      token, 
      user: { _id: user._id, name: user.name, phone: user.phone } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    console.log(`✅ Reset OTP for ${phone} saved in DB: ${otp}`);
    
    // 🔥 FALLBACK LOGIC START (For Forgot Password)
    try {
        await sendWhatsAppOTP(phone, otp);
        res.json({ success: true, message: "Reset OTP sent to WhatsApp." });
    } catch (waError) {
        console.error("⚠️ WhatsApp API Failed via ForgotPass:", waError.message);
        res.json({ 
            success: true, 
            message: "Network Issue. Use this OTP.", 
            fallbackOtp: otp 
        });
    }
    // 🔥 FALLBACK LOGIC END

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 5. Reset Password (Reset page pe verify + update)
export const resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;
    
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    // Verify OTP first
    if (!user.otp || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ success: true, message: "Password reset successful." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 6. Resend OTP
export const resendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });

    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    console.log(`✅ Resend OTP for ${phone} saved in DB: ${otp}`);
    
    // 🔥 FALLBACK LOGIC START (For Resend OTP)
    try {
        await sendWhatsAppOTP(phone, otp);
        res.json({ success: true, message: "OTP resent successfully." });
    } catch (waError) {
        console.error("⚠️ WhatsApp API Failed via Resend:", waError.message);
        res.json({ 
            success: true, 
            message: "Network Issue. Use this OTP.", 
            fallbackOtp: otp 
        });
    }
    // 🔥 FALLBACK LOGIC END

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};