//   import express from "express";
// import {
//   startConversation,
//   getMessages,
//   getConversations,
//   deleteConversation,
  
//   getConversationById,
// } from "../controllers/chat.controller.js";
// import authMiddleware from "../middlewares/auth.middleware.js";

// const router = express.Router();

// router.get("/conversations", authMiddleware, getConversations);
// router.post("/start", authMiddleware, startConversation);
// router.get("/:conversationId", authMiddleware, getMessages);
//  router.get("/conversation/:id", authMiddleware, getConversationById);
//  router.delete(
//   "/conversation/:id",
//   authMiddleware,
//   deleteConversation
// );



// export default router;
  import express from "express";
import {
  startConversation,
  getMessages,
  getConversations,
  deleteConversation,
  getConversationById,
} from "../controllers/chat.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/conversations", authMiddleware, getConversations);
router.post("/start", authMiddleware, startConversation);

// 🔥 IMPORTANT ORDER
router.get("/conversation/:id", authMiddleware, getConversationById);
router.delete("/conversation/:id", authMiddleware, deleteConversation);
router.get("/:conversationId", authMiddleware, getMessages);

export default router;
