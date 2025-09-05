"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const hideLayout = pathname === "/login" || pathname === "/signup" || pathname === "/verify-otp";

useEffect(() => {
  if (pathname === "/login" || pathname === "/signup" || pathname === "/verify-otp") return;

  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    router.replace("/login");
    return;
  }

  // ✅ verify token with backend
  fetch("http://localhost:5000/api/auth/verify", {
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  },
})
  .then((res) => {
    if (res.status === 401) {
      // token expired → try refresh flow
      console.log("Token expired");
      sessionStorage.removeItem("accessToken");
      router.replace("/login");
    } else if (res.status === 403) {
      // invalid token
      console.log("Invalid token");
      sessionStorage.removeItem("accessToken");
      router.replace("/login");
    }
  })
  .catch(() => {
    sessionStorage.removeItem("accessToken");
    router.replace("/login");
  });

}, [pathname, router]);

  return (
    <div>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
      <ToastContainer position="top-center" />
    </div>
  );
}
