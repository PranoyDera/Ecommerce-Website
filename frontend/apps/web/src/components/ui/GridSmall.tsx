import { cn } from "../../lib/utils";
import React from "react";

export function GridSmallBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex w-[95%] mx-auto my-4 items-center justify-center bg-white dark:bg-black rounded-3xl overflow-hidden">
      {/* Grid effect */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />

      {/* Radial fade */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

      {/* Content goes on top */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
