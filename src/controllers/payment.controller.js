//  import razorpay from "../utils/razorpay.js";
// import Item from "../models/item.model.js";
// import Payment from "../models/Payment.js";
// import Borrow from "../models/borrow.model.js";
// import crypto from "crypto";
//  export const verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_payment_id,
//       razorpay_order_id,
//       razorpay_signature,
//       itemId,
//       days,
//       rentAmount,
//       platformFee,
//       depositAmount,
//     } = req.body;

//     const userId = req.user._id;

//     // 🔐 SIGNATURE VERIFY
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_SECRET)
//       .update(body)
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({ message: "Invalid payment signature" });
//     }

//     // 🔹 ITEM FETCH
//     const item = await Item.findById(itemId).populate("owner");
//     if (!item) return res.status(404).json({ message: "Item not found" });

//     // 🔹 BORROW DATES
//     const borrowFrom = new Date();
//     const borrowTo = new Date(
//       borrowFrom.getTime() + days * 24 * 60 * 60 * 1000
//     );

//     // 🔹 ITEM UPDATE
//     item.status = "borrowed";
//     item.borrowedBy = userId;
//     item.borrowFrom = borrowFrom;
//     item.borrowTo = borrowTo;
//     await item.save();

//     // 🔹 PAYMENT SAVE
//     const payment = await Payment.create({
//       item: itemId,
//       borrower: userId,
//       owner: item.owner._id,
//       rentAmount,
//       depositAmount,
//       platformFee,
//       totalPaid: rentAmount + platformFee + depositAmount,
//       razorpayOrderId: razorpay_order_id,
//       razorpayPaymentId: razorpay_payment_id,
//       status: "paid",
//     });

//     // 🔥🔥 MISSING PART — BORROW ENTRY
//      const borrow = await Borrow.create({
//   item: itemId,
//   borrower: userId,
//   owner: item.owner._id,
//   borrowFrom,
//   borrowTo,
//   deposit: depositAmount,
//   pricePerDay: item.pricePerDay,
//   paymentId: payment._id,
//   status: "active",
// });

//     res.json({
//       success: true,
//       message: "Payment verified & borrow created",
//     });
//   } catch (err) {
//     console.error("verifyPayment error:", err);
//     res.status(500).json({ message: "Payment verification failed" });
//   }
// };



//   export const createPaymentOrder = async (req, res) => {
//   try {
//     const { itemId, days } = req.body;

//     const item = await Item.findById(itemId);
//     if (!item) {
//       return res.status(404).json({ message: "Item not found" });
//     }

//     const rentAmount = item.pricePerDay * days;
//     const platformFee = Math.round(rentAmount * 0.05);
//     const depositAmount = item.deposit;

//     const totalAmount = rentAmount + platformFee + depositAmount;

//     const order = await razorpay.orders.create({
//       amount: totalAmount * 100,
//       currency: "INR",
//       receipt: `rcpt_${itemId.slice(-6)}_${Date.now().toString().slice(-6)}`

//     });

//     res.json({
//       success: true,
//       orderId: order.id,
//       amount: totalAmount,
//       rentAmount,
//       platformFee,
//       depositAmount,
//     });
//   } catch (err) {
//     console.error("createPaymentOrder error:", err);
//     res.status(500).json({ message: "Payment order failed" });
//   }
// };

 





























//  import razorpay from "../utils/razorpay.js";
// import Item from "../models/item.model.js";
// import Payment from "../models/Payment.js";
// import Borrow from "../models/borrow.model.js";
// import crypto from "crypto";




 
 

// //nakli payment k e liye 

// // 👇 File ke sabse neeche paste kar de 👇

// export const mockPaymentSuccess = async (req, res) => {
//   try {
//     const { itemId, days, rentAmount, platformFee } = req.body;
//     const userId = req.user._id;

//     // 1. Fake Payment Record
//     const pickupOtp = "4590"; // 🔥 Fixed OTP for testing
    
//     // Dates Calculation
//     const startDate = new Date();
//     const endDate = new Date();
//     endDate.setDate(startDate.getDate() + days);

