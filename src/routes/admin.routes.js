// // File: backend/routes/admin.routes.js

// import express from "express";
// import { getDisputes, resolveDispute } from "../controllers/admin.controller.js";
// import authMiddleware from "../middlewares/auth.middleware.js";

// const router = express.Router();

// // 🔥 Admin Routes
// // Note: Real world me yahan 'adminMiddleware' bhi hona chahiye, 
// // par abhi ke liye 'authMiddleware' kaafi hai startup ke liye.

// router.get("/disputes", authMiddleware, getDisputes); // Disputes ki list lao
// router.post("/resolve", authMiddleware, resolveDispute); // Faisla sunao

// export default router;


import express from "express";
import { 
  getDisputes, 
  resolveDispute, 
  getWithdrawals, 
  approveWithdrawal,
  fileCase,
    retryPenaltyCharge

} from "../controllers/admin.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// ⚖️ Court Routes
router.get("/disputes", authMiddleware, getDisputes); 
router.post("/resolve", authMiddleware, resolveDispute); 

// 💸 Payout Routes
router.get("/withdrawals", authMiddleware, getWithdrawals);
router.put("/withdrawals/:id/approve", authMiddleware, approveWithdrawal);
router.post("/file-case", authMiddleware, fileCase);
router.post("/retry-charge", authMiddleware, retryPenaltyCharge);

export default router;