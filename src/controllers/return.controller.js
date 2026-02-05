 


// import Item from "../models/item.model.js";
// // import { chargeMandate } from "../utils/razorpay.js"; // Future me jab asli payment lagayega

// /* =========================================================
//    1. BORROWER: Request Return (Generate OTP)
//    ========================================================= */
// export const requestReturn = async (req, res) => {
//   try {
//     const { itemId } = req.body;
//     const userId = req.user._id;

//     // Item dhoondo jo user ne borrow kiya hai
//     const item = await Item.findOne({ _id: itemId, borrowedBy: userId });

//     if (!item) return res.status(404).json({ message: "Active borrowed item not found" });

//     // 4 Digit OTP Generate karo
//     const otp = Math.floor(1000 + Math.random() * 9000).toString();

//     // Item ke andar save kar do
//     item.returnRequest = {
//         otp: otp,
//         status: "pending",
//         requestedAt: new Date()
//     };

//     await item.save();

//     res.status(200).json({ success: true, message: "OTP Generated", otp });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* =========================================================
//    2. LENDER: Verify OTP (Return Process)
//    -> Agar Damage hai to Court me bhejega
//    -> Agar sahi hai to Return complete karega
//    ========================================================= */
// export const verifyReturnOtp = async (req, res) => {
//   try {
//     const { itemId, otp, damageClaimed, issueDescription } = req.body;
//     const userId = req.user._id;

//     const item = await Item.findById(itemId);
//     if (!item) return res.status(404).json({ message: "Item not found" });

//     // Check: Kya main hi owner hu?
//     if (item.owner.toString() !== userId.toString()) {
//         return res.status(403).json({ message: "Only Owner can verify return" });
//     }

//     // Check: OTP sahi hai?
//     if (!item.returnRequest || item.returnRequest.otp !== otp) {
//         return res.status(400).json({ message: "Invalid OTP! Return failed." });
//     }

//     // 🚨 CASE A: DAMAGE REPORTED -> SEND TO COURT
//     if (damageClaimed && Number(damageClaimed) > 0) {
        
//         item.status = "disputed_in_court"; // Status change (Red Alert)
//         item.returnRequest = null; // OTP clear

//         // Admin Court ka data bharo
//         item.adminCourt = {
//             isCaseOpen: true,
//             reportedBy: userId,
//             reason: issueDescription || "Damage reported during return",
//             caseStartedAt: new Date(),
//             verdict: "pending"
//         };

//         // Note: Max amount user ke mandate limit se zyada nahi ho sakta
//         const claim = Number(damageClaimed);
//         const limit = item.mandate?.maxDeductibleAmount || 0;
        
//         item.adminCourt.adminNotes = `Owner claimed damage: ₹${claim}. Mandate Limit: ₹${limit}`;

//         await item.save();

//         return res.json({ 
//             success: true, 
//             message: "Damage Reported! Case forwarded to Admin Court for Mandate Deduction." 
//         });
//     }

//     // ✅ CASE B: HAPPY RETURN (No Issues)
//     item.status = "available";
//     item.borrowedBy = null;
//     item.borrowFrom = null;
//     item.borrowTo = null;
//     item.returnRequest = null;
//     item.adminCourt = { isCaseOpen: false }; // Ensure court is closed

//     await item.save();

//     res.json({ success: true, message: "Item Returned Successfully!" });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* =========================================================
//    3. LENDER: File Case (Direct Theft Report - No OTP)
//    ========================================================= */
// export const fileCase = async (req, res) => {
//     try {
//         const { itemId, reason } = req.body;
//         const item = await Item.findById(itemId);

//         if (item.owner.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ message: "Unauthorized" });
//         }

//         // Status update -> Red Alert on Frontend
//         item.status = "disputed_in_court";
        
//         item.adminCourt = {
//             isCaseOpen: true,
//             reportedBy: req.user._id,
//             reason: reason || "Theft Reported by Owner",
//             caseStartedAt: new Date(),
//             verdict: "pending"
//         };

