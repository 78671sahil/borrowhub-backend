//  import express from "express";
// import cors from "cors";

// import chatRoutes from "./routes/chat.routes.js";
// import authRoutes from "./routes/auth.routes.js";
// import itemRoutes from "./routes/item.routes.js";
// import paymentRoutes from "./routes/payment.routes.js";
// import borrowRoutes from "./routes/borrow.routes.js";
// import adminroutes from "./routes/admin.routes.js";
// import dotenv from "dotenv";
// dotenv.config();


// import returnRoutes from "./routes/return.routes.js";


// const app = express();

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

// app.use("/api/chat", chatRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/items", itemRoutes);
// app.use("/api/payment", paymentRoutes);
// app.use("/api/return", returnRoutes);
// app.use("/api/borrow", borrowRoutes);
// app.use("/api/admin", adminroutes);

 



 



// export default app;
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import chatRoutes from "./routes/chat.routes.js";
import authRoutes from "./routes/auth.routes.js";
import itemRoutes from "./routes/item.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import borrowRoutes from "./routes/borrow.routes.js"; // Is route file ko check karna
import adminroutes from "./routes/admin.routes.js";
import returnRoutes from "./routes/return.routes.js";

dotenv.config();

const app = express();

// Temporary allow all origins taaki deployment ke baad CORS issue na aaye.
// Jab tera naya Render URL finalize ho jaye, tab unko array me daal dena.
app.use(cors({ origin: "*" })); 

app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/return", returnRoutes);
// 🔥 DHYAN DE: Frontend me "/api/borrows" call ho raha hai ya "/api/borrow"?
// Main plural "borrows" rakh raha hu taaki Navbar 404 theek ho jaye.
app.use("/api/borrows", borrowRoutes); 
app.use("/api/admin", adminroutes);

export default app;