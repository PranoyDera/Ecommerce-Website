"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { User } from "@/components/UserList";
import { useState } from "react";

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
  if (!open || !user) return null;
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrder = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 rounded-full overflow-hidden bg-white/20">
              {user.image ? (
                <Image src={user.image} alt={user.name} fill />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-bold">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm opacity-90">{user.email}</p>
            </div>
          </div>

          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* User Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InfoBox label="Phone" value={user.phone || "N/A"} />
            <InfoBox label="Gender" value={user.gender || "N/A"} />
            <InfoBox label="Orders" value={user.orders?.length || 0} />
            <InfoBox label="Addresses" value={user.addresses?.length || 0} />
          </div>

          {/* Orders */}
          <Section title="" color="indigo">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-emerald-600">
                Orders ({user.totalOrders})
              </h3>

              {user.orders.length ? (
                user.orders.map((order) => {
                  const isOpen = expandedOrderId === order._id;

                  return (
                    <div
                      key={order._id}
                      className="rounded-xl border bg-white p-4 shadow transition-all"
                    >
                      {/* Order Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-lg">
                            ₹{order.totalAmount}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toDateString()}
                          </p>
                        </div>

                        {/* Toggle Button */}
                        <button
                          onClick={() => toggleOrder(order._id)}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          {isOpen
                            ? "Hide items"
                            : `View items (${order.items.length})`}
                          <span
                            className={`transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            ▼
                          </span>
                        </button>
                      </div>

                      {/* Status */}
                      <div className="mt-2 flex gap-2 text-sm">
                        <span className="rounded bg-green-100 px-2 py-1 text-green-700">
                          {order.paymentStatus}
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1">
                          {order.paymentMethod}
                        </span>
                      </div>

                      {/* Items Section */}
                      {isOpen && (
                        <div className="mt-4 space-y-3 rounded-lg bg-gray-50 p-3">
                          {order.items.map((item) => (
                            <div
                              key={item._id}
                              className="flex items-center gap-4 rounded-md bg-white p-2 shadow-sm"
                            >
                              {/* Product Image */}
                              <img
                                src={item.image}
                                alt={item.title}
                                className="h-14 w-14 rounded object-cover"
                              />

                              {/* Product Info */}
                              <div className="flex-1">
                                <p className="font-medium">{item.title}</p>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>

                              {/* Price */}
                              <div className="text-right text-sm">
                                <p>₹{item.price}</p>
                                <p className="text-gray-500">
                                  Total: ₹
                                  {(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">No orders placed</p>
              )}
            </div>
          </Section>

          {/* Addresses */}
          <Section title="" color="emerald">
            <h3 className="text-lg font-semibold text-indigo-600">
              Saved Addresses
            </h3>
            {user?.addresses?.length ? (
              <div className="space-y-4">
                {user.addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="rounded-xl border bg-gradient-to-br from-indigo-50 to-white p-4 shadow-sm"
                  >
                    <p className="font-medium text-gray-900">{addr.address}</p>

                    <p className="text-sm text-gray-600">
                      {addr.city}, {addr.state} – {addr.zipCode}
                    </p>

                    <p className="text-sm text-gray-600">{addr.country}</p>

                    {addr.landmark && (
                      <p className="text-sm text-gray-500">
                        Landmark: {addr.landmark}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No addresses available</p>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function InfoBox({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl bg-neutral-100 p-3 text-center">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

function Section({
  title,
  color,
  children,
}: {
  title: string;
  color: "indigo" | "emerald";
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className={cn("mb-3 font-semibold", `text-${color}-600`)}>{title}</p>
      {children}
    </div>
  );
}

function Empty({ children }: { children: string }) {
  return <p className="text-sm text-neutral-500 italic">{children}</p>;
}

function StatusBadge({ status }: { status: string }) {
  const map = {
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={cn(
        "inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-medium",
        map[status as keyof typeof map]
      )}
    >
      {status}
    </span>
  );
}
