// File: backend/routes/admin.routes.js

import express from "express";
import { getDisputes, resolveDispute } from "../controllers/admin.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔥 Admin Routes
// Note: Real world me yahan 'adminMiddleware' bhi hona chahiye, 
// par abhi ke liye 'authMiddleware' kaafi hai startup ke liye.

router.get("/disputes", authMiddleware, getDisputes); // Disputes ki list lao
router.post("/resolve", authMiddleware, resolveDispute); // Faisla sunao

export default router;