"use client";

import React, { useState } from "react";
import { PaymentFormInputs, PaymentFormSchema } from "@/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Banknote,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./button";


function PaymentForm({
  setShippingForm,
}: {
  setShippingForm: (data: PaymentFormInputs) => void;
}) {
  const [paymentMethod, setPaymentMethod] = useState<
    "cod" | "Online" | "card" | null
  >(null);

  const {
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
  const total = Number(localStorage.getItem("total") || 0);

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
            onClick={() => setPaymentMethod("Online")}
          >
            <Smartphone className="w-5 h-5" />
            Online Payment
          </Button>
        </div>
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
      {paymentMethod === "Online" && (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">You selected Online Payment</h3>
          <button
            className="w-full bg-blue-600 text-white p-2 rounded-lg"
            onClick={() => {
                localStorage.setItem("selectedPaymentMethod","Online");
                router.push("/order/confirmation")
            }}
          >
            Confirm Order
          </button>
        </div>
      )}
    </div>
  );
}

export default PaymentForm;
