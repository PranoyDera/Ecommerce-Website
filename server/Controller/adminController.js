import Admin from "../Models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import Order from "../Models/Orders.js";

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, gender, image, DateOfBirth } =
      req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists with this email",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      phone,
      gender,
      image,
      DateOfBirth,
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Register Admin Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        gender: admin.gender,
        imageUrl: admin.image,
      },
    });
  } catch (error) {
    console.error("Login Admin Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin._id; // coming from JWT middleware
    const {
      name,
      email,
      phone,
      gender,
      image,
      DateOfBirth,
      currentPassword,
      newPassword,
    } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    /* 🔐 If changing password, validate old password */
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required",
        });
      }

      const isMatch = await bcrypt.compare(
        currentPassword,
        admin.password
      );

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(newPassword, salt);
    }

    /* 📧 If email is changing, ensure uniqueness */
    if (email && email !== admin.email) {
      const emailExists = await Admin.findOne({ email });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already in use",
        });
      }
      admin.email = email;
    }

    /* 🧾 Update fields only if provided */
    if (name) admin.name = name;
    if (phone) admin.phone = phone;
    if (gender) admin.gender = gender;
    if (image) admin.image = image;
    if (DateOfBirth) admin.DateOfBirth = DateOfBirth;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        gender: admin.gender,
        image: admin.image,
        DateOfBirth: admin.DateOfBirth,
      },
    });
  } catch (error) {
    console.error("Update Admin Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "orders",
        },
      },
      {
        $addFields: {
          totalOrders: { $size: "$orders" },
          totalOrderAmount: {
            $sum: "$orders.totalAmount",
          },
        },
      },
      {
        $project: {
          password: 0,
          otp: 0,
          otpExpiry: 0,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    console.error("Fetch users with orders error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const bulkDeleteUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "userIds must be a non-empty array",
      });
    }

    const result = await User.deleteMany({
      _id: { $in: userIds },
    });

    res.status(200).json({
      success: true,
      message: "Users deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Bulk delete users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          paymentStatus: { $first: "$paymentStatus" },
          paymentMethod: { $first: "$paymentMethod" },
          totalAmount: { $first: "$totalAmount" },
          createdAt: { $first: "$createdAt" },
          items: { $push: "$items" },
          totalProductsInOrder: { $sum: "$items.quantity" },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    const totalOrders = orders.length;

    const totalRevenue = Number(
      orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toFixed(2)
    );

    const totalProductsPurchased = orders.reduce(
      (sum, o) => sum + (o.totalProductsInOrder || 0),
      0
    );

    await Order.populate(orders, {
      path: "userId",
      select: "name email phone",
    });

    res.status(200).json({
      success: true,
      totalOrders,
      totalRevenue,
      totalProductsPurchased,
      orders,
    });
  } catch (error) {
    console.error("Fetch all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getTopPurchasedProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      {
        $match: {
          paymentStatus: { $in: ["Paid", "shipped", "delivered"] },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
          title: { $first: "$items.title" },
          price: { $first: "$items.price" },
          image: { $first: "$items.image" },
        },
      },
      {
        $sort: { totalSold: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    res.status(200).json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    console.error("Top Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top products",
    });
  }
};
