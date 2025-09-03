"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useCart } from "../app/context/cartContext";

function CartIcon() {
  const { cart } = useCart();
  const totalItems = cart.length
    console.log("totalItems:",totalItems)
    console.log(cart)
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

export default CartIcon;
