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
      toast.success("Signup Successful");
      router.push("/login");
    } else {
      toast.error("Error Occurred In Signup!");
    }
  };

  return (
    <AuthForm
      title="Signup"
      fields={[
        { name: "name", type: "text", label: "Enter Your Name", placeholder: "john doe" },
        { name: "email", type: "email", label: "Enter Your Email", placeholder: "johndoe@example.com" },
        { name: "password", type: "password", label: "Enter a Password", placeholder: "********" },
        { name: "phone", type: "text", label: "Enter Your Phone Number", placeholder: "+91-XXXXX-XXXXX" },
      ]}
      onSubmit={handleSignup}
      footerText="Already have an account?"
      footerLink={{ href: "/login", label: "Login" }}
      submitLabel="Sign up"
    />
  );
}
