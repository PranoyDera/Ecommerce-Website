"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function ShoppingCartIcon() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  const fetchCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart(); // initial load
    // ✅ Listen for cart updates
    window.addEventListener("cartUpdated", fetchCart);
    return () => window.removeEventListener("cartUpdated", fetchCart);
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative">
      <Link href="/cart" className="relative">
        <ShoppingCart className="w-4 h-4 text-gray-500" />
        {totalItems > 0 && (
          <span
            className="
              absolute
              -top-3
              -right-3
              bg-black
              rounded-full
              text-[8px]
              text-white
              flex
              items-center
              justify-center
              w-4
              h-4
              shadow-md
            "
          >
            {totalItems}
          </span>
        )}
      </Link>
    </div>
  );
}

export default ShoppingCartIcon;
