// context/CheckoutContext.tsx
"use client";
import { createContext, useContext, useState } from "react";

type ShippingFormInputs = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
};

type CheckoutContextType = {
  shipping: ShippingFormInputs | null;
  setShipping: (data: ShippingFormInputs) => void;
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [shipping, setShipping] = useState<ShippingFormInputs | null>(null);

  return (
    <CheckoutContext.Provider value={{ shipping, setShipping }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used inside CheckoutProvider");
  return ctx;
};
