const nodemailer = require("nodemailer");

// Brevo API Configuration
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

/**
 * Sends an email using Brevo's REST API.
 */
const sendBrevoEmail = async (to, subject, htmlContent) => {
    try {
        const response = await fetch(BREVO_API_URL, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: { name: "InstaVibe Security", email: "personalproject92@gmail.com" },
                to: [{ email: to }],
                subject: subject,
                htmlContent: htmlContent
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("[Vault] BREVO API Error:", errorText);
            return false;
        }

        console.log(`[Vault] Email successfully sent to ${to} via Brevo`);
        return true;
    } catch (err) {
        console.error("[Vault] CRITICAL TRANSMISSION FAILURE:", err);
        return false;
    }
};

/**
 * sendRegistrationOtp
 * @param {string} to - Recipient email
 * @param {string} otp - The 6-digit OTP code
 */
const sendRegistrationOtp = async (to, otp) => {
    const html = `
    <div style="font-family: 'Outfit', sans-serif; background: #020617; color: white; padding: 40px; border-radius: 20px; text-align: center; border: 1px solid rgba(168, 85, 247, 0.2);">
      <h1 style="color: #a855f7; letter-spacing: -1px; margin: 0;">InstaVibe Security</h1>
      <p style="color: #94a3b8; font-size: 16px;">Verify your identity to create a Digital Vault.</p>
      
      <div style="background: rgba(255,255,255,0.05); padding: 30px; border-radius: 24px; margin: 40px 0; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #a855f7; margin-bottom: 15px; font-weight: 800;">Your Verification Code</p>
        <h2 style="font-size: 42px; letter-spacing: 12px; color: #10b981; margin: 0; font-family: monospace;">${otp}</h2>
      </div>
      
      <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">This code will expire in 5 minutes. If you didn't request this, please ignore this email.</p>
      
      <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.05); margin: 40px 0;">
      <p style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 2px; font-weight: 800;">Private. Sophisticated. Yours.</p>
    </div>
    `;
    return sendBrevoEmail(to, "Your InstaVibe Verification Code", html);
};

/**
 * sendResetEmail
 * @param {string} to - Recipient email
 * @param {string} token - The vault reset code
 */
const sendResetEmail = async (to, token) => {
    const html = `
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
    `;
    return sendBrevoEmail(to, "Vault Access Request - InstaVibe", html);
};

module.exports = { sendRegistrationOtp, sendResetEmail };
