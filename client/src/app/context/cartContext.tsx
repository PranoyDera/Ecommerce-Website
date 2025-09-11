"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiDelete, apiGet, apiPost } from "../utils/api";

type CartItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  discountPercentage?: number;
};

// 👇 Separate type for Buy Now products
type BuyNowItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  discountPercentage?: number;
};

type CartContextType = {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  fetchCart: (userId: string) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;
  addToCart: (userId: string, product: CartItem) => Promise<void>;
  removeFromCart: (userId: string, productId: string) => Promise<void>;

  // 👇 BuyNow state and actions
  buyNowItems: BuyNowItem[];
  setBuyNowItems: React.Dispatch<React.SetStateAction<BuyNowItem[]>>;
  addBuyNow: (product: BuyNowItem) => void;
  clearBuyNow: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [buyNowItems, setBuyNowItems] = useState<BuyNowItem[]>([]); // ✅ separate state

  // ---------------- CART ----------------
const fetchCart = React.useCallback(async (userId: string) => {
  try {
    if (!userId) return;

    const data = await apiGet<{ items: CartItem[] }>(`/api/cart/${userId}`);
    const items: CartItem[] = Array.isArray(data.items) ? data.items : [];
    setCart(items);
  } catch (err) {
    console.error("Error fetching cart:", err);
    setCart([]);
  }
}, []);

const addToCart = async (userId: string, product: CartItem) => {
  try {
    const data = await apiPost<{ items: CartItem[] }>(
      `/api/cart/${userId}`,
      product
    );
    setCart(data.items || []);
  } catch (err) {
    console.error("Error adding to cart:", err);
  }
};

const removeFromCart = async (userId: string, productId: string) => {
  try {
    const data = await apiDelete<{ items: CartItem[] }>(
      `/api/cart/${userId}/${productId}`
    );
    setCart(data.items || []);
  } catch (err) {
    console.error("Error removing from cart:", err);
  }
};

const clearCart = async (userId: string) => {
  try {
    if (!userId) return;

    await apiDelete(`/api/cart/${userId}`);
    setCart([]);
  } catch (err) {
    console.error("Error clearing cart:", err);
  }
};

  // ---------------- BUY NOW ----------------
  const addBuyNow = (product: BuyNowItem) => {
    setBuyNowItems([product]); // ✅ Only one item at a time
    localStorage.setItem("buyNow", JSON.stringify(product));
  };

  const clearBuyNow = () => {
    setBuyNowItems([]);
    localStorage.removeItem("buyNow");
  };

  // Load from localStorage (if needed)
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) fetchCart(userId);

    const savedBuyNow = localStorage.getItem("buyNow");
    if (savedBuyNow) {
      try {
        setBuyNowItems([JSON.parse(savedBuyNow)]);
      } catch {
        setBuyNowItems([]);
      }
    }
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        fetchCart,
        clearCart,
        addToCart,
        removeFromCart,
        buyNowItems,
        setBuyNowItems,
        addBuyNow,
        clearBuyNow,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
