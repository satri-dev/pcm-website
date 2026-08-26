import { useEffect, useRef, useState } from "react";
import { Alumni } from "@/types/alumni";

const API_BASE = "/api/admin/people/alumni";

export interface UseAlumniOptions { initialData?: Alumni[]; pageSize?: number; }
export interface UseAlumniReturn {
  alumni: Alumni[]; loading: boolean; error: string; refresh: () => void;
  createAlumni: (data: Partial<Alumni>) => Promise<Alumni>;
  updateAlumni: (id: string, data: Partial<Alumni>) => Promise<Alumni>;
  deleteAlumni: (id: string) => Promise<void>;
}

export function useAlumni({ initialData, pageSize = 50 }: UseAlumniOptions = {}): UseAlumniReturn {
  const [alumni, setAlumni] = useState<Alumni[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) { setAlumni(initialData); setLoading(false); return; }
    let cancelled = false; const controller = new AbortController();
    fetch(`${API_BASE}?pageSize=${pageSize}`, { signal: controller.signal })
      .then(async (res) => { if (!res.ok) throw new Error(res.status === 401 ? "Session expired." : `Failed (HTTP ${res.status})`); return res.json(); })
      .then((data) => { if (cancelled) return; setAlumni(data.items ?? []); setError(""); setLoading(false); })
      .catch((err: unknown) => { if (cancelled) return; setError(err instanceof Error ? err.message : "Failed"); setLoading(false); });
    return () => { cancelled = true; controller.abort(); };
  }, [reloadKey.current, initialData, pageSize]);

  const refresh = () => { reloadKey.current += 1; setLoading(true); };
  const createAlumni = async (data: Partial<Alumni>): Promise<Alumni> => {
    const res = await fetch(API_BASE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || "Create failed"); }
    const created = await res.json(); setAlumni((prev) => [...prev, created]); return created;
  };
  const updateAlumni = async (id: string, data: Partial<Alumni>): Promise<Alumni> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || "Update failed"); }
    const updated = await res.json(); setAlumni((prev) => prev.map((a) => (a.id === id ? updated : a))); return updated;
  };
  const deleteAlumni = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || "Delete failed"); }
    setAlumni((prev) => prev.filter((a) => a.id !== id));
  };
  return { alumni, loading, error, refresh, createAlumni, updateAlumni, deleteAlumni };
}
