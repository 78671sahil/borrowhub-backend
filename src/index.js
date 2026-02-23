 import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import connectDB from "./db/index.js";
import { initSocket } from "./socket/index.js";

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

// 🔥 SOCKET YAHIN INIT HOGA
initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
