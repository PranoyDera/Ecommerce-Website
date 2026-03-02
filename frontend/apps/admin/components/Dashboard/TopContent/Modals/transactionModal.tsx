"use client";

import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import BaseModal from "./BaseModal";

const data = [
  { name: "Completed", value: 8000 },
  { name: "Pending", value: 3000 },
  { name: "Failed", value: 1467 },
];

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

export default function TransactionsModal({ open, onClose }: any) {
  return (
    <BaseModal open={open} onClose={onClose} title="Transaction Analytics">
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              label
              outerRadius={110}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </BaseModal>
  );
}