//         await item.save();
//         res.json({ success: true, message: "Case Filed! Admin has been notified." });

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// /* =========================================================
//    4. ADMIN: Get All Cases (For Dashboard)
//    ========================================================= */
// export const getCourtCases = async (req, res) => {
//     try {
//         // Sirf wo items lao jinka case open hai
//         const cases = await Item.find({ "adminCourt.isCaseOpen": true })
//             .populate("borrowedBy", "name email phone")
//             .populate("owner", "name phone");

//         // Timer Calculation (Frontend ko batane ke liye ki kitne ghante hue)
//         const casesWithTimer = cases.map(item => {
//             const start = new Date(item.adminCourt.caseStartedAt);
//             const now = new Date();
//             const hours = Math.abs(now - start) / 36e5; // Hours me difference
//             return {
//                 ...item.toObject(),
//                 hoursPassed: hours.toFixed(1),
//                 isTimeUp: hours >= 24
//             };
//         });

//         res.json({ success: true, cases: casesWithTimer });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// /* =========================================================
//    5. ADMIN: Execute Verdict (Paisa Kaatne wala button) 🔨
//    ========================================================= */
// export const executeVerdict = async (req, res) => {
//   try {
//     const { itemId, decision, adminNote } = req.body; 
//     // decision = 'GUILTY' (Paisa Kato) | 'INNOCENT' (Chhod do)

//     const item = await Item.findById(itemId);
//     if (!item) return res.status(404).json({ message: "Item not found" });

//     // Admin ka note save karo
//     item.adminCourt.adminNotes = adminNote;
//     item.adminCourt.isCaseOpen = false; // Case Closed in Court

//     if (decision === "GUILTY") {
//         // 💰 MANDATE CHARGE LOGIC
//         // Yahan Razorpay API call hogi asli paise katne ke liye
//         if (item.mandate?.isActive) {
//             console.log(`[MANDATE EXECUTED] Charging Subscription: ${item.mandate.mandateId}`);
//             console.log(`Amount: ₹${item.mandate.maxDeductibleAmount}`);
//             // await chargeMandate(item.mandate.mandateId, item.mandate.maxDeductibleAmount);
//         } else {
//             console.log("⚠️ No active mandate found to charge.");
//         }

//         // Frontend update ke liye verdict set karo
//         item.adminCourt.verdict = "guilty"; 
        
//         // Item lost ho gaya ya damage penalty mili
//         item.status = "completed"; 

//         await item.save();

//         res.json({ success: true, message: "Penalty Deducted via Mandate. Owner Notified." });

//     } else {
//         // 🕊️ CASE DISMISSED
//         item.status = "available"; // Item wapas available
//         item.borrowedBy = null;
//         item.adminCourt.verdict = "innocent";

//         await item.save();
//         res.json({ success: true, message: "Case Dismissed. No Deduction." });
//     }

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };




// import Item from "../models/item.model.js";

// /* =========================================================
//    🟢 PART 1: NEW SYSTEM (ADMIN COURT & THEFT) - ACTIVE
//    (Ye wo functions hain jo hum abhi use kar rahe hain)
// ========================================================= */

// // 1. Borrower Requests Return (Generate OTP)
// export const requestReturn = async (req, res) => {
//   try {
//     const { itemId } = req.body;
//     const userId = req.user._id;

//     const item = await Item.findOne({ _id: itemId, borrowedBy: userId });
//     if (!item) return res.status(404).json({ message: "Active borrow not found" });

//     const otp = Math.floor(1000 + Math.random() * 9000).toString();
//     item.returnRequest = { otp, status: "pending", requestedAt: new Date() };

//     await item.save();
//     res.status(200).json({ success: true, message: "OTP Generated", otp });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 2. Lender Verifies OTP OR Reports Damage
// export const verifyReturnOtp = async (req, res) => {
//   try {
//     const { itemId, otp, damageClaimed, issueDescription } = req.body;
//     const userId = req.user._id;

//     const item = await Item.findById(itemId);
//     if (!item) return res.status(404).json({ message: "Item not found" });

