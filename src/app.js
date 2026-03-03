 

// // export default app;
// // 1. Sabse pehle Dotenv chalna chahiye taaki sabko Environment variables mil jayein!
// import "dotenv/config"; 

// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// // 2. Tere Saare Routes
// import chatRoutes from "./routes/chat.routes.js";
// import authRoutes from "./routes/auth.routes.js";
// import itemRoutes from "./routes/item.routes.js";
// import paymentRoutes from "./routes/payment.routes.js";
// import borrowRoutes from "./routes/borrow.routes.js";
// import adminroutes from "./routes/admin.routes.js";
// import courtRoutes from "./routes/admin.routes.js"; // 👈 Dhyan de: tune adminroutes aur courtRoutes mein same file daali hai, if it's intentional then okay.
// import walletRoutes from "./routes/wallet.routes.js";
// import userRoutes from "./routes/user.routes.js";
// import returnRoutes from "./routes/return.routes.js";

// const app = express();

// // 3. Middlewares
// app.use(cookieParser());

// // 🔥 TERA PERFECT CORS SETUP
// app.use(cors({
//   origin: [
//     "http://localhost:3000",        // React dev
//     "http://localhost:5173",        // Vite dev
//     "https://www.borrowhub.in",     // Live website
//     "https://borrowhub.in"          // Live website (no www)
//   ],
//   credentials: true,
// }));

// app.use(express.json());

// // 4. API Endpoints
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

// // 🔥 SERVER AUR DATABASE KO JAGANE WALA ROUTE
// const mongoose = require('mongoose'); // Agar upar pehle se likha hai toh ye line hata dena

// app.get('/ping', (req, res) => {
//     // Check karte hain ki Database connected hai ya nahi (1 = connected)
//     const isDbConnected = mongoose.connection.readyState === 1;

//     res.status(200).json({ 
//         server: "BorrowHub Server is Awake! 🚀",
//         database: isDbConnected ? "MongoDB is Awake! 🟢" : "MongoDB is Waking up... 🟡"
//     });
// });

// export default app;


// 1. Sabse pehle Dotenv chalna chahiye
import "dotenv/config"; 

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose"; // 🔥 Mongoose ko yahan UPAR IMPORT karna hai!

// 2. Tere Saare Routes
import chatRoutes from "./routes/chat.routes.js";
import authRoutes from "./routes/auth.routes.js";
import itemRoutes from "./routes/item.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import borrowRoutes from "./routes/borrow.routes.js";
import adminroutes from "./routes/admin.routes.js";
import courtRoutes from "./routes/admin.routes.js"; 
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

// 🔥 SERVER AUR DATABASE KO JAGANE WALA ROUTE
app.get('/ping', (req, res) => {
    // Check karte hain ki Database connected hai ya nahi (1 = connected)
    const isDbConnected = mongoose.connection.readyState === 1;

    res.status(200).json({ 
        server: "BorrowHub Server is Awake! 🚀",
        database: isDbConnected ? "MongoDB is Awake! 🟢" : "MongoDB is Waking up... 🟡"
    });
});

export default app;