const nodemailer = require("nodemailer");

// Initialize transporter at the top level with explicit SMTP settings
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify connection configuration on startup
transporter.verify(function (error, success) {
    if (error) {
        console.error("--------------------------------------------------");
        console.error("CRITICAL: GMAIL SMTP CONNECTION FAILED");
        console.error(error);
        console.error("--------------------------------------------------");
    } else {
        console.log("--------------------------------------------------");
        console.log("VAULT EMAIL SERVICE: Secure Link Established.");
        console.log(`GATEWAY: ${process.env.EMAIL_USER}`);
        console.log("--------------------------------------------------");
    }
});

/**
 * sendResetEmail
 * @param {string} to - Recipient email
 * @param {string} token - The vault reset code
 */
const sendResetEmail = async (to, token) => {
    try {
        const mailOptions = {
            from: `"InstaVibe Security" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: "Vault Access Request - InstaVibe",
            html: `
        <div style="font-family: 'Outfit', sans-serif; background: #020617; color: white; padding: 40px; border-radius: 20px; text-align: center; border: 1px solid rgba(168, 85, 247, 0.2);">
          <h1 style="color: #a855f7; letter-spacing: -1px; margin: 0;">InstaVibe Security</h1>
          <p style="color: #94a3b8; font-size: 16px;">We received a request to access your Digital Vault.</p>
          
          <div style="background: rgba(255,255,255,0.05); padding: 30px; border-radius: 24px; margin: 40px 0; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #a855f7; margin-bottom: 15px; font-weight: 800;">Your Secure Vault Code</p>
            <h2 style="font-size: 42px; letter-spacing: 12px; color: #10b981; margin: 0; font-family: monospace;">${token}</h2>
          </div>
          
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">If you didn't request this, please ignore this email. Your privacy is protected by end-to-end encryption.</p>
          
          <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.05); margin: 40px 0;">
          <p style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 2px; font-weight: 800;">Private. Sophisticated. Yours.</p>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (err) {
        console.error("[Vault] CRITICAL TRANSMISSION FAILURE:", err);
        return false;
    }
};

module.exports = { sendResetEmail };
