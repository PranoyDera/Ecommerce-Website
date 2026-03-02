"use client";

import { useState } from "react";
import Card from "@/components/ui/Card/Card";
import { DollarSign, Package, ShoppingCart, UserPlus } from "lucide-react";
import TransactionsModal from "./Modals/transactionModal";
import OrdersModal from "./Modals/OrdersModal";
import ProductsModal from "./Modals/ProductsModal";
import UsersModal from "./Modals/UsersModal";

interface TopContentProps {
  totalOrders: number;
  totalRevenue: number;
  totalUser: number;
  totalProductsPurchased: number;
}

type ModalType = "transactions" | "orders" | "products" | "users" | null;

export default function TopContent({
  totalOrders,
  totalRevenue,
  totalUser,
  totalProductsPurchased,
}: TopContentProps) {
  const [openModal, setOpenModal] = useState<ModalType>(null);

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
          onClick={() => setOpenModal("transactions")}
        />

        <Card
          icon={<ShoppingCart size={18} />}
          title="Total Orders"
          value={totalOrders}
          change="+8% from yesterday"
          changeType="positive"
          onClick={() => setOpenModal("orders")}
        />

        <Card
          icon={<Package size={18} />}
          title="Products Sold"
          value={totalProductsPurchased}
          change="-2% from yesterday"
          changeType="negative"
          onClick={() => setOpenModal("products")}
        />

        <Card
          icon={<UserPlus size={18} />}
          title="Customer count"
          value={totalUser}
          change="+3% from yesterday"
          changeType="positive"
          onClick={() => setOpenModal("users")}
        />
      </div>

      {/* Modals */}
      <TransactionsModal open={openModal === "transactions"} onClose={() => setOpenModal(null)} />
      <OrdersModal open={openModal === "orders"} onClose={() => setOpenModal(null)} />
      <ProductsModal open={openModal === "products"} onClose={() => setOpenModal(null)} />
      <UsersModal open={openModal === "users"} onClose={() => setOpenModal(null)} />
    </div>
  );
}
