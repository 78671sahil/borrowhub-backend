  
// import express from "express";
// import authMiddleware from "../middlewares/auth.middleware.js"; // Path aur naam check kar lena

// import {
//   requestReturn,
//   getPendingReturns,
//   verifyReturnOtp,
//   fileCase,
//   getCourtCases,
//   executeVerdict,
  
//   // Dummies
//   getMyPenaltyApprovals,
//   approvePenalty,
//   disputePenalty,
//   runAutoSettlement
// } from "../controllers/return.controller.js";

// const router = express.Router();

// /* =========================================================
//    NOTE: Server.js me app.use("/api", returnRoutes) hona chahiye.
   
//    Isliye hum yahan manually "/return/" prefix laga rahe hain 
//    taaki Frontend ka URL match ho jaye.
// ========================================================= */

// // 1. Borrower: Request Return (OTP)
// // URL banega: /api/return/request
// router.post("/return/request", authMiddleware, requestReturn);

// // 2. Lender: Handover Page (Pending Requests)
// // URL banega: /api/return/pending-requests
// router.get("/return/pending-requests", authMiddleware, getPendingReturns);

// // 3. Lender: Verify OTP
// // URL banega: /api/return/verify
// router.post("/return/verify", authMiddleware, verifyReturnOtp);
// router.post("/return/verify/:borrowId", authMiddleware, verifyReturnOtp); // Backup path

// // 4. Admin Court & Theft
// router.post("/admin-court/file-case", authMiddleware, fileCase);
// router.get("/admin-court/cases", authMiddleware, getCourtCases);
// router.post("/admin-court/verdict", authMiddleware, executeVerdict);

// // 5. Old/Dummy Paths (Crash Prevention)
// router.get("/return/my-approvals", authMiddleware, getMyPenaltyApprovals);
// router.post("/return/approve-penalty", authMiddleware, approvePenalty);
// router.post("/return/dispute-penalty", authMiddleware, disputePenalty);
// router.get("/return/run-cron", runAutoSettlement);

// export default router;

import express from "express";

// 🔥 FIX: Auth Import ko robust banaya
import * as AuthModule from "../middlewares/auth.middleware.js"; 
// Check kar rahe hain ki export default hai ya named export
const authMiddleware = AuthModule.default || AuthModule.authMiddleware || AuthModule.verifyToken;

import {
  requestReturn,
  getPendingReturns,
  verifyReturnOtp,
  fileCase,
  getCourtCases,
  executeVerdict,
  getMyPenaltyApprovals // Dummy function
} from "../controllers/return.controller.js";

const router = express.Router();

// Console log to verify middleware load
if (!authMiddleware) {
    console.error("❌ CRITICAL ERROR: Auth Middleware not found! Check ../middlewares/auth.middleware.js");
} else {
    console.log("✅ Auth Middleware Loaded Successfully in Return Routes");
}

/* =========================================================
   ROUTES (Ab Middleware har jagah sahi se laga hai)
========================================================= */

// 1. Borrower: Request Return
router.post("/return/request", authMiddleware, requestReturn);

// 2. Lender: Pending Requests (Handover)
router.get("/return/pending-requests", authMiddleware, getPendingReturns);

// 3. Lender: Verify OTP
router.post("/return/verify", authMiddleware, verifyReturnOtp);
router.post("/return/verify/:borrowId", authMiddleware, verifyReturnOtp);

// 4. Admin Court & Theft (Yehi fail ho raha tha)
router.post("/admin-court/file-case", authMiddleware, fileCase);
router.get("/admin-court/cases", authMiddleware, getCourtCases);
router.post("/admin-court/verdict", authMiddleware, executeVerdict);

// 5. Placeholders (Crash Prevention)
router.get("/return/my-approvals", authMiddleware, getMyPenaltyApprovals);

export default router;