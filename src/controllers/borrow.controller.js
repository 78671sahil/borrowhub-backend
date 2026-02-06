// //  import Borrow from "../models/borrow.model.js";
// // import Item from "../models/item.model.js";

// // // ---------------------------------------------------------
// // // 1. CREATE BORROW (Legacy/Direct)
// // // ---------------------------------------------------------
// // export const createBorrow = async (req, res) => {
// //   try {
// //     const userId = req.user._id;

// //     const {
// //       itemId,
// //       startDate,
// //       endDate,
// //     } = req.body;

// //     // 🔎 Item fetch
// //     const item = await Item.findById(itemId).populate("owner");

// //     if (!item) {
// //       return res.status(404).json({ message: "Item not found" });
// //     }

// //     if (item.status !== "available") {
// //       return res.status(400).json({ message: "Item not available" });
// //     }

// //     // 🧮 Calculate rent
// //     const days =
// //       Math.ceil(
// //         (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
// //       ) || 1;

// //     const totalRent = days * item.pricePerDay;

// //     // 🧾 Create borrow record
// //     const borrow = await Borrow.create({
// //       item: item._id,
// //       owner: item.owner._id,
// //       borrower: userId,
// //       startDate,
// //       endDate,
// //       rentPerDay: item.pricePerDay,
// //       totalRent,
// //       deposit: item.deposit,
// //       status: "active",
// //     });

// //     // 🔒 Update item
// //     item.status = "borrowed";
// //     item.borrowedBy = userId;
// //     await item.save();

// //     res.status(201).json({
// //       success: true,
// //       borrow,
// //     });
// //   } catch (err) {
// //     console.error("createBorrow error:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };

// // // ---------------------------------------------------------
// // // 2. CONFIRM BORROW
// // // ---------------------------------------------------------
// // export const confirmBorrow = async (req, res) => {
// //   try {
// //     const { itemId, startDate, endDate } = req.body;

// //     const item = await Item.findById(itemId);
// //     if (!item) return res.status(404).json({ message: "Item not found" });

// //     if (item.status === "borrowed") {
// //       return res.status(400).json({ message: "Item already borrowed" });
// //     }

// //     item.status = "borrowed";
// //     item.borrowedBy = req.user._id;
// //     item.borrowFrom = startDate;
// //     item.borrowTo = endDate;

// //     await item.save();

// //     res.json({ success: true, item });
// //   } catch (err) {
// //     res.status(500).json({ message: "Borrow failed" });
// //   }
// // };

// // // ---------------------------------------------------------
// // // 3. 🔥 VERIFY PICKUP OTP (Handover Logic)
// // // ---------------------------------------------------------
// // export const verifyPickup = async (req, res) => {
// //   try {
// //     const { itemId, otp } = req.body;
// //     const userId = req.user._id; // Lender (Owner)

// //     // 1. Find Borrow Request (Jo 'reserved' hai)
// //     const borrow = await Borrow.findOne({
// //       item: itemId,
// //       owner: userId,
// //       status: "reserved",
// //     });

// //     if (!borrow) {
// //       return res.status(404).json({ success: false, message: "No pending pickup found." });
// //     }

// //     // 2. Check OTP
// //     if (borrow.pickupOtp !== otp) {
// //       return res.status(400).json({ success: false, message: "❌ Wrong OTP!" });
// //     }

// //     // 3. ✅ Update BORROW Status
// //     borrow.status = "active";
// //     await borrow.save();

// //     // 4. ✅ Update ITEM Status (Reserved -> Borrowed)
// //     // 🔥 Ye line sabse zaruri hai taki "Lent Out" me dikhe ki item chala gaya
// //     await Item.findByIdAndUpdate(itemId, { status: "borrowed" });

// //     res.json({ success: true, message: "Handover Successful! 🚀" });

// //   } catch (err) {
// //     console.error("Verify Error:", err);
// //     res.status(500).json({ success: false, message: "Server Error" });
// //   }
// // };

