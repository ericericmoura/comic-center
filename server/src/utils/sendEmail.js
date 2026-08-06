import { transporter } from "../config/emailTransporter.js";
import nodemailer from "nodemailer"

export const sendEmail = async (sender, recipients, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from:    sender,
      to:      recipients,
      subject: subject,
      text:    text,
      html:    html,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }        
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

export const sendEmailConfirmation = async (recipient, link) => {
    const payload = { email: user.email };
    const token = generateToken(payload, "15m");
    
    const link = `${process.env.SERVER_URL}/authentication/confirm-email/${token}`;

    await sendEmail(
      process.env.SECURITY_EMAIL,
      recipient,
      "E-mail Confirmation",
      `confirm your e-mail by clicking on this link: ${link}`,
      `<p>confirm your e-mail by clicking on this link: ${link}</p>`,
    );
}

export const sendPasswordRecoveryEmail = async () => {
    return await sendEmail(
      process.env.SECURITY_EMAIL,
      email,
      "Password recovery",
      "not implemented.",
      "<p>not implemented.</p>",
    );
}