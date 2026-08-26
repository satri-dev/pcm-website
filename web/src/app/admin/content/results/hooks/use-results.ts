import { useEffect, useRef, useState } from "react";
import { Result } from "@/types/results";

const API_BASE = "/api/admin/content/results";

export interface UseResultsOptions {
  initialData?: Result[];
  pageSize?: number;
}

export interface UseResultsReturn {
  results: Result[];
  loading: boolean;
  error: string;
  refresh: () => void;
  createResult: (data: Partial<Result>) => Promise<Result>;
  updateResult: (id: string, data: Partial<Result>) => Promise<Result>;
  deleteResult: (id: string) => Promise<void>;
  restoreResult: (id: string) => Promise<void>;
  hardDeleteResult: (id: string) => Promise<void>;
}

export function useResults({
  initialData,
  pageSize = 50,
}: UseResultsOptions = {}): UseResultsReturn {
  const [results, setResults] = useState<Result[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) {
      setResults(initialData);
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
              : `Failed to load results (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setResults(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load results"
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

  const createResult = async (data: Partial<Result>): Promise<Result> => {
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
    setResults((prev) => [created, ...prev]);
    return created;
  };

  const updateResult = async (
    id: string,
    data: Partial<Result>
  ): Promise<Result> => {
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
    setResults((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    );
    return updated;
  };

  const deleteResult = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setResults((prev) => prev.filter((item) => item.id !== id));
  };

  const restoreResult = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}?action=restore`, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Restore failed (HTTP ${res.status})`);
    }
  };

  const hardDeleteResult = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}?action=permanent-delete`, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Permanent delete failed (HTTP ${res.status})`);
    }
  };

  return {
    results,
    loading,
    error,
    refresh,
    createResult,
    updateResult,
    deleteResult,
    restoreResult,
    hardDeleteResult,
  };
}
