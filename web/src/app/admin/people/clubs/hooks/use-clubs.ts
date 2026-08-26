import { useEffect, useRef, useState } from "react";
import { Club } from "@/types/clubs";

const API_BASE = "/api/admin/people/clubs";

export interface UseClubsOptions {
  initialData?: Club[];
  pageSize?: number;
}

export interface UseClubsReturn {
  clubs: Club[];
  loading: boolean;
  error: string;
  refresh: () => void;
  createClub: (data: Partial<Club>) => Promise<Club>;
  updateClub: (id: string, data: Partial<Club>) => Promise<Club>;
  deleteClub: (id: string) => Promise<void>;
}

export function useClubs({
  initialData,
  pageSize = 50,
}: UseClubsOptions = {}): UseClubsReturn {
  const [clubs, setClubs] = useState<Club[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) {
      setClubs(initialData);
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
              : `Failed to load clubs (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setClubs(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load clubs"
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

  const createClub = async (data: Partial<Club>): Promise<Club> => {
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
    setClubs((prev) => [...prev, created]);
    return created;
  };

  const updateClub = async (
    id: string,
    data: Partial<Club>
  ): Promise<Club> => {
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
    setClubs((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const deleteClub = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setClubs((prev) => prev.filter((item) => item.id !== id));
  };

  return { clubs, loading, error, refresh, createClub, updateClub, deleteClub };
}
