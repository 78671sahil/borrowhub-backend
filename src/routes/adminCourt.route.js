import express from "express";
import { verifyToken, verifyAdmin } from "../middleware/auth.middleware.js"; // verifyAdmin middleware banana padega
import { fileCase, getCourtCases, executeVerdict } from "../controllers/adminCourt.controller.js";

const router = express.Router();

// Owner Report karega
router.post("/file-case", verifyToken, fileCase);

// Admin dekhega (Sirf Admin allowed hona chahiye)
// Filhal verifyToken laga raha hu, baad me 'isAdmin' check laga dena
router.get("/cases", verifyToken, getCourtCases);

// Admin Faisla sunayega
router.post("/verdict", verifyToken, executeVerdict);

export default router;