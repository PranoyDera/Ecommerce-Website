"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;

  title?: string;
  description?: string;

  confirmText?: string;
  cancelText?: string;

  loading?: boolean;
  variant?: "danger" | "warning" | "info" | "success";
}

const variantStyles = {
  danger: {
    button: "bg-red-600 hover:bg-red-700",
    ring: "ring-red-100",
  },
  warning: {
    button: "bg-yellow-500 hover:bg-yellow-600",
    ring: "ring-yellow-100",
  },
  info: {
    button: "bg-blue-600 hover:bg-blue-700",
    ring: "ring-blue-100",
  },
  success: {
    button: "bg-green-600 hover:bg-green-700",
    ring: "ring-green-100",
  },
};

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  variant = "danger",
}: ConfirmationModalProps) {
  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div
              className={cn(
                "w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1",
                styles.ring
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {title}
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                {description}
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  {cancelText}
                </button>

                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50",
                    styles.button
                  )}
                >
                  {loading ? "Please wait..." : confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
