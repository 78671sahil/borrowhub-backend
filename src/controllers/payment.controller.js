//  import razorpay from "../utils/razorpay.js";
// import Item from "../models/item.model.js";
// import Payment from "../models/Payment.js";
// import Borrow from "../models/borrow.model.js";
// import crypto from "crypto";

// // ---------------------------------------------------------
// // 👇 1. MOCK PAYMENT (Jadu Wala Button) - TEST MODE
// // ---------------------------------------------------------
// export const mockPaymentSuccess = async (req, res) => {
//   try {
//     const { itemId, days, rentAmount, platformFee } = req.body;
//     const userId = req.user._id;

//     // 1. Item Check
//     const item = await Item.findById(itemId);
//     if (!item) {
//         return res.status(404).json({ success: false, message: "Item not found" });
//     }

//     // 🔥 SECURITY CHECK
//     if (item.pickupOtp || item.status !== "available") {
//         return res.status(400).json({ success: false, message: "Item is already booked!" });
//     }

//     // 2. Setup Data
//     const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString(); 
    
//     const start = new Date();
//     const end = new Date();
//     end.setDate(start.getDate() + (days || 1));

//     // 3. Create Borrow Record
//     const newBorrow = await Borrow.create({
//       item: itemId,
//       borrower: userId,
//       owner: item.owner,
//       borrowFrom: start,
//       borrowTo: end,
//       totalPrice: rentAmount + platformFee,
//       status: "reserved", 
//       pickupOtp: pickupOtp,
//     });

//     // 4. Update Item Details
//     // 🔥🔥 IMPORTANT CHANGE HERE 👇👇
//     item.status = "reserved";  // ✅ AB YE HOME PAGE SE HAT JAYEGA
    
//     item.borrowedBy = userId;
//     item.borrowFrom = start;
//     item.borrowTo = end;
//     item.pickupOtp = pickupOtp; // ✅ Handover ke liye zaroori hai
    
//     await item.save();

//     res.json({
//       success: true,
//       message: "Payment Verified (Wait for Pickup)",
//       borrowId: newBorrow._id,
//       pickupOtp: pickupOtp,
//     });

//   } catch (error) {
//     console.error("Mock Payment Error:", error);
//     res.status(500).json({ success: false, message: "Mock Failed: " + error.message });
//   }
// };


// // ---------------------------------------------------------
// // 👇 2. CREATE MANDATE ORDER (No Status Change Here)
// // ---------------------------------------------------------
// export const createPaymentOrder = async (req, res) => {
//   try {
//     const { itemId, days } = req.body;

//     const item = await Item.findById(itemId);
//     if (!item) return res.status(404).json({ message: "Item not found" });

//     if (item.status !== "available") {
//         return res.status(400).json({ message: "Sorry, this item is currently unavailable." });
//     }

//     const rentAmount = item.pricePerDay * days;
//     const platformFee = Math.round(rentAmount * 0.05); 
//     const upfrontAmount = rentAmount + platformFee; 
//     const mandateLimit = item.deposit || 10000; 

//     // 🔥 RAZORPAY SUBSCRIPTION
//     const subscription = await razorpay.subscriptions.create({
//       plan_id: process.env.RAZORPAY_PLAN_ID, 
//       customer_notify: 1,
//       total_count: 120, 
//       quantity: 1,
//       addons: [{
//           item: { name: "Upfront Rent + Fee", amount: upfrontAmount * 100, currency: "INR" }
//       }],
//       notes: { itemId: itemId, max_liability: mandateLimit }
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
// // 👇 3. VERIFY MANDATE (Real Payment Verification)
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

//     // 🔍 1. Double Check Item Availability
//     const item = await Item.findById(itemId);
//     if (!item) return res.status(404).json({ message: "Item not found" });

//     if (item.status !== "available") {
//         return res.status(400).json({ 
//             success: false, 
//             message: "⚠️ Oops! Someone else just booked this item. Payment will be refunded." 
//         });
//     }

//     // 🔐 2. Validate Signature
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({ success: false, message: "Invalid Signature" });
//     }

//     // ✅ 3. Signature Valid - Proceed to Book
//     const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();

//     // Create Payment Record
//     await Payment.create({
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       user: userId,
//       item: itemId,
//       amount: rentAmount + platformFee,
//       status: "success",
//     });

//     const start = new Date();
//     const end = new Date();
//     end.setDate(start.getDate() + days);

