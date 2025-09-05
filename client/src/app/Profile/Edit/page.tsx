"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader2";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/DatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/stateful-button";

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    birthday: "",
    phone: "",
    email: "",
    username: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setFormData({
            fullName: data.name || "",
            gender: data.gender || "",
            birthday: data.DateOfBirth
              ? new Date(data.DateOfBirth).toISOString().split("T")[0]
              : "",
            phone: data.phone || "",
            email: data.email || "",
            username: data.username || "",
            image: data.image || "",
          });
        } else {
          console.error("Failed to fetch user:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Input handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Save API
  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/update", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          name: formData.fullName,
          gender: formData.gender,
          DateOfBirth: formData.birthday,
          phone: formData.phone,
          email: formData.email,
          username: formData.username,
          image: formData.image,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading)
    return (
      <div className="h-screen w-[95%] mx-auto rounded-3xl bg-white my-4 items-center justify-center flex">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen bg-[url('/userpage.jpg')] bg-cover bg-center flex items-center justify-center p-6 w-[95%] mx-auto rounded-3xl my-4">
      <div className="bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-2xl border border-white/40">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700 hover:text-black transition mb-6"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>

        <h1 className="text-2xl font-bold text-center mb-8 text-gray-900 tracking-wide">
          Edit Profile
        </h1>

        {/* Profile Image */}
        <div className="flex flex-col items-center relative">
          <div className="relative group">
            <Image
              src={formData.image || "/userImage.png"}
              alt="Profile"
              width={110}
              height={110}
              className="rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
            />
            <input
              type="file"
              id="profileUpload"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="profileUpload"
              className="absolute bottom-2 right-2 bg-black text-white p-2 rounded-full cursor-pointer hover:bg-gray-800 h-8 w-8 flex items-center justify-center shadow-md"
            >
              <Camera size={16} />
            </label>
          </div>
          <h2 className="mt-3 font-semibold text-lg">{formData.fullName}</h2>
          <p className="text-gray-500 text-sm">{formData.username}</p>
        </div>

        {/* Form */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label className="block text-sm text-gray-700 font-medium mb-1">
              Full Name
            </Label>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 bg-white/80 shadow-sm focus:outline-none focus:ring-1 focus:ring-white transition"
            />
          </div>
          <div>
            <Label className="block text-sm text-gray-700 font-medium mb-1">
              Birthday
            </Label>
            <DatePicker
              value={formData.birthday}
              onChange={(date: string) =>
                setFormData({ ...formData, birthday: date })
              }
              className="bg-white/80 h-[40px] mt-[3px] w-full focus:ring-[2px] focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div>
            <Label className="block text-sm text-gray-700 font-medium mb-1">
              Gender
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) =>
                setFormData({ ...formData, gender: value })
              }
            >
              <SelectTrigger className="w-full bg-white/80 shadow-sm transition border-0 border-white focus:ring-[1.5px] focus:ring-blue-500 h-[39px] mt-[6px]">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-white focus:ring-white">
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="block text-sm text-gray-700 font-medium mb-1">
              Phone
            </Label>
            <Input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 bg-white/80 shadow-sm focus:outline-none transition"
            />
          </div>
          <div className="md:col-span-2">
            <Label className="block text-sm text-gray-700 font-medium mb-1">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={handleSave}
            className="bg-black text-white px-8 py-2 rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-md hover:scale-105 cursor-pointer text-sm w-full"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
