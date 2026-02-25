import User from "../models/user.model.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    // Frontend ke Modal se Address aur ID Proof aayega
    const { address, idProof } = req.body; 

    // Database mein permanently save kar do
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { address, idProof, isVerified: true }, // isVerified true hote hi OTP hamesha ke liye unlock!
      { new: true }
    ).select("-password");

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};