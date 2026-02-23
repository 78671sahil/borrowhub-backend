// import express from "express";
// import {addItem} from "../controllers/item.controller.js";
// import authMiddleware from "../middlewares/auth.middleware.js";
// import multer from "multer";
// import { getAllItems } from "../controllers/item.controller.js";
// import { getMyItems } from "../controllers/item.controller.js";
// import { getLentOutItems } from "../controllers/item.controller.js";
// import { getBorrowedItems } from "../controllers/item.controller.js";
// import { getItemById } from "../controllers/item.controller.js";
// import { updateItem } from "../controllers/item.controller.js";
// import { borrowItem } from "../controllers/item.controller.js";
// import { deleteItem } from "../controllers/item.controller.js";

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// router.get("/", getAllItems);

// router.post(
//   "/add",
//   authMiddleware,           // 🔐 TOKEN CHECK
//   upload.array("images"),   // 📸 images[]
//   addItem
// );


// router.get("/my-items", authMiddleware, getMyItems);
// router.get("/lent-out", authMiddleware, getLentOutItems);
// router.get("/borrowed", authMiddleware, getBorrowedItems);
// router.get("/:id", getItemById);
 
//  router.put(
//   "/:id",
//   authMiddleware,
//   upload.array("images"),
//   updateItem
// );

// router.post(
//   "/:id/borrow",
//   authMiddleware,
//   borrowItem
// );


// router.delete("/:id", authMiddleware, deleteItem);

// export default router;

import express from "express";
import {
  addItem, getAllItems, getMyItems, getLentOutItems,
  getBorrowedItems, getItemById, updateItem, borrowItem, deleteItem
} from "../controllers/item.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// 📍 1. General Route
router.get("/", getAllItems);

// 📍 2. Specific Routes (HAMESHA UPAR)
router.get("/nearby", getAllItems); // Assuming nearby fetches all for now
router.get("/my-items", authMiddleware, getMyItems);
router.get("/lent-out", authMiddleware, getLentOutItems);
router.get("/borrowed", authMiddleware, getBorrowedItems);

// 🆔 3. Dynamic Route (HAMESHA NEECHE)
router.get("/:id", getItemById);

// 📝 4. Action Routes
router.post("/add", authMiddleware, upload.array("images"), addItem);
router.put("/:id", authMiddleware, upload.array("images"), updateItem);
router.post("/:id/borrow", authMiddleware, borrowItem);
router.delete("/:id", authMiddleware, deleteItem);

export default router;
 