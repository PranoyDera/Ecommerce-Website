import express from "express";
import razorpayInstance from "../config/razorpay.js";


const router = express.Router();

// Create Order API
// Create Order API
router.post("/create-order", async (req, res) => {
  try {
    let { amount } = req.body; // amount in INR

    // Ensure amount is a number
    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100), // ✅ round to nearest integer
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
});


// Verify Payment API
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_payment_id } = req.body;

    if (!razorpay_payment_id) {
      return res.status(400).json({ success: false, message: "Payment ID is required" });
    }

    // Fetch payment details from Razorpay
    const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);

    if (payment.status === "captured") {
      return res.status(200).json({ success: true, message: "Payment verified successfully", payment });
    } else {
      return res.status(400).json({ success: false, message: "Payment not captured", payment });
    }
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({ success: false, message: "Payment verification failed", error });
  }
});

export default router;
