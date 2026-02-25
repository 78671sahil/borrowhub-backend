 


//  import ReturnRequest from "../models/ReturnRequest.js";
// import Borrow from "../models/borrow.model.js";
 
// import razorpay from "../utils/razorpay.js";

// /* ---------------------------------------------------------
//    1. BORROWER REQUESTS RETURN (Generate OTP) - (Same as before)
// --------------------------------------------------------- */
// export const requestReturn = async (req, res) => {
//   try {
//     const { itemId } = req.body;
//     const borrowerId = req.user._id;

//     const borrow = await Borrow.findOne({
//       item: itemId,
//       borrower: borrowerId,
//       status: "active",
//     });

//     if (!borrow) return res.status(404).json({ message: "Active Borrow not found" });

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Reset pending requests
//     await ReturnRequest.deleteMany({ borrow: borrow._id, status: { $ne: "completed" } });

//     await ReturnRequest.create({
//       borrow: borrow._id,
//       item: itemId,
//       borrower: borrowerId,
//       owner: borrow.owner,
//       status: "pending",
//       otp,
//       otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
//     });

//     res.json({ success: true, message: "OTP Generated", otp });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ---------------------------------------------------------
//    2. LENDER VERIFIES OTP (Calculates Penalty & Decides Flow)
// --------------------------------------------------------- */
//  export const verifyReturnOtp = async (req, res) => {
//   try {
//     const { borrowId } = req.params;
    
//     // 🔥 FRONTEND SE AB YE 4 CHEEZEIN AA RAHI HAIN:
//     const { otp, damageClaimed, lateFeesCalculated, lenderComment } = req.body;

//     // 1. Return Request dhundo
//     const returnRequest = await ReturnRequest.findOne({ borrow: borrowId });
//     if (!returnRequest) return res.status(404).json({ message: "Request not found" });

//     // 2. OTP Check karo
//     if (returnRequest.otp !== otp) {
//       return res.status(400).json({ message: "Invalid OTP! Return failed." });
//     }

//     // 3. Item dhundo status change karne ke liye
//     const item = await Item.findById(returnRequest.item);

//     /* ==================================================
//        💰 CALCULATION LOGIC (Damage + Late Fee)
//     ================================================== */
//     const damageVal = Number(damageClaimed) || 0;
//     const lateVal = Number(lateFeesCalculated) || 0;
//     const totalBill = damageVal + lateVal;

//     // 4. Data Save karo (Note aur Late Fee ke saath)
//     returnRequest.damageClaimed = damageVal;
//     returnRequest.lateFeesCalculated = lateVal; // ✅ Late fee save hui
//     returnRequest.totalPenalty = totalBill;     // ✅ Total Bill save hua
//     returnRequest.lenderComment = lenderComment || "No comments"; // ✅ Note save hua
    
//     // 🔥 IMPORTANT: Status set karo
//     if (totalBill > 0) {
//       // Agar paisa lena hai -> Pending Borrower Action (Red Card dikhega)
//       returnRequest.status = "pending_borrower_action";
//       returnRequest.proofImage = "https://via.placeholder.com/150"; // (Yahan Lender ki upload ki hui photo aayegi agar hai to)
//     } else {
//       // Agar koi paisa nahi lena -> Seedha Complete
//       returnRequest.status = "completed";
      
//       // Item free kar do
//       item.status = "available";
//       item.borrower = null;
//       item.borrowTo = null;
//       await item.save();
//     }

//     await returnRequest.save();

//     res.json({ 
//       success: true, 
//       message: totalBill > 0 ? "Penalty added! Waiting for payment." : "Item Returned Successfully!" 
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ---------------------------------------------------------
//    3. BORROWER APPROVES PENALTY (Money Deduction Logic)
// --------------------------------------------------------- */
// export const approvePenalty = async (req, res) => {
//     try {
//         const { requestId } = req.body; // Borrower ye ID bhejega
//         const userId = req.user._id;

//         const request = await ReturnRequest.findById(requestId).populate("borrow");
        
//         if (!request || request.status !== "waiting_approval") {
//             return res.status(400).json({ message: "Invalid Request" });
//         }
        
//         // Security Check: Sirf Borrower hi approve kar sakta hai
//         if (request.borrower.toString() !== userId.toString()) {
//             return res.status(403).json({ message: "Not authorized" });
//         }

