"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthForm from "../../components/AuthForm";
import { useState } from "react";
import { apiGet, apiPost } from "../utils/api";

export default function LoginPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);

 const handleLogin = async (form: Record<string, string>) => {
  try {
    const data = await apiPost<{
      accessToken: string;
      refreshToken: string;
      id: string;
      message: string;
    }>("/api/auth/login", form);

    
    if (data.accessToken) sessionStorage.setItem("accessToken", data.accessToken);
    if (data.refreshToken) sessionStorage.setItem("refreshToken", data.refreshToken);
    if (data.id) sessionStorage.setItem("userId", data.id);

    
    const decoded = JSON.parse(atob(data.accessToken.split(".")[1])) as {
      username: string;
      email: string;
      id: string;
    };

    localStorage.setItem("username", decoded.username);
    localStorage.setItem("email", decoded.email);
    localStorage.setItem("userId", decoded.id);

  
    const token = sessionStorage.getItem("accessToken") || "";
    const addresses = await apiGet<any[]>("/api/users/address", token);

    setAddresses(addresses || []);
    localStorage.setItem("addresses", JSON.stringify(addresses || []));

    toast(data.message);
    router.replace("/");
  } catch (err: any) {
    console.error("Login failed:", err);
    toast(err.message || "Login failed");
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
