import express from "express";
import User from "../Models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Add new address
router.post("/address", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // 👈 comes from JWT payload
    const { address, city, state, zipCode, country, landmark } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses.push({ address, city, state, zipCode, country, landmark });
    await user.save();

    res.status(201).json({ message: "Address added successfully", addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Get all addresses
router.get("/address", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("addresses");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Update address by ID
router.put("/address/:addressId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const { address, city, state, zipCode, country, landmark } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const addr = user.addresses.id(addressId);
    if (!addr) return res.status(404).json({ message: "Address not found" });

    // Update fields if provided
    if (address) addr.address = address;
    if (city) addr.city = city;
    if (state) addr.state = state;
    if (zipCode) addr.zipCode = zipCode;
    if (country) addr.country = country;
    if (landmark) addr.landmark = landmark;

    await user.save();

    res.status(200).json({ message: "Address updated successfully", addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Delete address by ID
router.delete("/address/:addressId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    user.addresses.pull({ _id: addressId });
    await user.save();

    res.status(200).json({ message: "Address deleted successfully", addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/address/:addressId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const user = await User.findById(userId).select("addresses");
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    res.status(200).json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/address/:addressId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const { address, city, state, zipCode, country, landmark } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existingAddress = user.addresses.id(addressId);
    if (!existingAddress)
      return res.status(404).json({ message: "Address not found" });

    // Update fields
    existingAddress.address = address;
    existingAddress.city = city;
    existingAddress.state = state;
    existingAddress.zipCode = zipCode;
    existingAddress.country = country;
    existingAddress.landmark = landmark;

    await user.save();

    res.status(200).json({
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Delete address by ID
router.delete("/address/:addressId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if address exists
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Remove address
    user.addresses.pull({ _id: addressId });
    await user.save();

    res.status(200).json({
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
