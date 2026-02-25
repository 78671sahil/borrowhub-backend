import Borrow from "../models/borrow.model.js";
import Withdrawal from "../models/Withdrawal.js";

// 💰 1. Get Wallet Balance & History
//  export const getWalletData = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // 🔥 DHAMAKA: Ab hum 'active' status ko bhi kamayi mein ginenge
//     // Jaise hi OTP match hua, status 'active' ho jata hai, aur paisa wallet mein show hoga!
//     const myEarnings = await Borrow.find({
//       owner: userId, 
//       status: { $in: ["active", "completed", "stolen"] } // 'active' = OTP Match ho chuka hai
//     });

//     let totalEarned = 0;

//     myEarnings.forEach((b) => {
//       // Logic: Agar totalPrice hai (penalty ke saath) toh wo lo, 
//       // warna pricePerDay (jo booking ke waqt fix hua tha).
//       let amount = b.totalPrice || (b.pricePerDay || 0);
      
//       // 5% Platform Fees kaat ke Lender ka hissa
//       const commission = Math.round(amount * 0.05); 
//       totalEarned += (amount - commission);
//     });

//     // 2. Withdrawals ka calculation (Pehle jaisa hi)
//     const withdrawals = await Withdrawal.find({ user: userId });
    
//     let totalWithdrawn = 0;
//     let pendingWithdrawal = 0;

//     withdrawals.forEach((w) => {
//       if (w.status === "completed") {
//         totalWithdrawn += w.amount;
//       } else if (w.status === "pending") {
//         pendingWithdrawal += w.amount;
//       }
//     });

//     // 3. Final Current Balance
//     const currentBalance = totalEarned - totalWithdrawn - pendingWithdrawal;

//     res.json({
//       success: true,
//       totalEarned,
//       totalWithdrawn,
//       pendingWithdrawal,
//       currentBalance,
//       history: withdrawals
//     });

//   } catch (err) {
//     console.error("Wallet Fetch Error:", err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

 
 

 export const getWalletData = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. 💰 LIFETIME EARNINGS (Total Earned)
    // Jitne bhi item 'active', 'completed' ya 'stolen' hain, unka total rent
    // 🔥 FIX: "returned" status ko bhi add kiya, ab paise gayab nahi honge!
    const myEarnings = await Borrow.find({
      owner: userId, 
      status: { $in: ["active", "completed", "returned", "stolen"] } 
    }).populate("item", "title");

    let lifetimeEarnings = 0;
    let transactionHistory = [];

    myEarnings.forEach((b) => {
      // Amount calculation: totalPrice (penalty ke saath) ya base pricePerDay
      let amount = b.totalPrice || (b.pricePerDay || 0);
      const commission = Math.round(amount * 0.05); // 5% Platform Fees
      const finalAmount = amount - commission;
      
      // 🔥 LIFE-TIME SAVING: Yeh kabhi kam nahi hogi
      lifetimeEarnings += finalAmount;

      transactionHistory.push({
        _id: b._id,
        type: "earning",
        title: `Rent: ${b.item?.title || "Item"}`,
        amount: finalAmount,
        status: "completed",
        createdAt: b.updatedAt
      });
    });

    // 2. 💸 WITHDRAWALS CHECK
    // 2. 💸 WITHDRAWALS CHECK
    const withdrawals = await Withdrawal.find({ user: userId }).sort({ createdAt: -1 });
    
    let totalWithdrawn = 0;
    let pendingAmount = 0;

    withdrawals.forEach((w) => {
      if (w.status === "completed") {
        totalWithdrawn += w.amount; 
      } else if (w.status === "pending") {
        pendingAmount += w.amount; 
      }
      
      transactionHistory.push({
        _id: w._id,
        type: "withdrawal",
        title: "Withdrawal", 
        upiId: w.upiId, // 🔥 ASLI FIX: Frontend isko dhoondh raha hai!
        amount: w.amount,
        status: w.status,
        createdAt: w.createdAt
      });
    });

    // 3. 🎯 FINAL LOGIC
    // Total Earned = Hamesha lifetime savings dikhayega (Sahil ka logic ✅)
    // Available Balance = Lifetime Earnings - (Nikal liya + Line mein hai)
    const availableBalance = lifetimeEarnings - totalWithdrawn - pendingAmount;

    res.json({
      success: true,
      totalEarned: lifetimeEarnings, // Lifetime Savings (Badhti rahegi)
      availableBalance: availableBalance, // Jo abhi user nikal sakta hai
      pendingWithdrawal: pendingAmount, // Jo pending hai
      withdrawals: transactionHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });

  } catch (err) {
    console.error("Wallet Logic Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 💸 2. Request Payout (User ne UPI daal kar Withdraw dabaya)
export const requestWithdrawal = async (req, res) => {
  try {
    const { amount, upiId } = req.body;
    const userId = req.user._id;

    if (!amount || !upiId) {
      return res.status(400).json({ success: false, message: "UPI ID and Amount are required!" });
    }

    // Nayi Request banao
    const withdrawal = await Withdrawal.create({
      user: userId,
      amount: amount,
      upiId: upiId,
      status: "pending"
    });

    res.json({ success: true, message: "Withdrawal request sent to Admin!", withdrawal });
  } catch (err) {
    console.error("Withdraw Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};