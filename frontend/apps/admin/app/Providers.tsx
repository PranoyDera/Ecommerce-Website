"use client";

import dynamic from "next/dynamic";

const Toaster = dynamic(
  () => import("sonner").then((m) => m.Toaster),
  { ssr: false }
);

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: { fontSize: "18px", justifyContent: "center" },
          }}
        />
        </>
  );
}
