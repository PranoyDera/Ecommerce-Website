"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Trash2 } from "lucide-react";
import Image from "next/image";
import PaymentForm from "../../components/PaymentForm";
import { ShippingFormInputs } from "@/type";
import AddressForm from "../../components/AddressForm";
import { useCart } from "../context/cartContext";
import { toast } from "sonner";
import { LoaderThree } from "@/components/ui/loader";
import Loader from "@/components/Loader2";

// ✅ CartItem (backend schema)
type CartItem = {
  productId: string;
  title: string;
  description?: string;
  price: number;
  quantity: number;
  discountPercentage?: number;
  image: string;
};

// ✅ Full cart response
type CartResponse = {
  _id: string;
  userId: string;
  items: CartItem[];
};

// ✅ Address type
type Address = {
  _id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  landmark?: string;
};

export default function CartPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeStep = parseInt(searchParams.get("step") || "1");

  const [shippingForm, setShippingForm] = useState<ShippingFormInputs>();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const { removeFromCart } = useCart();

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 🔹 Fetch cart
  const fetchCart = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!userId) return;
    fetchCart();
  }, [userId]);

  // 🔹 Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      const token = sessionStorage.getItem("accessToken");
      try {
        const res = await fetch(`http://localhost:5000/api/users/address`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAddresses(data || []);
      } catch (err) {
        toast.error(`Error fetching addresses:${err}`);
      } finally {
        setLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, [token]);

  // 🔹 Remove item
  const handleRemove = async ({ productId }: { productId: string }) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast("User not logged in");
      return;
    }
    await removeFromCart(userId, productId);
    fetchCart();
  };
  // ✅ Totals
  const subTotal =
    cart?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0;

  const totalDiscount =
    cart?.items.reduce(
      (acc, item) =>
        acc +
        ((item.price * (item.discountPercentage ?? 0)) / 100) * item.quantity,
      0
    ) ?? 0;

  const shipping = cart && cart.items.length > 0 ? 10 : 0;
  const total = subTotal - totalDiscount + shipping;

  // 🔹 Save totals
  useEffect(() => {
    if (cart && cart.items.length > 0) {
      localStorage.setItem("subtotal", subTotal.toFixed(2));
      localStorage.setItem("total", total.toFixed(2));
    } else {
      localStorage.removeItem("subtotal");
      localStorage.removeItem("total");
    }
  }, [cart, subTotal, total]);

  const steps = [
    { id: 1, title: "Shopping Cart" },
    { id: 2, title: "Shipping Address" },
    { id: 3, title: "Payment Method" },
  ];

  if (loading)
    return (
      <div className="h-screen w-[95%] mx-auto rounded-3xl bg-white my-4 items-center justify-center flex">
        <Loader />
      </div>
    );
  return (
    <div className="w-[95%] rounded-2xl mx-auto flex flex-col gap-8 items-center justify-center my-4 bg-[url('/cartPage.jpg')] bg-cover bg-no-repeat bg-top p-4">
      {/* TITLE */}
      <h1 className="text-2xl font-medium">Your Cart</h1>

      {/* STEPS */}
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 bg-white/60 rounded-3xl justify-center p-4">
        {steps.map((step) => (
          <div className="flex items-center gap-2" key={step.id}>
            <div
              className={`w-6 h-6 flex text-white rounded-full justify-center items-center p-4 
                ${step.id === activeStep ? "bg-orange-600" : "bg-black"}`}
            >
              {step.id}
            </div>
            <p
              className={`text-sm font-medium ${
                step.id === activeStep ? "text-orange-600" : "text-black"
              }`}
            >
              {step.title}
            </p>
          </div>
        ))}
      </div>

      {/* STEPS & DETAILS */}
      <div className="w-[95%] flex flex-col lg:flex-row gap-16 mx-auto">
        {/* LEFT SIDE */}
        <div className="w-full lg:w-7/12 shadow-lg p-8 rounded-lg flex flex-col gap-8 bg-white/70 border-1 border-gray-100">
          {activeStep === 1 ? (
            <div className="flex flex-col gap-6 max-h-96 overflow-y-auto pr-2">
              {!cart || cart.items.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
              ) : (
                cart.items.map((item) => (
                  <div
                    className="flex items-center justify-between"
                    key={item.productId}
                  >
                    {/* IMAGE + DETAILS */}
                    <div className="flex gap-8">
                      <div className="relative w-32 h-32 bg-gray-50 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-black">
                          Quantity: {item.quantity}
                        </p>
                        <p className="font-semibold mt-4">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* DELETE */}
                    <button
                      onClick={() => {
                        handleRemove({ productId: item.productId });
                      }}
                      className="w-8 h-8 rounded-full hover:bg-red-300 transition-all duration-300 bg-red-100 text-red-400 flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : activeStep === 2 ? (
            loadingAddresses ? (
              <p>Loading addresses...</p>
            ) : addresses.length > 0 ? (
              <div className="flex flex-col gap-4">
                <h2 className="font-semibold text-black">Select Address</h2>
                {addresses.map((addr) => (
                  <div
                    key={addr?._id}
                    className="p-4 rounded-lg border bg-white/80 cursor-pointer hover:border-orange-500 hover:scale-105 transition-transform duration-300"
                    onClick={() => {
                      localStorage.setItem(
                        "selectedAddress",
                        JSON.stringify(addr)
                      );
                      router.push("/cart?step=3", { scroll: false });
                    }}
                  >
                    <p className="text-sm font-medium">
                      {addr?.address}, {addr?.city}
                    </p>
                    <p className="text-xs text-gray-600">
                      {addr?.state}, {addr?.country} - {addr?.zipCode}
                    </p>
                    {addr?.landmark && (
                      <p className="text-xs italic text-gray-500">
                        Landmark: {addr?.landmark}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <AddressForm
                width="w-[40vw]"
                onSuccess={(newAddress) => {
                  localStorage.setItem(
                    "selectedAddress",
                    JSON.stringify(newAddress)
                  );
                  setAddresses((prev) => [...prev, newAddress]);
                  router.push("/cart?step=3", { scroll: false });
                }}
              />
            )
          ) : activeStep === 3 &&
            (shippingForm || localStorage.getItem("selectedAddress")) ? (
            <PaymentForm />
          ) : (
            <p className="text-sm text-gray-500">
              Fill the address form to continue
            </p>
          )}

          {/* 🔹 BACK BUTTON */}
          {activeStep > 1 && (
            <button
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 w-fit"
              onClick={() =>
                router.push(`/cart?step=${activeStep - 1}`, { scroll: false })
              }
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          )}
        </div>

        {/* SUMMARY */}
        <div className="w-full lg:w-5/12 shadow-lg border-1 border-gray-100 p-8 rounded-lg flex flex-col gap-8 h-max bg-white/70">
          <h2 className="font-semibold text-black">Cart Details</h2>
          <div className="flex flex-col gap-4 text-white">
            <div className="flex justify-between text-sm">
              <p className="text-black font-semibold">Subtotal</p>
              <p className="font-medium text-black">${subTotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-black font-semibold">Discount</p>
              <p className="font-medium text-green-700">
                -${totalDiscount.toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-black font-semibold">Shipping Fee</p>
              <p className="font-medium text-red-700">
                {shipping > 0 ? "+$10" : "$0"}
              </p>
            </div>
            <hr className="text-black font-semibold" />
            <div className="flex justify-between text-sm">
              <p className="text-black font-semibold">Total</p>
              <p className="font-medium text-blue-950">${total.toFixed(2)}</p>
            </div>
          </div>

          {activeStep === 1 && cart && cart.items.length > 0 && (
            <button
              className="w-full bg-gray-800 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2 hover:bg-gray-900 transition-all duration-300"
              onClick={() => router.push("/cart?step=2", { scroll: false })}
            >
              Continue
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
