import SibApiV3Sdk from "@sendinblue/client";

const brevo = new SibApiV3Sdk.TransactionalEmailsApi();
brevo.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendEmail = async (to, subject, text) => {
  try {
    await brevo.sendTransacEmail({
      sender: { name: "Procart", email: "pranoystrange@gmail.com" }, // 👈 verified Gmail
      to: [{ email: to }],
      subject,
      textContent: text,
    });
    console.log("✅ Email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Email not sent");
  }
};
