import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true }, // use product id from your frontend data / API
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String }, // store product image url
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [cartItemSchema],
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
