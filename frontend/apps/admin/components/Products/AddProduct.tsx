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
  thumbnail: "",
  images: [""],
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

  const updateImage = (index: number, value: string) => {
    setForm((prev) => {
      const images = [...prev.images];
      images[index] = value;
      return { ...prev, images };
    });
  };

  const addImage = () =>
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));

  const removeImage = (index: number) =>
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

  const formatPayload = () => ({
    title: form.title.trim(),
    brand: form.brand.trim(),
    description: form.description.trim(),
    category: form.category,
    price: Number(form.price),
    stock: Number(form.stock),
    thumbnail: form.thumbnail,
    images: form.images.filter(Boolean),
  });

  /* ---------------- API HANDLERS ---------------- */

  const handleAddProduct = async () => {
    try {
      setLoading(true);
      const res = await apiPost(`${PRODUCT.CREATE_PRODUCT}`,formatPayload());

      if(res?.success){
        toast.success(res?.message);
        onSuccess();
      }
      else{
        toast.error(res?.message);
      }

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editId) return;

    try {
      setLoading(true);

      const res = await apiPut(`${PRODUCT.UPDATE_PRODUCT}/${editId}`,formatPayload())
      if(res?.success){
        toast.success(res?.message);
        onSuccess();
      }
      else{
        toast.error(res?.message);
      }

      onClose();
    } catch (error) {
      console.error(error);
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
      <div className="w-[95%] max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-lg font-semibold">
            {editId ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Product name"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
            />
            <Input
              placeholder="Brand"
              value={form.brand}
              onChange={(e) => update("brand", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => update("stock", e.target.value)}
            />
          </div>

          <Select
            value={form.category}
            onValueChange={(val) => update("category", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-56">
              <div className="max-h-56 overflow-y-auto p-1">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.replace("-", " ").toUpperCase()}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Product description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />

          <Input
            placeholder="Thumbnail Image URL"
            value={form.thumbnail}
            onChange={(e) => update("thumbnail", e.target.value)}
          />

          {/* Images */}
          <div className="rounded-lg border bg-gray-50 p-4 space-y-3">
            {form.images.map((img, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={img}
                  placeholder={`Image ${i + 1}`}
                  onChange={(e) => updateImage(i, e.target.value)}
                />
                {form.images.length > 1 && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeImage(i)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}

            <Button variant="outline" size="sm" onClick={addImage}>
              <Plus className="w-4 h-4 mr-2" />
              Add image
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <Button
            className="bg-red-500 hover:bg-red-700 px-6"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            className="bg-blue-600 hover:bg-blue-700 px-6"
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
