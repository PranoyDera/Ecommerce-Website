export {};

declare global {
  interface Window {
    Razorpay: new (options: any) => any;
  }
}
