"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthForm from "../../components/AuthForm";
import { apiPost } from "../utils/api";

export default function SignupPage() {
  const router = useRouter();

const handleSignup = async (form: Record<string, string>) => {
  try {
    const data = await apiPost<{ message: string }>("/api/auth/register", form);

    // Success toast
    toast.success(data.message || "Signup Successful. Please verify OTP.");

    // Redirect to OTP page with email
    router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
  } catch (err: any) {
    // Show backend error message in toast
    toast.error(err.message || "Error occurred in Signup!");
    console.error("Signup failed:", err);
  }
};
  return (
    <AuthForm
      title="Signup"
      fields={[
        { name: "name", type: "text", label: "Enter Your Name", placeholder: "john doe" },
        { name: "email", type: "email", label: "Enter Your Email", placeholder: "johndoe@example.com" },
        { name: "password", type: "password", label: "Enter a Password", placeholder: "********" },
      ]}
      onSubmit={handleSignup}
      footerText="Already have an account?"
      footerLink={{ href: "/login", label: "Login" }}
      submitLabel="Sign up"
    />
  );
}
