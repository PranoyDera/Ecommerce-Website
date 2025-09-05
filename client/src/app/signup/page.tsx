"use client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AuthForm from "../../components/AuthForm";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (form: Record<string, string>) => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Signup Successful. Please verify OTP.");
      // Redirect to OTP page with email
      router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
    } else {
      toast.error(data.message || "Error Occurred In Signup!");
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
