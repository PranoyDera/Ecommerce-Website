"use client";

import ConfirmModal from "../../../components/ConfirmModal";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOrders } from "@/app/context/orderContext";
import Loader from "@/components/Loader2";
import { apiDelete } from "@/app/utils/api";
import Image from "next/image";



export default function OrderList() {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const router = useRouter();
  const { orders, setOrders, fetchOrders } = useOrders();

  // Load orders on mount
  useEffect(() => {
    fetchOrders().finally(() => setLoading(false));
  }, [fetchOrders]);

    const deleteOrder = async (orderId: string) => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      toast.error("User not logged in");
      return;
    }
  
    try {
      const data = await apiDelete<{ addresses: any[] }>(
        `/api/orders/${orderId}`,
        token
      );
  
      setOpen(false)
      toast.success("Order deleted!");
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (error: any) {
      console.error("Error deleting Order:", error);
      toast.error(error.message || "Failed to delete Order");
    }
  };

  if (loading) return (
    <div className="h-screen w-[95%] mx-auto rounded-3xl bg-white my-4 items-center justify-center flex">
    <Loader/>
  </div>
  )

  return (
    <div className="min-h-screen bg-[url('/userpage.jpg')] bg-cover bg-center px-6 py-12 w-[95%] mx-auto rounded-3xl my-4">
      {/* Back button */}
      <button
        onClick={() => router.push("/Profile")}
        className="flex items-center gap-2 text-gray-700 hover:text-purple-700 transition mb-6"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h1 className="scroll-m-20 text-center text-4xl font-bold tracking-tight text-balance mb-5">
        My Orders:
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-lg text-center h-100 items-center justify-center flex flex-col ">
          <Image
          src={"/empty-box.png"}
          alt="EmptyOrderList"
          width={100}
          height={100}
          />
          <p className="text-gray-600 text-lg justify-center items-center whitespace-nowrap">You don’t have any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="md:text-sm text-xs text-gray-500">
                    <span className="font-medium">Order ID:</span>{" "}
                    <span className="font-mono">{order._id}</span>
                  </p>
                  <p className="md:text-sm text-xs text-gray-500">
                    Placed on:{" "}
                    <span className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide ${
                    order.paymentStatus === "Pending"
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                      : order.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300"
                  }`}
                >
                  {order.paymentStatus.toUpperCase()}
                </span>
              </div>

              {/* Order Items */}
              <div className="space-y-4 divide-y">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{item.title}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex justify-between items-center mt-6">
                <div>
                  <p className="md:text-lg text-sm font-semibold text-gray-800">
                    Total: ${order.totalAmount.toFixed(2)}
                  </p>
                  <p className="md:text-sm text-xs text-gray-600">
                    Payment Method:{" "}
                    <span className="capitalize font-medium">{order.paymentMethod === "cod"?"Cash On delivery":"Online"}</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedOrder(order._id);
                    setOpen(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm px-3 md:px-5 py-2 rounded-xl shadow-md transition whitespace-nowrap w-25 justify-center items-center md:w-40 cursor-pointer"
                >
                  Cancel Order
                </button>
              </div> 
            </div>
          ))}
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          if (selectedOrder) deleteOrder(selectedOrder);
        }}
        title="Are you sure?"
        message="Your order will be permanently deleted."
      />
    </div>
  );
}
