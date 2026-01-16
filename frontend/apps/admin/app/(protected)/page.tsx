"use client";

import Dashboard from "@/components/Dashboard";
import { LayoutWithSidebar } from "@/components/LayoutWithSidebar";
import Profile from "@/components/Profile";
import ProfilePage from "@/components/Profile/ProfilePage";
import Settings from "@/components/Settings";
import UserList from "@/components/UserList";
import { useRouter } from "next/navigation";
import {
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { Package } from "lucide-react";
import Products from "@/components/Products";

export default function Home() {


  const router = useRouter();
  const handleLogout = () => {
  sessionStorage.removeItem("token");
  localStorage.clear();
  router.replace("/login");
};


  return (
    <div>
      <LayoutWithSidebar
        links={[
          {
            label: "Dashboard",
            key: "dashboard",
            icon: <IconBrandTabler className="h-5 w-5" />,
          },
          {
            label: "Userlist",
            key: "Userlist",
            icon: <IconUserBolt className="h-5 w-5" />,
          },
          {
            label: "Products",
            key: "products",
            icon: <Package className="h-5 w-5" />,
          },
        ]}
        tabs={{
          dashboard: <Dashboard />,
          Userlist: <UserList/>,
          products: <Products />,
          profile:<ProfilePage/>
        }}
        onLogout={handleLogout}
      />
    </div>
  );
}
