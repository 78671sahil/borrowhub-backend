// File: backend/controllers/admin.controller.js

 import ReturnRequest from "../models/ReturnRequest.js";
import Item from "../models/item.model.js";

// 1. SARE DISPUTES LAO (Jo Admin Panel me dikhenge)
export const getDisputes = async (req, res) => {
  try {
    // Sirf wahi request lao jinka status 'disputed' hai
    const disputes = await ReturnRequest.find({ status: "disputed" })
      .populate("item")        // Item ki photo/name ke liye
      .populate("borrower", "name phone") 
      .populate("owner", "name phone")
      .populate("borrow");

    res.json({ success: true, disputes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. FAISLA SUNAO (Resolve Dispute)
export const resolveDispute = async (req, res) => {
  try {
    const { requestId, decision, finalPenaltyAmount } = req.body;
    // decision can be: 'release' (Maaf kiya) OR 'charge' (Penalty lagao)

    const request = await ReturnRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const item = await Item.findById(request.item);

    if (decision === "release") {
      /* ==========================
          CASE 1: BORROWER WON 🏆
          (Admin ne kaha: Jao koi penalty nahi)
      ========================== */
      request.status = "completed"; 
      request.totalPenalty = 0; // Penalty zero kar do
      
      // Item ko free kar do
      if (item) {
        item.status = "available";
        item.borrower = null;
        item.borrowTo = null;
        await item.save();
      }

      await request.save();
      return res.json({ success: true, message: "Dispute Resolved: Borrower Released (No Charge)." });

    } else if (decision === "charge") {
      /* ==========================
          CASE 2: LENDER WON 🔨
          (Admin ne kaha: Penalty deni padegi)
      ========================== */
      
      // Admin ne jo amount bola, wahi final penalty hogi
      request.totalPenalty = finalPenaltyAmount || request.totalPenalty;
      
      // Status wapas 'pending_borrower_action' kar do
      // Taaki User ke pass wapas RED CARD aaye aur wo 'PAY' button dabaye
      request.status = "pending_borrower_action"; 
      
      // Note: Hum status 'completed' nahi kar rahe, kyunki user ko abhi Payment karni hai.
      
      await request.save();
      return res.json({ success: true, message: `Dispute Resolved: Borrower must pay ₹${request.totalPenalty}` });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};