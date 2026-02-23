 export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 🔥 FIX: Ye export missing tha isliye SyntaxError aa raha tha
export const sendSMS = async (phone, otp) => {
  console.log(`[OTP LOG] Phone: ${phone}, OTP: ${otp}`);
  // Future mein yahan WhatsApp ya Fast2SMS ka logic daal sakte ho
};