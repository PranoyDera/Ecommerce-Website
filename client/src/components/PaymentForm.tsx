"use client";

import React, { useState } from "react";
import { PaymentFormInputs, PaymentFormSchema } from "@/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Banknote,
  CreditCard,
  ShoppingCartIcon,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "./button";

function PaymentForm({
  setShippingForm,
}: {
  setShippingForm: (data: PaymentFormInputs) => void;
}) {
  const [paymentMethod, setPaymentMethod] = useState<
    "cod" | "online" | "card" | null
  >(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormInputs>({
    resolver: zodResolver(PaymentFormSchema),
  });

  const router = useRouter();

  const handlePaymentForm: SubmitHandler<PaymentFormInputs> = (data) => {
    // save card form if card selected
    if (paymentMethod === "card") {
      setShippingForm(data);
    }
    // redirect to success/next step
    router.push("/order/confirmation");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Step 1: Choose Payment Method */}
      {!paymentMethod && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Choose Payment Method</h2>

          {/* Cash on Delivery */}
          <Button
            variant="outline"
            className={`h-[50px] p-3 border rounded-3xl font-semibold flex items-center justify-center gap-2
                transition-transform duration-300 hover:scale-105 hover:shadow-lg text-white
                ${
                  paymentMethod === "cod"
                    ? "shadow-xl border-2 border-green-500"
                    : ""
                }
                bg-gradient-to-r from-green-400 to-green-700 hover:from-green-500 hover:to-green-800 cursor-pointer`}
            onClick={() => setPaymentMethod("cod")}
          >
            <Banknote className="w-5 h-5" />
            Cash on Delivery
          </Button>

          {/* Online Payment */}
          <Button
            className={`h-[50px] p-3 border rounded-3xl font-semibold flex items-center justify-center gap-2
                transition-transform duration-300 hover:scale-105 hover:shadow-lg text-white
                ${
                  paymentMethod === "online"
                    ? "shadow-xl border-2 border-blue-500"
                    : ""
                }
                bg-gradient-to-r from-blue-400 to-blue-700 hover:from-blue-500 hover:to-blue-800 cursor-pointer`}
            onClick={() => setPaymentMethod("online")}
          >
            <Smartphone className="w-5 h-5" />
            Online Payment
          </Button>

          {/* Card Payment */}
          <Button
            className={`h-[50px] p-3 border rounded-3xl font-semibold flex items-center justify-center gap-2
                transition-transform duration-300 hover:scale-105 hover:shadow-lg text-white
                ${
                  paymentMethod === "card"
                    ? "shadow-xl border-2 border-purple-500"
                    : ""
                }
                bg-gradient-to-r from-gray-700 to-black hover:from-gray-800 hover:to-black cursor-pointer`}
            onClick={() => setPaymentMethod("card")}
          >
            <CreditCard className="w-5 h-5" />
            Card Payment
          </Button>
        </div>
      )}

      {/* Step 2: Show card form if card selected */}
      {paymentMethod === "card" && (
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handlePaymentForm)}
        >
          <div className="flex flex-col gap-1">
            <label
              htmlFor="cardholder"
              className="text-xs font-semibold text-black"
            >
              Name on Card
            </label>
            <input
              className="border-b border-black py-2 outline-none text-sm text-black"
              type="text"
              id="cardholder"
              placeholder="John Doe"
              {...register("CardHolder")}
            />
            {errors.CardHolder && (
              <p className="text-xs text-red-500">
                {errors.CardHolder.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="CardNumber"
              className="text-xs font-semibold text-black"
            >
              Card Number
            </label>
            <input
              className="border-b border-black py-2 outline-none text-sm"
              type="text"
              id="CardNumber"
              placeholder="XXXX-XXXX-XXXX"
              {...register("CardNumber")}
            />
            {errors.CardNumber && (
              <p className="text-xs text-red-500">
                {errors.CardNumber.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="ExpirationDate"
              className="text-xs font-semibold text-black"
            >
              Expiration Date
            </label>
            <input
              className="border-b border-black py-2 outline-none text-sm"
              type="text"
              id="ExpirationDate"
              placeholder="MM/YY"
              {...register("expirationDate")}
            />
            {errors.expirationDate && (
              <p className="text-xs text-red-500">
                {errors.expirationDate.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="CVV" className="text-xs font-semibold text-black">
              CVV
            </label>
            <input
              className="border-b border-black py-2 outline-none text-sm"
              type="password"
              id="CVV"
              placeholder="CVV"
              {...register("cvv")}
            />
            {errors.cvv && (
              <p className="text-xs text-red-500">{errors.cvv.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Image src="/klarna.png" alt="klarna" width={50} height={25} />
            <Image src="/stripe.png" alt="stripe" width={50} height={25} />
            <Image src="/cards.png" alt="cards" width={50} height={25} />
          </div>

          <button
            className="w-full bg-gray-800 text-white p-2 rounded-lg cursor-pointer 
            flex items-center justify-center gap-2 hover:bg-gray-900 transition-all duration-300"
            type="submit"
            onClick={() => {
              localStorage.setItem(
                "selectedPaymentMethod",
                JSON.stringify(paymentMethod)
              );
              router.push("order/confirmation");
            }}
          >
            Checkout
            <ShoppingCartIcon className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* COD / Online Payment confirmation (no form needed) */}
      {paymentMethod === "cod" && (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">You selected Cash on Delivery</h3>
          <button
            className="w-full bg-gray-800 text-white p-2 rounded-lg"
            onClick={() => {
              localStorage.setItem(
                "selectedPaymentMethod",
                JSON.stringify(paymentMethod)
              );
              localStorage.setItem("checkoutMode", "cart");
              router.push("/order/confirmation");
            }}
          >
            Confirm Order
          </button>
        </div>
      )}
      {paymentMethod === "online" && (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">You selected Online Payment</h3>
          <button
            className="w-full bg-blue-600 text-white p-2 rounded-lg"
            onClick={() => {
              localStorage.setItem(
                "selectedPaymentMethod",
                JSON.stringify(paymentMethod)
              );
              router.push("/order/confirmation");
            }}
          >
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
}

export default PaymentForm;
