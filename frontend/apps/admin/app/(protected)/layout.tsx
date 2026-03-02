"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutWithSidebar } from "@/components/LayoutWithSidebar";
import {
  IconBrandTabler,
  IconUserBolt,
} from "@tabler/icons-react";
import { Package } from "lucide-react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    localStorage.clear();
    router.replace("/login");
  };

  return (
    <LayoutWithSidebar
      links={[
        {
          label: "Dashboard",
          key: "dashboard",
          icon: <IconBrandTabler className="h-5 w-5" />,
          href: "/dashboard",
        },
        {
          label: "Userlist",
          key: "userlist",
          icon: <IconUserBolt className="h-5 w-5" />,
          href: "/user-list",
        },
        {
          label: "Products",
          key: "products",
          icon: <Package className="h-5 w-5" />,
          href: "/products",
        },
      ]}
      onLogout={handleLogout}
    >
      {children}
    </LayoutWithSidebar>
  );
}