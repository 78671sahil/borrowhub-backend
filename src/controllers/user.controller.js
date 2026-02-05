 // user.controller.js
import User from "../models/user.model.js";
// 👇 YE NYA FUNCTION ADD KAR
export const updateProfile = async (req, res) => {
  try {
    // Check kar user ID hai ya nahi (Middleware se aani chahiye)
    const userId = req.userId || req.user?._id || req.user?.id; 

    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized!" });
    }

    // Frontend se jo data aaya
    const { address, idProof, profilePic } = req.body;

    // Database update kar rahe hain
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          address: address, // Address save ho raha hai
          idProof: idProof, // ID Proof URL save ho raha hai
          profilePic: profilePic // Profile pic (optional)
        },
      },
      { new: true } // Taaki naya updated data wapas mile
    ).select("-password"); // Password mat bhejna

    res.status(200).json({ success: true, user: updatedUser });

  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

