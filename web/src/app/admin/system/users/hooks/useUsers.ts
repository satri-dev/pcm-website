/* eslint-disable react-hooks/refs */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { UserEntry } from "../types";

const API_BASE = "/api/admin/system/users";

function extractErrorMessage(err: Record<string, unknown>, fallback: string): string {
  // better-auth returns { message, code }, our routes return { error }
  if (typeof err.message === "string" && err.message) return err.message;
  if (typeof err.error === "string" && err.error) return err.error;
  return fallback;
}

export interface UseUsersOptions {
  initialData?: UserEntry[];
  pageSize?: number;
}

export interface UseUsersReturn {
  users: UserEntry[];
  loading: boolean;
  error: string;
  refresh: () => void;
  createUser: (data: {
    name: string;
    email: string;
    username: string;
    password: string;
    role: string;
  }) => Promise<UserEntry>;
  updateUser: (
    id: string,
    data: Partial<{
      name: string;
      email: string;
      username: string;
      role: string;
      password: string;
    }>
  ) => Promise<UserEntry>;
  banUser: (id: string) => Promise<UserEntry>;
  unbanUser: (id: string) => Promise<UserEntry>;
  deleteUser: (id: string) => Promise<void>;
}

export function useUsers({
  initialData,
  pageSize = 50,
}: UseUsersOptions = {}): UseUsersReturn {
  const [users, setUsers] = useState<UserEntry[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) {
      setUsers(initialData);
      setLoading(false);
      return;
    }
    let cancelled = false;
    const controller = new AbortController();
    fetch(`${API_BASE}?pageSize=${pageSize}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 401
              ? "Your session has expired. Please sign in again."
              : `Failed to load users (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setUsers(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load users");
        setLoading(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [reloadKey.current, initialData, pageSize]);

  const refresh = () => {
    reloadKey.current += 1;
    setLoading(true);
  };

  const createUser = async (data: {
    name: string;
    email: string;
    username: string;
    password: string;
    role: string;
  }): Promise<UserEntry> => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(extractErrorMessage(err, `Create failed (HTTP ${res.status})`));
    }
    const created = await res.json();
    setUsers((prev) => [created, ...prev]);
    return created;
  };

  const updateUser = async (
    id: string,
    data: Partial<{
      name: string;
      email: string;
      username: string;
      role: string;
      password: string;
    }>
  ): Promise<UserEntry> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(extractErrorMessage(err, `Update failed (HTTP ${res.status})`));
    }
    const updated = await res.json();
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    return updated;
  };

  const banUser = async (id: string): Promise<UserEntry> => {
    const res = await fetch(`${API_BASE}/${id}?action=ban`, {
      method: "PATCH",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(extractErrorMessage(err, `Ban failed (HTTP ${res.status})`));
    }
    const updated = await res.json();
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    return updated;
  };

  const unbanUser = async (id: string): Promise<UserEntry> => {
    const res = await fetch(`${API_BASE}/${id}?action=unban`, {
      method: "PATCH",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(extractErrorMessage(err, `Unban failed (HTTP ${res.status})`));
    }
    const updated = await res.json();
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    return updated;
  };

  const deleteUser = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(extractErrorMessage(err, `Delete failed (HTTP ${res.status})`));
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return {
    users,
    loading,
    error,
    refresh,
    createUser,
    updateUser,
    banUser,
    unbanUser,
    deleteUser,
  };
}
