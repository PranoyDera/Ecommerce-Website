import { z } from "zod";

export const shippingFormSchema = z.object({
  name: z.string().min(1, "Name is Required!!!"),
  email: z.string().min(1, "Email is required!!!"),
  phone: z
    .string()
    .min(7, "Phone Number Must be Between 7 to 10 Digits!")
    .max(10, "Phone Number Must be Between 7 to 10 Digits!")
    .regex(/^\d+$/, "Phone Number Must contains only numbers!"),
  address: z.string().min(1, "Address is Required!"),
  city: z.string().min(1, "city is required!"),
  country:z.string()
});

export type ShippingFormInputs = z.infer<typeof shippingFormSchema>;

export const PaymentFormSchema = z.object({
  CardHolder: z.string().min(1, "Name is Required!!!"),
  CardNumber: z
    .string()
    .min(16, "Email is required!!!")
    .max(16, "Email is required!!!"),
  expirationDate: z
    .string()
    .regex(/^\d+$/, "Expiration Date Must be in DD/MM format!"),
  address: z.string().min(1, "Address is Required!"),
  cvv: z.string().min(3, "CVV is required!").max(3, "CVV is required!"),
});

export type PaymentFormInputs = z.infer<typeof PaymentFormSchema>;

export type cartStoreStateType = {
  cart: cartItemTypes;
};

export type cartStoreStateActionType = {
  addToCart: (product: cartItemType) => void;
  removeFromCart: (product: cartItemType) => void;
  clearCart: () => void;
  hasHydrated: boolean;
};

export type ProductType = {
  id: string | number;
  title: string; // DummyJSON uses "title"
  description: string;
  price: number;
  sizes?: string[]; // optional, DummyJSON doesn’t provide this
  colors?: string[]; // optional, DummyJSON doesn’t provide this
  images: string[]; // DummyJSON returns array of image URLs
  thumbnail: string;
  rating: number;
  discountPercentage: number;
  // DummyJSON provides thumbnail
};

export type ProductsType = ProductType[];

export type cartItemType = ProductType & {
  quantity: number;
  selectedColor?: string; // make optional, since not always present
  selectedSize?: string;
};

export type cartItemTypes = cartItemType[];
