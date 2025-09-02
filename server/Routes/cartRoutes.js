import express from "express";
import Cart from "../Models/Cart.js"; // path to your schema

const router = express.Router();

/**
 * 1. Get user's cart
 */
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.json({ message: "Cart is empty", items: [] });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 2. Add item to cart
 */
router.post("/:userId", async (req, res) => {
  try {
    const { productId, title, description, price, quantity, image } = req.body;

    let cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      cart = new Cart({
        userId: req.params.userId,
        items: [{
          productId: productId.toString(),
          title,
          description,
          price,
          quantity: Number(quantity),
          image,
        }],
        totalAmount: price * Number(quantity),
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId.toString()
      );

      if (existingItem) {
        existingItem.quantity = Number(existingItem.quantity) + Number(quantity);
      } else {
        cart.items.push({
          productId: productId.toString(),
          title,
          description,
          price,
          quantity: Number(quantity),
          image,
        });
      }

      cart.totalAmount = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * 3. Update quantity
 */
router.put("/:userId/:productId", async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((item) => item.productId === req.params.productId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 4. Remove item from cart
 */
router.delete("/:userId/:productId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId !== req.params.productId);

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 5. Clear cart
 */
router.delete("/:userId", async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
