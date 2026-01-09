"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomTable } from "@/components/ui/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

interface ProductList {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
}

export default function BottomContent(){
    const data: ProductList[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 9876543210",
    gender: "Male",
  },
  {
    id: "2",
    name: "Ananya Verma",
    email: "ananya.verma@example.com",
    phone: "+91 9123456780",
    gender: "Female",
  },
  {
    id: "3",
    name: "Amit Patel",
    email: "amit.patel@example.com",
    phone: "+91 9988776655",
    gender: "Male",
  },
  {
    id: "4",
    name: "",
    email: "",
    phone: "",
    gender: "",
  },
];

     const columns: ColumnDef<ProductList>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? value : "N/A";
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? value : "N/A";
      },
    },
    {
      accessorKey: "phone",
      header: "Contact Number",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? value : "N/A";
      },
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? value : "N/A";
      },
    },
  ];
    return(
        <div className="rounded-sm p-4 flex flex-col gap-2">
            <p className="text-xl font-bold">Top Products</p>
            <CustomTable columns={columns} data={data}/>
        </div>
    )
}