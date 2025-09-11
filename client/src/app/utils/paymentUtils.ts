import { toast } from "sonner";
import { apiPost } from "./api";

export const openRazorpayCheckout = async (
  amount: number,
  onSuccess: () => void,
  onFailure?: () => void
) => {
  try {
    // 1️⃣ Dynamically load Razorpay script
    const res = await new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

    if (!res) {
      toast("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // 2️⃣ Create order on backend
    const orderData = await apiPost<any>("/api/payment/create-order", { amount });

    // 3️⃣ Razorpay options
    const options = {
      key: "rzp_test_REyrSmk6GoayoM", // Replace with your key
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Pro-Cart",
      description: "Procart Transaction",
      order_id: orderData.id,
      handler: async (response: any) => {
        // Verify payment
        try {
          const verifyData = await apiPost<any>("/api/payment/verify-payment", {
            razorpay_payment_id: response.razorpay_payment_id,
          });

          if (verifyData.success) {
            onSuccess();
          } else {
            if (onFailure) onFailure();
          }
        } catch (err) {
          console.error(err);
          if (onFailure) onFailure();
        }
      },
      theme: { color: "#3399cc" },
    };

    // 4️⃣ Open Razorpay popup
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (err) {
    console.error(err);
    if (onFailure) onFailure();
  }
};
