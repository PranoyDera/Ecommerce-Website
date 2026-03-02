import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  onClick?: () => void;
}

export default function StatCard({
  icon,
  title,
  value,
  change,
  changeType = "neutral",
  onClick,
}: StatCardProps) {
  const changeStyles = {
    positive: "bg-green-50 text-green-600 border-green-200",
    negative: "bg-red-50 text-red-600 border-red-200",
    neutral: "bg-gray-50 text-gray-500 border-gray-200",
  }[changeType];

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        `
        group relative w-full rounded-sm p-[1.2px]
        bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500
        transition-all duration-300 hover:-translate-y-1
        `,
        onClick && "cursor-pointer"
      )}
    >
      {/* Inner Card */}
      <div className="rounded-sm bg-white p-5 shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
        <div className="flex flex-col gap-5">
          {/* Icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 transition group-hover:scale-105">
            {icon}
          </div>

          {/* Text */}
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="mt-1 text-3xl font-semibold text-gray-900">{value}</h3>
          </div>

          {/* Change Badge */}
          {change && (
            <div
              className={cn(
                "w-fit rounded-full border px-3 py-1 text-xs font-semibold",
                changeStyles
              )}
            >
              {change}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
