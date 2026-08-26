import { useEffect, useRef, useState } from "react";
import { LeadershipMessage } from "@/types/leadership-message";

const API_BASE = "/api/admin/people/messages";

export interface UseLeadershipMessageOptions { initialData?: LeadershipMessage[]; pageSize?: number; }
export interface UseLeadershipMessageReturn {
  messages: LeadershipMessage[]; loading: boolean; error: string; refresh: () => void;
  createMessage: (data: Partial<LeadershipMessage>) => Promise<LeadershipMessage>;
  updateMessage: (id: string, data: Partial<LeadershipMessage>) => Promise<LeadershipMessage>;
  deleteMessage: (id: string) => Promise<void>;
}

export function useLeadershipMessage({ initialData, pageSize = 50 }: UseLeadershipMessageOptions = {}): UseLeadershipMessageReturn {
  const [messages, setMessages] = useState<LeadershipMessage[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) { setMessages(initialData); setLoading(false); return; }
    let cancelled = false; const controller = new AbortController();
    fetch(`${API_BASE}?pageSize=${pageSize}`, { signal: controller.signal })
      .then(async (res) => { if (!res.ok) throw new Error(res.status === 401 ? "Session expired." : `Failed (HTTP ${res.status})`); return res.json(); })
      .then((data) => { if (cancelled) return; setMessages(data.items ?? []); setError(""); setLoading(false); })
      .catch((err: unknown) => { if (cancelled) return; setError(err instanceof Error ? err.message : "Failed"); setLoading(false); });
    return () => { cancelled = true; controller.abort(); };
  }, [reloadKey.current, initialData, pageSize]);

  const refresh = () => { reloadKey.current += 1; setLoading(true); };
  const createMessage = async (data: Partial<LeadershipMessage>): Promise<LeadershipMessage> => {
    const res = await fetch(API_BASE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || `Create failed`); }
    const created = await res.json(); setMessages((prev) => [...prev, created]); return created;
  };
  const updateMessage = async (id: string, data: Partial<LeadershipMessage>): Promise<LeadershipMessage> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || `Update failed`); }
    const updated = await res.json(); setMessages((prev) => prev.map((m) => (m.id === id ? updated : m))); return updated;
  };
  const deleteMessage = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || `Delete failed`); }
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };
  return { messages, loading, error, refresh, createMessage, updateMessage, deleteMessage };
}
