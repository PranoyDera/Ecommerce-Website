"use client";

import { API_BASE, PRODUCT } from "@/app/constants/apiUrl";
import { apiDelete, apiGet, apiPost } from "@/app/utils/api";
import { useEffect, useState } from "react";
import { CustomTable } from "../ui/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, Delete, Edit, Eye, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import AddProductModal from "./AddProduct";
import { toast } from "sonner";
import ConfirmationModal from "../ui/ConfirmationModal";

type ProductRow = {
  _id: string;
  title: string;
  price: number;
  category: string;
  stock: number;
  brand?: string;
};

export default function Products() {
  const [selectedRows, setSelectedRows] = useState<ProductRow[]>([]);
  const columns: ColumnDef<ProductRow>[] = [
    {
      id: "select",
      size: 50,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
    },
    {
      accessorKey: "title",
      header: "Product Name",
      size: 220, // 👈 restrict width
      cell: ({ getValue }) => (
        <div className="truncate  max-w-[200px]">
          {getValue<string>() || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "thumbnail",
      header: "Thumbnail",
      size: 90,
      cell: ({ row }) => {
        const src =
          row.original.thumbnail ||
          row.original.images?.[0] ||
          "/placeholder.png";

        return (
          <div className="w-14 h-14 rounded-md overflow-hidden border">
            <img
              src={src}
              alt={row.original.title}
              className="w-full h-full object-cover"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      size: 50,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ getValue }) => `₹${getValue<number>()}`,
    },
    {
      accessorKey: "category",
      size: 150,
      header: "Category",
    },
    {
      accessorKey: "stock",
      size: 80,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "brand",
      size: 140,
      header: "Brand",
    },
    {
      id: "actions",
      size: 100,
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button className="text-blue-600 cursor-pointer">
            <Eye className="w-5 h-5" />
          </button>
          <button
            className="text-red-600 cursor-pointer"
            onClick={() => {
              setDeleteId(row.original._id);
              setIsConfirmOpen(true);
            }}
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            className="text-green-600 cursor-pointer"
            onClick={() => handleEdit(row.original)}
          >
            <Edit className="w-5 h-5" />
          </button>{" "}
        </div>
      ),
    },
  ];

  const [data, setData] = useState<ProductRow[]>([]);
  const [viewUser, setViewUser] = useState<any | null>();
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [editId, setEditid] = useState<string>();
  const [deleteId, setDeleteId] = useState<string>();
  const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(
    null
  );

  const fetchProducts = async () => {
    const token = sessionStorage.getItem("token");
    const response = await apiGet(
      `${API_BASE.PRODUCT}?limit=1000`,
      token || undefined
    );
    console.log("Response:", response);
    setData(response?.products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetch("https://dummyjson.com/products/category-list")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleEdit = (product: ProductRow) => {
    setEditid(product._id);
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    const res = await apiDelete(
      `${PRODUCT.DELETE_PRODUCT}/${deleteId ? deleteId : ""}`
    );
    if (res?.success) {
      toast.success(res?.message);
      setIsConfirmOpen(false);
      fetchProducts();
      setLoading(false);
    } else {
      toast.error(res?.message);
      setIsConfirmOpen(false);
      setLoading(false);
    }
  };

  const handleBulkDelete = async() => {
      const ids = selectedRows.map(row => row._id);
      const res = await apiPost(`${PRODUCT.BULK_DELETE}`,{ids});
      if(res?.success){
        toast.success("Items Deleted");
        fetchProducts();
      }
      else{
        toast.error("delete failed");
      }
  }

  return (
    <div className="min-h-[96vh] px-4">
      <AddProductModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditid(undefined);
          setSelectedProduct(null);
        }}
        categories={categories}
        editId={editId}
        defaultValues={selectedProduct}
        onSuccess={fetchProducts}
      />
      <ConfirmationModal
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete User"
        description="Are you sure you want to delete this product?"
        confirmText="Delete"
        variant="danger"
        loading={loading}
      />
      <div className="flex flex-col">
        <div>
          <p className="text-xl font-bold">Product Management:</p>
        </div>
        <div className="flex justify-end">
          <Button
            hidden={selectedRows.length === 0}
            onClick={handleBulkDelete}
            className="p-4 bg-red-700 hover:bg-red-700 rounded-[4px] cursor-pointer relative top-9 right-4"
          >
            Delete Selected ({selectedRows.length})
          </Button>
          <Button
            className="p-4 bg-blue-700 hover:bg-blue-700 rounded-[4px] cursor-pointer relative top-9 right-2"
            onClick={() => {
              setEditid(undefined);
              setSelectedProduct(null);
              setOpen(true);
            }}
          >
            Add product <Plus />
          </Button>
        </div>
        <div>
          <CustomTable
            showColumnToggle={false}
            searchColumn="title"
            data={data}
            columns={columns}
            pageSize={5}
            onRowSelectionChange={(rows) => setSelectedRows(rows)}
          />
        </div>
      </div>
    </div>
  );
}
