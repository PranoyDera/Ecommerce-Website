"use client";

import AddressForm from "../../../components/AddressForm";
import { Pencil, Plus, Trash2, ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";
import { apiDelete, apiGet } from "@/app/utils/api";
import Loader from "@/components/Loader2";

function EditAddress() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const router = useRouter();

  // Fetch user addresses
  const fetchAddresses = async () => {
  const token = sessionStorage.getItem("accessToken");

  try {
    setLoading(true);
    const data = await apiGet<any[]>("/api/users/address", token);
    
    setAddresses(data || []);
    setLoading(false);
    localStorage.setItem("addresses", JSON.stringify(data || []));
  } catch (err) {
    console.error("Error fetching addresses:", err);
    setAddresses([]); // fallback to empty list
  }
};

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (addressId: string) => {
  const token = sessionStorage.getItem("accessToken");
  if (!token) {
    toast.error("User not logged in");
    return;
  }

  try {
    const data = await apiDelete<{ addresses: any[] }>(
      `/api/users/address/${addressId}`,
      token
    );

    setAddresses(data.addresses || []);
    toast.success("Address deleted!");
  } catch (error: any) {
    console.error("Error deleting address:", error);
    toast.error(error.message || "Failed to delete address");
  }
};
 const [loading, setLoading] = useState(true);
    if (loading) {
    return (
      <div className="rounded-3xl h-screen mx-auto my-4 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-[95%] bg-[url('/userpage.jpg')] bg-cover bg-center flex flex-col p-6 mx-auto my-4 rounded-3xl">
      <div className="w-full md:w-[80vw] bg-white/90 mx-auto md:p-8 p-4 rounded-2xl shadow-xl relative">
        {/* Header with back button */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {showAddressForm
              ? editingAddress
                ? "Edit Address"
                : "Add New Address"
              : "Your Saved Addresses"}
          </h2>
        </div>

        {/* Address Form or List */}
        {showAddressForm ? (
          <AddressForm
            existingAddress={editingAddress}
            addressId={editingAddress?._id}
            onAddressAdded={() => {
              fetchAddresses();
              setShowAddressForm(false);
              setEditingAddress(null);
            }}
            onCancel={() => {
              setShowAddressForm(false);
              setEditingAddress(null);
            }}
          />
        ) : addresses.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-600">
            <img
              src="/maps-and-flags.png"
              alt="No addresses"
              className="w-10 opacity-80"
            />
            <p className="text-lg">No addresses saved yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {addresses.map((addr, idx) => (
              <div
                key={addr._id || idx}
                className="p-5 border rounded-xl shadow-sm bg-white hover:shadow-lg transition cursor-default"
              >
                <p className="font-semibold text-gray-800">{addr.address}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {addr.city}, {addr.state}, {addr.country}
                </p>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => {
                      setEditingAddress(addr);
                      setShowAddressForm(true);
                    }}
                    className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-black transition"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAddressId(addr._id);
                      setOpen(true);
                    }}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Button */}
        {!showAddressForm && addresses.length < 3 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => {
                setEditingAddress(null);
                setShowAddressForm(true);
              }}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus size={18} />
              Add New Address
            </button>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          if (selectedAddressId) {
            handleDelete(selectedAddressId);
          }
          setOpen(false);
          setSelectedAddressId(null);
        }}
        title="Are you sure?"
        message="You want to delete this address?"
      />
    </div>
  );
}

export default EditAddress;