//     if (item.owner.toString() !== userId.toString()) {
//         return res.status(403).json({ message: "Only Owner can verify" });
//     }
//     if (!item.returnRequest || item.returnRequest.otp !== otp) {
//         return res.status(400).json({ message: "Invalid OTP!" });
//     }

//     // CASE A: DAMAGE REPORTED -> ADMIN COURT
//     if (damageClaimed && Number(damageClaimed) > 0) {
//         item.status = "disputed_in_court";
//         item.returnRequest = null;
//         item.adminCourt = {
//             isCaseOpen: true,
//             reportedBy: userId,
//             reason: issueDescription || "Damage reported during return",
//             caseStartedAt: new Date(),
//             verdict: "pending",
//             adminNotes: `Claim: ₹${damageClaimed}`
//         };
//         await item.save();
//         return res.json({ success: true, message: "Damage Reported! Case sent to Admin Court." });
//     }

//     // CASE B: SUCCESS RETURN
//     item.status = "available";
//     item.borrowedBy = null;
//     item.returnRequest = null;
//     item.adminCourt = { isCaseOpen: false };

//     await item.save();
//     res.json({ success: true, message: "Item Returned Successfully!" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
//  export const fileCase = async (req, res) => {
//     try {
//         console.log("-------------------------------------------------");
//         console.log("🚨 FILE CASE REQUEST HIT");
        
//         // Check 1: Middleware ne user set kiya ya nahi?
//         if (!req.user) {
//             console.log("❌ req.user is UNDEFINED (Middleware fail hua)");
//             return res.status(401).json({ message: "Middleware did not attach user." });
//         }

//         console.log("👤 User in Controller:", req.user);
//         console.log("🆔 User ID Type:", typeof req.user._id);
//         console.log("📦 Body:", req.body);

//         const { itemId, reason } = req.body;
//         const item = await Item.findById(itemId);

//         if (!item) return res.status(404).json({ message: "Item not found" });

//         // Check 2: Owner ID vs User ID
//         const ownerId = item.owner._id ? item.owner._id.toString() : item.owner.toString();
//         const userId = req.user._id.toString();

//         console.log(`⚖️ Compare: ItemOwner(${ownerId}) vs RequestUser(${userId})`);

//         if (ownerId !== userId) {
//             console.log("⛔ Unauthorized: IDs match nahi hui");
//             return res.status(403).json({ message: "You are not the owner!" });
//         }

//         // Logic...
//         item.status = "disputed_in_court";
//         item.adminCourt = {
//             isCaseOpen: true,
//             reportedBy: req.user._id,
//             reason: reason || "Theft Reported",
//             caseStartedAt: new Date(),
//             verdict: "pending"
//         };

//         await item.save();
//         console.log("✅ Case Filed Successfully");
//         res.json({ success: true, message: "Case Filed!" });

//     } catch (err) {
//         console.error("🔥 CRITICAL ERROR:", err);
//         res.status(500).json({ message: err.message });
//     }
// };

// // 4. Admin Dashboard (Get Cases)
// export const getCourtCases = async (req, res) => {
//     try {
//         const cases = await Item.find({ "adminCourt.isCaseOpen": true })
//             .populate("borrowedBy", "name email phone")
//             .populate("owner", "name phone");

//         const casesWithTimer = cases.map(item => {
//             const start = new Date(item.adminCourt.caseStartedAt);
//             const hours = Math.abs(new Date() - start) / 36e5;
//             return { ...item.toObject(), hoursPassed: hours.toFixed(1), isTimeUp: hours >= 24 };
//         });
//         res.json({ success: true, cases: casesWithTimer });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // 5. Execute Penalty (Admin Verdict)
// export const executeVerdict = async (req, res) => {
//   try {
//     const { itemId, decision, adminNote } = req.body; 
//     const item = await Item.findById(itemId);
//     if (!item) return res.status(404).json({ message: "Item not found" });

//     item.adminCourt.adminNotes = adminNote;
//     item.adminCourt.isCaseOpen = false;

