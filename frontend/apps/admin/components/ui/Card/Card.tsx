// components/StatCard.tsx
import React from "react";
import { cn } from "@/lib/utils"; // optional utility

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

export default function Card({
  icon,
  title,
  value,
  change,
  changeType = "neutral",
}: StatCardProps) {
  const changeColor = {
    positive: "text-green-400",
    negative: "text-red-400",
    neutral: "text-gray-400",
  }[changeType];

  return (
    <div className="rounded-md bg-[#ffffff] p-5 border border-gray-400 w-60">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#151a30] text-white">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <h3 className="text-2xl font-semibold text-black">{value}</h3>
        </div>
      </div>

      {change && (
        <p className={cn("mt-2 text-sm", changeColor)}>
          {change}
        </p>
      )}
    </div>
  );
}
