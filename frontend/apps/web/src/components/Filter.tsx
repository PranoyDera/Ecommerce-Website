"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 my-6">
      <span className="">Sort by:</span>
     <Select
        onValueChange={handleFilter}
        value={searchParams.get("sort") || "newest"} // ✅ preserves selected
      >
        <SelectTrigger className="w-[180px] ring-1 bg-white ring-gray-200 shadow-md rounded-md">
          <SelectValue placeholder="Select sorting" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="asc">Price Low to High</SelectItem>
          <SelectItem value="desc">Price High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default Filter;