// // // ---------------------------------------------------------
// // // 4. 🔥 EVIDENCE UPLOAD API
// // // ---------------------------------------------------------
// // export const uploadPickupEvidence = async (req, res) => {
// //   try {
// //     const { borrowId, photos } = req.body; // Frontend se photos ka array aayega

// //     const borrow = await Borrow.findById(borrowId);
// //     if (!borrow) return res.status(404).json({ message: "Borrow record not found" });

// //     // Photos save karo
// //     borrow.pickupEvidence = photos;
// //     await borrow.save();

// //     res.json({ success: true, message: "Evidence Saved!" });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // // ---------------------------------------------------------
// // // 5. 🔥 NEW: Navbar Badge Counts (Red/Yellow Dots ke liye)
// // // ---------------------------------------------------------
// // export const getNavbarCounts = async (req, res) => {
// //   try {
// //     const userId = req.user._id;

// //     // 1. Lender ke liye: Kitne items "Reserved" hain? (Jo dene hain)
// //     const pendingHandovers = await Borrow.countDocuments({
// //       owner: userId,
// //       status: "reserved" // Matlab borrower ne pay kar diya, ab saman dena hai
// //     });

// //     // 2. Borrower ke liye: Kitne items "Active" ya "Reserved" hain?
// //     const activeBorrows = await Borrow.countDocuments({
// //       borrower: userId,
// //       status: { $in: ["reserved", "active"] } // Pickup baki hai ya use kar raha hai
// //     });

// //     res.json({ success: true, pendingHandovers, activeBorrows });
// //   } catch (err) {
// //     console.error(err);
// //     res.json({ success: false, pendingHandovers: 0, activeBorrows: 0 });
// //   }
// // };
























// // import Borrow from "../models/borrow.model.js";
// // import Item from "../models/item.model.js";

// // // ---------------------------------------------------------
// // // 1. CREATE BORROW
// // // ---------------------------------------------------------
// // export const createBorrow = async (req, res) => {
// //   try {
// //     const userId = req.user._id;
// //     const { itemId, startDate, endDate } = req.body;

// //     const item = await Item.findById(itemId).populate("owner");
// //     if (!item) return res.status(404).json({ message: "Item not found" });
// //     if (item.status !== "available") return res.status(400).json({ message: "Item not available" });

// //     const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1;
// //     const totalRent = days * item.pricePerDay;

// //     const borrow = await Borrow.create({
// //       item: item._id,
// //       owner: item.owner._id,
// //       borrower: userId,
// //       startDate,
// //       endDate,
// //       rentPerDay: item.pricePerDay,
// //       totalRent,
// //       deposit: item.deposit,
// //       status: "active",
// //     });

// //     item.status = "borrowed";
// //     item.borrowedBy = userId;
// //     await item.save();

// //     res.status(201).json({ success: true, borrow });
// //   } catch (err) {
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };

// // // ---------------------------------------------------------
// // // 2. CONFIRM BORROW
// // // ---------------------------------------------------------
// // export const confirmBorrow = async (req, res) => {
// //   try {
// //     const { itemId, startDate, endDate } = req.body;
// //     const item = await Item.findById(itemId);
// //     if (!item) return res.status(404).json({ message: "Item not found" });

// //     if (item.status === "borrowed") return res.status(400).json({ message: "Item already borrowed" });

// //     item.status = "borrowed";
// //     item.borrowedBy = req.user._id;
// //     item.borrowFrom = startDate;
// //     item.borrowTo = endDate;
// //     await item.save();

// //     res.json({ success: true, item });
// //   } catch (err) {
// //     res.status(500).json({ message: "Borrow failed" });
// //   }
// // };

// // // ---------------------------------------------------------
// // // 3. 🔥 VERIFY PICKUP OTP & SAVE EVIDENCE (UPDATED)
// // // ---------------------------------------------------------
// // export const verifyPickup = async (req, res) => {
// //   try {
// //     // 🔥 Frontend se ab 'evidence' (photos array) bhi aayega
// //     const { itemId, otp, evidence } = req.body;
// //     const userId = req.user._id;

// //     const borrow = await Borrow.findOne({
// //       item: itemId,
// //       owner: userId,
// //       status: "reserved",
// //     });

