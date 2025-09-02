// controllers/addressController.js
import User from "../Models/User.js";

export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const { address, city, state, zipCode, country } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses.push({ address, city, state, zipCode, country });
    await user.save();

    res.status(200).json({
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
