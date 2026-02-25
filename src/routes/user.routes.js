import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
 
import { updateProfile } from "../controllers/user.controller.js";

const router = express.Router();

// 🔒 Protected route
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Profile data",
    user: req.user,
  });
});

export default router;



 

 

// 🔥 YE HAI WO DARWAZA JO GAYAB THA (404 Error wala)
router.put("/update-profile", authMiddleware, updateProfile); 

 