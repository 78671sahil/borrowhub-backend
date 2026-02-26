 
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