//     // Create Borrow Record
//     const newBorrow = await Borrow.create({
//       item: itemId,
//       borrower: userId,
//       owner: item.owner,
//       borrowFrom: start,
//       borrowTo: end,
//       totalPrice: rentAmount + platformFee,
//       status: "reserved", 
//       pickupOtp: pickupOtp,
//     });

//     // 🔄 4. UPDATE ITEM STATUS
//     item.status = "reserved"; // ✅ Home page se gayab
//     item.borrowedBy = userId;
//     item.borrowFrom = start;
//     item.borrowTo = end;
//     item.pickupOtp = pickupOtp; 
    
//     await item.save();

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


// // ---------------------------------------------------------
// // 👇 4. CANCEL BOOKING & REFUND
// // ---------------------------------------------------------
// export const cancelBooking = async (req, res) => {
//   try {
//     const { borrowId } = req.body; 
//     const userId = req.user._id;

//     // 1. Find Borrow Record
//     const borrowRecord = await Borrow.findById(borrowId).populate("item");
//     if (!borrowRecord) return res.status(404).json({ success: false, message: "Booking not found" });

//     if (borrowRecord.borrower.toString() !== userId.toString()) {
//         return res.status(403).json({ success: false, message: "Unauthorized" });
//     }

//     if (borrowRecord.status !== "reserved") {
//         return res.status(400).json({ success: false, message: "Cannot cancel active or completed booking." });
//     }

//     // 2. Find Payment
//     const paymentRecord = await Payment.findOne({ 
//         item: borrowRecord.item._id, 
//         user: userId, 
//         status: "success" 
//     }).sort({ createdAt: -1 });

//     if (paymentRecord && paymentRecord.razorpay_payment_id) {
//         try {
//             console.log(`Refund initiated for Payment ID: ${paymentRecord.razorpay_payment_id}`);
//             paymentRecord.status = "refunded";
//             await paymentRecord.save();
//         } catch (rpError) {
//             console.error("Razorpay Refund Failed:", rpError);
//         }
//     }

//     // 3. Reset DB
//     const item = borrowRecord.item;
//     item.status = "available"; // ✅ Wapas Home page pe dikhne lagega
//     item.borrowedBy = null;
//     item.pickupOtp = ""; 
//     item.borrowFrom = null;
//     item.borrowTo = null;
    
//     await item.save();

//     borrowRecord.status = "cancelled";
//     await borrowRecord.save();

//     res.json({ success: true, message: "Booking Cancelled & Refund Initiated" });

//   } catch (error) {
//     console.error("Cancel Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

import razorpay from "../utils/razorpay.js";
import Item from "../models/item.model.js";
import Payment from "../models/Payment.js";
import Borrow from "../models/borrow.model.js";
import crypto from "crypto";

// ---------------------------------------------------------
// 👇 1. MOCK PAYMENT (Jadu Wala Button) - TEST MODE
// ---------------------------------------------------------
export const mockPaymentSuccess = async (req, res) => {
  try {
    const { itemId, days, rentAmount, platformFee } = req.body;
    const userId = req.user._id;

    // 1. Item Check
    const item = await Item.findById(itemId);
    if (!item) {
        return res.status(404).json({ success: false, message: "Item not found" });
    }

    // 🔥 SECURITY CHECK
    if (item.pickupOtp || item.status !== "available") {
        return res.status(400).json({ success: false, message: "Item is already booked!" });
    }

    // 2. Setup Data
    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString(); 
    
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + (days || 1));

    // 3. Create Borrow Record
    const newBorrow = await Borrow.create({
      item: itemId,
      borrower: userId,
      owner: item.owner,
      borrowFrom: start,
      borrowTo: end,
      totalPrice: rentAmount + platformFee,
      status: "reserved", 
      pickupOtp: pickupOtp,
    });

    // 4. Update Item Details
    // 🔥🔥 IMPORTANT: Mark as Reserved so it disappears from Home Page
    item.status = "reserved"; 
    
    item.borrowedBy = userId;
    item.borrowFrom = start;
    item.borrowTo = end;
    item.pickupOtp = pickupOtp; // Handover ke liye zaroori
    
    await item.save();

    res.json({
      success: true,
      message: "Payment Verified (Wait for Pickup)",
      borrowId: newBorrow._id,
      pickupOtp: pickupOtp,
    });

  } catch (error) {
    console.error("Mock Payment Error:", error);
    res.status(500).json({ success: false, message: "Mock Failed: " + error.message });
  }
};


