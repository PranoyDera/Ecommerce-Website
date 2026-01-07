"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ToastContainer } from "react-toastify";
import { apiGet } from "../utils/api";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const hideLayout =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/verify-otp";

  useEffect(() => {
    if (hideLayout) return;

    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      router.replace("/login");
      return;
    }

    // ✅ verify token with backend
    const verifyToken = async () => {
      try {
        const data = await apiGet("/api/auth/verify", token);
      } catch (error: any) {
        if (error.message.includes("401")) {
        } else if (error.message.includes("403")) {
        } else {
          console.log("Verification failed:", error.message);
        }

        sessionStorage.removeItem("accessToken");
        router.replace("/login");
      }
    };

    verifyToken(); // ✅ call it
  }, [pathname, router, hideLayout]);

  return (
    <div>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
      <ToastContainer position="top-center" />
    </div>
  );
}