// //     if (!borrow) return res.status(404).json({ success: false, message: "No pending pickup found." });

// //     if (borrow.pickupOtp !== otp) {
// //       return res.status(400).json({ success: false, message: "❌ Wrong OTP!" });
// //     }

// //     // Update Status
// //     borrow.status = "active";
    
// //     // 🔥 Save Photos if verified
// //     if (evidence && evidence.length > 0) {
// //         borrow.pickupEvidence = evidence; 
        
// //         // Item model me bhi save kar lete hain safety ke liye
// //         await Item.findByIdAndUpdate(itemId, { pickupEvidence: evidence });
// //     }

// //     await borrow.save();

// //     // Item Status Update
// //     await Item.findByIdAndUpdate(itemId, { status: "borrowed" });

// //     res.json({ success: true, message: "Handover Successful! Evidence Saved. 📸" });

// //   } catch (err) {
// //     console.error("Verify Error:", err);
// //     res.status(500).json({ success: false, message: "Server Error" });
// //   }
// // };

// // // ---------------------------------------------------------
// // // 4. EVIDENCE UPLOAD (Standalone - Optional)
// // // ---------------------------------------------------------
// // export const uploadPickupEvidence = async (req, res) => {
// //   try {
// //     const { borrowId, photos } = req.body;
// //     const borrow = await Borrow.findById(borrowId);
// //     if (!borrow) return res.status(404).json({ message: "Borrow record not found" });

// //     borrow.pickupEvidence = photos;
// //     await borrow.save();

// //     res.json({ success: true, message: "Evidence Saved!" });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // // ---------------------------------------------------------
// // // 5. NAVBAR COUNTS
// // // ---------------------------------------------------------
// // export const getNavbarCounts = async (req, res) => {
// //   try {
// //     const userId = req.user._id;
// //     const pendingHandovers = await Borrow.countDocuments({ owner: userId, status: "reserved" });
// //     const activeBorrows = await Borrow.countDocuments({ borrower: userId, status: { $in: ["reserved", "active"] } });
// //     res.json({ success: true, pendingHandovers, activeBorrows });
// //   } catch (err) {
// //     res.json({ success: false, pendingHandovers: 0, activeBorrows: 0 });
// //   }
// // };









// import Borrow from "../models/borrow.model.js";
// import Item from "../models/item.model.js";

// // ---------------------------------------------------------
// // 1. CREATE BORROW
// // ---------------------------------------------------------
// export const createBorrow = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { itemId, startDate, endDate } = req.body;

//     const item = await Item.findById(itemId).populate("owner");
//     if (!item) return res.status(404).json({ message: "Item not found" });
//     if (item.status !== "available") return res.status(400).json({ message: "Item not available" });

//     const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1;
//     const totalRent = days * item.pricePerDay;

//     const borrow = await Borrow.create({
//       item: item._id,
//       owner: item.owner._id,
//       borrower: userId,
//       startDate,
//       endDate,
//       rentPerDay: item.pricePerDay,
//       totalRent,
//       deposit: item.deposit,
//       status: "active",
//     });

//     item.status = "borrowed";
//     item.borrowedBy = userId;
//     await item.save();

//     res.status(201).json({ success: true, borrow });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ---------------------------------------------------------
// // 2. CONFIRM BORROW
// // ---------------------------------------------------------
// export const confirmBorrow = async (req, res) => {
//   try {
//     const { itemId, startDate, endDate } = req.body;
//     const item = await Item.findById(itemId);
//     if (!item) return res.status(404).json({ message: "Item not found" });

//     if (item.status === "borrowed") return res.status(400).json({ message: "Item already borrowed" });

//     item.status = "borrowed";
//     item.borrowedBy = req.user._id;
//     item.borrowFrom = startDate;
//     item.borrowTo = endDate;
//     await item.save();

//     res.json({ success: true, item });
//   } catch (err) {
//     res.status(500).json({ message: "Borrow failed" });
//   }
// };

