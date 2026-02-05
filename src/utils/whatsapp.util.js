 

//  import qrcode from "qrcode-terminal";
// import pkg from "whatsapp-web.js";
// const { Client, LocalAuth } = pkg;

// let isReady = false;
// let isInitializing = false;

// // 1. WhatsApp Client Setup
// const client = new Client({
//     authStrategy: new LocalAuth({ dataPath: './session-data' }), // OneDrive se bahar data save karne ke liye
//     puppeteer: {
//         headless: true,
//         args: [
//             "--no-sandbox",
//             "--disable-setuid-sandbox",
//             "--disable-dev-shm-usage",
//             "--disable-gpu"
//         ]
//     },
// });

// // 🛠️ Core Bot Initialize Function
// const startBot = async () => {
//     if (isInitializing || isReady) return;
//     isInitializing = true;
//     console.log("🛠️ [SYSTEM] Initializing WhatsApp Client...");
//     try {
//         await client.initialize();
//     } catch (err) {
//         isInitializing = false;
//         console.error("❌ [SYSTEM] Initialization Failed:", err.message);
//     }
// };

// // 🟢 Status Handlers
// client.on("qr", (qr) => {
//     isReady = false;
//     isInitializing = false;
//     console.log("\n📢 [STATUS] Scan this QR Code to connect:");
//     qrcode.generate(qr, { small: true });
// });

// client.on("ready", () => {
//     isReady = true;
//     isInitializing = false;
//     console.log("\n✅ [STATUS] WHATSAPP LIVE: BorrowHub is ready!");
// });

// // 🔄 Auto-Reconnect on Disconnect
// client.on("disconnected", async (reason) => {
//     isReady = false;
//     console.log("❌ [ERROR] Connection lost:", reason, "Restarting...");
//     startBot();
// });

// // 🐕 THE WATCHDOG: Har 60 second mein check karega bot zinda hai ya nahi
// setInterval(() => {
//     if (!isReady && !isInitializing) {
//         console.log("🐕 [WATCHDOG] Bot offline detected. Triggering Auto-Repair...");
//         startBot();
//     }
// }, 60000);

// // Pehli baar bot start karein
// startBot();

// // 🚀 SMART SEND FUNCTION: (Retry + Delay + LID Fix)
// export const sendWhatsAppOTP = async (phone, otp, attempt = 1) => {
//     const MAX_ATTEMPTS = 5;

//     // A. Agar bot ready nahi hai to wait karo
//     if (!isReady) {
//         if (attempt <= MAX_ATTEMPTS) {
//             console.log(`⚠️ [RETRY] Bot not ready. Attempt ${attempt}/${MAX_ATTEMPTS}. Waiting 2s...`);
//             await new Promise(res => setTimeout(res, 2000));
//             return sendWhatsAppOTP(phone, otp, attempt + 1);
//         } else {
//             console.error("❌ [FAIL] Bot took too long to respond.");
//             return false;
//         }
//     }

//     try {
//         // B. Number Formatting
//         let formattedPhone = phone.replace(/\D/g, "");
//         if (formattedPhone.length === 10) formattedPhone = "91" + formattedPhone;

//         // C. 🛡️ NO LID FIX: Number ko WhatsApp server par check karna
//         const numberId = await client.getNumberId(formattedPhone);
//         if (!numberId) {
//             console.error(`❌ [ERROR] Number ${formattedPhone} is NOT on WhatsApp.`);
//             return false;
//         }

//         const chatId = numberId._serialized;

//         // D. ⏳ Anti-Spam Delay: 2 second ka gap message bhejne se pehle
//         await new Promise(res => setTimeout(res, 2000));

//         const message = `🚀 *BorrowHub Verification*\n\nYour OTP is: *${otp}*\n\n_Valid for 10 minutes. Do not share._`;

//         await client.sendMessage(chatId, message);
//         console.log(`✅ [SUCCESS] OTP sent to ${formattedPhone}`);
//         return true;

