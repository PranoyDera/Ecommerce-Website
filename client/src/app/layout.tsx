import type { Metadata } from "next";
import "./globals.css";

import { Geist, Geist_Mono, Poppins, Roboto } from "next/font/google";
import ClientLayout from "./clientLayout";
import { CheckoutProvider } from "./context/checkoutContext";
import { Toaster } from "sonner";

// Google + Local Fonts with variables
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-roboto",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// SEO / Metadata
export const metadata: Metadata = {
  title: "Pro-Cart",
  description: "Made Shopping Easy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${roboto.variable}`}
    >
      <body className="antialiased">
        <ClientLayout>
          <CheckoutProvider>
            {children}
            <Toaster 
            position="top-center"
            toastOptions={{
              style:{fontSize:"18px",
                justifyContent:"center"
              }
            }}/>
          </CheckoutProvider>
        </ClientLayout>
      </body>
    </html>
  );
}
