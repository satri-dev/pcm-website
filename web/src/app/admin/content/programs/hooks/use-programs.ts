import { useEffect, useRef, useState } from "react";
import { Program } from "@/types/programs";

const API_BASE = "/api/admin/content/programs";

export interface UseProgramsOptions {
  initialData?: Program[];
  pageSize?: number;
}

export interface UseProgramsReturn {
  programs: Program[];
  loading: boolean;
  error: string;
  refresh: () => void;
  createProgram: (data: Partial<Program>) => Promise<Program>;
  updateProgram: (id: string, data: Partial<Program>) => Promise<Program>;
  deleteProgram: (id: string) => Promise<void>;
}

export function usePrograms({
  initialData,
  pageSize = 50,
}: UseProgramsOptions = {}): UseProgramsReturn {
  const [programs, setPrograms] = useState<Program[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) {
      setPrograms(initialData);
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
              : `Failed to load programs (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setPrograms(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load programs");
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

  const createProgram = async (data: Partial<Program>): Promise<Program> => {
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
    setPrograms((prev) => [created, ...prev]);
    return created;
  };

  const updateProgram = async (
    id: string,
    data: Partial<Program>
  ): Promise<Program> => {
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
    setPrograms((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const deleteProgram = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setPrograms((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    programs,
    loading,
    error,
    refresh,
    createProgram,
    updateProgram,
    deleteProgram,
  };
}
