import express from "express";
import Order from "../Models/Orders.js";

const router = express.Router();

// ✅ Place new order
router.post("/", async (req, res) => {
  try {
    const { userId, items, totalAmount, paymentMethod,paymentStatus } = req.body;

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get all orders for a user
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted permanently" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
