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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";

export default function ProfilePage() {
  const router = useRouter();
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const [user, setUser] = useState<any>(null);

  // Confirm modal states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    toast.info("User Signed Out!");
    router.replace("/login");
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          refreshToken: localStorage.getItem("refreshToken"),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account deleted successfully!");
        localStorage.clear();
        sessionStorage.clear();
        router.replace("/register");
      } else {
        toast.error(data.message || "Failed to delete account");
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-[url('/userpage.jpg')] bg-cover bg-center px-6 py-8 flex flex-col items-center w-[95%] mx-auto my-4 rounded-3xl">
      <div className="mt-6 w-[80vw] max-w-2xl space-y-5 bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-lg">
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
