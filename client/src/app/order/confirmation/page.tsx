"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import SuccessModal from "../../../components/successModal";
import { useRouter } from "next/navigation";
import { useOrders } from "@/app/context/orderContext";
import { useCart } from "@/app/context/cartContext";
import Loader from "@/components/Loader2";
import { toast } from "sonner";
import { Button } from "@/components/ui/stateful-button";

interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export default function OrderConfirmation() {
  const router = useRouter();
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const [orderTotal, setOrderTotal] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(true);

  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<{
    address: string;
    city: string;
    country: string;
  } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { fetchOrders } = useOrders();
  const { cart, setCart, fetchCart } = useCart();

  const paymentStatus = localStorage.getItem("paymentStatus");

  // ✅ Local state for buyNow items
  const [buyNowItems, setBuyNowItems] = useState<CartItem[] | null>(null);

  // ✅ Load user info, address, payment
  useEffect(() => {
    if (typeof window === "undefined") return;

    setUsername(localStorage.getItem("username"));
    setEmail(localStorage.getItem("email"));

    const storedAddr = localStorage.getItem("selectedAddress");
    if (storedAddr) {
      try {
        setSelectedAddress(JSON.parse(storedAddr));
      } catch {
        setSelectedAddress(null);
      }
    }

    const rawPayment = localStorage.getItem("selectedPaymentMethod");
    if (rawPayment) {
      try {
        const parsed = JSON.parse(rawPayment);
        const val = typeof parsed === "string" ? parsed : rawPayment;
        if (val === "cod" || val === "Cash on Delivery")
          setPaymentMethod("Cash on Delivery");
        else if (val === "card") setPaymentMethod("Credit/Debit Card");
        else if (val === "online") setPaymentMethod("Online");
      } catch {
        setPaymentMethod(rawPayment);
      }
    }
  }, []);

  // ✅ Load cart or buyNow order
  const loadCart = useCallback(async () => {
    const checkoutMode = localStorage.getItem("checkoutMode");

    if (checkoutMode === "buyNow") {
      const buyNowOrder = localStorage.getItem("order");
      if (buyNowOrder) {
        try {
          const parsed = JSON.parse(buyNowOrder);
          const item: CartItem = {
            productId: parsed.productId,
            title: parsed.title,
            price: Number(parsed.discountPrice ?? parsed.price),
            quantity: parsed.quantity,
            image: parsed.image,
          };

          setBuyNowItems([item]);
          setOrderTotal((item.price * item.quantity).toString());
          setLoading(false);
          return;
        } catch (err) {
          console.error("Error parsing buy now order:", err);
        }
      }
    }

    // 🛒 Normal Cart flow
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      await fetchCart(userId);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [userId, fetchCart, setCart]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // ✅ Keep totals updated
  useEffect(() => {
    if (buyNowItems) {
      const total = buyNowItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setOrderTotal(total.toString());
    } else if (cart && Array.isArray(cart)) {
      const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setOrderTotal(total.toString());
    }
  }, [cart, buyNowItems]);

  // ✅ Place order
  const handleOrderPlace = async () => {
    const checkoutMode = localStorage.getItem("checkoutMode");

    try {
      let orderPayload;

      if (checkoutMode === "buyNow" && buyNowItems) {
        orderPayload = {
          userId,
          items: buyNowItems,
          totalAmount: orderTotal,
          paymentMethod,
          paymentStatus,
          address: selectedAddress,
        };
      } else {
        if (!userId || cart.length === 0) {
          toast("No items in cart to place an order.");
          return;
        }

        orderPayload = {
          userId,
          items: cart,
          totalAmount: orderTotal,
          paymentMethod,
          paymentStatus,
          address: selectedAddress,
        };
      }

      const orderRes = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) throw new Error("Failed to place order");

      if (checkoutMode === "buyNow") {
        localStorage.removeItem("order");
      } else {
        await fetch(`http://localhost:5000/api/cart/${userId}`, {
          method: "DELETE",
        });
        setCart([]);
        await fetchCart(userId);
      }

      localStorage.removeItem("checkoutMode");

      setOrderTotal("0");
      setIsModalOpen(true);
      fetchOrders();
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error("❌ Failed to place order, please try again.");
    }
  };

  if (loading)
    return (
      <div className="h-screen w-[95%] mx-auto rounded-3xl bg-white my-4 items-center justify-center flex">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-20 w-[95%] mx-auto my-4 rounded-2xl">
      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAfterClose={() => router.push("/")}
        title="Order Placed!"
        message="The item will be delivered soon!"
      />

      {/* Header */}
      <div className="flex justify-between items-center pb-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Confirmation</h1>
        <div className="flex items-center gap-6">
          <p className="text-lg font-semibold text-gray-600">
            Order Total:{" "}
            <span className="text-xl font-bold">
              ${Number(orderTotal).toFixed(2)}
            </span>
          </p>
          <Button
            onClick={handleOrderPlace}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow transition-all cursor-pointer hover:scale-105"
          >
            Place Order
          </Button>
        </div>
      </div>

      {/* User, Address, Payment Info */}
      <div className="w-full mx-auto bg-white p-4 mb-4">
        <div className="grid md:grid-cols-2 gap-6 pb-6 mb-6">
          <div className="rounded-xl p-4">
            <div className="flex justify-between items-center border-b-2 border-black border-dashed">
              <h2 className="text-lg font-semibold">Your Information</h2>
            </div>
            <p className="mt-2 text-gray-600">{username}</p>
            <p className="text-gray-600">{email}</p>
          </div>

          <div className="rounded-xl p-4">
            <div className="flex justify-between items-center border-b-2 border-black border-dashed">
              <h2 className="text-lg font-semibold">Shipping Address</h2>
              <Link href="/cart?step=2">
                <button className="text-blue-500 hover:underline text-sm cursor-pointer">
                  Edit
                </button>
              </Link>
            </div>
            {selectedAddress ? (
              <>
                <p className="mt-2 text-gray-600">{selectedAddress.address}</p>
                <p className="text-gray-600">
                  {selectedAddress.city}, {selectedAddress.country}
                </p>
              </>
            ) : (
              <p className="mt-2 text-gray-500">No address selected</p>
            )}
          </div>

          <div className="rounded-xl p-4">
            <div className="flex justify-between items-center border-b-2 border-black border-dashed">
              <h2 className="text-lg font-semibold">Payment</h2>
            </div>
            <p className="mt-2 text-gray-600">
              Selected Payment Method: {paymentMethod ?? "Not Selected"}
            </p>
             <p className="mt-2 text-gray-600">
              Payment Status: {paymentStatus ?? "Pending"}
            </p>
          </div>

          <div className="rounded-xl p-4">
            <div className="flex justify-between items-center border-b-2 border-black border-dashed">
              <h2 className="text-lg font-semibold">Billing Address</h2>
            </div>
            <p className="mt-2 text-gray-600">{username}</p>
            <p className="text-gray-600">
              {selectedAddress?.address} <br /> {selectedAddress?.city},{" "}
              {selectedAddress?.country}
            </p>
            <p className="text-gray-600">(315) 396-7461</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div>
        {(buyNowItems ?? cart).length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-600 text-sm border-b">
                <th className="pb-3">Item</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(buyNowItems ?? cart).map((item) => (
                <tr key={item.productId} className="border-b text-gray-800">
                  <td className="py-4 flex items-center gap-4">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={60}
                      height={60}
                      className="rounded-lg"
                    />
                    <span>{item.title}</span>
                  </td>
                  <td className="py-4">{item.quantity}</td>
                  <td className="py-4">${item.price.toFixed(2)}</td>
                  <td className="py-4 font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
