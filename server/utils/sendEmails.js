import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or your email service (e.g., Outlook, Yahoo, SMTP config)
  auth: {
    user: "pranoydera@gmail.com",
    pass: "piay bbrq pvgl uhun",
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Procart App" <pranoydera@gmail.com>`,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email not sent");
  }
};
