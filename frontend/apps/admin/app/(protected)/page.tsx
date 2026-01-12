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
            label: "Settings",
            key: "settings",
            icon: <IconSettings className="h-5 w-5" />,
          },
        ]}
        tabs={{
          dashboard: <Dashboard />,
          Userlist: <UserList/>,
          settings: <Settings />,
          profile:<ProfilePage/>
        }}
        onLogout={handleLogout}
      />
    </div>
  );
}
