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
import { openRazorpayCheckout } from "@/app/utils/paymentUtils";

export default function OrderConfirmation() {
  const router = useRouter();
  const { fetchOrders } = useOrders();
  const { cart, setCart, fetchCart, buyNowItems, setBuyNowItems } = useCart();

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const [orderTotal, setOrderTotal] = useState<string>("0");
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const paymentStatus = localStorage.getItem("paymentStatus");
  const checkoutMode = localStorage.getItem("checkoutMode"); // "cart" | "buyNow"

  // ✅ Load user, address, payment
  useEffect(() => {
    if (typeof window === "undefined") return;

    setUsername(localStorage.getItem("username"));
    setEmail(localStorage.getItem("email"));

    const storedAddr = localStorage.getItem("selectedAddress");
    if (storedAddr) setSelectedAddress(JSON.parse(storedAddr));

    const rawPayment = localStorage.getItem("selectedPaymentMethod");
    if (rawPayment) {
      try {
        const parsed = JSON.parse(rawPayment);
        setPaymentMethod(typeof parsed === "string" ? parsed : rawPayment);
      } catch {
        setPaymentMethod(rawPayment);
      }
    }
  }, []);

  // ✅ Load items based on checkoutMode
  const loadItems = useCallback(async () => {
    if (checkoutMode === "buyNow") {
      // Use context first
      if (buyNowItems.length > 0) {
        setOrderTotal(
          buyNowItems
            .reduce((sum, item) => sum + item.price * item.quantity, 0)
            .toString()
        );
        setLoading(false);
        return;
      }

      // Fallback to localStorage
      const storedOrder = localStorage.getItem("order");
      if (storedOrder) {
        try {
          const parsed = JSON.parse(storedOrder);
          setBuyNowItems([parsed]);
          setOrderTotal((parsed.price * parsed.quantity).toString());
        } catch (err) {
          console.error("Error parsing buyNow order:", err);
        }
      }
      setLoading(false);
      return;
    }

    // 🛒 Cart flow
    if (userId) {
      try {
        await fetchCart(userId);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setCart([]);
      }
    }
    setLoading(false);
  }, [checkoutMode, userId, fetchCart, setCart, buyNowItems, setBuyNowItems]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // ✅ Keep totals updated
  useEffect(() => {
    if (checkoutMode === "buyNow" && buyNowItems.length > 0) {
      const total = buyNowItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setOrderTotal(total.toString());
    } else if (checkoutMode !== "buyNow" && cart.length > 0) {
      const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setOrderTotal(total.toString());
    }
  }, [checkoutMode, buyNowItems, cart]);

  // ✅ Place order
  const handleOrderPlace = async () => {
    try {
      let orderPayload;

      if (checkoutMode === "buyNow" && buyNowItems.length > 0) {
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

      // 🔥 Online Payment Flow
      if (paymentMethod === "Online") {
        const total = Number(orderTotal);

        openRazorpayCheckout(
          total,
          async () => {
            toast.success("Order Placed!");

            await fetch("http://localhost:5000/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...orderPayload, paymentStatus: "Paid" }),
            });

            if (checkoutMode !== "buyNow" && userId) {
              await fetch(`http://localhost:5000/api/cart/${userId}`, {
                method: "DELETE",
              });
              setCart([]);
              await fetchCart(userId);
            }

            localStorage.removeItem("checkoutMode");
            localStorage.removeItem("order");
            setOrderTotal("0");
            setIsModalOpen(true);
            fetchOrders();
            router.push("/");
          },
          () => toast.error("❌ Payment failed!")
        );
        return;
      }

      // 🔥 COD or other
      await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (checkoutMode === "buyNow") {
        localStorage.removeItem("order");
      } else if (userId) {
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
      <div className="h-screen w-[95%] mx-auto rounded-3xl bg-white my-4 flex items-center justify-center">
        <Loader />
      </div>
    );

  const itemsToShow = checkoutMode === "buyNow" ? buyNowItems : cart;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 md:px-12 lg:px-20 w-[95%] mx-auto my-4 rounded-2xl">
      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAfterClose={() => router.push("/")}
        title="Order Placed!"
        message="The item will be delivered soon!"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Order Confirmation
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-2">
          <p className="text-base sm:text-lg font-semibold text-gray-600">
            Order Total:{" "}
            <span className="text-lg sm:text-xl font-bold">
              ${Number(orderTotal).toFixed(2)}
            </span>
          </p>
          <Button
            onClick={handleOrderPlace}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow transition-all cursor-pointer hover:scale-105"
          >
            {paymentMethod === "Online" ? "Pay and Place Order" : "Place Order"}
          </Button>
        </div>
      </div>

      {/* User, Address, Payment */}
      <div className="w-full mx-auto bg-white p-4 mb-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-xl">
          <h2 className="text-lg font-semibold border-b pb-2">Your Info</h2>
          <p className="mt-2 text-gray-600">{username}</p>
          <p className="text-gray-600">{email}</p>
        </div>
        <div className="p-4 border rounded-xl">
          <h2 className="text-lg font-semibold border-b pb-2">Shipping Address</h2>
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
        <div className="p-4 border rounded-xl">
          <h2 className="text-lg font-semibold border-b pb-2">Payment</h2>
          <p className="mt-2 text-gray-600">
            Selected: {paymentMethod ?? "Not Selected"}
          </p>
          <p className="text-gray-600">
            Status: {paymentStatus ?? "Pending"}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="overflow-x-auto bg-white rounded-xl p-4">
        {itemsToShow.length === 0 ? (
          <p className="text-gray-500">No items found.</p>
        ) : (
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead>
              <tr className="text-gray-600 text-sm border-b">
                <th className="pb-3">Item</th>
                <th className="pb-3">Qty</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {itemsToShow.map((item) => (
                <tr key={item.productId} className="border-b text-gray-800">
                  <td className="py-4 flex items-center gap-4">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={60}
                      height={60}
                      className="rounded-lg"
                    />
                    <span className="text-sm sm:text-base">{item.title}</span>
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
