 import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Token uthao header se
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ User find karo (DB se)
    // Note: Kabhi token me 'id' hota hai kabhi 'userId'. Dono check kar liye.
    const userId = decoded.userId || decoded.id || decoded._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 4️⃣ req me user attach karo
    req.user = user;

    // 5️⃣ Next controller ko jaane do
    next();

  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;