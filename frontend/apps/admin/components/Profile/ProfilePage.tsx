"use client";
import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiGet, apiPut } from "@/app/utils/api";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { ADMIN } from "@/app/constants/apiUrl";

export default function AdminProfilePage() {
  const [admin,setAdmin] = useState();
  const adminName = localStorage.getItem("name");
  const gender = localStorage.getItem("gender");
  const email = localStorage.getItem("email");
  const phone = localStorage.getItem("phone");
  const image = localStorage.getItem("image");
  const [form, setForm] = useState({
    name: adminName || "",
    gender: gender || "",
    email: email || "",
    phone: phone || "",
    image: image || "",
  });
 const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const res = await apiPut(
        `${ADMIN.ADMIN_PROFILE}`,
        {
          name: form.name,
          gender: form.gender,
          email: form.email,
          phone: form.phone,
          image: form.image,
        },
        token
      );

      if (res.success) {
        localStorage.setItem("name", res?.admin.name);
        localStorage.setItem("email", res?.admin.email);
        localStorage.setItem("gender", res?.admin.gender);
        localStorage.setItem("phone", res?.admin.phone);
        toast.success(res?.message);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const fetchAdmin = async() =>{
    const token = sessionStorage.getItem('token');
    const res = apiGet(`${ADMIN.ADMIN_PROFILE}`,token?token:'');
    console.log("admin:",res);
  }

  useEffect(()=>{
    fetchAdmin();
  },[])

  return (
    <div className="h-[96vh] bg-[#f4f6fb] w-full">
      {/* Header */}
      <div className="h-40 w-full bg-gradient-to-r from-blue-200 to-orange-100 rounded-b-xl" />

      {/* Profile Card */}
      <div className="-mt-20 mx-auto w-[70%] bg-white rounded-[4px] shadow-sm p-6">
        {/* Top Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                id="avatarUpload"
                hidden
                onChange={handleImageUpload}
              />
              <img
                src={image ? image : "/userImage.png"}
                className="w-20 h-20 rounded-full object-cover shadow"
              />
              <button className="absolute bottom-1 right-1 bg-blue-600 p-1.5 rounded-full cursor-pointer"  onClick={() => document.getElementById("avatarUpload")?.click()}>
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Name */}
            <div>
              <h2 className="text-xl font-semibold">{adminName}</h2>
              <p className="text-gray-500 text-sm">{email}</p>
            </div>
          </div>

          <Button
            onClick={() => {
              updateProfile();
            }}
            className="bg-blue-600 hover:bg-blue-600 text-white px-5 py-2 rounded-[4px] text-sm cursor-pointer"
          >
            Save
          </Button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">Name</p>
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-[4px] focus-visible:ring-[1px]! focus:border-none! focus:ring-blue-700!"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">Gender</p>
            <Select
              value={form.gender}
              onValueChange={(value) => setForm({ ...form, gender: value })}
            >
              <SelectTrigger className="w-full rounded-[4px] focus-visible:ring-[1px]! focus:border-none! focus:ring-blue-700!">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="rounded-[4px]">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Email Section */}
        <div className="mt-10 w-full grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-sm">My email Address</p>
            <Input
              placeholder="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-[4px] focus-visible:ring-[1px]! focus:border-none! focus:ring-blue-700!"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-sm">Phone</p>
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-[4px] focus-visible:ring-[1px]! focus:border-none! focus:ring-blue-700!"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
