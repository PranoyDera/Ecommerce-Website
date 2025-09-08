"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthForm from "../../components/AuthForm";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);

  const handleLogin = async (form: Record<string, string>) => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      if (data.accessToken) sessionStorage.setItem("accessToken", data.accessToken);
      if (data.refreshToken) sessionStorage.setItem("refreshToken", data.refreshToken);
      if (data.id) sessionStorage.setItem("userId", data.id);

      const decoded = JSON.parse(atob(data.accessToken.split(".")[1]));
      console.log(decoded.username, decoded.email, decoded.id);

      localStorage.setItem("username", decoded.username);
      localStorage.setItem("email", decoded.email);
      localStorage.setItem("userId", decoded.id);

      // ✅ Fetch addresses after login
      const fetchAddresses = async () => {
        const token = sessionStorage.getItem("accessToken");
        try {
          const res = await fetch(`http://localhost:5000/api/users/address`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();

          setAddresses(data || []);

          // ✅ Save in localStorage
          localStorage.setItem("addresses", JSON.stringify(data || []));
        } catch (err) {
          console.error("Error fetching addresses:", err);
        }
      };

      await fetchAddresses();

      toast(data.message);
      router.replace("/");
    } else {
      toast(data.message);
    }
  };

  return (
    <AuthForm
      title="Login"
      fields={[
        { name: "email", type: "email", label: "Email", placeholder: "johndoe@example.com" },
        { name: "password", type: "password", label: "Password", placeholder: "********" },
      ]}
      onSubmit={handleLogin}
      footerText="Don't have an account?"
      footerLink={{ href: "/signup", label: "Create an Account" }}
      submitLabel="Login"
    />
  );
}