//     // 2. Create Borrow Record (Database Entry)
//     const Borrow = await import("../models/borrow.model.js").then(m => m.default);
//     const Item = await import("../models/item.model.js").then(m => m.default);
    
//     const item = await Item.findById(itemId);

//     const newBorrow = await Borrow.create({
//       item: itemId,
//       borrower: userId,
//       owner: item.owner,
//       startDate: startDate,
//       endDate: endDate,
//       totalPrice: rentAmount + platformFee,
//       status: "reserved", // ✅ Pickup pending
//       pickupOtp: pickupOtp,
//     });

//     // 3. Update Item Status
//     item.status = "reserved";
//     item.borrowedBy = userId;
//     await item.save();

//     res.json({
//       success: true,
//       message: "Test Payment Successful (Mock)",
//       borrowId: newBorrow._id,
//       pickupOtp: pickupOtp,
//     });

//   } catch (error) {
//     console.error("Mock Payment Error:", error);
//     res.status(500).json({ success: false, message: "Mock Failed" });
//   }
// };


// // ---------------------------------------------------------
// // 1️⃣ CREATE MANDATE (Replacement for createPaymentOrder)
// // ---------------------------------------------------------
// export const createPaymentOrder = async (req, res) => {
//   try {
//     const { itemId, days } = req.body;

//     const item = await Item.findById(itemId);
//     if (!item) {
//       return res.status(404).json({ message: "Item not found" });
//     }

//     // --- Calculation Logic ---
//     const rentAmount = item.pricePerDay * days;
//     const platformFee = Math.round(rentAmount * 0.05); // 5% Fee
    
//     // 🔥 CHANGE: Deposit ab 0 hai (User ki jeb se nahi jayega)
//     const depositAmount = 0; 
    
//     // User abhi sirf Rent + Fee pay karega
//     const upfrontAmount = rentAmount + platformFee; 

//     // Item ki asli value (Mandate Limit ke liye)
//     // Agar tere DB me 'value' field nahi h, to deposit ko hi value maan lete h abhi ke liye
//     // Better hoga Item model me 'value' field add kar dena like (50000)
//     const mandateLimit = item.deposit || 10000; 

//     // 🔥 RAZORPAY SUBSCRIPTION (E-Mandate)
//     // Order create karne ki jagah Subscription create kar rahe hain
//     const subscription = await razorpay.subscriptions.create({
//       plan_id: process.env.RAZORPAY_PLAN_ID, // Dashboard se Plan ID laake .env me daal
//       customer_notify: 1,
//       total_count: 120, // Long duration
//       quantity: 1,
//       addons: [
//         {
//           item: {
//             name: "Upfront Rent + Fee",
//             amount: upfrontAmount * 100, // Paise me convert (Abhi Katega)
//             currency: "INR"
//           }
//         }
//       ],
//       notes: {
//         itemId: itemId,
//         max_liability: mandateLimit // Ye limit hai jo hum future me kaat sakte hain
//       }
//     });

//     res.json({
//       success: true,
//       subscriptionId: subscription.id, // Frontend pe ye bhejenge
//       amount: upfrontAmount,
//       rentAmount,
//       platformFee,
//       depositAmount: 0, // Frontend ko dikhane ke liye ki 0 deposit hai
//       mandateLimit: mandateLimit // User ko dikhana "Protected up to ₹..."
//     });

//   } catch (err) {
//     console.error("createPaymentOrder error:", err);
//     res.status(500).json({ message: "Mandate creation failed" });
//   }
// };


// // ---------------------------------------------------------
// // 2️⃣ VERIFY MANDATE (Replacement for verifyPayment)



// export const verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       itemId,
//       days,
//       rentAmount,
//       platformFee,
//     } = req.body;

//     const userId = req.user._id;

//     // 1. Validate Signature
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({ success: false, message: "Invalid Signature" });
//     }

//     // 2. Generate Pickup OTP
//     const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();

//     // 3. Create Payment Record
//     await Payment.create({
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       user: userId,
//       item: itemId,
//       amount: rentAmount + platformFee,
//       status: "success",
//     });

