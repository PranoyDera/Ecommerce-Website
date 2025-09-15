import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, text) => {
  try {
    await resend.emails.send({
      from: "Procart <onboarding@resend.dev>",
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Email not sent");
  }
};
