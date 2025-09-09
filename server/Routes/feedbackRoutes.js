import express from "express";
import Feedback from "../Models/Feedback.js";

const router = express.Router();

// POST feedback
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, country, phone, email, inquiryType, message, offersOptIn } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ message: "First name, Last name, Email and Message are required" });
    }

    const feedback = new Feedback({
      firstName,
      lastName,
      country,
      phone,
      email,
      inquiryType,
      message,
      offersOptIn,
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    console.error("Feedback post error:", error);
    res.status(500).json({ message: "Server error while submitting feedback" });
  }
});

// (Optional) Get all feedbacks (Admin use)
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedbacks" });
  }
});

export default router;
