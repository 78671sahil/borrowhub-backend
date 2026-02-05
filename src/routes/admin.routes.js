 import express from "express";

// ✅ CLEAN IMPORT (Kyunki ab auth.middleware default export hai)
import authMiddleware from "../middlewares/auth.middleware.js"; 

import {
  requestReturn,
  getPendingReturns,
  verifyReturnOtp,
  fileCase,
  getCourtCases,
  executeVerdict,
  getMyPenaltyApprovals
} from "../controllers/return.controller.js";

const router = express.Router();

/* =========================================================
   ROUTES
========================================================= */

// 1. Borrower: Request Return
router.post("/return/request", authMiddleware, requestReturn);

// 2. Lender: Pending Requests (Handover)
router.get("/return/pending-requests", authMiddleware, getPendingReturns);

// 3. Lender: Verify OTP
router.post("/return/verify", authMiddleware, verifyReturnOtp);
router.post("/return/verify/:borrowId", authMiddleware, verifyReturnOtp);

// 4. Admin Court & Theft
router.post("/admin-court/file-case", authMiddleware, fileCase);
router.get("/admin-court/cases", authMiddleware, getCourtCases);
router.post("/admin-court/verdict", authMiddleware, executeVerdict);

// 5. Placeholders
router.get("/return/my-approvals", authMiddleware, getMyPenaltyApprovals);

export default router;