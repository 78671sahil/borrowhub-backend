 import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  requestReturn,
  verifyReturnOtp,
  approvePenalty,
  disputePenalty,
  getMyPenaltyApprovals,
  getPendingReturns,
  runAutoSettlement
} from "../controllers/return.controller.js";

const router = express.Router();

/* -----------------------------------------------------
   BORROWER ROUTES
----------------------------------------------------- */
// 1. Return Request Start karna (Generate OTP)
router.post("/request", authMiddleware, requestReturn);

// 2. Check karna ki "Kya mujh par koi penalty lagi hai?" (My Items page ke liye)
router.get("/my-approvals", authMiddleware, getMyPenaltyApprovals);

// 3. Penalty Action: Approve (Pay) or Dispute (Reject)
router.post("/approve-penalty", authMiddleware, approvePenalty);
router.post("/dispute-penalty", authMiddleware, disputePenalty);


/* -----------------------------------------------------
   LENDER ROUTES
----------------------------------------------------- */
// 1. "To Receive" List lana (Pending Returns)
router.get("/pending-requests", authMiddleware, getPendingReturns);

// 2. Item wapas lete waqt OTP verify karna (+ Damage claim karna)
router.post("/verify/:borrowId", authMiddleware, verifyReturnOtp);


/* -----------------------------------------------------
   SYSTEM / ADMIN ROUTES
----------------------------------------------------- */
// Cron Job: Auto-settle pending penalties after 24 hours
router.get("/run-cron", runAutoSettlement);


export default router;