//     // 4. Create Borrow Record (Initial Status: reserved)
//     const item = await Item.findById(itemId);
    
//     // Dates calculate karo
//     const startDate = new Date();
//     const endDate = new Date();
//     endDate.setDate(startDate.getDate() + days);

//     const newBorrow = await Borrow.create({
//       item: itemId,
//       borrower: userId,
//       owner: item.owner,
//       startDate: startDate,
//       endDate: endDate,
//       totalPrice: rentAmount + platformFee,
//       status: "reserved", // ✅ Pickup pending hai
//       pickupOtp: pickupOtp, // ✅ OTP save kiya
//     });

//     // 5. UPDATE ITEM STATUS
//     // 🔥 YAHI CODE MISSING THA 🔥
//     item.status = "reserved";  // Ab ye reserved banega
//     item.borrowedBy = userId;
//     await item.save();

//     // 6. Response with OTP
//     res.json({
//       success: true,
//       message: "Payment Verified",
//       borrowId: newBorrow._id,
//       pickupOtp: pickupOtp,
//     });

//   } catch (error) {
//     console.error("Payment Verify Error:", error);
//     res.status(500).json({ success: false, message: "Payment Verification Failed" });
//   }
// };



// import razorpay from "../utils/razorpay.js";
// import Item from "../models/item.model.js";
// import Payment from "../models/Payment.js";
// import Borrow from "../models/borrow.model.js";
// import crypto from "crypto";

// // ---------------------------------------------------------
// // 👇 FIX: MOCK PAYMENT (Jadu Wala Button)
// // ---------------------------------------------------------
//  // backend/controllers/paymentController.js

// export const mockPaymentSuccess = async (req, res) => {
//   try {
//     const { itemId, days, rentAmount, platformFee } = req.body;
//     const userId = req.user._id;

//     // 1. Setup Data
//     const pickupOtp = "4590"; 
    
//     // Dates Calculation
//     const start = new Date();
//     const end = new Date();
//     end.setDate(start.getDate() + (days || 1));

//     // 2. Find Item
//     const item = await Item.findById(itemId);
//     if (!item) {
//         return res.status(404).json({ success: false, message: "Item not found" });
//     }

//     // 3. Create Borrow Record
//     const newBorrow = await Borrow.create({
//       item: itemId,
//       borrower: userId,
//       owner: item.owner,
      
//       // 👇👇 YAHAN GALTI THI (Ab sahi hai) 👇👇
//       borrowFrom: start,  // Pehle yahan 'startDate' likha tha
//       borrowTo: end,      // Pehle yahan 'endDate' likha tha
      
//       totalPrice: rentAmount + platformFee,
//       status: "reserved", 
//       pickupOtp: pickupOtp,
//     });

//     // 4. Update Item Status
//     item.status = "reserved";
//     item.borrowedBy = userId;
    
//     // 👇 Item me bhi sahi naam use karo
//     item.borrowFrom = start;
//     item.borrowTo = end;
    
//     await item.save();

//     res.json({
//       success: true,
//       message: "Test Payment Successful (Mock)",
//       borrowId: newBorrow._id,
//       pickupOtp: pickupOtp,
//     });

//   } catch (error) {
//     console.error("Mock Payment Error:", error);
//     res.status(500).json({ success: false, message: "Mock Failed: " + error.message });
//   }
// };


// // ---------------------------------------------------------
// // 1️⃣ CREATE MANDATE (As it is - No Changes)
// // ---------------------------------------------------------
// export const createPaymentOrder = async (req, res) => {
//   try {
//     const { itemId, days } = req.body;

//     const item = await Item.findById(itemId);
//     if (!item) {
//       return res.status(404).json({ message: "Item not found" });
//     }

//     // --- Calculation Logic ---
//     const rentAmount = item.pricePerDay * days;
//     const platformFee = Math.round(rentAmount * 0.05); // 5% Fee
    
