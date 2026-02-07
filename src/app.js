//  import express from "express";
// import cors from "cors";

// import chatRoutes from "./routes/chat.routes.js";
// import authRoutes from "./routes/auth.routes.js";
// import itemRoutes from "./routes/item.routes.js";
// import paymentRoutes from "./routes/payment.routes.js";
// import borrowRoutes from "./routes/borrow.routes.js";
// import adminroutes from "./routes/admin.routes.js";
// import userroutes from "./routes/user.routes.js";
// import dotenv from "dotenv";
// dotenv.config();


// import returnRoutes from "./routes/return.routes.js";


// const app = express();
// // UptimeRobot ke liye Health Check Route
// app.get('/', (req, res) => {
//   res.send('BorrowHub Backend is Running Fast! 🚀');
// });

// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true,
// }));

// app.use(express.json());



// app.use("/api/chat", chatRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/items", itemRoutes);
// app.use("/api/payment", paymentRoutes);
//  app.use("/api", returnRoutes);
 
// // app.use("/api/borrow", borrowRoutes);
// // ✅ Isko replace karke ye likh:
// app.use("/api/borrows", borrowRoutes);
// app.use("/api/admin", adminroutes);
// app.use("/api/user", userroutes);

 



 



// export default app;


import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import chatRoutes from "./routes/chat.routes.js";
import authRoutes from "./routes/auth.routes.js";
import itemRoutes from "./routes/item.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import borrowRoutes from "./routes/borrow.routes.js";
import adminroutes from "./routes/admin.routes.js";
import userroutes from "./routes/user.routes.js";
import returnRoutes from "./routes/return.routes.js";

dotenv.config();

const app = express();

// ✅ UptimeRobot Health Check (Ye bilkul sahi add kiya tune)
app.get('/', (req, res) => {
  res.send('BorrowHub Backend is Running Fast! 🚀');
});

// 🚨 YAHAN MAGIC KIYA HAI (Saare darwaze khol diye)
 app.use(cors({
  origin: [
    "http://localhost:3000",                // Tera Laptop
    "https://borrowhubs.vercel.app",        // Purana Backup Link
    "https://borrowhubs-frontend.vercel.app", 
    "https://borrowhub.in",                 // ✅ TERA NAYA DOMAIN
    "https://www.borrowhub.in"              // ✅ NAYA DOMAIN (WWW)
  ],
  credentials: true,
}));

app.use(express.json());

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api", returnRoutes);
app.use("/api/borrows", borrowRoutes); 
app.use("/api/admin", adminroutes);
app.use("/api/user", userroutes);

export default app;
