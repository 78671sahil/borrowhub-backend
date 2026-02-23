import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔒 Protected route
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Profile data",
    user: req.user,
  });
});

export default router;
