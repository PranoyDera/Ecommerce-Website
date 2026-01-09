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

type User = {
  _id: string | null;
  name: string;
  email: string;
  phone: string;
  gender: string;
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
            onClick={() => console.log(row.original)}
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
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const res = await apiGet("/api/admin/users", token || "");
    setUsers(res?.users);
  };

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
      toast.success("User deleted successfully");
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
      <CustomTable data={users} columns={columns} />
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
    </div>
  );
}
