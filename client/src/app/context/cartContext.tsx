"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type CartItem = {
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
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 🔹 Fetch cart from backend
  const fetchCart = React.useCallback(async (userId: string) => {
    try {
      if (!userId) return;

      const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch cart");

      const data = await res.json();
      const items: CartItem[] = Array.isArray(data.items) ? data.items : [];
      setCart(items);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]);
    }
  }, []);

  // 🔹 Add to cart
  const addToCart = async (userId: string, product: CartItem) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      const data = await res.json();
      setCart(data.items || []); // ✅ update context immediately
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // 🔹 Remove from cart
  const removeFromCart = async (userId: string, productId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${userId}/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to remove from cart");

      const data = await res.json();
      setCart(data.items || []); // ✅ update context immediately
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  // 🔹 Clear cart
  const clearCart = async (userId: string) => {
    try {
      if (!userId) return;

      await fetch(`http://localhost:5000/api/cart/${userId}`, {
        method: "DELETE",
      });

      setCart([]); // always array
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  // 🔹 Auto-fetch when user is logged in
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchCart(userId);
    }
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{ cart, setCart, fetchCart, clearCart, addToCart, removeFromCart }}
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
