 export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 🔥 FIX: Ye export missing tha isliye SyntaxError aa raha tha
 export const sendSMS = async (phone, otp) => {
  // Yahan tera WhatsApp Bot ka logic hoga (Venom ya WhatsApp-web.js)
  // Agar bot ready nahi hai, toh ye function error throw karega
  console.log(`Attempting to send WhatsApp OTP to ${phone}: ${otp}`);
  
  // Example condition: agar bot ready nahi hai toh error throw karo
  // throw new Error("Bot not ready"); 
};