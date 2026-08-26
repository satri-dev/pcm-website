import { useEffect, useRef, useState } from "react";
import { Scholarship } from "@/types/scholarships";

const API_BASE = "/api/admin/content/scholarships";

export interface UseScholarshipsOptions {
  initialData?: Scholarship[];
  pageSize?: number;
}

export interface UseScholarshipsReturn {
  scholarships: Scholarship[];
  loading: boolean;
  error: string;
  refresh: () => void;
  createScholarship: (data: Partial<Scholarship>) => Promise<Scholarship>;
  updateScholarship: (id: string, data: Partial<Scholarship>) => Promise<Scholarship>;
  deleteScholarship: (id: string) => Promise<void>;
}

export function useScholarships({
  initialData,
  pageSize = 50,
}: UseScholarshipsOptions = {}): UseScholarshipsReturn {
  const [scholarships, setScholarships] = useState<Scholarship[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) {
      setScholarships(initialData);
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
              : `Failed to load scholarships (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setScholarships(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load scholarships");
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

  const createScholarship = async (data: Partial<Scholarship>): Promise<Scholarship> => {
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
    setScholarships((prev) => [created, ...prev]);
    return created;
  };

  const updateScholarship = async (
    id: string,
    data: Partial<Scholarship>
  ): Promise<Scholarship> => {
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
    setScholarships((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const deleteScholarship = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setScholarships((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    scholarships,
    loading,
    error,
    refresh,
    createScholarship,
    updateScholarship,
    deleteScholarship,
  };
}
