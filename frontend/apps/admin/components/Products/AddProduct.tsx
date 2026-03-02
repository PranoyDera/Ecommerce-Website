"use client";

import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { apiPost, apiPut } from "@/app/utils/api";
import { PRODUCT } from "@/app/constants/apiUrl";
import { toast } from "sonner";

type AddProductModalProps = {
  open: boolean;
  onClose: () => void;
  categories: string[];
  editId?: string;
  defaultValues?: any;
  onSuccess: () => void;
};

const EMPTY_FORM = {
  title: "",
  price: "",
  category: "",
  stock: "",
  brand: "",
  description: "",
  discountPercentage:"",
  thumbnail: null as File | null,
  images: [] as File[],
};

export default function AddProductModal({
  open,
  onClose,
  categories,
  editId,
  defaultValues,
  onSuccess,
}: AddProductModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editId && defaultValues) {
      setForm({ ...EMPTY_FORM, ...defaultValues });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editId, defaultValues, open]);

  if (!open) return null;

  /* ---------------- HELPERS ---------------- */

  const update = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addImage = () =>
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));

  const formatPayload = () => {
    const fd = new FormData();

    fd.append("title", form.title.trim());
    fd.append("brand", form.brand.trim());
    fd.append("description", form.description.trim());
    fd.append("discountPercentage",form.discountPercentage.trim());
    fd.append("category", form.category);
    fd.append("price", String(Number(form.price)));
    fd.append("stock", String(Number(form.stock)));
    if (form.thumbnail) {
      fd.append("thumbnail", form.thumbnail);
    }
    form.images.forEach((img) => {
      fd.append("images", img);
    });
    return fd;
  };

  /* ---------------- API HANDLERS ---------------- */

  const handleAddProduct = async () => {
    try {
      setLoading(true);
      const res = await apiPost(`${PRODUCT.CREATE_PRODUCT}`, formatPayload());

      if (res?.success) {
        toast.success(res?.message);
        onSuccess();
      } else {
        toast.error(res?.message);
      }

      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editId) return;

    try {
      setLoading(true);

      const res = await apiPut(
        `${PRODUCT.UPDATE_PRODUCT}/${editId}`,
        formatPayload(),
      );
      if (res?.success) {
        toast.success(res?.message);
        onSuccess();
      } else {
        toast.error(res?.message);
      }

      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (loading) return;
    editId ? handleUpdateProduct() : handleAddProduct();
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[95%] max-w-3xl rounded-[4px] bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-lg font-semibold">
            {editId ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500 hover:text-black cursor-pointer" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Product name"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="rounded-[4px] focus-visible:ring-[1px]! focus:border-none! focus:ring-blue-700!"
            />
            <Input
              placeholder="Brand"
              value={form.brand}
              onChange={(e) => update("brand", e.target.value)}
              className="rounded-[4px] focus-visible:ring-[1px]! focus:border-none! focus:ring-blue-700!"
            />
            <Input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className="rounded-[4px] focus-visible:ring-[1px]! focus:border-none! focus:ring-blue-700!"
            />
            <Input
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => update("stock", e.target.value)}
              className="rounded-[4px] focus-visible:ring-[1px]! focus:border-none! focus:ring-blue-700!"
            />
          </div>

          <div className="flex gap-4">
          <Select
            value={form.category}
            onValueChange={(val) => update("category", val)
            }
          >
            <SelectTrigger className="rounded-[4px] focus-visible:ring-[1px]! focus:border-none! focus:ring-blue-700! w-1/2">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="max-h-60 ml-18 rounded-[4px]"
            >
              <div className="max-h-56 overflow-y-auto p-1">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.replace("-", " ").toUpperCase()}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
          <Input
              type="number"
              placeholder="Discount Percentage"
              value={form.discountPercentage}
              onChange={(e) => update("discountPercentage", e.target.value)}
              className="rounded-[4px] focus-visible:ring-[1px]! focus:border-none! focus:ring-blue-700! w-1/2"
            />
          </div>

          <Textarea
            placeholder="Product description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="rounded-[4px] focus-visible:ring-[1px]! focus:border-none! focus:ring-blue-700!"
          />

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => update("thumbnail", e.target.files?.[0] || null)}
            className="rounded-[4px] focus-visible:ring-[1px]! focus:border-none focus:ring-blue-700!"
          />

          {/* Images */}
          <div className="rounded-[4px] border bg-gray-50 p-4 space-y-3">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = e.target.files ? Array.from(e.target.files) : [];
                update("images", files);
              }}
              className="rounded-[4px] focus-visible:ring-[1px]! focus:border-none! focus:ring-blue-700!"
            />

            {form.images.length > 0 && (
              <div className="text-sm text-gray-600">
                {form.images.length} image(s) selected
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={addImage}
              className="rounded-[4px] focus-visible:ring-[1px]! focus:border-none! focus:ring-blue-700!"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add image
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <Button
            className="bg-red-600 hover:bg-red-700 px-6 rounded-[4px] cursor-pointer"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            className="bg-blue-600 hover:bg-blue-700 px-6 rounded-[4px] cursor-pointer"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {editId ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </div>
    </div>
  );
}