//         // ✅ User said YES -> Process Payment
//         const borrow = request.borrow;
//         await finalizeReturn(borrow, request, res, request.totalPenalty, "Approved by Borrower");

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// /* ---------------------------------------------------------
//    4. BORROWER DISPUTES PENALTY (Send to Admin)
// --------------------------------------------------------- */
// export const disputePenalty = async (req, res) => {
//     try {
//         const { requestId } = req.body;
//         const request = await ReturnRequest.findById(requestId);

//         if (!request) return res.status(404).json({ message: "Not found" });

//         request.status = "disputed";
//         await request.save();

//         // Yahan tum Admin ko Email/Notification bhej sakte ho
        
//         res.json({ 
//             success: true, 
//             message: "Dispute raised. Support team will contact you." 
//         });

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };


// /* ---------------------------------------------------------
//    HELPER FUNCTION: FINALIZE RETURN (Common Code)
//    - Mandate charge karta hai (agar penalty hai)
//    - Mandate cancel karta hai
//    - Item available karta hai
// --------------------------------------------------------- */
// const finalizeReturn = async (borrow, request, res, penaltyAmount, statusMsg) => {
    
//     // 1. Handle Mandate (Charge + Cancel)
//     let mandateMessage = "Manual/Mock Payment handled";

//     if (borrow.mandateDetails?.subscriptionId) {
//         try {
//             const subId = borrow.mandateDetails.subscriptionId;

//             // A. Charge Penalty (If any)
//             if (penaltyAmount > 0) {
//                 // Real Razorpay Add-on charge (Commented out for safety unless key exists)
//                 // await razorpay.subscriptions.createAddon(subId, { ... });
//                 console.log(`💳 Charged ₹${penaltyAmount} from Mandate ${subId}`);
//             }

//             // B. Cancel Mandate
//             await razorpay.subscriptions.cancel(subId);
//             borrow.mandateDetails.isActive = false;
//             mandateMessage = "✅ Auto-Pay Settled & Cancelled";

//         } catch (e) {
//             console.error("Razorpay Error:", e);
//             mandateMessage = "⚠️ Return OK, but Payment Error";
//         }
//     }

//     // 2. Update DB
//     borrow.status = "returned";
//     borrow.penaltyAmount = penaltyAmount;
//     await borrow.save();

//     const Item = await import("../models/item.model.js").then(m => m.default);
//     await Item.findByIdAndUpdate(borrow.item, { 
//         status: "available",
//         borrowedBy: null,
//         borrowFrom: null,
//         borrowTo: null
//     });

//     request.status = "completed";
//     await request.save();

//     res.json({
//         success: true,
//         message: "Return Successful! " + statusMsg,
//         penalty: penaltyAmount,
//         mandateStatus: mandateMessage
//     });
// };



// // 👇 Is function ko file ke end me jod de 👇

// export const getPendingReturns = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // Wo requests dhundo jahan main Owner hu aur status 'pending' hai
//     const requests = await ReturnRequest.find({
//       owner: userId,
//       status: "pending", 
//     })
//     .populate("item")
//     .populate("borrower", "name email");

//     res.json({ success: true, requests });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };




// /* ---------------------------------------------------------
//    ⏰ CRON JOB: AUTO-SETTLE PENDING CLAIMS (24 HOURS)
// --------------------------------------------------------- */
 
//   // backend/controllers/return.controller.js

// export const runAutoSettlement = async (req, res) => {
//   try {
//     console.log("⏰ Running Auto-Escalation Job...");

//     // 1. Time Limit: 24 Hours pehle ka time
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

//     // 2. Wo requests dhundo jo 'pending_borrower_action' (Red Card) hain aur 24 ghante purane hain
//     const stuckRequests = await ReturnRequest.find({
//       status: "pending_borrower_action",
//       updatedAt: { $lt: twentyFourHoursAgo } 
//     });

//     if (stuckRequests.length === 0) {
//         return res.json({ success: true, message: "No stuck cases found." });
//     }

//     // 3. Un sabko utha ke Admin Court me daal do
//     for (const req of stuckRequests) {
//       req.status = "disputed"; 
//       req.lenderComment += " [System Note: User did not respond in 24hrs. Auto-sent to Admin.]";
//       await req.save();
//       console.log(`⚖️ Case ${req._id} sent to Admin Court.`);
//     }

//     res.json({ 
//         success: true, 
//         message: `${stuckRequests.length} cases sent to Admin Court automatically.` 
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // 👇 GET REQUESTS WAITING FOR BORROWER APPROVAL
// export const getMyPenaltyApprovals = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // Wo requests laao jahan main Borrower hu aur status 'waiting_approval' hai
//     const requests = await ReturnRequest.find({
//       borrower: userId,
//       status: "waiting_approval",
//     })
//     .populate("item", "title")
//     .populate("owner", "name");

