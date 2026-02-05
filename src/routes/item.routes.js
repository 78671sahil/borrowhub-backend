import express from "express";
import {addItem} from "../controllers/item.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import multer from "multer";
import { getAllItems } from "../controllers/item.controller.js";
import { getMyItems } from "../controllers/item.controller.js";
import { getLentOutItems } from "../controllers/item.controller.js";
import { getBorrowedItems } from "../controllers/item.controller.js";
import { getItemById } from "../controllers/item.controller.js";
import { updateItem } from "../controllers/item.controller.js";
import { borrowItem } from "../controllers/item.controller.js";
import { deleteItem } from "../controllers/item.controller.js";
 import { getItemsNearMe } from "../controllers/item.controller.js";
const router = express.Router();
const upload = multer({ dest: "uploads/" });
router.get("/nearby", getItemsNearMe); 
// URL banega: http://localhost:5000/api/items/nearby?lat=...&lng=...

router.get("/", getAllItems);

router.post(
  "/add",
  authMiddleware,           // 🔐 TOKEN CHECK
  upload.array("images"),   // 📸 images[]
  addItem
);


router.get("/my-items", authMiddleware, getMyItems);
router.get("/lent-out", authMiddleware, getLentOutItems);
router.get("/borrowed", authMiddleware, getBorrowedItems);
router.get("/:id", getItemById);
 
 router.put(
  "/:id",
  authMiddleware,
  upload.array("images"),
  updateItem
);

router.post(
  "/:id/borrow",
  authMiddleware,
  borrowItem
);




router.delete("/:id", authMiddleware, deleteItem);

export default router;
