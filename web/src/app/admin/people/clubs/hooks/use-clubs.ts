import { useEffect, useRef, useState } from "react";
import { Club } from "@/types/clubs";

const API_BASE = "/api/admin/people/clubs";

export interface UseClubsOptions { initialData?: Club[]; pageSize?: number; }
export interface UseClubsReturn {
  clubs: Club[]; loading: boolean; error: string; refresh: () => void;
  createClub: (data: Partial<Club>) => Promise<Club>;
  updateClub: (id: string, data: Partial<Club>) => Promise<Club>;
  deleteClub: (id: string) => Promise<void>;
}

export function useClubs({ initialData, pageSize = 50 }: UseClubsOptions = {}): UseClubsReturn {
  const [clubs, setClubs] = useState<Club[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) { setClubs(initialData); setLoading(false); return; }
    let cancelled = false; const controller = new AbortController();
    fetch(`${API_BASE}?pageSize=${pageSize}`, { signal: controller.signal })
      .then(async (res) => { if (!res.ok) throw new Error(res.status === 401 ? "Session expired." : `Failed (HTTP ${res.status})`); return res.json(); })
      .then((data) => { if (cancelled) return; setClubs(data.items ?? []); setError(""); setLoading(false); })
      .catch((err) => { if (cancelled) return; setError(err instanceof Error ? err.message : "Failed"); setLoading(false); });
    return () => { cancelled = true; controller.abort(); };
  }, [reloadKey.current, initialData, pageSize]);

  const refresh = () => { reloadKey.current += 1; setLoading(true); };
  const createClub = async (data: Partial<Club>): Promise<Club> => {
    const res = await fetch(API_BASE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || "Create failed"); }
    const created = await res.json(); setClubs((prev) => [...prev, created]); return created;
  };
  const updateClub = async (id: string, data: Partial<Club>): Promise<Club> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || "Update failed"); }
    const updated = await res.json(); setClubs((prev) => prev.map((c) => (c.id === id ? updated : c))); return updated;
  };
  const deleteClub = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || "Delete failed"); }
    setClubs((prev) => prev.filter((c) => c.id !== id));
  };
  return { clubs, loading, error, refresh, createClub, updateClub, deleteClub };
}