//     res.json({ success: true, requests });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



// // return.controller.js

 import ReturnRequest from "../models/ReturnRequest.js";
import Borrow from "../models/borrow.model.js";
import Item from "../models/item.model.js"; // 🔥 FIX 1: YE IMPORT MISSING THA!
import razorpay from "../utils/razorpay.js";

/* ---------------------------------------------------------
   1. BORROWER REQUESTS RETURN (Generate OTP)
--------------------------------------------------------- */
export const requestReturn = async (req, res) => {
  try {
    const { itemId } = req.body;
    const borrowerId = req.user._id;

    const borrow = await Borrow.findOne({
      item: itemId,
      borrower: borrowerId,
      status: "active",
    });

    if (!borrow) return res.status(404).json({ message: "Active Borrow not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Reset pending requests
    await ReturnRequest.deleteMany({ borrow: borrow._id, status: { $ne: "completed" } });

    await ReturnRequest.create({
      borrow: borrow._id,
      item: itemId,
      borrower: borrowerId,
      owner: borrow.owner,
      status: "pending",
      otp,
      otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    res.json({ success: true, message: "OTP Generated", otp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------------------------------------
   2. LENDER VERIFIES OTP (Calculates Penalty & Decides Flow)
--------------------------------------------------------- */
export const verifyReturnOtp = async (req, res) => {
  try {
    const { borrowId } = req.params;
    
    // 🔥 FIX 2: 'proofImage' bhi receive kar rahe hain ab
    const { otp, damageClaimed, lateFeesCalculated, lenderComment, proofImage } = req.body;

    console.log(`🔍 Verifying OTP for Borrow: ${borrowId}`);

    // 1. Return Request dhundo
    const returnRequest = await ReturnRequest.findOne({ borrow: borrowId });
    if (!returnRequest) return res.status(404).json({ message: "Request not found" });

    // 2. OTP Check karo
    if (returnRequest.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP! Return failed." });
    }

    // 3. Item dhundo (Ab ye chalega kyunki upar Import kar diya hai)
    const item = await Item.findById(returnRequest.item);
    if (!item) return res.status(404).json({ message: "Item not found in DB" });

    /* ==================================================
       💰 CALCULATION LOGIC
    ================================================== */
    const damageVal = Number(damageClaimed) || 0;
    const lateVal = Number(lateFeesCalculated) || 0;
    const totalBill = damageVal + lateVal;

    // 4. Data Save karo
    returnRequest.damageClaimed = damageVal;
    returnRequest.lateFeesCalculated = lateVal;
    returnRequest.totalPenalty = totalBill;
    returnRequest.lenderComment = lenderComment || "No comments";
    returnRequest.proofImage = proofImage || ""; // 🔥 Proof Save kiya

    // 🔥 IMPORTANT: Status set karo
    if (totalBill > 0) {
      // Agar paisa lena hai -> Pending Borrower Action (Red Card dikhega)
      returnRequest.status = "pending_borrower_action";
    } else {
      // Agar koi paisa nahi lena -> Seedha Complete
      returnRequest.status = "completed";
      
      // Item free kar do
      item.status = "available";
      item.borrower = null;
      item.borrowTo = null;
      await item.save();
      await Borrow.findByIdAndUpdate(borrowId, { status: "returned" });
    }

    await returnRequest.save();

    res.json({ 
      success: true, 
      message: totalBill > 0 ? "Penalty added! Waiting for payment." : "Item Returned Successfully!",
      requiresApproval: totalBill > 0 
    });

  } catch (err) {
    console.error("🔥 ERROR in verifyReturnOtp:", err); // Error print hoga console me
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------------------------------------
   3. BORROWER APPROVES PENALTY (Money Deduction Logic)
--------------------------------------------------------- */
export const approvePenalty = async (req, res) => {
    try {
        const { requestId } = req.body;
        const userId = req.user._id;

        const request = await ReturnRequest.findById(requestId).populate("borrow");
        
        // Status check: pending_borrower_action (Tumne schema me ye status add kiya hai)
        if (!request || (request.status !== "pending_borrower_action" && request.status !== "waiting_approval")) {
            return res.status(400).json({ message: "Invalid Request Status" });
        }
        
        if (request.borrower.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const borrow = request.borrow;
        await finalizeReturn(borrow, request, res, request.totalPenalty, "Approved by Borrower");

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ---------------------------------------------------------
   4. BORROWER DISPUTES PENALTY (Send to Admin)
--------------------------------------------------------- */
export const disputePenalty = async (req, res) => {
    try {
        const { requestId, reason } = req.body; // Reason bhi le lo
        const request = await ReturnRequest.findById(requestId);

        if (!request) return res.status(404).json({ message: "Not found" });

        request.status = "disputed";
        // Agar schema me disputeReason field hai to save karo, nahi to lenderComment me append kar do
        if(reason) request.lenderComment += ` | Borrower Dispute: ${reason}`;
        
        await request.save();

        res.json({ 
            success: true, 
            message: "Dispute raised. Sent to Admin Court." 
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ---------------------------------------------------------
   HELPER FUNCTION: FINALIZE RETURN
--------------------------------------------------------- */
const finalizeReturn = async (borrow, request, res, penaltyAmount, statusMsg) => {
    
    let mandateMessage = "Manual/Mock Payment handled";

    if (borrow.mandateDetails?.subscriptionId) {
        try {
            const subId = borrow.mandateDetails.subscriptionId;
            // Fake Mandate Charge Logic here for now
            // ...
            
            // Cancel Mandate (Mock)
            borrow.mandateDetails.isActive = false;
            mandateMessage = "✅ Auto-Pay Settled & Cancelled";

        } catch (e) {
            console.error("Payment Error:", e);
            mandateMessage = "⚠️ Return OK, but Payment Error";
        }
    }

    // Update Borrow Status
    borrow.status = "returned";
    borrow.penaltyAmount = penaltyAmount;
    await borrow.save();

    // Make Item Available
    await Item.findByIdAndUpdate(borrow.item, { 
        status: "available",
        borrowedBy: null,
        borrowFrom: null,
        borrowTo: null
    });

    request.status = "completed";
    await request.save();

    res.json({
        success: true,
        message: "Return Successful! " + statusMsg,
        penalty: penaltyAmount,
        mandateStatus: mandateMessage
    });
};

/* ---------------------------------------------------------
   GET REQUESTS FOR LENDER
--------------------------------------------------------- */
// export const getPendingReturns = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const requests = await ReturnRequest.find({
//       owner: userId,
//       status: "pending", 
//     })
//     .populate("item")
//     .populate("borrower", "name email");

//     res.json({ success: true, requests });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// 🔥 NAYA getPendingReturns (Copy-Paste this)
export const getPendingReturns = async (req, res) => {
  try {
    // Ye LENDER ke wo items layega jo abhi rent par hain ('active')
    const pendingReturns = await Borrow.find({
      owner: req.user._id,
      status: "active" 
    })
    .populate("item") // Item ki photo/title ke liye
    .populate("borrower", "name phone address idProof profilePic"); // 🔥 ASLI FIX: Ye line address aur naam bhejegi!

    res.json({ success: true, requests: pendingReturns });
  } catch (err) {
    console.error("Pending Returns Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
/* ---------------------------------------------------------
   ⏰ CRON JOB: AUTO-ESCALATION
--------------------------------------------------------- */
export const runAutoSettlement = async (req, res) => {
  try {
    console.log("⏰ Running Auto-Escalation Job...");
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const stuckRequests = await ReturnRequest.find({
      status: "pending_borrower_action",
      updatedAt: { $lt: twentyFourHoursAgo } 
    });

    if (stuckRequests.length === 0) {
        return res.json({ success: true, message: "No stuck cases found." });
    }

    for (const req of stuckRequests) {
      req.status = "disputed"; 
      req.lenderComment += " [System Note: Auto-sent to Admin due to inactivity.]";
      await req.save();
      console.log(`⚖️ Case ${req._id} sent to Admin Court.`);
    }

    res.json({ 
        success: true, 
        message: `${stuckRequests.length} cases sent to Admin Court automatically.` 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------------------------------------
   GET MY APPROVALS (For Red Card)
--------------------------------------------------------- */
export const getMyPenaltyApprovals = async (req, res) => {
  try {
    const userId = req.user._id;
    // Status 'pending_borrower_action' check karna zaruri hai
    const requests = await ReturnRequest.find({
      borrower: userId,
      status: { $in: ["waiting_approval", "pending_borrower_action", "disputed"] } 
    })
    .populate("item", "title")
    .populate("owner", "name");

    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};