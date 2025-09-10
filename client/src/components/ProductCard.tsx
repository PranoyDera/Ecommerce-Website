"use client";

import React, { useEffect, useState } from "react";
import { cartItemType, ProductType } from "@/type";
import Link from "next/link";
import Image from "next/image";
import { Plus, ShoppingCart, Star } from "lucide-react";
import useCartStore from "../app/Stores/cartStore";
import { useRouter } from "next/navigation";
import BuyNowModal from "./BuynowModal";
import { useCart } from "@/app/context/cartContext";
import {toast} from "sonner";
import { openRazorpayCheckout } from "@/app/utils/paymentUtils";

function ProductCard({ product }: { product: ProductType }) {
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const { addToCart,addBuyNow } = useCart();
//  const { addToCart } = useCartStore();
  const router = useRouter();

  // Load addresses from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("addresses");
    if (stored) setAddresses(JSON.parse(stored));
  }, []);

  const handleAddToCart = async () => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Please login first!");
      return;
    }

    await addToCart(userId, {
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity,
      image: product.images[0],
      discountPercentage: product.discountPercentage,
    });

    toast.success(`${quantity} item(s) added to cart`);
  } catch (error) {
    console.error("Add to cart failed:", error);
    toast.error("Failed to add to cart");
  }
};

  const discountPrice = (
    product.price -
    ((product.price * product.discountPercentage) / 100) + 10
  ).toFixed(2);
  const handleBuyNow = () => {
    setShowModal(true);
  };

  const handleConfirmOrder = (address: any, paymentMethod: string) => {
  if (!address) {
    toast.error("Please select an address");
    return;
  }
  if (!paymentMethod) {
    toast.error("Please select a payment method");
    return;
  }

  const orderData = {
    productId: product.id,
    title: product.title,
    price: Number(discountPrice), // ✅ use discounted price if available
    quantity,
    image: product.images[0],
    address,
    paymentMethod,
  };

  // ✅ store in context (Buy Now item)
  addBuyNow(orderData);

  // (optional) still keep localStorage for fallback
  localStorage.setItem("order", JSON.stringify(orderData));
  localStorage.setItem("checkoutMode", "buyNow");
  localStorage.setItem("subtotal", JSON.stringify((Number(discountPrice) * quantity).toFixed(2)));
  localStorage.setItem("total", JSON.stringify((Number(discountPrice) * quantity).toFixed(2)));
  localStorage.setItem("selectedAddress", JSON.stringify(address));
  localStorage.setItem("selectedPaymentMethod", JSON.stringify(paymentMethod));

  if (paymentMethod === "Cash on Delivery") {
    localStorage.setItem("paymentStatus", "Pending");
    router.push("/order/confirmation");
  } else {
    localStorage.setItem("selectedPaymentMethod", "Online");
    localStorage.setItem("paymentStatus", "Pending");
    router.push("/order/confirmation");
  }
};


  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  

  return (
    <>
      <div className="rounded-3xl overflow-hidden shadow-md bg-white flex flex-col transition-transform transform hover:scale-105 hover:shadow-xl p-4 ">
        {/* IMAGE */}
        <Link href={`/products/${product.id}`}>
          <div className="relative w-full h-60">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-contain p-4"
            />
          </div>
        </Link>

        {/* INFO SECTION */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          {/* Title + Price */}
          <div className="flex justify-between items-start gap-4">
            <h2 className="font-semibold text-base overflow-hidden whitespace-nowrap text-ellipsis">
              {product.title}
            </h2>
            <p className="font-semibold text-base">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-500 line-clamp-2">
            {product.description}
          </p>

          {/* Rating + Discount */}
          <div className="flex justify-between items-center text-xs mt-2">
            <span className="flex items-center gap-1 text-yellow-500">
              <Star size={14} /> {product.rating?.toFixed(1) ?? "N/A"}
            </span>
            {product.discountPercentage && (
              <span className="text-green-600 font-medium">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Quantity Adjuster */}
          <div className="flex items-center justify-center w-full gap-3 mt-3">
            <button
              onClick={decreaseQuantity}
              className="px-3 py-1 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300"
            >
              -
            </button>
            <span className="min-w-[30px] text-center font-semibold">
              {quantity}
            </span>
            <button
              onClick={increaseQuantity}
              className="px-3 py-1 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300"
            >
              +
            </button>
          </div>

          {/* Buttons */}
          <button
            onClick={()=>handleAddToCart()}
            className="mt-4 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition cursor-pointer"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="mt-2 bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition cursor-pointer"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
         <BuyNowModal
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmOrder}
        />
      )}
    </>
  );
}

export default ProductCard;
