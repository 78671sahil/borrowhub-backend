import { verify } from "crypto";
import Borrow from "../models/borrow.model.js";
import Item from "../models/item.model.js";


 

// 🔥 VERIFY PICKUP OTP


// export const createBorrow = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const {
//       itemId,
//       startDate,
//       endDate,
//     } = req.body;

//     // 🔎 Item fetch
//     const item = await Item.findById(itemId).populate("owner");

//     if (!item) {
//       return res.status(404).json({ message: "Item not found" });
//     }

//     if (item.status !== "available") {
//       return res.status(400).json({ message: "Item not available" });
//     }

//     // 🧮 Calculate rent
//     const days =
//       Math.ceil(
//         (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
//       ) || 1;

//     const totalRent = days * item.pricePerDay;

//     // 🧾 Create borrow record
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

//     // 🔒 Update item
//     item.status = "borrowed";
//     item.borrowedBy = userId;
//     await item.save();

//     res.status(201).json({
//       success: true,
//       borrow,
//     });
//   } catch (err) {
//     console.error("createBorrow error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };




//2 no h
// export const createBorrow = async (req, res) => {
//   try {
//     const { itemId, startDate, endDate } = req.body;
//     console.log("📥 New Booking Request:", { itemId, startDate, endDate });

//     const item = await Item.findById(itemId);
//     if (!item || item.status !== "available") return res.status(400).json({ message: "Item unavailable" });

//     const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();
    
//     // 1. Create Borrow Record
//     const borrow = await Borrow.create({
//       item: itemId,
//       owner: item.owner,
//       borrower: req.user._id,
//       borrowFrom: startDate, 
//       borrowTo: endDate,
//       pickupOtp,
//       status: "reserved"
//     });
//     console.log("✅ Borrow Record Created. OTP:", pickupOtp);

//     // 2. Update Item
//     item.status = "reserved";
//     item.borrowedBy = req.user._id;
//     item.pickupOtp = pickupOtp;
//     item.borrowFrom = startDate;
//     item.borrowTo = endDate;
//     await item.save();
//     console.log("✅ Item updated to RESERVED");

//     // Timer (5 Min)
//     setTimeout(async () => {
//         const b = await Borrow.findById(borrow._id);
//         if(b && b.status === "reserved") {
//             await Item.findByIdAndUpdate(itemId, { status: "available", borrowedBy: null, pickupOtp: null });
//             await Borrow.findByIdAndUpdate(borrow._id, { status: "cancelled" });
//             console.log("⏰ Timer Up: Item Reverted to Available");
//         }
//     }, 5 * 60 * 1000);

//     res.status(201).json({ success: true, pickupOtp, borrowId: borrow._id });
//   } catch (err) {
//     console.error("🔥 Error:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };
export const createBorrow = async (req, res) => {
  try {
    const { itemId, startDate, endDate } = req.body;
    const item = await Item.findById(itemId);

    if (!item || item.status !== "available") {
      return res.status(400).json({ message: "Item unavailable" });
    }

    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // 🔥 WALLET FIX: Yahan price calculate kar rahe hain taaki DB mein save ho
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1;
    const totalRent = days * item.pricePerDay;

    // 1. Create Borrow Record
    const borrow = await Borrow.create({
      item: itemId,
      owner: item.owner,
      borrower: req.user._id,
      borrowFrom: startDate, 
      borrowTo: endDate,
      pricePerDay: item.pricePerDay, // Wallet ke liye zaroori
      totalPrice: totalRent,         // Wallet ke liye zaroori
      pickupOtp,
      status: "reserved"
    });

    // 2. Update Item Status
    item.status = "reserved";
    item.borrowedBy = req.user._id;
    item.pickupOtp = pickupOtp;
    item.borrowFrom = startDate;
    item.borrowTo = endDate;
    await item.save();

    // ⏰ 5-MINUTE AUTO-RELEASE TIMER
    setTimeout(async () => {
        const b = await Borrow.findById(borrow._id);
        if(b && b.status === "reserved") {
            await Item.findByIdAndUpdate(itemId, { 
                status: "available", 
                borrowedBy: null, 
                pickupOtp: null,
                borrowFrom: null,
                borrowTo: null
            });
            await Borrow.findByIdAndUpdate(borrow._id, { status: "cancelled" });
            console.log("⏰ Timer Up: Item Reverted to Available");
        }
    }, 5 * 60 * 1000);

    res.status(201).json({ success: true, pickupOtp, borrowId: borrow._id });
  } catch (err) {
    console.error("Create Borrow Error:", err);
    res.status(500).json({ message: err.message });
  }
};


//verify pickup OTP ka code neeche hai, uske baad wallet wala code hai, dono important hain, dono ko mat hata dena
//   export const verifyPickup = async (req, res) => {
//   try {
//     const { itemId, otp } = req.body;
//     const userId = req.user._id; // Lender (Owner)

//     console.log(`🔑 Verifying OTP: ${otp} for Item: ${itemId}`);

