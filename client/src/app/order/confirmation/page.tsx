"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SuccessModal from "../../../components/successModal";
import { useRouter } from "next/navigation";

interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export default function OrderConfirmation() {
  const router = useRouter();
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const [cart, setCart] = useState<CartItem[]>([]);
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

  // ✅ Fetch cart OR Buy Now depending on checkoutMode
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
        if (val === "cod") setPaymentMethod("Cash on Delivery");
        else if (val === "card") setPaymentMethod("Credit/Debit Card");
        else if (val === "Online")setPaymentMethod("Online");
        else if (val === "Cash on Delivery") setPaymentMethod("Cash on Delivery")
      } catch {
        setPaymentMethod(rawPayment);
      }
    }

    const checkoutMode = localStorage.getItem("checkoutMode");

    // 🛒 If user came from Buy Now
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

          setCart([item]);
          setOrderTotal((item.price * item.quantity).toString());
          setLoading(false);
          return;
        } catch (err) {
          console.error("Error parsing buy now order:", err);
        }
      }
    }

    // 🛒 Else, load from Cart
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch cart");

        const data = await res.json();
        setCart(data.items || []);
        setOrderTotal(data.totalAmount?.toString() || "0");
      } catch (err) {
        console.error("Error fetching cart:", err);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  // ✅ Place order
const handleOrderPlace = async () => {
  if (!userId || cart.length === 0) {
    alert("No items in cart to place an order.");
    return;
  }

  try {
    const orderPayload = {
      userId,
      items: cart,
      totalAmount: orderTotal,
      paymentMethod,
      address: selectedAddress,
    };

    const orderRes = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    if (!orderRes.ok) throw new Error("Failed to place order");

    const checkoutMode = localStorage.getItem("checkoutMode");

    if (checkoutMode === "buyNow") {
      // ✅ Just clear Buy Now temp data
      localStorage.removeItem("order");
    } else {
      // ✅ Cart checkout: clear cart in DB
      await fetch(`http://localhost:5000/api/cart/${userId}`, {
        method: "DELETE",
      });
    }

    // ✅ Reset checkoutMode so it doesn’t interfere with future orders
    localStorage.removeItem("checkoutMode");

    setCart([]);
    setOrderTotal("0");
    setIsModalOpen(true);
  } catch (err) {
    console.error("Error placing order:", err);
    alert("❌ Failed to place order, please try again.");
  }
};


  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-20 w-[95%] mx-auto my-4 rounded-2xl">
      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAfterClose={() => router.push("/")}
        title="Order Placed!"
        message="The item will be delivered soon!"
      />
      <div className="flex justify-between items-center pb-6 mb-6 ">
        <h1 className="text-2xl font-bold text-gray-800">Order Confirmation</h1>
        <div className="flex items-center gap-6">
          <p className="text-lg font-semibold text-gray-600">
            Order Total: <span className="text-xl font-bold">${Number(orderTotal).toFixed(2)}</span>
          </p>
          <button
            onClick={handleOrderPlace}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow transition-all cursor-pointer"
          >
            Place Order
          </button>
        </div>
      </div>

      <div className="w-full mx-auto bg-white p-4 mb-4">
        <div className="grid md:grid-cols-2 gap-6 pb-6 mb-6">
          {/* User Info */}
          <div className="rounded-xl p-4">
            <div className="flex justify-between items-center border-b-2 border-black border-dashed">
              <h2 className="text-lg font-semibold">Your Information</h2>
            </div>
            <p className="mt-2 text-gray-600">{username}</p>
            <p className="text-gray-600">{email}</p>
          </div>

          {/* Shipping */}
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

          {/* Payment */}
          <div className="rounded-xl p-4">
            <div className="flex justify-between items-center border-b-2 border-black border-dashed">
              <h2 className="text-lg font-semibold">Payment</h2>
            </div>
            <div className="mt-2 flex items-center gap-2 text-gray-600">
              Selected Payment Method: {paymentMethod ?? "Not Selected"}
            </div>
          </div>

          {/* Billing */}
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

      {/* Cart Table */}
      <div>
        {cart.length === 0 ? (
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
              {cart.map((item) => (
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
