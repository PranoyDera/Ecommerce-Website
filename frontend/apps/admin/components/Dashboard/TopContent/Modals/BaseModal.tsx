"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";

export default function BaseModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-[900px] max-w-[95%] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-lg cursor-pointer"><X/></button>
        </div>
        {children}
      </div>
    </div>
  );
}
