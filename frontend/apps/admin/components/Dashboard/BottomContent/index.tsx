"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomTable } from "@/components/ui/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

interface TopProduct {
  _id: string;
  title: string;
  price: number;
  image: string;
  totalSold: number;
}

interface BottomContentProps {
  topProductsList: TopProduct[];
}

export default function BottomContent({ topProductsList }: BottomContentProps) {
  const data = topProductsList;

  const columns: ColumnDef<TopProduct>[] = [
    {
      id: "rank",
      header: "#",
      cell: ({ row }) => (
        <span className="font-semibold text-gray-600">0{row.index + 1}</span>
      ),
    },
    {
      accessorKey: "title",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.image}
            alt={row.original.title}
            className="w-10 h-10 rounded object-cover"
          />
          <span>{row.original.title}</span>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ getValue }) => `₹${getValue<number>()}`,
    },
    {
      accessorKey: "totalSold",
      header: "Total Sold",
      cell: ({ getValue }) => getValue<number>(),
    },
  ];

  return (
    <div className="rounded-sm flex flex-col">
      <div className="p-4">
        <p className="text-xl font-bold">Top Products</p>
      </div>
      <CustomTable
        columns={columns}
        data={data}
        showSearch={false}
        showColumnToggle={false}
      />
    </div>
  );
}