//     if (decision === "GUILTY") {
//         if (item.mandate?.isActive) {
//             console.log(`Charging Mandate: ${item.mandate.mandateId} for ₹${item.mandate.maxDeductibleAmount}`);
//         }
//         item.adminCourt.verdict = "guilty"; 
//         item.status = "completed"; 
//         await item.save();
//         res.json({ success: true, message: "Penalty Deducted via Mandate." });
//     } else {
//         item.status = "available";
//         item.borrowedBy = null;
//         item.adminCourt.verdict = "innocent";
//         await item.save();
//         res.json({ success: true, message: "Case Dismissed." });
//     }
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// /* =========================================================
//    🟡 PART 2: OLD / COMPATIBILITY FUNCTIONS 
//    (Ye sirf isliye hain taaki Route file crash na ho)
// ========================================================= */

// // Used by MyItems page to check penalties
// export const getMyPenaltyApprovals = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     // Hum Item model se hi check kar lete hain (Smart move)
//     const items = await Item.find({ 
//         borrowedBy: userId, 
//         status: "disputed_in_court" 
//     });
//     res.json({ success: true, requests: items });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Used by Lender Pending Requests
// export const getPendingReturns = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const items = await Item.find({ owner: userId, "returnRequest.status": "pending" })
//         .populate("borrowedBy", "name");
//     res.json({ success: true, requests: items });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Placeholder for Approve Penalty (Old Logic)
// export const approvePenalty = async (req, res) => {
//     res.status(200).json({ message: "Please use Admin Court for resolution." });
// };

// // Placeholder for Dispute Penalty (Old Logic)
// export const disputePenalty = async (req, res) => {
//     res.status(200).json({ message: "Dispute recorded." });
// };

// // Placeholder for Old Cron
// export const runAutoSettlement = async (req, res) => {
//     res.status(200).json({ message: "Auto-settlement is now handled by Admin Court." });
// };




 import Item from "../models/item.model.js";
import Borrow from "../models/borrow.model.js"; // 🔥 IMPORT ADDED

/* =========================================================
   1. BORROWER: Return Request Start (Generate OTP)
   Frontend Call: POST /api/return/request
   ========================================================= */
