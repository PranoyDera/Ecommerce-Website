"use client";

import { Bell, Package } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function OrderIcon() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${userId}`);
      const data = await res.json();
      setOrders(data || []); // make sure your API returns { orders: [...] }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders(); // initial load

    // ✅ Listen for new orders (optional)
    window.addEventListener("ordersUpdated", fetchOrders);
    return () => window.removeEventListener("ordersUpdated", fetchOrders);
  }, []);

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
