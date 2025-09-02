"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

type Address = {
  _id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  landmark?: string;
};

export default function BuyNowModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (address: Address, paymentMethod: string) => void;
}) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  // ✅ Fetch addresses from localStorage
  useEffect(() => {
    const storedAddresses = localStorage.getItem("addresses");
    if (storedAddresses) {
      setAddresses(JSON.parse(storedAddresses));
    }
  }, []);

  const handleConfirm = () => {
    if (!selectedAddress) return alert("Please select an address!");
    if (!paymentMethod) return alert("Please select a payment method!");
    onConfirm(selectedAddress, paymentMethod);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-4">Select Address</h2>

        {/* Address List */}
        {addresses.length > 0 ? (
          <div className="space-y-3 mb-6">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                onClick={() => setSelectedAddress(addr)
                }
                className={`p-3 border rounded-lg cursor-pointer ${
                  selectedAddress?._id === addr._id
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-300"
                }`}
              >
                <p className="font-medium">{addr.address}</p>
                <p className="text-sm text-gray-600">
                  {addr.city}, {addr.state} - {addr.zipCode}
                </p>
                <p className="text-sm text-gray-600">{addr.country}</p>
                {addr.landmark && (
                  <p className="text-xs text-gray-500">
                    Landmark: {addr.landmark}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No saved addresses found.</p>
        )}

        {/* Payment Methods */}
        <h2 className="text-lg font-semibold mb-2">Select Payment Method</h2>
        <div className="flex gap-3 mb-6">
          {["Cash on Delivery", "Online", "Card"].map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`px-4 py-2 rounded-lg border ${
                paymentMethod === method
                  ? "bg-purple-600 text-white border-purple-600"
                  : "border-gray-300"
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}
