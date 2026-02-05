 import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

// 👇 Yahan 'getNavbarCounts' import karna zaroori hai
import { 
  createBorrow, 
  confirmBorrow, 
  verifyPickup,
  uploadPickupEvidence,
  getNavbarCounts 
} from "../controllers/borrow.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createBorrow);
router.post("/confirm", authMiddleware, confirmBorrow);

// 🔥🔥🔥 YE WALI LINE MISSING THI 👇
router.get("/navbar-counts", authMiddleware, getNavbarCounts);

router.post("/verify-pickup", authMiddleware, verifyPickup);
router.post("/upload-evidence", authMiddleware, uploadPickupEvidence);

export default router;