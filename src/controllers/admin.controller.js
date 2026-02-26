 
import Item from "../models/item.model.js";
import Borrow from "../models/borrow.model.js";
import Withdrawal from "../models/Withdrawal.js"; 
import razorpay from "../utils/razorpay.js";

// ⚖️ 1. FETCH COURT CASES (Items marked as disputed)
export const getDisputes = async (req, res) => {
  try {
    const cases = await Item.find({ status: "disputed_in_court" })
      .populate("borrowedBy", "name phone email")
      .populate("owner", "name phone email");
    res.json({ success: true, cases });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ⚖️ 2. RESOLVE DISPUTE (Theft/Damage Verdict)
export const resolveDispute = async (req, res) => {
  try {
    const { itemId, decision, adminNote } = req.body;
    
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Active borrow record dhoondo
    const borrow = await Borrow.findOne({ item: itemId }).sort({ createdAt: -1 });

    if (decision === "INNOCENT") {
      /* ==================================
          CASE: INNOCENT (CASE DISMISSED)
      ================================== */
      item.status = "available";
      
      // Update verdict details safely
      if (!item.adminCourt) item.adminCourt = {};
      item.adminCourt.verdict = "innocent";
      item.adminCourt.adminNote = adminNote;

      // Reset item ownership status
      item.borrowedBy = null;
      item.borrowFrom = null;
      item.borrowTo = null;

      await item.save();

      if (borrow) {
        borrow.status = "completed"; 
        await borrow.save();
        
        // Cancel mandate as item is safely accounted for
        if (borrow.mandateDetails?.subscriptionId) {
           try {
             await razorpay.subscriptions.cancel(borrow.mandateDetails.subscriptionId);
           } catch (e) { console.error("Mandate Cancel Failed:", e); }
        }
      }
      return res.json({ success: true, message: "Case Dismissed! Item is now Available." });

    } else if (decision === "GUILTY") {
      /* ==================================
          CASE: GUILTY (PENALTY CHARGE)
      ================================== */
      const penaltyAmount = item.deposit || 10000;
      let paymentSuccess = false;

      // 1. Try to charge Borrower's Bank
      if (borrow && borrow.mandateDetails?.subscriptionId) {
          try {
              await razorpay.subscriptions.createAddon(borrow.mandateDetails.subscriptionId, {
                  item: {
                      name: `Penalty: ${item.title}`,
                      amount: penaltyAmount * 100, 
                      currency: "INR"
                  }
              });
              await razorpay.subscriptions.cancel(borrow.mandateDetails.subscriptionId);
              paymentSuccess = true;
          } catch (rzpError) {
              console.error("Razorpay Charge Failed:", rzpError);
          }
      }

      // 2. Update Item Status & Verdict
      item.status = "stolen"; 
      if (!item.adminCourt) item.adminCourt = {};
      item.adminCourt.verdict = "guilty";
      item.adminCourt.adminNote = adminNote;
      
      await item.save();

      // 3. Add Penalty to Lender's Wallet
      if (borrow) {
          borrow.totalPrice = (borrow.totalPrice || 0) + penaltyAmount; 
          borrow.status = "completed"; 
          borrow.adminNote = adminNote + (paymentSuccess ? " (Auto Recovered)" : " (MANUAL RECOVERY NEEDED)");
          await borrow.save();
      }
      
      return res.json({ 
          success: true, 
          message: paymentSuccess 
            ? `✅ Guilty! ₹${penaltyAmount} deducted and added to Wallet.` 
            : `⚠️ Guilty! Wallet updated, but Bank charge failed. Recover manually.` 
      });
    }
  } catch (err) {
    console.error("Dispute Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 💸 3. FETCH WITHDRAWAL REQUESTS
export const getWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ status: "pending" })
      .populate("user", "name phone email")
      .sort({ createdAt: 1 });
    res.json({ success: true, withdrawals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 💸 4. APPROVE PAYOUT
export const approveWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) return res.status(404).json({ message: "Request not found" });

    withdrawal.status = "completed";
    await withdrawal.save();

    res.json({ success: true, message: "Payout Marked as Completed!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 🚨 5. FILE CASE (Lender reporting theft)
export const fileCase = async (req, res) => {
  try {
    const { itemId, reason } = req.body;
    const item = await Item.findById(itemId);

    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    item.status = "disputed_in_court";
    item.adminCourt = {
      reason: reason,
      caseStartedAt: new Date(),
      verdict: "pending"
    };
    
    await item.save();
    res.json({ success: true, message: "🚨 Case filed successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// 🔨 6. RETRY PENALTY CHARGE (Admin Manual Trigger)
 export const retryPenaltyCharge = async (req, res) => {
  try {
    const { itemId } = req.body;
    
    // 1. Item aur uski latest booking dhoondo
    const item = await Item.findById(itemId);
    const borrow = await Borrow.findOne({ item: itemId }).sort({ createdAt: -1 });

    if (!borrow || !borrow.mandateDetails?.subscriptionId) {
      return res.status(404).json({ success: false, message: "Mandate record not found!" });
    }

    const penaltyAmount = item.deposit ;
    if (!penaltyAmount || penaltyAmount <= 0) {
  return res.status(400).json({ success: false, message: "Is item par koi security deposit set nahi hai!" });
}
    
    try {
      // 2. 💸 Razorpay se Paisa Kaato
      await razorpay.subscriptions.createAddon(borrow.mandateDetails.subscriptionId, {
        item: {
          name: `RETRY: Penalty for ${item.title}`,
          amount: penaltyAmount * 100, // Paise mein
          currency: "INR"
        }
      });
      
      // 3. ✂️ Paisa aate hi MANDATE CANCEL kar do (Taaki dubaara na kate)
      await razorpay.subscriptions.cancel(borrow.mandateDetails.subscriptionId);

      // 4. 📝 Note update karo jisse button gayab ho jaye
      const successMsg = ` | ✅ Success at ${new Date().toLocaleString()}`;
      
      if (!item.adminCourt) item.adminCourt = {};
      item.adminCourt.adminNote = (item.adminCourt.adminNote || "") + successMsg;
      await item.save();

      borrow.adminNote = (borrow.adminNote || "") + successMsg;
      await borrow.save();

      return res.json({ success: true, message: "✅ Paisa vasool aur Mandate Cancelled! Button ab gayab ho jayega." });
      
    } catch (rzpErr) {
      // ❌ Agar fail hua toh "Failed" ka tag laga do
      const failMsg = ` | ❌ Failed at ${new Date().toLocaleString()}`;
      if (!item.adminCourt) item.adminCourt = {};
      item.adminCourt.adminNote = (item.adminCourt.adminNote || "") + failMsg;
      await item.save();
      
      return res.status(400).json({ success: false, message: "❌ Bank ne mana kar diya! Account abhi bhi khali hai." });
    }
  } catch (err) {
    console.error("Retry Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};