import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./context/ClientLayout";
import { CheckoutProvider } from "./context/checkoutContext";
import { Toaster } from "sonner";
import { OrderProvider } from "./context/orderContext";
import { CartProvider } from "./context/cartContext";

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
    >
      <body className="antialiased">
        <OrderProvider>
          <CartProvider>
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
        </CartProvider>
        </OrderProvider>
      </body>
    </html>
  );
}
