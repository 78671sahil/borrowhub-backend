import Borrow from "../models/borrow.model.js";
import Item from "../models/item.model.js";


 

// 🔥 VERIFY PICKUP OTP


export const createBorrow = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      itemId,
      startDate,
      endDate,
    } = req.body;

    // 🔎 Item fetch
    const item = await Item.findById(itemId).populate("owner");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.status !== "available") {
      return res.status(400).json({ message: "Item not available" });
    }

    // 🧮 Calculate rent
    const days =
      Math.ceil(
        (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
      ) || 1;

    const totalRent = days * item.pricePerDay;

    // 🧾 Create borrow record
    const borrow = await Borrow.create({
      item: item._id,
      owner: item.owner._id,
      borrower: userId,
      startDate,
      endDate,
      rentPerDay: item.pricePerDay,
      totalRent,
      deposit: item.deposit,
      status: "active",
    });

    // 🔒 Update item
    item.status = "borrowed";
    item.borrowedBy = userId;
    await item.save();

    res.status(201).json({
      success: true,
      borrow,
    });
  } catch (err) {
    console.error("createBorrow error:", err);
    res.status(500).json({ message: "Server error" });
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




 export const verifyPickup = async (req, res) => {
  try {
    const { itemId, otp } = req.body;
    const userId = req.user._id; // Lender (Owner)

    // 1. Find Borrow Request (Jo 'reserved' hai)
    const borrow = await Borrow.findOne({
      item: itemId,
      owner: userId,
      status: "reserved",
    });

    if (!borrow) {
      return res.status(404).json({ success: false, message: "No pending pickup found." });
    }

    // 2. Check OTP
    if (borrow.pickupOtp !== otp) {
      return res.status(400).json({ success: false, message: "❌ Wrong OTP!" });
    }

    // 3. ✅ Update BORROW Status
    borrow.status = "active";
    await borrow.save();

    // 4. ✅ Update ITEM Status (Reserved -> Borrowed)
    // 🔥 Ye line sabse zaruri hai taki "Lent Out" me dikhe ki item chala gaya
    await Item.findByIdAndUpdate(itemId, { status: "borrowed" });

    res.json({ success: true, message: "Handover Successful! 🚀" });

  } catch (err) {
    console.error("Verify Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



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