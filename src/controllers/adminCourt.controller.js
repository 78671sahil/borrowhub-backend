import Item from "../models/item.model.js";

/* =========================================================
   1. OWNER: Case File karega (Report Theft)
   ========================================================= */
export const fileCase = async (req, res) => {
  try {
    const { itemId, reason } = req.body;
    const item = await Item.findById(itemId);

    if (item.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Only Owner can file a case." });
    }

    // Status Update -> Case goes to Admin
    item.status = "disputed_in_court";
    
    item.adminCourt = {
        isCaseOpen: true,
        reportedBy: req.user._id,
        reason: reason || "Item not returned",
        caseStartedAt: new Date(), // 🔥 TIMER START NOW
        verdict: "pending"
    };

    await item.save();

    res.status(200).json({ 
        success: true, 
        message: "Case filed in Admin Court! Admin will investigate." 
    });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* =========================================================
   2. ADMIN: Saare Open Cases dekhega (Timer ke saath)
   ========================================================= */
export const getCourtCases = async (req, res) => {
  try {
    // Sirf wo items lao jo Court me hain
    const cases = await Item.find({ "adminCourt.isCaseOpen": true })
        .populate("borrowedBy", "name email phone") // Borrower ka phone number chahiye call karne ko
        .populate("owner", "name email phone");

    // Har case ke sath "Time Elapsed" calculate karke bhejo
    const casesWithTimer = cases.map(item => {
        const now = new Date();
        const start = new Date(item.adminCourt.caseStartedAt);
        const hoursPassed = (now - start) / (1000 * 60 * 60); // Hours me convert
        
        return {
            ...item.toObject(),
            hoursPassed: hoursPassed.toFixed(1), // e.g., "12.5 hours"
            isTimeUp: hoursPassed >= 24 // Red Alert flag
        };
    });

    res.status(200).json({ success: true, cases: casesWithTimer });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* =========================================================
   3. ADMIN: JUDGEMENT DAY (Execute Penalty) 🔨
   ========================================================= */
export const executeVerdict = async (req, res) => {
  try {
    const { itemId, decision, adminNote } = req.body; 
    // decision = 'GUILTY' (Kaat lo paisa) or 'INNOCENT' (Chhod do)

    const item = await Item.findById(itemId);

    if (!item.adminCourt.isCaseOpen) return res.status(400).json({ message: "Case is closed" });

    // Admin apna comment save karega
    item.adminCourt.adminNotes = adminNote;

    if (decision === "GUILTY") {
        // 🔥 OPTION A: BANDA CHOR HAI -> PAISA KAATO
        
        if (!item.mandate.isActive) {
            return res.status(400).json({ message: "No active mandate found! Cannot deduct." });
        }

        console.log(`💸 CHARGING MANDATE ID: ${item.mandate.mandateId}`);
        console.log(`💰 AMOUNT: ₹${item.mandate.maxDeductibleAmount}`);

        // Yahan Razorpay API call hogi real deduction ke liye
        // await razorpay.subscriptions.charge({ ... })

        item.status = "completed"; // Case closed
        item.adminCourt.verdict = "guilty";
        item.adminCourt.isCaseOpen = false;
        
        // Mandate use ho gaya, ab item chala gaya samjho
        await item.save();

        return res.status(200).json({ success: true, message: "Penalty Deducted via Mandate. Case Closed." });

    } else {
        // 🕊️ OPTION B: BANDA MASOOM HAI (Samjha diya, item wapas kar diya)
        
        item.status = "available"; // Item wapas market me
        item.borrowedBy = null;
        item.adminCourt.verdict = "innocent";
        item.adminCourt.isCaseOpen = false;

        await item.save();

        return res.status(200).json({ success: true, message: "Case Dismissed. No money deducted." });
    }

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};