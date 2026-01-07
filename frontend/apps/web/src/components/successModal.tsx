"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  redirectTo?: string; // optional prop
  onAfterClose?: () => void; // callback after close
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = "Order Successful!",
  message = "Thank you for your purchase",
  redirectTo,
  onAfterClose,
}) => {
  const handleClose = () => {
    onClose(); // close modal first
    if (onAfterClose) {
      setTimeout(() => {
        onAfterClose();
      }, 500); // wait for exit animation
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm w-[80%]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Tick */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <CheckCircle className="w-16 h-16 text-green-500" />
            </motion.div>

            {/* Text */}
            <h2 className="text-2xl font-bold text-green-600">{title}</h2>
            <p className="text-gray-500 mt-2">{message}</p>

            {/* Button */}
            <button
              onClick={handleClose}
              className="mt-6 px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
