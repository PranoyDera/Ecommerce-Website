import axios from "axios";

export const sendEmail = async (to, subject, text) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Procart",
          email: "pranoystrange@gmail.com", // must be verified
        },
        to: [{ email: to }],
        subject,
        textContent: text,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
          accept: "application/json",
        },
      }
    );

    console.log("✅ Email sent:", response.data);
  } catch (error) {
    console.error(
      " Brevo Error:",
      error.response?.data || error.message
    );
    throw new Error("Email not sent");
  }
};
