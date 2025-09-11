"use client";

import Image from "next/image";
import {
  Settings,
  Package,
  MapPin,
  Lock,
  LogOut,
  ChevronRight,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";
import { apiDelete, apiGet } from "../utils/api";

export default function ProfilePage() {
  const router = useRouter();
 const username =
  typeof window !== "undefined" ? localStorage.getItem("username") : null;

  const email = localStorage.getItem("email");
  const [user, setUser] = useState<any>(null);

  // Confirm modal states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    toast.info("User Signed Out!");
    router.replace("/login");
  };

 const handleDeleteAccount = async () => {
  try {
    const token = sessionStorage.getItem("accessToken") || "";
    const refreshToken = localStorage.getItem("refreshToken");

    // ✅ use apiDelete with body support (we’ll pass body via fetch-like logic)
    const res = await apiDelete<{ message: string }>("/api/auth/delete", token);

    toast.success("Account deleted successfully!");
    localStorage.clear();
    sessionStorage.clear();
    router.replace("/register");
  } catch (err: any) {
    console.error("Error deleting account:", err);
    toast.error(err.message || "Something went wrong!");
  }
};

useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = sessionStorage.getItem("accessToken") || "";
      const data = await apiGet<any>("/api/auth/me", token); // ✅ use apiGet
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  fetchUser();
}, []);

  return (
    <div className="min-h-screen bg-[url('/userpage.jpg')] bg-cover bg-center px-6 py-8 flex flex-col items-center w-[95%] mx-auto my-4 rounded-3xl">
      <div className="mt-6 w-[80vw] max-w-2xl space-y-5 bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-lg">
       <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-gray-700 hover:text-purple-700 transition mb-6"
      >
        <ArrowLeft size={18} /> Back
      </button>
        {/* Profile Section */}
        <div className="flex flex-col items-center">
          <Image
            src={user?.image || "/userImage.png"}
            alt="Profile"
            width={110}
            height={110}
            className="rounded-full border-4 border-white shadow-md object-cover"
          />
          <h2 className="mt-3 font-bold text-xl text-gray-900">{username}</h2>
          <p className="text-gray-600 text-sm">{email}</p>

          <button
            onClick={() => {
              router.push("/Profile/Edit");
            }}
            className="mt-5 bg-black text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-all cursor-pointer shadow-md hover:scale-105 duration-300"
          >
            Edit Profile
          </button>
        </div>

        {/* Menu Options */}
        <div className="space-y-2">
          <ProfileItem
            icon={<Package size={22} />}
            label="My Orders"
            onClick={() => {
              router.push("/Profile/orderList");
            }}
          />
          <ProfileItem
            onClick={() => {
              router.push("/Profile/AddressEdit");
            }}
            icon={<MapPin size={22} />}
            label="Address"
          />
          <ProfileItem
            onClick={() => router.push("/Profile/changePassword")}
            icon={<Lock size={22} />}
            label="Change Password"
          />

          {/* 🔹 Open Confirm Modal for Logout */}
          <ProfileItem
            icon={<LogOut size={22} />}
            label="Log out"
            noArrow
            onClick={() => setIsLogoutOpen(true)}
          />

          {/* 🔹 Delete Account Confirm */}
          <ProfileItem
            onClick={() => setIsDeleteOpen(true)}
            icon={<Trash2 size={22} className="text-red-600" />}
            label="Delete Account"
            noArrow
          />
        </div>
      </div>

      {/* Confirm Modals */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Are you sure?"
        message="On confirming yes your account will be deleted permanently."
      />

      <ConfirmModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
        title="Are you sure?"
        message="you want to log out of this account?"
      />
    </div>
  );
}

interface ItemProps {
  icon: React.ReactNode;
  label: string;
  noArrow?: boolean;
  onClick?: () => void;
}

const ProfileItem: React.FC<ItemProps> = ({
  icon,
  label,
  noArrow,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="group flex items-center justify-between px-5 py-3.5 cursor-pointer 
      rounded-xl hover:bg-black transition-all duration-200 
      hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className="text-gray-600 group-hover:text-white">{icon}</div>
        <span className="font-medium text-gray-800 group-hover:text-white">
          {label}
        </span>
      </div>
      {!noArrow && (
        <ChevronRight
          size={20}
          className="text-gray-400 group-hover:text-white"
        />
      )}
    </div>
  );
};