//     } catch (error) {
//         console.error("❌ [SEND ERROR]:", error.message);
//         // Agar frame detach ho jaye (Rare now after OneDrive fix)
//         if (error.message.includes("detached")) {
//             isReady = false;
//             startBot();
//         }
//         return false;
//     }
// };

// // Admin Functions
// export const getBotStatus = () => isReady;
// export const restartBot = async () => {
//     isReady = false;
//     try {
//         await client.destroy();
//         startBot();
//         return { success: true };
//     } catch (err) { return { success: false, error: err.message }; }
// };
 

import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

let isReady = false;

// 1. Client Configuration (Docker Optimized)
const client = new Client({
    // LocalAuth: Ye session save karega taaki baar-baar scan na karna pade
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: "new",
        // Ye line Docker aur Local dono jagah chalegi 👇
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome-stable",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage", // RAM bachane ke liye (Server crash se bachata hai)
            "--disable-gpu",
            "--no-first-run",
            "--no-zygote",
            "--single-process",
        ],
    },
});

// 2. QR Code Handler
client.on("qr", (qr) => {
    // Agar QR aaye matlab disconnect ho gaya, status false kar do
    isReady = false;
    console.log("\n⚠️ [ACTION REQUIRED] SCAN THIS QR CODE NOW:");
    qrcode.generate(qr, { small: true });
});

// 3. Ready Handler
client.on("ready", () => {
    isReady = true;
    console.log("\n✅ [STATUS] WhatsApp Connected! System is Live.");
});

// 4. Authenticated Handler (Jab session restore hota hai)
client.on("authenticated", () => {
    console.log("🔐 [AUTH] Session restored successfully!");
});

// 5. Auth Failure Handler (Agar session expire ho jaye)
client.on("auth_failure", (msg) => {
    console.error("❌ [AUTH ERROR] Authentication failed:", msg);
    isReady = false;
});

// 6. Disconnect Handler (Auto-Reconnect Logic - Safe Mode)
client.on("disconnected", (reason) => {
    isReady = false;
    console.log("❌ [WARN] Client Disconnected:", reason);
    console.log("🔄 Reconnecting in 5 seconds...");
    // 5 second ruk kar wapas start karo (Loop se bachne ke liye)
    setTimeout(() => {
        client.initialize().catch(err => console.log("Restart Error:", err.message));
    }, 5000);
});

// Bot Start
console.log("🛠️ [SYSTEM] Initializing WhatsApp Bot...");
client.initialize();


// 🚀 SMART OTP FUNCTION (Best for Future)
export const sendWhatsAppOTP = async (phone, otp) => {
    // A. Check: Kya Bot Ready hai?
    if (!isReady) {
        console.log("⚠️ [SKIP] Bot not ready. Cannot send OTP.");
        return false;
    }

    try {
        // B. Number Format (India Specific)
        let formattedPhone = phone.replace(/\D/g, ""); // Sirf numbers rakho
        if (formattedPhone.length === 10) formattedPhone = "91" + formattedPhone;

        // C. Check: Kya number WhatsApp par exist karta hai?
        // (Ye error se bachata hai agar user galat number daal de)
        const numberId = await client.getNumberId(formattedPhone);
        
        if (!numberId) {
            console.log(`❌ [INVALID] Number ${formattedPhone} is not on WhatsApp.`);
            return false;
        }

        // D. Anti-Ban Delay (2 Seconds)
        // (Ye bohot zaroori hai taaki WhatsApp tumhein spammer na samjhe)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // E. Send Message
        const message = `🔐 *BorrowHub Verification*\n\nYour OTP is: *${otp}*\n\nValid for 10 minutes. Do not share.`;
        
        await client.sendMessage(numberId._serialized, message);
        console.log(`✅ [SENT] OTP sent to ${formattedPhone}`);
        return true;

    } catch (error) {
        console.error("❌ [SEND FAIL] Error:", error.message);
        return false;
    }
};