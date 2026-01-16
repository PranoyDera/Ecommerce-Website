"use client";

import { useState, useCallback } from "react";
import { apiGet } from "@/app/utils/api";
import { toast } from "sonner";
import { User } from "@/components/UserList"; // adjust path
import { ADMIN } from "@/app/constants/apiUrl";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await apiGet(`${ADMIN.GET_USERS}`, token || "");
      setUsers(res?.users || []);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    fetchUsers,
    setUsers, // optional (useful)
  };
};
