import { useEffect, useRef, useState } from "react";
import { BlogStudent, BlogStudentStatus } from "@/types/blog-student";

const API_BASE = "/api/admin/content/blog-student";

export interface UseBlogStudentsOptions {
  initialData?: BlogStudent[];
  pageSize?: number;
}

export interface UseBlogStudentsReturn {
  items: BlogStudent[];
  loading: boolean;
  error: string;
  refresh: () => void;
  updateStatus: (id: string, status: BlogStudentStatus) => Promise<void>;
  updateItem: (id: string, values: Record<string, unknown>) => Promise<BlogStudent>;
  deleteItem: (id: string) => Promise<void>;
}

export function useBlogStudents({
  initialData,
  pageSize = 100,
}: UseBlogStudentsOptions = {}): UseBlogStudentsReturn {
  const [items, setItems] = useState<BlogStudent[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) {
      setItems(initialData);
      setLoading(false);
      return;
    }
    let cancelled = false;
    const controller = new AbortController();
    fetch(`${API_BASE}?pageSize=${pageSize}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 401 || res.status === 403
              ? "Your session has expired. Please sign in again."
              : `Failed to load student blogs (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setItems(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load student blogs"
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

  const updateStatus = async (id: string, status: BlogStudentStatus) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Update failed (HTTP ${res.status})`);
    }
    const updated = await res.json();
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  const updateItem = async (id: string, values: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Update failed (HTTP ${res.status})`);
    }
    const updated = await res.json();
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated as BlogStudent;
  };

  const deleteItem = async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    items,
    loading,
    error,
    refresh,
    updateStatus,
    updateItem,
    deleteItem,
  };
}