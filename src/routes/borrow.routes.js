 import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

 
import { 
  createBorrow, 
  confirmBorrow, 
  verifyPickup ,
  uploadPickupEvidence
} from "../controllers/borrow.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createBorrow);
router.post("/confirm", authMiddleware, confirmBorrow);
router.post("/verify-pickup", authMiddleware, verifyPickup);
router.post("/upload-evidence", authMiddleware, uploadPickupEvidence);

export default router;