// ---------------------------------------------------------
// 👇 2. CREATE MANDATE ORDER (No Status Change Here)
// ---------------------------------------------------------
export const createPaymentOrder = async (req, res) => {
  try {
    const { itemId, days } = req.body;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.status !== "available") {
        return res.status(400).json({ message: "Sorry, this item is currently unavailable." });
    }

    const rentAmount = item.pricePerDay * days;
    const platformFee = Math.round(rentAmount * 0.05); 
    const upfrontAmount = rentAmount + platformFee; 
    const mandateLimit = item.deposit || 10000; 

    // 🔥 RAZORPAY SUBSCRIPTION
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID, 
      customer_notify: 1,
      total_count: 120, 
      quantity: 1,
      addons: [{
          item: { name: "Upfront Rent + Fee", amount: upfrontAmount * 100, currency: "INR" }
      }],
      notes: { itemId: itemId, max_liability: mandateLimit }
    });

    res.json({
      success: true,
      subscriptionId: subscription.id, 
      amount: upfrontAmount,
      rentAmount,
      platformFee,
      depositAmount: 0, 
      mandateLimit: mandateLimit 
    });

  } catch (err) {
    console.error("createPaymentOrder error:", err);
    res.status(500).json({ message: "Mandate creation failed" });
  }
};


// ---------------------------------------------------------
// 👇 3. VERIFY MANDATE (Real Payment Verification)
// ---------------------------------------------------------
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id, 
      razorpay_payment_id,
      razorpay_signature,
      itemId,
      days,
      rentAmount,
      platformFee,
    } = req.body;

    const userId = req.user._id;

    // 🔍 1. Double Check Item Availability
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.status !== "available") {
        return res.status(400).json({ 
            success: false, 
            message: "⚠️ Oops! Someone else just booked this item. Payment will be refunded." 
        });
    }

    // 🔐 2. Validate Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid Signature" });
    }

    // ✅ 3. Signature Valid - Proceed to Book
    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Create Payment Record
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user: userId,
      item: itemId,
      amount: rentAmount + platformFee,
      status: "success",
    });

    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + days);

    // Create Borrow Record
    const newBorrow = await Borrow.create({
      item: itemId,
      borrower: userId,
      owner: item.owner,
      borrowFrom: start,
      borrowTo: end,
      totalPrice: rentAmount + platformFee,
      status: "reserved", 
      pickupOtp: pickupOtp,
    });

    // 🔄 4. UPDATE ITEM STATUS
    item.status = "reserved"; // ✅ Home page se gayab
    item.borrowedBy = userId;
    item.borrowFrom = start;
    item.borrowTo = end;
    item.pickupOtp = pickupOtp; 
    
    await item.save();

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


// ---------------------------------------------------------
// 👇 4. CANCEL BOOKING & REFUND
// ---------------------------------------------------------
export const cancelBooking = async (req, res) => {
  try {
    const { borrowId } = req.body; 
    const userId = req.user._id;

    // 1. Find Borrow Record
    const borrowRecord = await Borrow.findById(borrowId).populate("item");
    if (!borrowRecord) return res.status(404).json({ success: false, message: "Booking not found" });

    if (borrowRecord.borrower.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (borrowRecord.status !== "reserved") {
        return res.status(400).json({ success: false, message: "Cannot cancel active or completed booking." });
    }

    // 2. Find Payment
    const paymentRecord = await Payment.findOne({ 
        item: borrowRecord.item._id, 
        user: userId, 
        status: "success" 
    }).sort({ createdAt: -1 });

    if (paymentRecord && paymentRecord.razorpay_payment_id) {
        try {
            console.log(`Refund initiated for Payment ID: ${paymentRecord.razorpay_payment_id}`);
            paymentRecord.status = "refunded";
            await paymentRecord.save();
        } catch (rpError) {
            console.error("Razorpay Refund Failed:", rpError);
        }
    }

    // 3. Reset DB
    const item = borrowRecord.item;
    item.status = "available"; // ✅ Wapas Home page pe dikhne lagega
    item.borrowedBy = null;
    item.pickupOtp = ""; 
    item.borrowFrom = null;
    item.borrowTo = null;
    
    await item.save();

    borrowRecord.status = "cancelled";
    await borrowRecord.save();

    res.json({ success: true, message: "Booking Cancelled & Refund Initiated" });

  } catch (error) {
    console.error("Cancel Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};