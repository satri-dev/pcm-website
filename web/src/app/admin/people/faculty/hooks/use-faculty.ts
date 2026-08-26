import { useEffect, useRef, useState } from "react";
import { Faculty } from "@/types/faculty";

const API_BASE = "/api/admin/people/faculty";

export interface UseFacultyOptions {
  initialData?: Faculty[];
  pageSize?: number;
}

export interface UseFacultyReturn {
  faculty: Faculty[];
  loading: boolean;
  error: string;
  refresh: () => void;
  createFaculty: (data: Partial<Faculty>) => Promise<Faculty>;
  updateFaculty: (id: string, data: Partial<Faculty>) => Promise<Faculty>;
  deleteFaculty: (id: string) => Promise<void>;
}

export function useFaculty({
  initialData,
  pageSize = 50,
}: UseFacultyOptions = {}): UseFacultyReturn {
  const [faculty, setFaculty] = useState<Faculty[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) {
      setFaculty(initialData);
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
              : `Failed to load faculty (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setFaculty(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load faculty"
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

  const createFaculty = async (data: Partial<Faculty>): Promise<Faculty> => {
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
    setFaculty((prev) => [...prev, created]);
    return created;
  };

  const updateFaculty = async (
    id: string,
    data: Partial<Faculty>
  ): Promise<Faculty> => {
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
    setFaculty((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const deleteFaculty = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setFaculty((prev) => prev.filter((item) => item.id !== id));
  };

  return { faculty, loading, error, refresh, createFaculty, updateFaculty, deleteFaculty };
}