//     // 🔥 THE FIX: Ab hum 'sort' pe depend nahi karenge. 
//     // Seedha us record ko dhoondho jisme ye Item ID aur yehi OTP ho!
//     const borrow = await Borrow.findOne({
//       item: itemId,
//       owner: userId,
//       status: "reserved",
//       pickupOtp: String(otp).trim() // String mein convert kiya safety ke liye
//     });

//     // Agar OTP match nahi hua, toh borrow `null` aayega
//     if (!borrow) {
//       return res.status(400).json({ success: false, message: "❌ Wrong OTP or Booking Expired!" });
//     }

//     // ✅ Status Update: Ab ye 'active' (Borrowed) ban gaya
//     borrow.status = "active";
//     await borrow.save();

//     // 🔥 Item Status Update: Ye Lent Out list se hat jayega
//     await Item.findByIdAndUpdate(itemId, { 
//       status: "borrowed", 
//       pickupOtp: null // Security: OTP ka kaam khatam, isko hata do
//     });

//     console.log("🚀 Handover Complete!");
//     res.json({ success: true, message: "Handover Successful! 🚀" });

//   } catch (err) {
//     console.error("Verify Error:", err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };
//      
//      

//      
//             // backend/controllers/borrow.controller.js

export const verifyPickup = async (req, res) => {
  try {
    const { itemId, otp, evidence } = req.body; // 🔥 Handover.jsx se 'evidence' (photos) aa rahi hain
    const userId = req.user._id;

    const borrow = await Borrow.findOne({
      item: itemId,
      owner: userId,
      status: "reserved",
      pickupOtp: String(otp).trim()
    });

    if (!borrow) {
      return res.status(400).json({ success: false, message: "❌ Wrong OTP or Booking Expired!" });
    }

    // 1. Borrow record update karo
    borrow.status = "active";
    borrow.pickupEvidence = evidence; // Evidence yahan bhi save karo backup ke liye
    await borrow.save();

    // 2. 🔥 ITEM UPDATE (Sabse Zaroori): Photos ko Item mein daalo taaki Card par dikhe
     await Item.findByIdAndUpdate(itemId, { 
      status: "borrowed", 
      pickupOtp: null,
      pickupEvidence: evidence // ✅ Ye line zaroori hai button ke liye
    });

    res.json({ success: true, message: "Handover Successful! 🚀" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const confirmBorrow = async (req, res) => {
  try {
    const { itemId, startDate, endDate } = req.body;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.status === "borrowed") {
      return res.status(400).json({ message: "Item already borrowed" });
    }

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


//real vaala verify

//  export const verifyPickup = async (req, res) => {
//   try {
//     const { itemId, otp } = req.body;
//     const userId = req.user._id; // Lender (Owner)

//     // 1. Find Borrow Request (Jo 'reserved' hai)
//     const borrow = await Borrow.findOne({
//       item: itemId,
//       owner: userId,
//       status: "reserved",
//     }).sort({ createdAt: -1 });

//     if (!borrow) {
//       return res.status(404).json({ success: false, message: "No pending pickup found." });
//     }

//     // 2. Check OTP
//     if (borrow.pickupOtp !== otp) {
//       return res.status(400).json({ success: false, message: "❌ Wrong OTP!" });
//     }

//     // 3. ✅ Update BORROW Status
//     borrow.status = "active";
//     await borrow.save();

//     // 4. ✅ Update ITEM Status (Reserved -> Borrowed)
//     // 🔥 Ye line sabse zaruri hai taki "Lent Out" me dikhe ki item chala gaya
//     await Item.findByIdAndUpdate(itemId, { status: "borrowed",pickupOtp: null });

//     res.json({ success: true, message: "Handover Successful! 🚀" });

//   } catch (err) {
//     console.error("Verify Error:", err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };



// File: backend/controllers/borrow.controller.js

 

// 🔥 EVIDENCE UPLOAD API
export const uploadPickupEvidence = async (req, res) => {
  try {
    const { borrowId, photos } = req.body; // Frontend se photos ka array aayega

    const borrow = await Borrow.findById(borrowId);
    if (!borrow) return res.status(404).json({ message: "Borrow record not found" });

    // Photos save karo
    borrow.pickupEvidence = photos;
    await borrow.save();

    res.json({ success: true, message: "Evidence Saved!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔥 FETCH NAVBAR COUNTS (For Red & Green Dots)
export const getNavbarCounts = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Pending Handovers (Lender ke side pe kitne orders OTP ka wait kar rahe hain)
    const pendingHandovers = await Item.countDocuments({
      owner: userId,
      status: "reserved"
    });

    // 2. Active Borrows (Borrower ne kitne items abhi rent pe le rakhe hain)
    const activeBorrows = await Item.countDocuments({
      borrowedBy: userId,
      status: { $in: ["borrowed", "reserved"] }
    });

    res.json({
      success: true,
      pendingHandovers,
      activeBorrows
    });
  } catch (error) {
    console.error("Navbar Counts Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};