export const requestReturn = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user._id;

    console.log("🔄 Return Requested for Item:", itemId);

    // Item dhoondo jo user ne borrow kiya hai
    const item = await Item.findOne({ _id: itemId, borrowedBy: userId });

    if (!item) {
        return res.status(404).json({ message: "Active borrowed item not found or unauthorized" });
    }

    // 4 Digit OTP Generate karo
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Item ke andar save kar do
    item.returnRequest = {
        otp: otp,
        status: "pending",
        requestedAt: new Date()
    };

    await item.save();

    res.status(200).json({ success: true, message: "OTP Generated", otp });

  } catch (err) {
    console.error("Return Request Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   2. LENDER: Get Pending Requests (Handover Page)
   Frontend Call: GET /api/return/pending-requests
   ========================================================= */
export const getPendingReturns = async (req, res) => {
  try {
    const userId = req.user._id;

    // Wo items dhoondo jo Mere hain aur Jinpar 'pending' request hai
    const items = await Item.find({ 
        owner: userId, 
        "returnRequest.status": "pending" 
    })
    .populate("borrowedBy", "name email phone image"); // User details bhi bhejo

    // Frontend ko 'requests' array chahiye (Handover.jsx logic ke hisaab se)
    res.json({ success: true, requests: items });

  } catch (err) {
    console.error("Get Pending Returns Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   3. LENDER: Verify OTP (Complete Return)
   Frontend Call: POST /api/return/verify
   ========================================================= */
export const verifyReturnOtp = async (req, res) => {
  try {
    const { itemId, otp, damageClaimed, issueDescription } = req.body;
    const userId = req.user._id;

    console.log("🔍 Verifying OTP for Item:", itemId);

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Owner Check
    if (item.owner.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Only Owner can verify return" });
    }

    // OTP Check
    if (!item.returnRequest || item.returnRequest.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP! Return failed." });
    }

    // --- SCENARIO A: DAMAGE (COURT CASE) ---
    if (damageClaimed && Number(damageClaimed) > 0) {
        item.status = "disputed_in_court";
        item.returnRequest = null; // Clear OTP
        
        item.adminCourt = {
            isCaseOpen: true,
            reportedBy: userId,
            reason: issueDescription || "Damage reported during Handover",
            caseStartedAt: new Date(),
            verdict: "pending",
            adminNotes: `Claim: ₹${damageClaimed}`
        };

        await item.save();
        return res.json({ success: true, message: "Damage Reported! Sent to Admin Court." });
    }

    // --- SCENARIO B: SUCCESSFUL RETURN (NO DAMAGE) ---
    
    // 1. Update ITEM (Available on Home Page)
    item.status = "available"; // ✅ AB YE HOME PAGE PAR DIKHEGA
    item.borrowedBy = null;
    item.borrowFrom = null;
    item.borrowTo = null;
    item.pickupOtp = "";      // Safai
    item.returnRequest = null; // Clear Request
    item.adminCourt = { isCaseOpen: false };

    await item.save();

    // 2. 🔥 Update BORROW HISTORY (Mark as Completed)
    // Ye line zaroori hai taaki 'My Items' me item 'Returned' dikhe, na ki 'Active'
    await Borrow.findOneAndUpdate(
        { item: itemId, status: "active" }, // Active borrow dhoondo
        { 
            status: "completed", 
            returnDate: new Date() 
        }
    );

    res.json({ success: true, message: "Item Returned Successfully!" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   4. ADMIN / OWNER: File Direct Case (Theft)
   Frontend Call: POST /api/admin-court/file-case
   ========================================================= */
export const fileCase = async (req, res) => {
    try {
        const { itemId, reason } = req.body;
        
        if(!req.user) return res.status(401).json({message: "Unauthorized"});

        const item = await Item.findById(itemId);
        if(!item) return res.status(404).json({message: "Item not found"});

        if (item.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        item.status = "disputed_in_court";
        item.adminCourt = {
            isCaseOpen: true,
            reportedBy: req.user._id,
            reason: reason || "Theft Reported",
            caseStartedAt: new Date(),
            verdict: "pending"
        };

        await item.save();
        res.json({ success: true, message: "Case Filed! Admin notified." });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- ADMIN DASHBOARD ---
export const getCourtCases = async (req, res) => {
    try {
        const cases = await Item.find({ "adminCourt.isCaseOpen": true })
            .populate("borrowedBy", "name phone")
            .populate("owner", "name phone");
        
        const data = cases.map(c => {
             const hrs = Math.abs(new Date() - new Date(c.adminCourt.caseStartedAt)) / 36e5;
             return { ...c.toObject(), hoursPassed: hrs.toFixed(1), isTimeUp: hrs >= 24 };
        });
        
        res.json({ success: true, cases: data });
    } catch (err) { res.status(500).json({message: err.message}); }
};

export const executeVerdict = async (req, res) => {
    try {
        const { itemId, decision, adminNote } = req.body;
        const item = await Item.findById(itemId);
        item.adminCourt.isCaseOpen = false;
        item.adminCourt.adminNotes = adminNote;
        
        if(decision === "GUILTY") {
            item.adminCourt.verdict = "guilty";
            item.status = "completed"; // Lost/Sold
        } else {
            item.adminCourt.verdict = "innocent";
            item.status = "available"; // Back to Home
        }
        await item.save();
        res.json({ success: true, message: "Verdict Executed." });
    } catch (err) { res.status(500).json({message: err.message}); }
};

// --- DUMMY FUNCTIONS ---
export const getMyPenaltyApprovals = async (req, res) => res.json({success: true, requests: []});
export const approvePenalty = async (req, res) => res.json({success: true});
export const disputePenalty = async (req, res) => res.json({success: true});
export const runAutoSettlement = async (req, res) => res.json({success: true});