//     // 🔥 CHANGE: Deposit ab 0 hai (User ki jeb se nahi jayega)
//     const depositAmount = 0; 
    
//     // User abhi sirf Rent + Fee pay karega
//     const upfrontAmount = rentAmount + platformFee; 

//     // Item ki asli value (Mandate Limit ke liye)
//     const mandateLimit = item.deposit || 10000; 

//     // 🔥 RAZORPAY SUBSCRIPTION (E-Mandate)
//     const subscription = await razorpay.subscriptions.create({
//       plan_id: process.env.RAZORPAY_PLAN_ID, 
//       customer_notify: 1,
//       total_count: 120, // Long duration
//       quantity: 1,
//       addons: [
//         {
//           item: {
//             name: "Upfront Rent + Fee",
//             amount: upfrontAmount * 100, // Paise me convert (Abhi Katega)
//             currency: "INR"
//           }
//         }
//       ],
//       notes: {
//         itemId: itemId,
//         max_liability: mandateLimit 
//       }
//     });

//     res.json({
//       success: true,
//       subscriptionId: subscription.id, 
//       amount: upfrontAmount,
//       rentAmount,
//       platformFee,
//       depositAmount: 0, 
//       mandateLimit: mandateLimit 
//     });

//   } catch (err) {
//     console.error("createPaymentOrder error:", err);
//     res.status(500).json({ message: "Mandate creation failed" });
//   }
// };


// // ---------------------------------------------------------
// // 2️⃣ VERIFY MANDATE (As it is - No Changes)
// // ---------------------------------------------------------
// export const verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       itemId,
//       days,
//       rentAmount,
//       platformFee,
//     } = req.body;

//     const userId = req.user._id;

//     // 1. Validate Signature
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({ success: false, message: "Invalid Signature" });
//     }

//     // 2. Generate Pickup OTP
//     const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();

//     // 3. Create Payment Record
//     await Payment.create({
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       user: userId,
//       item: itemId,
//       amount: rentAmount + platformFee,
//       status: "success",
//     });

//     // 4. Create Borrow Record (Initial Status: reserved)
//     const item = await Item.findById(itemId);
    
//     // Dates calculate karo
//     const startDate = new Date();
//     const endDate = new Date();
//     endDate.setDate(startDate.getDate() + days);

//     const newBorrow = await Borrow.create({
//       item: itemId,
//       borrower: userId,
//       owner: item.owner,
//       startDate: startDate,
//       endDate: endDate,
//       totalPrice: rentAmount + platformFee,
//       status: "reserved", // ✅ Pickup pending hai
//       pickupOtp: pickupOtp, // ✅ OTP save kiya
//     });

//     // 5. UPDATE ITEM STATUS
//     item.status = "reserved";  // Ab ye reserved banega
//     item.borrowedBy = userId;


    
//     await item.save();

//     // 6. Response with OTP
//     res.json({
//       success: true,
//       message: "Payment Verified",
//       borrowId: newBorrow._id,
//       pickupOtp: pickupOtp,
//     });

//   } catch (error) {
//     console.error("Payment Verify Error:", error);
//     res.status(500).json({ success: false, message: "Payment Verification Failed" });
//   }
// };


import razorpay from "../utils/razorpay.js";
import Item from "../models/item.model.js";
import Payment from "../models/Payment.js";
import Borrow from "../models/borrow.model.js";
import crypto from "crypto";

// ---------------------------------------------------------
// 1️⃣ CREATE MANDATE (Order Creation)
// ---------------------------------------------------------
export const createPaymentOrder = async (req, res) => {
  try {
    const { itemId, days } = req.body;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const rentAmount = item.pricePerDay * days;
    const platformFee = Math.round(rentAmount * 0.05); // 5% Fee
    const upfrontAmount = rentAmount + platformFee; 
    const mandateLimit = item.deposit || 10000; 

    // 🔥 RAZORPAY SUBSCRIPTION (E-Mandate)
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID, 
      customer_notify: 1,
      total_count: 120, 
      quantity: 1,
      addons: [
        {
          item: {
            name: "Upfront Rent + Platform Fee",
            amount: upfrontAmount * 100, // Paise
            currency: "INR"
          }
        }
      ],
      notes: { itemId: itemId, max_liability: mandateLimit }
    });

    res.json({
      success: true,
      subscriptionId: subscription.id, 
      amount: upfrontAmount,
    });
  } catch (err) {
    console.error("createPaymentOrder error:", err);
    res.status(500).json({ message: "Mandate creation failed" });
  }
};

