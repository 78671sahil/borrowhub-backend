 import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import  User  from "../models/user.model.js";
 import { generateOTP,sendSMS } from "../utils/otp.util.js";

 

// Register or Send OTP
export const register = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 min

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = existingUser;

    if (!user) {
      user = new User({
        name,
        phone,
        password: hashedPassword,
        otp,
        otpExpiry,
      });
    } else {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      user.password = hashedPassword;
    }

    await user.save();
   //ye rha otp ka code isko replace krna hoga sms wale code se future me
    console.log("REGISTER OTP:", otp); // SMS later

    res.json({ message: "OTP sent for registration" , otp: otp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Verify OTP
export const verifyRegisterOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// register ka data save
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: "User not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
         _id: user._id,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// forgot password otp bhejna
export const forgotPassword = async (req, res) => {
  const { phone } = req.body;

  const user = await User.findOne({ phone });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 2 * 60 * 1000);
  await user.save();

  console.log("RESET OTP:", otp);

  res.json({ message: "OTP sent for password reset" ,otp: otp });
};

// reset password otp verify
export const resetPassword = async (req, res) => {
  const { phone, otp, newPassword } = req.body;

  const user = await User.findOne({ phone });
  if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ message: "Password reset successful",otp: otp });
};

export const resendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "User already verified" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    console.log("RESEND OTP:", otp);

    res.json({ message: "OTP resent successfully" ,otp: otp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 