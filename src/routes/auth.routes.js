 import { Router } from "express";
 import { resendOtp } from "../controllers/auth.controller.js";
 
import {
  register,
  verifyRegisterOtp,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = Router();
router.post("/register", register);
router.post("/verify-register-otp", verifyRegisterOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOtp);

 
export default router;
