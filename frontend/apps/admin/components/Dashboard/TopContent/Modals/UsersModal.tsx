"use client";

import BaseModal from "./BaseModal";

export default function UsersModal({ open, onClose }: any) {
  return (
    <BaseModal open={open} onClose={onClose} title="User Analytics">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded">Total Users: 3</div>
        <div className="p-4 border rounded">New Today: 1</div>
        <div className="p-4 border rounded">Active Users: 2</div>
        <div className="p-4 border rounded">Churn: 0</div>
      </div>
    </BaseModal>
  );
}
