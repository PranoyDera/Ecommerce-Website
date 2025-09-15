"use client";
export const dynamic = "force-dynamic";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import AuthForm from "../../components/AuthForm";
import { useEffect, useState } from "react";
import { apiPost } from "../utils/api"; 

export default function VerifyOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); 


  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    setEmail(searchParams.get("email"));
  }, []);
  // 🔹 Verify OTP Handler
  const handleVerify = async (form: Record<string, string>): Promise<void> => {
    if (!email) {
      toast.error("Email not found. Please try again.");
      return;
    }

    setLoading(true);
    try {
      await apiPost("/api/auth/verify-otp", { email, otp: form.otp });
      toast.success("OTP Verified! You can now log in.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Resend OTP Handler
  const handleResendOtp = async (): Promise<void> => {
    if (!email) {
      toast.error("Email not found. Please sign up again.");
      return;
    }

    setLoading(true);
    try {
      await apiPost("/api/auth/resend-otp", { email });
      toast.success("New OTP sent to your email.");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Verify OTP"
      fields={[
        {
          name: "otp",
          type: "text",
          label: "Enter OTP",
          placeholder: "6-digit code",
        },
      ]}
      onSubmit={handleVerify}
      submitLabel="Verify"
      secondaryLabel="Resend OTP"
      onSecondaryClick={handleResendOtp}
      secondaryDisabled={loading}
    />
  );
}
