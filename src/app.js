//  import express from "express";
// import cors from "cors";

// import chatRoutes from "./routes/chat.routes.js";
// import authRoutes from "./routes/auth.routes.js";
// import itemRoutes from "./routes/item.routes.js";
// import paymentRoutes from "./routes/payment.routes.js";
// import borrowRoutes from "./routes/borrow.routes.js";
// import adminroutes from "./routes/admin.routes.js";
// import courtRoutes from "./routes/admin.routes.js";
// import walletRoutes from "./routes/wallet.routes.js";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser"; // 👈 Upar import kar
// import userRoutes from "./routes/user.routes.js"; // 👈 Upar imports mein add kar

// // ... baaki app.use() ke paas ye add kar:
//  // 👈 Iske lagte hi 404 error khatam!
// // ... baaki imports
//  // 👈 app.use(express.json()) ke neeche daal de
// dotenv.config();


// import returnRoutes from "./routes/return.routes.js";


// const app = express();
// app.use(cookieParser());

//  app.use(cors({
//   origin: [
//     "http://localhost:3000",        // Tere local testing ke liye
//     "http://localhost:5173",        // (Agar Vite use karta hai toh)
//     "https://www.borrowhub.in",     // Teri live website (www ke saath)
//     "https://borrowhub.in"          // Teri live website (bina www ke)
//   ],
//   credentials: true,
// }));

// app.use(express.json());
// app.use("/api/user", userRoutes);

// app.use("/api/chat", chatRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/items", itemRoutes);
// app.use("/api/payment", paymentRoutes);
// app.use("/api/return", returnRoutes);
// app.use("/api/borrows", borrowRoutes);
// app.use("/api/admin", adminroutes);
// app.use("/api/wallet", walletRoutes);
// app.use("/api/admin-court", courtRoutes);
 



 



// export default app;
// 1. Sabse pehle Dotenv chalna chahiye taaki sabko Environment variables mil jayein!
import "dotenv/config"; 

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// 2. Tere Saare Routes
import chatRoutes from "./routes/chat.routes.js";
import authRoutes from "./routes/auth.routes.js";
import itemRoutes from "./routes/item.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import borrowRoutes from "./routes/borrow.routes.js";
import adminroutes from "./routes/admin.routes.js";
import courtRoutes from "./routes/admin.routes.js"; // 👈 Dhyan de: tune adminroutes aur courtRoutes mein same file daali hai, if it's intentional then okay.
import walletRoutes from "./routes/wallet.routes.js";
import userRoutes from "./routes/user.routes.js";
import returnRoutes from "./routes/return.routes.js";

const app = express();

// 3. Middlewares
app.use(cookieParser());

// 🔥 TERA PERFECT CORS SETUP
app.use(cors({
  origin: [
    "http://localhost:3000",        // React dev
    "http://localhost:5173",        // Vite dev
    "https://www.borrowhub.in",     // Live website
    "https://borrowhub.in"          // Live website (no www)
  ],
  credentials: true,
}));

app.use(express.json());

// 4. API Endpoints
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/return", returnRoutes);
app.use("/api/borrows", borrowRoutes);
app.use("/api/admin", adminroutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/admin-court", courtRoutes);

export default app;