"use client";

import Card from "@/components/ui/Card/Card";
import { DollarSign, Package, ShoppingCart, UserPlus } from "lucide-react";

export default function TopContent() {
  return (
    <div className="bg-neutral-100 p-4 rounded-md flex flex-col gap-4">
      <p className="text-xl font-bold">Overview</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          icon={<DollarSign size={18} />}
          title="Total Sales"
          value="$5k"
          change="+10% from yesterday"
          changeType="positive"
        />

        <Card
          icon={<ShoppingCart size={18} />}
          title="Total Orders"
          value="500"
          change="+8% from yesterday"
          changeType="positive"
        />

        <Card
          icon={<Package size={18} />}
          title="Product Sold"
          value="9"
          change="-2% from yesterday"
          changeType="negative"
        />

        <Card
          icon={<UserPlus size={18} />}
          title="New Customers"
          value="12"
          change="+3% from yesterday"
          changeType="positive"
        />
      </div>
    </div>
  );
}
