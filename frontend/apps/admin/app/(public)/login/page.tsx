"use client";

import AuthForm from "@/components/Authform";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { apiPost } from "@/app/utils/api";
import { ADMIN } from "@/app/constants/apiUrl";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (form: Record<string, string>) => {
    try {
      setLoading(true);

      const data = await apiPost<{
        token:string;
        message: string;
        admin: any;
      }>(`${ADMIN.LOGIN}`, form);
      if (data.token) sessionStorage.setItem("token", data.token);
      if (data.admin.id) sessionStorage.setItem("adminId", data.admin.id);
      localStorage.setItem("name", data.admin.name);
      localStorage.setItem("email", data.admin.email);
      localStorage.setItem("adminId", data.admin.id);
      localStorage.setItem("gender",data.admin.gender);
      localStorage.setItem("phone",data.admin.phone);
      localStorage.setItem("image",data.admin.imageUrl);

      const token = sessionStorage.getItem("token") || "";

      toast(data.message);
      router.replace("/");
    } catch (err: any) {
      toast(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-black">
       {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-50">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <AuthForm
        title="Login"
        fields={[
          {
            name: "email",
            type: "email",
            label: "Email",
            placeholder: "johndoe@example.com",
          },
          {
            name: "password",
            type: "password",
            label: "Password",
            placeholder: "********",
          },
        ]}
        onSubmit={handleLogin}
        footerText="Don't have an account?"
        footerLink={{ href: "/signup", label: "Create an Account" }}
        submitLabel={loading ? "Logging in..." : "Login"}
        disable={loading}
        className="w-[30%]!"
      />
    </div>
  );
}
