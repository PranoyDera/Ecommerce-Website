"use client";

import Image from "next/image";
import {
  X,
  Calendar,
  Phone,
  User2,
  MapPin,
  Box,
  LocationEdit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { User } from "@/components/UserList";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type UserDetailModalProps = {
  open: boolean;
  onClose: () => void;
  user: User | null;
};

export default function UserDetailModal({
  open,
  onClose,
  user,
}: UserDetailModalProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  if (!open || !user) return null;

  const toggleOrder = (id: string) =>
    setExpandedOrderId((prev) => (prev === id ? null : id));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-5xl h-full overflow-hidden rounded-lg bg-white shadow-2xl"
      >
        {/* HEADER */}
        <div className="relative p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-2 hover:bg-white/20 cursor-pointer"
          >
            <X />
          </button>

          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-white/40 shadow">
              {user.image ? (
                <Image src={user.image} alt={user.name} fill />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold bg-white text-indigo-600">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <p className="text-2xl font-bold">{user.name}</p>
              <p className="opacity-90">{user.email}</p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto max-h-[65vh] space-y-8">
          {/* USER INFO */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Info icon={Phone} label="Phone" value={user.phone || "N/A"} />
            <Info icon={User2} label="Gender" value={user.gender || "N/A"} />
            <Info
              icon={Calendar}
              label="DOB"
              value={formatDate(user.DateOfBirth)}
            />
            <Info icon={Box} label="Orders" value={user.totalOrders} />
            <Info
              icon={MapPin}
              label="Addresses"
              value={user.addresses?.length || 0}
            />
          </div>

          {/* ORDERS */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-indigo-700">
              Orders
            </h3>

            <div className="space-y-4">
              {user.orders?.length ? (
                user.orders.map((order) => {
                  const open = expandedOrderId === order._id;

                  return (
                    <div
                      key={order._id}
                      className="rounded-2xl border bg-gradient-to-br from-white to-indigo-50 p-5 shadow-sm"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold">
                            ₹{order.totalAmount}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toDateString()}
                          </p>
                        </div>

                        <div className="flex gap-4 items-center">
                          <div className="flex gap-1 text-sm items-center">
                          Payment Method:
                          <span className="text-sm text-blue-500">
                            {order.paymentMethod === "cod"
                              ? "Cash on delivery"
                              : `${order.paymentMethod}`}
                          </span>
                          </div>
                          <StatusBadge status={order.paymentStatus} />
                          <button
                            onClick={() => toggleOrder(order._id)}
                            className="text-sm text-indigo-600 hover:underline cursor-pointer"
                          >
                            {open
                              ? "Hide items"
                              : `View items (${order.items.length})`}
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 space-y-3 overflow-hidden"
                          >
                            {order.items.map((item) => (
                              <div
                                key={item._id}
                                className="flex items-center gap-4 rounded-xl bg-white p-3 shadow"
                              >
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="h-14 w-14 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{item.title}</p>
                                  <p className="text-sm text-gray-500">
                                    Qty {item.quantity}
                                  </p>
                                </div>
                                <p className="font-semibold">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No orders found</p>
              )}
            </div>
          </div>

          {/* ADDRESSES */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-indigo-700">
              Addresses
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {user.addresses?.map((a) => (
                <div
                  key={a._id}
                  className="rounded-2xl p-4 bg-gradient-to-br from-indigo-50 to-white border shadow-sm"
                >
                  <div className="flex gap-2 items-start">
                    <MapPin className="text-indigo-600 mt-1" />
                    <div>
                      <p className="font-medium">{a.address}</p>
                      <p className="text-sm text-gray-500">
                        {a.city}, {a.state} – {a.zipCode}
                      </p>
                      <p className="text-sm text-gray-500">{a.country}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function Info({ icon: Icon, label, value }: any) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-white p-4 border shadow-sm text-center">
      {Icon && <Icon className="mx-auto mb-2 text-indigo-600" />}
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map = {
    Pending: "bg-orange-100 text-orange-700",
    Paid: "bg-green-100 text-green-700",
    Failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-medium",
        map[status as keyof typeof map]
      )}
    >
      {status}
    </span>
  );
}

function formatDate(date?: string) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
}