// // ---------------------------------------------------------
// // 3. 🔥 VERIFY PICKUP & FIX STATUS/EVIDENCE
// // ---------------------------------------------------------
// export const verifyPickup = async (req, res) => {
//   try {
//     const { itemId, otp, evidence } = req.body;
//     const userId = req.user._id;

//     const borrow = await Borrow.findOne({
//       item: itemId,
//       owner: userId,
//       status: "reserved",
//     });

//     if (!borrow) return res.status(404).json({ success: false, message: "No pending pickup found." });

//     if (borrow.pickupOtp !== otp) {
//       return res.status(400).json({ success: false, message: "❌ Wrong OTP!" });
//     }

//     // 1. Update Borrow Status
//     borrow.status = "active";
    
//     // 2. Save Evidence (Agar hai to)
//     if (evidence && evidence.length > 0) {
//         borrow.pickupEvidence = evidence; 
//     }
//     await borrow.save();

//     // 3. Update Item Status (Isse Banner Gayab Hoga aur Dot Hatega)
//     // 🔥 Important: Evidence ko Item model me bhi daal rahe hain taaki Card pe dikhe
//     await Item.findByIdAndUpdate(itemId, { 
//         status: "borrowed",
//         pickupEvidence: evidence || [] 
//     });

//     res.json({ success: true, message: "Handover Successful! Evidence Saved. 📸" });

//   } catch (err) {
//     console.error("Verify Error:", err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // ---------------------------------------------------------
// // 4. EVIDENCE UPLOAD (Standalone)
// // ---------------------------------------------------------
// export const uploadPickupEvidence = async (req, res) => {
//   try {
//     const { borrowId, photos } = req.body;
//     const borrow = await Borrow.findById(borrowId);
//     if (!borrow) return res.status(404).json({ message: "Borrow record not found" });

//     borrow.pickupEvidence = photos;
//     await borrow.save();

//     res.json({ success: true, message: "Evidence Saved!" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ---------------------------------------------------------
// // 5. NAVBAR COUNTS (Isi se Dot aate hain)
// // ---------------------------------------------------------
// export const getNavbarCounts = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     // Sirf 'reserved' status walon ka count bhejte hain
//     const pendingHandovers = await Borrow.countDocuments({ owner: userId, status: "reserved" });
//     const activeBorrows = await Borrow.countDocuments({ borrower: userId, status: "reserved" }); 
    
//     res.json({ success: true, pendingHandovers, activeBorrows });
//   } catch (err) {
//     res.json({ success: false, pendingHandovers: 0, activeBorrows: 0 });
//   }
// };



import Borrow from "../models/borrow.model.js";
import Item from "../models/item.model.js";






// 🔥 5-Minute Auto Revert Logic
 export const startReservationTimer = (itemId, borrowId) => {
  setTimeout(async () => {
    try {
      const item = await Item.findById(itemId);
      const borrow = await Borrow.findById(borrowId);

      // Agar status abhi bhi "reserved" hai, matlab OTP verify nahi hua
      if (item && item.status === "reserved") {
        item.status = "available";
        item.borrowedBy = null;
        item.pickupOtp = "";
        await item.save();

        if (borrow && borrow.status === "reserved") {
          borrow.status = "cancelled";
          await borrow.save();
        }
        console.log(`⏰ Time up! Item ${itemId} is now available again.`);
      }
    } catch (err) {
      console.error("Timer error:", err);
    }
  }, 5 * 60 * 1000); // $5 \times 60 \times 1000$ ms
};

