"use client";

import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Lock, X } from "lucide-react";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";


export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "Failed to update password");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="shadow-input w-full max-w-md rounded-none bg-white p-0 md:rounded-2xl md:p-2 dark:bg-black">
        <div className="flex w-full items-center justify-end">
        <button type="button" onClick={() => router.back()} className="flex items-center justify-center text-gray-600 hover:text-black transition cursor-pointer" > 
            <X size={20} className="mr-1" /> 
            </button>
        </div>
        <div className="w-full p-6">
      <h2 className="mb-6 flex items-center justify-center gap-2 text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Change Password
      </h2>

      <form onSubmit={handleSubmit} className="my-8 space-y-6">
        <LabelInputContainer>
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            type={showPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            required
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </LabelInputContainer>

        <button
          type="submit"
          disabled={loading}
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] hover:opacity-90 transition disabled:opacity-50 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
        >
          {loading ? "Updating..." : "Update Password"}
          <BottomGradient />
        </button>
      </form>
      </div>
    </div>
  );
}

// --- Extra Components ---
const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
);
