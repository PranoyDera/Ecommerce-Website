import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String },
    phone: { type: String },
    email: { type: String, required: true },
    inquiryType: { type: String, enum: ["Purchase", "General", "Sell", "Order", "Others"], default: "General" },
    message: { type: String, required: true },
    offersOptIn: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
