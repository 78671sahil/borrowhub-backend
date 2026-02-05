//  import { Server } from "socket.io";
// import jwt from "jsonwebtoken";
// import Message from "../models/Message.js";

// let io;

// export const initSocket = (server) => {
//   io = new Server(server, {
//     cors: {
//       origin: "http://localhost:3000",
//       credentials: true,
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("🔌 User connected:", socket.id);

//     /* ---------------- AUTH ---------------- */
//     const token = socket.handshake.auth?.token;
//     if (!token) {
//       console.log("❌ No token");
//       socket.disconnect();
//       return;
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       socket.userId = decoded.userId || decoded.id;

//       console.log("✅ Auth user:", socket.userId);

//       // 🔔 personal room for notifications
//       socket.join(socket.userId);
//     } catch (err) {
//       console.log("❌ Invalid token");
//       socket.disconnect();
//       return;
//     }

//     /* ---------------- JOIN ROOM ---------------- */
//     socket.on("joinRoom", ({ roomId }) => {
//       if (!roomId) return;
//       socket.join(roomId);
//       console.log(`👥 ${socket.userId} joined ${roomId}`);
//     });

//     socket.on("leaveRoom", ({ roomId }) => {
//       if (!roomId) return;
//       socket.leave(roomId);
//       console.log(`🚪 ${socket.userId} left ${roomId}`);
//     });

//     /* ---------------- SEND MESSAGE ---------------- */
//     socket.on(
//       "sendMessage",
//       async ({ roomId, message, receiverId, clientId }) => {
//         if (!roomId || !message?.text) return;

//         // ✅ SAVE TO DB
//         const savedMessage = await Message.create({
//           conversation: roomId,
//           sender: socket.userId,
//           text: message.text,
//           delivered: true,
//         });

//         // ✅ SEND TO CHAT ROOM
//         io.to(roomId).emit("receiveMessage", {
//           ...savedMessage.toObject(),
//           clientId, // 🔥 IMPORTANT for optimistic UI
//         });

//         // ✅ OFFLINE NOTIFICATION
//         if (receiverId) {
//           io.to(receiverId).emit("newNotification", {
//             conversationId: roomId,
//             senderId: socket.userId,
//             text: message.text,
//           });
//         }
//       }
//     );

//     /* ---------------- MARK SEEN ---------------- */
//     socket.on("markSeen", async ({ conversationId }) => {
//       if (!conversationId) return;

//       await Message.updateMany(
//         {
//           conversation: conversationId,
//           sender: { $ne: socket.userId },
//           seen: false,
//         },
//         { seen: true }
//       );

//       io.to(conversationId).emit("messagesSeen");
//     });

//     /* ---------------- DISCONNECT ---------------- */
//     socket.on("disconnect", () => {
//       console.log("🔴 User disconnected:", socket.id);
//     });
//   });

//   return io;
// };

// export const getIO = () => io;

 import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "./models/Message.js"; // Path check karlena

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "http://localhost:3000", credentials: true }
  });

  io.on("connection", (socket) => {
    const token = socket.handshake.auth?.token;
    if (!token) return socket.disconnect();

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // 🔥 String conversion zaroori hai
      socket.userId = (decoded.userId || decoded.id).toString();
      socket.join(socket.userId);
      console.log("✅ Socket Connected User:", socket.userId);
    } catch (err) {
      return socket.disconnect();
    }

    socket.on("joinRoom", ({ roomId }) => {
      if (roomId) {
        socket.join(roomId);
        console.log(`User ${socket.userId} joined room ${roomId}`);
      }
    });

    socket.on("sendMessage", async ({ roomId, message, receiverId }) => {
      console.log("📩 Msg Request:", message.text, "Room:", roomId);
      
      if (!roomId || !message?.text) return;
      
      try {
        const savedMessage = await Message.create({
          conversation: roomId,
          sender: socket.userId,
          text: message.text,
          delivered: true,
        });

        // 1. Room me sabko bhejo
        io.to(roomId).emit("receiveMessage", savedMessage);

        // 2. Notification sirf tab bhejo agar receiverId valid ho
        if (receiverId) {
          io.to(receiverId.toString()).emit("newNotification", {
            type: "chat",
            conversationId: roomId,
            text: message.text,
          });
        }
      } catch (err) {
        console.error("❌ DB Save Error:", err);
      }
    });

    socket.on("disconnect", () => console.log("User disconnected"));
  });
  return io;
};