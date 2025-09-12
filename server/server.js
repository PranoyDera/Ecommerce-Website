import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./Routes/authRoutes.js";
import blogRoutes from "./Routes/BlogRoute.js";
import addressRoutes from "./Routes/addressRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";
import cartRoutes from "./Routes/cartRoutes.js";
import paymentRoutes from "./Routes/paymentRoutes.js";
import searchRoutes from "./Routes/searchRoutes.js";
import feedbackRoutes from "./Routes/feedbackRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "https://pro-cart-zeta.vercel.app"||"http://localhost:3000",
    credentials: true, 
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/users", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/feedback",feedbackRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
