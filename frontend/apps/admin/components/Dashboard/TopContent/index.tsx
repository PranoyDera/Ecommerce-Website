"use client";

import Card from "@/components/ui/Card/Card";
import { DollarSign, Package, ShoppingCart, UserPlus } from "lucide-react";
import Image from "next/image";

interface TopContentProps {
  totalOrders: number;
  totalRevenue: number;
  totalUser:number;
  totalProductsPurchased:number;
}
export default function TopContent(
  { totalOrders,totalRevenue,totalUser,totalProductsPurchased }: TopContentProps,
) {
  return (
    <div className="p-4 rounded-md flex flex-col gap-4">
      <p className="text-xl font-bold">Overview</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          icon={<DollarSign size={18} />}
          title="Total Transaction"
          value={totalRevenue}
          change="+10% from yesterday"
          changeType="positive"
        />

        <Card
          icon={<ShoppingCart size={18} />}
          title="Total Orders"
          value={totalOrders}
          change="+8% from yesterday"
          changeType="positive"
        />

        <Card
          icon={<Package size={18} />}
          title="Product Sold"
          value={totalProductsPurchased}
          change="-2% from yesterday"
          changeType="negative"
        />

        <Card
          icon={<UserPlus size={18} />}
          title="Customer count"
          value={totalUser}
          change="+3% from yesterday"
          changeType="positive"
        />
      </div>
    </div>
  );
}
