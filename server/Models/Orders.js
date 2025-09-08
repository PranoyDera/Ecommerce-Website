import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: String }, // or ObjectId if you have a Products collection
        title: String,
        quantity: Number,
        price: Number,
        image: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "Paid", "shipped", "delivered"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      default: "cod",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
