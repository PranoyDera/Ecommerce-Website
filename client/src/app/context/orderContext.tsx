"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiGet } from "../utils/api";

interface Item {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
  image?: string;
}

interface Order {
  _id: string;
  userId: string;
  items: Item[];
  status: string;
  paymentMethod: string;
  paymentStatus:String,
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

interface OrderContextType {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  fetchOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | null>(null);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = useCallback(async () => {
  const userId = localStorage.getItem("userId");
  const token = sessionStorage.getItem("accessToken");

  if (!userId || !token) {
    setOrders([]); // clear orders if user not logged in
    return;
  }

  try {
    const data = await apiGet<Order[]>(`/api/orders/${userId}`, token);
    setOrders(data || []);
  } catch (err: any) {
    console.error("Error fetching orders:", err.message || err);
    setOrders([]); // fallback to empty
  }
}, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <OrderContext.Provider value={{ orders, setOrders, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within an OrderProvider");
  return context;
};