// ---------------------------------------------------------
// 1. CREATE BORROW
// ---------------------------------------------------------
export const createBorrow = async (req, res) => {
  try {
    const userId = req.user._id;
    // Frontend se startDate/endDate aa raha hai
    const { itemId, startDate, endDate } = req.body;

    const item = await Item.findById(itemId).populate("owner");
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.status !== "available") return res.status(400).json({ message: "Item not available" });

    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1;
    const totalRent = days * item.pricePerDay;

    // 🔥 Generate Unique OTP
    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const borrow = await Borrow.create({
      item: item._id,
      owner: item.owner._id,
      borrower: userId,
      
      // ✅ FIX: Frontend ka startDate -> DB ka borrowFrom ban gaya
      borrowFrom: startDate, 
      borrowTo: endDate,     
      
      pricePerDay: item.pricePerDay,
      totalRent,
      deposit: item.deposit,
      
      // 🔥 FIX: OTP Saved Here
      pickupOtp: pickupOtp, 
      status: "reserved", 
    });

    // Item update
    item.status = "reserved";
    item.borrowedBy = userId;
    item.pickupOtp = pickupOtp; 
    await item.save();
    startReservationTimer(item._id, borrow._id);

    res.status(201).json({ success: true, borrow });
  } catch (err) {
    console.error("Create Borrow Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------------------------------------
// 2. CONFIRM BORROW
// ---------------------------------------------------------
export const confirmBorrow = async (req, res) => {
  try {
    const { itemId, startDate, endDate } = req.body;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.status === "borrowed") return res.status(400).json({ message: "Item already borrowed" });

    item.status = "borrowed";
    item.borrowedBy = req.user._id;
    item.borrowFrom = startDate;
    item.borrowTo = endDate;
    await item.save();

    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ message: "Borrow failed" });
  }
};

// ---------------------------------------------------------
// 3. 🔥 VERIFY PICKUP
// ---------------------------------------------------------
 // ---------------------------------------------------------
// 3. 🔥 VERIFY PICKUP (FIXED & FINAL)
// ---------------------------------------------------------
export const verifyPickup = async (req, res) => {
  try {
    const { itemId, otp, evidence } = req.body;
    const userId = req.user._id;

    console.log(`🔍 Verifying Pickup for Item: ${itemId}, User: ${userId}`);

    // 🔥 FIX 1: Sabse LATEST booking uthao (Ghost bookings ignore hongi)
    const borrow = await Borrow.findOne({
      item: itemId,
      owner: userId,
      status: "reserved",
    }).sort({ createdAt: -1 }); // 👈 LATEST FIRST

    if (!borrow) {
        console.log("❌ No pending pickup found in DB");
        return res.status(404).json({ success: false, message: "No pending pickup found." });
    }

    // 🔥 FIX 2: String banakar Trim karo (Spaces aur Type ka lafda khatam)
    const inputOtp = String(otp).trim();
    const dbOtp = String(borrow.pickupOtp).trim();

    console.log(`👉 Matching: Input('${inputOtp}') vs DB('${dbOtp}')`);

    if (inputOtp !== dbOtp) {
      console.log("❌ OTP Mismatch!");
      return res.status(400).json({ success: false, message: "❌ Wrong OTP! Please check carefully." });
    }

    // --- Success Logic ---
    borrow.status = "active";
    if (evidence && evidence.length > 0) {
        borrow.pickupEvidence = evidence; 
    }
    await borrow.save();

    await Item.findByIdAndUpdate(itemId, { 
        status: "borrowed",
        pickupEvidence: evidence || [] 
    });

    console.log("✅ Handover Successful!");
    res.json({ success: true, message: "Handover Successful! Evidence Saved. 📸" });

  } catch (err) {
    console.error("Verify Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ---------------------------------------------------------
// 4. EVIDENCE UPLOAD
// ---------------------------------------------------------
export const uploadPickupEvidence = async (req, res) => {
  try {
    const { borrowId, photos } = req.body;
    const borrow = await Borrow.findById(borrowId);
    if (!borrow) return res.status(404).json({ message: "Borrow record not found" });

    borrow.pickupEvidence = photos;
    await borrow.save();

    res.json({ success: true, message: "Evidence Saved!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------------------
// 5. NAVBAR COUNTS
// ---------------------------------------------------------
export const getNavbarCounts = async (req, res) => {
  try {
    const userId = req.user._id;
    const pendingHandovers = await Borrow.countDocuments({ owner: userId, status: "reserved" });
    const activeBorrows = await Borrow.countDocuments({ borrower: userId, status: "reserved" }); 
    
    res.json({ success: true, pendingHandovers, activeBorrows });
  } catch (err) {
    res.json({ success: false, pendingHandovers: 0, activeBorrows: 0 });
  }
};