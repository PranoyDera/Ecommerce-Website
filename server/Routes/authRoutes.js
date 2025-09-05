import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import Cart from "../Models/Cart.js";
import Order from "../Models/Orders.js";
import { sendEmail } from "../utils/sendEmails.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // Send OTP email
    await sendEmail(
      email,
      "Verify your account",
      `Welcome ${name}, your verification code is ${otp}`
    );

    res.status(201).json({
      message: "User registered. Please verify your email using the OTP sent.",
      userId: newUser._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (!user.otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired. Please register again." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Email verified successfully. You can now log in." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Resend OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min expiry
    await user.save();

    // Send OTP email
    await sendEmail(
      email,
      "Resend Verification Code",
      `Hi ${user.name}, your new verification code is ${otp}`
    );

    res.json({ message: "A new OTP has been sent to your email." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Prevent unverified users
    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { id: user._id, username: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//get logged in
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); 
    // remove password from response

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Profile
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, DateOfBirth, gender, username, image } = req.body;

    // Find user by ID (from token)
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields only if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
     if (DateOfBirth) user.DateOfBirth = new Date(DateOfBirth);
    if (gender) user.gender = gender;
    if (username) user.username = username;
    if (image) user.image = image; // base64 string or image URL

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        DateOfBirth: user.DateOfBirth,
        gender: user.gender,
        username: user.username,
        image: user.image,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Password
router.put("/update-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/verify", authMiddleware, (req, res) => {
  res.json({ message: "Token is valid", user: req.user });
});

export default router;

router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete user
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete user's cart items
    await Cart.deleteMany({ userId });

    // Delete user's orders
    await Order.deleteMany({ userId });

    res.json({ 
      message: "User account and related data deleted successfully",
      deletedUser: user.email
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});