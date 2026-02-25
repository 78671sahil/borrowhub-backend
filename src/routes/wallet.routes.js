import express from "express";
import { getWalletData, requestWithdrawal } from "../controllers/wallet.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 💰 1. Get Wallet Balance
router.get("/", authMiddleware, getWalletData);

// 💸 2. Request Payout
router.post("/withdraw", authMiddleware, requestWithdrawal);

export default router;