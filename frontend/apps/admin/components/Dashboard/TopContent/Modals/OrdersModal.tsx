"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import BaseModal from "./BaseModal";

const data = [
  { day: "Mon", orders: 3 },
  { day: "Tue", orders: 2 },
  { day: "Wed", orders: 4 },
  { day: "Thu", orders: 1 },
  { day: "Fri", orders: 4 },
];

export default function OrdersModal({ open, onClose }: any) {
  return (
    <BaseModal open={open} onClose={onClose} title="Orders Analytics">
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </BaseModal>
  );
}
