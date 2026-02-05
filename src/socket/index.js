 import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/Message.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    /* ---------------- AUTH ---------------- */
    const token = socket.handshake.auth?.token;
    if (!token) {
      console.log("❌ No token provided");
      socket.disconnect();
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId || decoded.id;
      console.log("✅ Auth user:", socket.userId);

      // 🔔 personal room (notifications ke liye)
      socket.join(socket.userId);
    } catch (err) {
      console.log("❌ Invalid token");
      socket.disconnect();
      return;
    }

    /* ---------------- JOIN CHAT ROOM ---------------- */
    socket.on("joinRoom", ({ roomId }) => {
      if (!roomId) return;
      socket.join(roomId);
      console.log(`👥 ${socket.userId} joined room ${roomId}`);
    });

    socket.on("leaveRoom", ({ roomId }) => {
      if (!roomId) return;
      socket.leave(roomId);
      console.log(`🚪 ${socket.userId} left room ${roomId}`);
    });

    /* ---------------- SEND MESSAGE ---------------- */
    socket.on(
      "sendMessage",
      async ({ roomId, message, receiverId, clientId }) => {
        try {
          if (!roomId || !message?.text) return;

          // 1️⃣ DB me message save
          const savedMessage = await Message.create({
            conversation: roomId,
            sender: socket.userId,
            text: message.text,
            delivered: true,
            seen: false,
          });

          // 2️⃣ Chat room me realtime message bhejo
          io.to(roomId).emit("receiveMessage", {
            ...savedMessage.toObject(),
            clientId, // optimistic UI ke liye
          });

          // 3️⃣ 🔔 OFFLINE NOTIFICATION (agar user room me nahi hai)
          if (receiverId) {
            io.to(receiverId).emit("newNotification", {
              type: "chat",
              conversationId: roomId,
              senderId: socket.userId,
              text: message.text, // 🔥 IMPORTANT
            });
          }
        } catch (err) {
          console.error("❌ sendMessage error:", err);
        }
      }
    );

    /* ---------------- MARK SEEN ---------------- */
    socket.on("markSeen", async ({ conversationId }) => {
      try {
        if (!conversationId) return;

        await Message.updateMany(
          {
            conversation: conversationId,
            sender: { $ne: socket.userId },
            seen: false,
          },
          { seen: true }
        );

        // seen update room me broadcast
        io.to(conversationId).emit("messagesSeen");
      } catch (err) {
        console.error("❌ markSeen error:", err);
      }
    });

    /* ---------------- DISCONNECT ---------------- */
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => io;
