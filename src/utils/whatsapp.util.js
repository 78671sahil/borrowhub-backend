// import qrcode from "qrcode-terminal";
// import pkg from "whatsapp-web.js";
// const { Client, LocalAuth } = pkg;

// const client = new Client({
//     authStrategy: new LocalAuth(),
//     puppeteer: {
//         args: ["--no-sandbox"],
//     },
// });

// client.on("qr", (qr) => {
//     console.log("\n⚠️ SCAN THIS QR CODE WITH WHATSAPP (Linked Devices):");
//     qrcode.generate(qr, { small: true });
// });

// client.on("ready", () => {
//     console.log("✅ WhatsApp Client is Ready! OTPs will now be sent.");
// });

// client.initialize();

// export const sendWhatsAppOTP = async (phone, otp) => {
//     try {
//         let formattedPhone = phone.replace(/\D/g, ""); 
//         if (formattedPhone.length === 10) formattedPhone = "91" + formattedPhone; 
        
//         const chatId = `${formattedPhone}@c.us`;
//         const message = `🔐 *BorrowHub Verification*\n\nYour OTP is: *${otp}*\n\nValid for 10 minutes. Do not share this with anyone.`;

//         await client.sendMessage(chatId, message);
//         return true;
//     } catch (error) {
//         console.error("WhatsApp Send Error:", error);
//         return false;
//     }
// };

 import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

let isReady = false;
let isInitializing = false;

// 1. WhatsApp Client Setup
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './session-data' }), // OneDrive se bahar data save karne ke liye
    puppeteer: {
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu"
        ]
    },
});

// 🛠️ Core Bot Initialize Function
const startBot = async () => {
    if (isInitializing || isReady) return;
    isInitializing = true;
    console.log("🛠️ [SYSTEM] Initializing WhatsApp Client...");
    try {
        await client.initialize();
    } catch (err) {
        isInitializing = false;
        console.error("❌ [SYSTEM] Initialization Failed:", err.message);
    }
};

// 🟢 Status Handlers
client.on("qr", (qr) => {
    isReady = false;
    isInitializing = false;
    console.log("\n📢 [STATUS] Scan this QR Code to connect:");
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    isReady = true;
    isInitializing = false;
    console.log("\n✅ [STATUS] WHATSAPP LIVE: BorrowHub is ready!");
});

// 🔄 Auto-Reconnect on Disconnect
client.on("disconnected", async (reason) => {
    isReady = false;
    console.log("❌ [ERROR] Connection lost:", reason, "Restarting...");
    startBot();
});

// 🐕 THE WATCHDOG: Har 60 second mein check karega bot zinda hai ya nahi
setInterval(() => {
    if (!isReady && !isInitializing) {
        console.log("🐕 [WATCHDOG] Bot offline detected. Triggering Auto-Repair...");
        startBot();
    }
}, 60000);

// Pehli baar bot start karein
startBot();

// 🚀 SMART SEND FUNCTION: (Retry + Delay + LID Fix)
export const sendWhatsAppOTP = async (phone, otp, attempt = 1) => {
    const MAX_ATTEMPTS = 5;

    // A. Agar bot ready nahi hai to wait karo
    if (!isReady) {
        if (attempt <= MAX_ATTEMPTS) {
            console.log(`⚠️ [RETRY] Bot not ready. Attempt ${attempt}/${MAX_ATTEMPTS}. Waiting 2s...`);
            await new Promise(res => setTimeout(res, 2000));
            return sendWhatsAppOTP(phone, otp, attempt + 1);
        } else {
            console.error("❌ [FAIL] Bot took too long to respond.");
            return false;
        }
    }

    try {
        // B. Number Formatting
        let formattedPhone = phone.replace(/\D/g, "");
        if (formattedPhone.length === 10) formattedPhone = "91" + formattedPhone;

        // C. 🛡️ NO LID FIX: Number ko WhatsApp server par check karna
        const numberId = await client.getNumberId(formattedPhone);
        if (!numberId) {
            console.error(`❌ [ERROR] Number ${formattedPhone} is NOT on WhatsApp.`);
            return false;
        }

        const chatId = numberId._serialized;

        // D. ⏳ Anti-Spam Delay: 2 second ka gap message bhejne se pehle
        await new Promise(res => setTimeout(res, 2000));

        const message = `🚀 *BorrowHub Verification*\n\nYour OTP is: *${otp}*\n\n_Valid for 10 minutes. Do not share._`;

        await client.sendMessage(chatId, message);
        console.log(`✅ [SUCCESS] OTP sent to ${formattedPhone}`);
        return true;

    } catch (error) {
        console.error("❌ [SEND ERROR]:", error.message);
        // Agar frame detach ho jaye (Rare now after OneDrive fix)
        if (error.message.includes("detached")) {
            isReady = false;
            startBot();
        }
        return false;
    }
};

// Admin Functions
export const getBotStatus = () => isReady;
export const restartBot = async () => {
    isReady = false;
    try {
        await client.destroy();
        startBot();
        return { success: true };
    } catch (err) { return { success: false, error: err.message }; }
};
 