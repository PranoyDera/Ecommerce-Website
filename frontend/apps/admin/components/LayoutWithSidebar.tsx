"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Handbag } from "lucide-react";
import Profile from "./Profile";
import { IconLogout } from "@tabler/icons-react";
import ConfirmationModal from "./ui/ConfirmationModal";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

type LinkItem = {
  label: string;
  key: string;
  icon: React.ReactNode;
  href: string;
};

type LayoutWithSidebarProps = {
  links: LinkItem[];
  tabs: Record<string, React.ReactNode>;
  onLogout?: () => void;
  children: React.ReactNode;
};

export function LayoutWithSidebar({
  links,
  tabs,
  onLogout,
  children
}: LayoutWithSidebarProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const adminName = localStorage.getItem("name");
  const image = localStorage.getItem("image");
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex h-screen w-full overflow-hidden border bg-gray-100 dark:bg-neutral-800",
        "md:flex-row flex-col",
      )}
    >
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}

            <div className="mt-8 flex flex-col gap-2">
              {links.map((link) => (
                <SidebarLink
                  key={link.key}
                  link={{
                    ...link,
                    href: link.href,
                    onClick: () => router.push(link.href),
                    active: pathname === link.href,
                  }}
                />
              ))}
              <div className="flex justify-center items-center w-full">
                {onLogout && (
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className={cn(
                      "cursor-pointer flex w-full rounded-lg py-2 pl-1 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20",
                      open ? "justify-start gap-3" : "justify-center",
                    )}
                  >
                    <IconLogout className="h-5 w-5" />
                    {open && (
                      <span className="text-sm font-medium">Logout</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="mb-20 dark:border-neutral-700 overflow-hidden">
            <Link href='/profile'>
            <Profile
              open={open}
              name={adminName}
              imageUrl={image ? image : "/userImage.png"}
              onClick={() => setActiveTab("profile")}
            />
            </Link>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <ConfirmationModal
          open={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={() => {
            setShowLogoutModal(false);
            onLogout?.();
          }}
          title="Logout"
          description="Are you sure you want to logout?"
          confirmText="Logout"
          variant="danger"
        />
        <div className="flex w-full flex-1 flex-col gap-2 border border-neutral-200 bg-white p-2 md:px-4 dark:border-neutral-700 dark:bg-neutral-900">
          {children}
        </div>
      </main>
    </div>
  );
}

export const Logo = () => {
  return (
    <a
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Pro-Cart Admin Panel
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    ></a>
  );
};
