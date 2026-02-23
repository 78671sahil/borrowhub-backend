import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const verifyToken = (req, res, next) => {
  try {
    // 1️⃣ token uthao header se
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" });
    }

    // format: Bearer token
    const token = authHeader.split(" ")[1];

    // 2️⃣ token verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ user id request me daal do
    req.userId = decoded.userId;

    // 4️⃣ aage jaane do
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


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

    // 3️⃣ User find karo
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 4️⃣ req me user attach karo
    req.user = user;

    // 5️⃣ Next controller ko jaane do
    next();

  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;

