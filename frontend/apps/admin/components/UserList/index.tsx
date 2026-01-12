"use client";

import { apiDelete, apiGet } from "@/app/utils/api";
import { useEffect, useRef, useState } from "react";
import { CustomTable } from "../ui/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import ConfirmationModal from "../ui/ConfirmationModal";
import { Spinner } from "@/components/ui/spinner";
import UserDetailModal from "../ui/Card/UserDetailCard";
import { useUsers } from "@/hooks/useUsers";


type OrderItem = {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
};

type Order = {
  _id: string;
  totalAmount: number;
  paymentStatus: "Pending" | "Paid" | "shipped" | "delivered";
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
};

type Address = {
  _id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  landmark?: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  image?: string;
  addresses: Address[];
  orders: Order[];
  totalOrders: number;
  totalOrderAmount: number;
  DateOfBirth: string;
};

export default function UserList() {
  const columns: ColumnDef<User>[] = [
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-6">
          <button
            onClick={() => {
              setViewUser(row.original);
              setViewOpen(true);
            }}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            View
          </button>

          <button
            onClick={() => {
              setSelectedUserId(row.original._id);
              setOpen(true);
            }}
            className="text-red-600 hover:underline cursor-pointer"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
  const hasFetched = useRef(false);
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewUser, setViewUser] = useState<any | null>();
  const [viewOpen, setViewOpen] = useState(false);
  const { users, loading: pageLoading, fetchUsers } = useUsers();

  const handleConfirmDelete = async () => {
    if (!selectedUserId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await apiDelete(
        `/api/admin/delete/${selectedUserId}`,
        token || ""
      );

      if (res) {
        toast.success(res.message);
        fetchUsers();
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
      setOpen(false);
      setSelectedUserId(null);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchUsers();
  }, []);

  return (
    <div className="bg-neutral-200 rounded-md p-4 gap-4 flex flex-col">
      <p className="text-xl font-bold">User list</p>
      {pageLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="size-6 text-blue-500" />
        </div>
      ) : (
        <CustomTable data={users} columns={columns} />
      )}
      <ConfirmationModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={loading}
      />
      <UserDetailModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        user={viewUser}
      />
    </div>
  );
}
