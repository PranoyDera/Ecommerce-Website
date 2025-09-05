"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import AuthForm from "../../components/AuthForm";
import { useState } from "react";
import { Button } from "@/components/button";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // get email from query params
  const [loading, setLoading] = useState(false);

  // 🔹 Verify OTP Handler
  const handleVerify = async (form: Record<string, string>) => {
    const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: form.otp }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("✅ OTP Verified! You can now log in.");
      router.push("/login");
    } else {
      toast.error(data.message || "Invalid or expired OTP.");
    }
  };

  // 🔹 Resend OTP Handler
  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not found. Please sign up again.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("📩 New OTP sent to your email.");
      } else {
        toast.error(data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      toast.error("Server error while resending OTP.");
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
        secondaryLabel="Resend Otp"
        onSecondaryClick={() => handleResendOtp()}
        secondaryDisabled={false}
      />
  );
}
