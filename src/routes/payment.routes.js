import express from "express";
import { createPaymentOrder } from "../controllers/payment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { verifyPayment } from "../controllers/payment.controller.js";
import {mockPaymentSuccess} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-order", authMiddleware, createPaymentOrder);

router.post("/verify", authMiddleware, verifyPayment);
router.post("/mock-success", authMiddleware, mockPaymentSuccess);

export default router;
 