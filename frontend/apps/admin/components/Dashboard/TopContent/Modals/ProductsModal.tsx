"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import BaseModal from "./BaseModal";

const data = [
  { day: "Mon", sold: 10 },
  { day: "Tue", sold: 15 },
  { day: "Wed", sold: 12 },
  { day: "Thu", sold: 20 },
  { day: "Fri", sold: 33 },
];

export default function ProductsModal({ open, onClose }: any) {
  return (
    <BaseModal open={open} onClose={onClose} title="Products Sold Analytics">
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line dataKey="sold" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </BaseModal>
  );
}
