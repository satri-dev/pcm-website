import { useEffect, useRef, useState } from "react";
import { Bod } from "@/types/bod";

const API_BASE = "/api/admin/people/board";

export interface UseBodOptions {
  initialData?: Bod[];
  pageSize?: number;
}

export interface UseBodReturn {
  bod: Bod[];
  loading: boolean;
  error: string;
  refresh: () => void;
  createBod: (data: Partial<Bod>) => Promise<Bod>;
  updateBod: (id: string, data: Partial<Bod>) => Promise<Bod>;
  deleteBod: (id: string) => Promise<void>;
}

export function useBod({
  initialData,
  pageSize = 50,
}: UseBodOptions = {}): UseBodReturn {
  const [bod, setBod] = useState<Bod[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) { setBod(initialData); setLoading(false); return; }
    let cancelled = false;
    const controller = new AbortController();
    fetch(`${API_BASE}?pageSize=${pageSize}`, { signal: controller.signal })
      .then(async (res) => { if (!res.ok) throw new Error(res.status === 401 ? "Session expired." : `Failed (HTTP ${res.status})`); return res.json(); })
      .then((data) => { if (cancelled) return; setBod(data.items ?? []); setError(""); setLoading(false); })
      .catch((err: unknown) => { if (cancelled) return; setError(err instanceof Error ? err.message : "Failed to load"); setLoading(false); });
    return () => { cancelled = true; controller.abort(); };
  }, [reloadKey.current, initialData, pageSize]);

  const refresh = () => { reloadKey.current += 1; setLoading(true); };

  const createBod = async (data: Partial<Bod>): Promise<Bod> => {
    const res = await fetch(API_BASE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || `Create failed (HTTP ${res.status})`); }
    const created = await res.json(); setBod((prev) => [...prev, created]); return created;
  };

  const updateBod = async (id: string, data: Partial<Bod>): Promise<Bod> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || `Update failed (HTTP ${res.status})`); }
    const updated = await res.json(); setBod((prev) => prev.map((item) => (item.id === id ? updated : item))); return updated;
  };

  const deleteBod = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || `Delete failed (HTTP ${res.status})`); }
    setBod((prev) => prev.filter((item) => item.id !== id));
  };

  return { bod, loading, error, refresh, createBod, updateBod, deleteBod };
}
