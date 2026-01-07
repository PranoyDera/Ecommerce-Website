"use client";

import { Package } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useOrders } from "../app/context/orderContext";

function OrderIcon() {
  const { orders } = useOrders(); // reactive to context updates

  const totalOrders = orders.length;

  return (
    <div className="relative">
      <Link href="/Profile/orderList" className="relative">
        <Package className="w-4 h-4 text-gray-500" />
        {totalOrders > 0 && (
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
            {totalOrders}
          </span>
        )}
      </Link>
    </div>
  );
}

export default OrderIcon;