// ---------------------------------------------------------
// 2️⃣ VERIFY PAYMENT & START 5 MINUTE REFUND TIMER
// ---------------------------------------------------------
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      itemId,
      startDate,
      endDate,
      rentAmount,
      platformFee,
    } = req.body;

    const userId = req.user._id;

    // 1. Validate Signature
    const body = razorpay_payment_id + "|" + razorpay_subscription_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET) // 🔥 Teri key
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid Signature" });
    }

    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const item = await Item.findById(itemId);

    // 2. Create Payment Record
     await Payment.create({
      item: itemId,
      borrower: userId,
      owner: item.owner,
      rentAmount: rentAmount,
      platformFee: platformFee,
      depositAmount: 0,
      totalPaid: rentAmount + platformFee,
      razorpayOrderId: razorpay_subscription_id, // CamelCase from schema
      razorpayPaymentId: razorpay_payment_id,    // CamelCase from schema
      status: "paid", // 🚨 YAHI THA ASLI CHOR! "success" ki jagah "paid" aayega
    });

    // 3. Create Borrow Record (STATUS: RESERVED)
    const newBorrow = await Borrow.create({
      item: itemId,
      owner: item.owner,
      borrower: userId,
      borrowFrom: startDate,
      borrowTo: endDate,
      totalPrice: rentAmount + platformFee,
      status: "reserved", // ⏳ Waiting for OTP
      pickupOtp: pickupOtp,
      mandateDetails: {
        subscriptionId: razorpay_subscription_id,
        limit: item.deposit || 10000,
        isActive: true
      }
    });

    // 4. Update Item Status
    item.status = "reserved";  
    item.borrowedBy = userId;
    item.pickupOtp = pickupOtp;
    item.borrowFrom = startDate;
    item.borrowTo = endDate;
    await item.save();

    console.log("✅ Payment Verified. Item is RESERVED. Timer Started.");

    // 🔥🔥🔥 5. THE 5-MINUTE AUTO-REFUND TIMER 🔥🔥🔥
    setTimeout(async () => {
      try {
        const checkBorrow = await Borrow.findById(newBorrow._id);
        
        // Agar 5 min baad bhi "reserved" hai (OTP match nahi hua)
        if (checkBorrow && checkBorrow.status === "reserved") {
          console.log(`⏰ 5 MIN UP: OTP not verified. Initiating Refund!`);
          
          try {
             // A. Razorpay se paisa Refund karo
             await razorpay.payments.refund(razorpay_payment_id, { speed: "normal" });
             console.log("💸 Refund Processed successfully.");

             // B. Mandate Cancel karo
             await razorpay.subscriptions.cancel(razorpay_subscription_id);
             console.log("🚫 Mandate Cancelled.");
          } catch (rzpErr) {
             console.error("Razorpay Refund Error:", rzpErr);
          }

          // C. Database wapas pehle jaisa kar do
          await Borrow.findByIdAndUpdate(newBorrow._id, { status: "cancelled" });
          await Item.findByIdAndUpdate(item._id, { 
            status: "available", 
            borrowedBy: null, 
            pickupOtp: null,
            borrowFrom: null,
            borrowTo: null 
          });
        }
      } catch (timerErr) {
        console.error("Timer Error:", timerErr);
      }
    }, 5 * 60 * 1000); // 5 Minutes

    res.json({
      success: true,
      message: "Payment Verified",
      borrowId: newBorrow._id,
      pickupOtp: pickupOtp,
    });

  } catch (error) {
    console.error("Payment Verify Error:", error);
    res.status(500).json({ success: false, message: "Payment Verification Failed" });
  }
};