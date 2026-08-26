import { useEffect, useRef, useState } from "react";
import { Notice } from "@/types/notices";

const API_BASE = "/api/admin/content/notices";

export interface UseNoticesOptions {
  initialData?: Notice[];
  pageSize?: number;
}

export interface UseNoticesReturn {
  notices: Notice[];
  loading: boolean;
  error: string;
  refresh: () => void;
  createNotice: (data: Partial<Notice>) => Promise<Notice>;
  updateNotice: (id: string, data: Partial<Notice>) => Promise<Notice>;
  deleteNotice: (id: string) => Promise<void>;
  restoreNotice: (id: string) => Promise<void>;
  hardDeleteNotice: (id: string) => Promise<void>;
}

export function useNotices({
  initialData,
  pageSize = 50,
}: UseNoticesOptions = {}): UseNoticesReturn {
  const [notices, setNotices] = useState<Notice[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) {
      setNotices(initialData);
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
              : `Failed to load notices (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setNotices(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load notices"
        );
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

  const createNotice = async (data: Partial<Notice>): Promise<Notice> => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Create failed (HTTP ${res.status})`);
    }
    const created = await res.json();
    setNotices((prev) => [created, ...prev]);
    return created;
  };

  const updateNotice = async (
    id: string,
    data: Partial<Notice>
  ): Promise<Notice> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Update failed (HTTP ${res.status})`);
    }
    const updated = await res.json();
    setNotices((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    );
    return updated;
  };

  const deleteNotice = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setNotices((prev) => prev.filter((item) => item.id !== id));
  };

  const restoreNotice = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}?action=restore`, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Restore failed (HTTP ${res.status})`);
    }
  };

  const hardDeleteNotice = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}?action=permanent-delete`, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Permanent delete failed (HTTP ${res.status})`);
    }
  };

  return {
    notices,
    loading,
    error,
    refresh,
    createNotice,
    updateNotice,
    deleteNotice,
    restoreNotice,
    hardDeleteNotice,
  };
}
