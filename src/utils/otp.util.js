 export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 🔥 Naya function SMS bhejne ke liye
export const sendSMS = async (phone, otp) => {
  try {
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        variables_values: otp,
        route: "otp",
        numbers: phone
      })
    });

    const data = await response.json();
    console.log("Fast2SMS Response:", data);
    return data.return; // Agar true aaya toh SMS chala gaya
  } catch (error) {
    console.error("SMS Error:", error);
    return false; // Agar error aayi toh false return karega taaki fallback chal sake
  }
};