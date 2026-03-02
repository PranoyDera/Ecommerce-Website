"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Product = {
  _id: string;
  title: string;
  price: number;
  category: string;
  stock: number;
  brand?: string;
  description?: string;
  images?: string[];
  thumbnail?: string;
  rating?: number;
  discountPercentage?: number;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
};

interface ViewProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function ViewProductModal({
  open,
  onClose,
  product,
}: ViewProductModalProps) {
  if (!open || !product) return null;

  const stock = product.stock ?? 0;
  const isLowStock = stock <= 25;

  const stockPercent = Math.min(100, Math.max(0, stock));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-4xl rounded-[4px] bg-white py-6 shadow-lg dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 mb-4 px-6">
          <h2 className="text-xl font-semibold">Product Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
          {/* Left: Images */}
          <div>
            <div className="w-full h-64 border rounded-[4px] overflow-hidden mb-3">
              <img
                src={product.thumbnail || product.images?.[0] || "/placeholder.png"}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>

            {product.images && product.images.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`img-${idx}`}
                    className="w-16 h-16 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold">{product.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="font-semibold">Brand:</span> {product.brand || "—"}</div>
              <div><span className="font-semibold">Category:</span> {product.category}</div>
              <div><span className="font-semibold">Price:</span> ₹{product.price}</div>
              <div><span className="font-semibold">Rating:</span> {product.rating ?? "—"}</div>
              <div><span className="font-semibold">Discount:</span> {product.discountPercentage ?? 0}%</div>
              <div><span className="font-semibold">Source:</span> {product.source ?? "—"}</div>
              <div>
                <span className="font-semibold">Created:</span>{" "}
                {product.createdAt
                  ? new Date(product.createdAt).toLocaleString()
                  : "—"}
              </div>
              <div>
                <span className="font-semibold">Updated:</span>{" "}
                {product.updatedAt
                  ? new Date(product.updatedAt).toLocaleString()
                  : "—"}
              </div>
            </div>

            {/* Stock Bar */}
            <div className="mt-4">
              <div className="flex justify-between mb-1 text-sm">
                <span className="font-semibold">Stock: {stock}</span>
                <span
                  className={cn(
                    "font-medium",
                    isLowStock ? "text-red-600" : "text-green-600"
                  )}
                >
                  {isLowStock ? "Low stock" : "Sufficient stock available"}
                </span>
              </div>

              <div className="w-full h-4 rounded bg-gray-200 overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all",
                    isLowStock ? "bg-red-500" : "bg-green-500"
                  )}
                  style={{ width: `${Math.min(stockPercent, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6 px-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
